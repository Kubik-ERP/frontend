# 🏗️ Create Module Command

## Purpose
Scaffold a new DDD-structured module with all necessary files and boilerplate code.

## Usage
```
/create-module <module-name> [options]
```

**Examples:**
```
/create-module inventory
/create-module customer-orders --with-api
/create-module reports --no-store
```

## Generated Structure

```
src/modules/<module-name>/
├── components/
│   ├── <ModuleName>UI.vue              # Main UI entry
│   ├── <ModuleName>List.vue            # List view
│   ├── <ModuleName>Form.vue            # Create/Edit form
│   ├── <ModuleName>Detail.vue          # Detail view
│   └── <ModuleName>Modal.vue           # Modal components
├── services/
│   ├── <module-name>.service.ts        # Main service
│   └── <module-name>-api.service.ts    # API service (optional)
├── interfaces/
│   ├── <module-name>.interface.ts      # Main interfaces
│   └── <module-name>-api.interface.ts  # API interfaces
├── stores/
│   └── <module-name>.store.ts          # Pinia store
├── constants/
│   └── <module-name>.constant.ts       # Constants
├── composables/
│   └── use<ModuleName>.ts              # Composables
├── router/
│   └── index.ts                        # Route definitions
└── README.md                            # Module documentation
```

## Options

### `--with-api`
Generate API service layer:
```
/create-module inventory --with-api
```
Creates: `<module-name>-api.service.ts` and `<module-name>-api.interface.ts`

### `--no-store`
Skip Pinia store generation:
```
/create-module simple-module --no-store
```

### `--with-tests`
Generate test files:
```
/create-module inventory --with-tests
```
Creates test files in `tests/unit/modules/<module-name>/`

### `--crud`
Generate full CRUD operations:
```
/create-module products --crud
```
Includes: List, Create, Read, Update, Delete views and methods

## Generated Files

### 1. Main UI Component (`<ModuleName>UI.vue`)

```vue
<script setup lang="ts">
import { inject } from 'vue';
import type { InventoryService } from '../services/inventory.service';

// Services
const inventoryService = inject<InventoryService>('inventoryService')!;

// Service properties
const {
  inventory_data,
  inventory_loading,
  inventory_error,
} = inventoryService;

// Service methods
const {
  inventoryGetList,
} = inventoryService;

// Lifecycle
inventoryGetList();
</script>

<template>
  <div class="inventory-container">
    <div class="inventory-header">
      <h1 class="text-2xl font-bold">Inventory</h1>
    </div>
    
    <div v-if="inventory_loading" class="inventory-loading">
      Loading...
    </div>
    
    <div v-else-if="inventory_error" class="inventory-error">
      {{ inventory_error }}
    </div>
    
    <div v-else class="inventory-content">
      <InventoryList :data="inventory_data" />
    </div>
  </div>
</template>

<style scoped>
.inventory-container {
  @apply p-6;
}

.inventory-header {
  @apply mb-6;
}

.inventory-loading {
  @apply flex items-center justify-center h-64;
}

.inventory-error {
  @apply text-red-500;
}

.inventory-content {
  @apply space-y-4;
}
</style>
```

### 2. Service (`<module-name>.service.ts`)

```typescript
import { reactive, toRefs } from 'vue';
import type {
  InventoryService,
  InventoryState,
  InventoryItem,
} from '../interfaces/inventory.interface';
import { useInventoryApiService } from './inventory-api.service';

export const useInventoryService = (): InventoryService => {
  // API Service
  const apiService = useInventoryApiService();
  
  // State
  const state = reactive<InventoryState>({
    inventory_data: [],
    inventory_loading: false,
    inventory_error: null,
    inventory_selectedItem: null,
  });
  
  /**
   * Get inventory list
   */
  const inventoryGetList = async (): Promise<void> => {
    try {
      state.inventory_loading = true;
      state.inventory_error = null;
      
      const response = await apiService.inventoryApiGetList();
      state.inventory_data = response.data;
    } catch (error) {
      state.inventory_error = 'Failed to load inventory';
      console.error('Inventory error:', error);
    } finally {
      state.inventory_loading = false;
    }
  };
  
  /**
   * Get inventory item by ID
   */
  const inventoryGetById = async (id: string): Promise<void> => {
    try {
      state.inventory_loading = true;
      state.inventory_error = null;
      
      const response = await apiService.inventoryApiGetById(id);
      state.inventory_selectedItem = response.data;
    } catch (error) {
      state.inventory_error = 'Failed to load item';
      console.error('Inventory error:', error);
    } finally {
      state.inventory_loading = false;
    }
  };
  
  /**
   * Create inventory item
   */
  const inventoryCreate = async (data: Partial<InventoryItem>): Promise<void> => {
    try {
      state.inventory_loading = true;
      state.inventory_error = null;
      
      await apiService.inventoryApiCreate(data);
      await inventoryGetList(); // Refresh list
    } catch (error) {
      state.inventory_error = 'Failed to create item';
      console.error('Inventory error:', error);
      throw error;
    } finally {
      state.inventory_loading = false;
    }
  };
  
  /**
   * Update inventory item
   */
  const inventoryUpdate = async (
    id: string,
    data: Partial<InventoryItem>
  ): Promise<void> => {
    try {
      state.inventory_loading = true;
      state.inventory_error = null;
      
      await apiService.inventoryApiUpdate(id, data);
      await inventoryGetList(); // Refresh list
    } catch (error) {
      state.inventory_error = 'Failed to update item';
      console.error('Inventory error:', error);
      throw error;
    } finally {
      state.inventory_loading = false;
    }
  };
  
  /**
   * Delete inventory item
   */
  const inventoryDelete = async (id: string): Promise<void> => {
    try {
      state.inventory_loading = true;
      state.inventory_error = null;
      
      await apiService.inventoryApiDelete(id);
      await inventoryGetList(); // Refresh list
    } catch (error) {
      state.inventory_error = 'Failed to delete item';
      console.error('Inventory error:', error);
      throw error;
    } finally {
      state.inventory_loading = false;
    }
  };
  
  return {
    ...toRefs(state),
    inventoryGetList,
    inventoryGetById,
    inventoryCreate,
    inventoryUpdate,
    inventoryDelete,
  };
};
```

### 3. Interface (`<module-name>.interface.ts`)

```typescript
import type { Ref } from 'vue';

/**
 * Inventory item entity
 */
export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Inventory state
 */
export interface InventoryState {
  inventory_data: InventoryItem[];
  inventory_loading: boolean;
  inventory_error: string | null;
  inventory_selectedItem: InventoryItem | null;
}

/**
 * Inventory service interface
 */
export interface InventoryService extends Readonly<{
  inventory_data: Ref<InventoryItem[]>;
  inventory_loading: Ref<boolean>;
  inventory_error: Ref<string | null>;
  inventory_selectedItem: Ref<InventoryItem | null>;
}> {
  inventoryGetList: () => Promise<void>;
  inventoryGetById: (id: string) => Promise<void>;
  inventoryCreate: (data: Partial<InventoryItem>) => Promise<void>;
  inventoryUpdate: (id: string, data: Partial<InventoryItem>) => Promise<void>;
  inventoryDelete: (id: string) => Promise<void>;
}
```

### 4. API Service (`<module-name>-api.service.ts`)

```typescript
import type { AxiosResponse } from 'axios';
import { useHttp } from '@/app/composables';
import type {
  InventoryApiService,
  InventoryApiResponse,
  InventoryApiListResponse,
} from '../interfaces/inventory-api.interface';
import type { InventoryItem } from '../interfaces/inventory.interface';

export const useInventoryApiService = (): InventoryApiService => {
  const { httpGet, httpPost, httpPut, httpDelete } = useHttp();
  
  /**
   * Get inventory list
   */
  const inventoryApiGetList = async (): Promise<InventoryApiListResponse> => {
    const response: AxiosResponse<InventoryApiListResponse> = await httpGet(
      '/api/inventory'
    );
    return response.data;
  };
  
  /**
   * Get inventory item by ID
   */
  const inventoryApiGetById = async (id: string): Promise<InventoryApiResponse> => {
    const response: AxiosResponse<InventoryApiResponse> = await httpGet(
      `/api/inventory/${id}`
    );
    return response.data;
  };
  
  /**
   * Create inventory item
   */
  const inventoryApiCreate = async (
    data: Partial<InventoryItem>
  ): Promise<InventoryApiResponse> => {
    const response: AxiosResponse<InventoryApiResponse> = await httpPost(
      '/api/inventory',
      data
    );
    return response.data;
  };
  
  /**
   * Update inventory item
   */
  const inventoryApiUpdate = async (
    id: string,
    data: Partial<InventoryItem>
  ): Promise<InventoryApiResponse> => {
    const response: AxiosResponse<InventoryApiResponse> = await httpPut(
      `/api/inventory/${id}`,
      data
    );
    return response.data;
  };
  
  /**
   * Delete inventory item
   */
  const inventoryApiDelete = async (id: string): Promise<void> => {
    await httpDelete(`/api/inventory/${id}`);
  };
  
  return {
    inventoryApiGetList,
    inventoryApiGetById,
    inventoryApiCreate,
    inventoryApiUpdate,
    inventoryApiDelete,
  };
};
```

### 5. Store (`<module-name>.store.ts`)

```typescript
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { InventoryItem } from '../interfaces/inventory.interface';

export const useInventoryStore = defineStore('inventory', () => {
  // State
  const items = ref<InventoryItem[]>([]);
  const selectedItem = ref<InventoryItem | null>(null);
  
  // Getters
  const getItemById = (id: string) => {
    return items.value.find(item => item.id === id);
  };
  
  const totalItems = () => {
    return items.value.length;
  };
  
  // Actions
  const setItems = (newItems: InventoryItem[]) => {
    items.value = newItems;
  };
  
  const addItem = (item: InventoryItem) => {
    items.value.push(item);
  };
  
  const updateItem = (id: string, data: Partial<InventoryItem>) => {
    const index = items.value.findIndex(item => item.id === id);
    if (index !== -1) {
      items.value[index] = { ...items.value[index], ...data };
    }
  };
  
  const deleteItem = (id: string) => {
    const index = items.value.findIndex(item => item.id === id);
    if (index !== -1) {
      items.value.splice(index, 1);
    }
  };
  
  const setSelectedItem = (item: InventoryItem | null) => {
    selectedItem.value = item;
  };
  
  return {
    // State
    items,
    selectedItem,
    
    // Getters
    getItemById,
    totalItems,
    
    // Actions
    setItems,
    addItem,
    updateItem,
    deleteItem,
    setSelectedItem,
  };
});
```

### 6. Router (`router/index.ts`)

```typescript
import type { RouteRecordRaw } from 'vue-router';

export const inventoryRoutes: RouteRecordRaw[] = [
  {
    path: '/inventory',
    name: 'inventory',
    component: () => import('../components/InventoryUI.vue'),
    meta: {
      requiresAuth: true,
      title: 'Inventory',
    },
  },
  {
    path: '/inventory/create',
    name: 'inventory-create',
    component: () => import('../components/InventoryForm.vue'),
    meta: {
      requiresAuth: true,
      title: 'Create Inventory Item',
    },
  },
  {
    path: '/inventory/:id',
    name: 'inventory-detail',
    component: () => import('../components/InventoryDetail.vue'),
    meta: {
      requiresAuth: true,
      title: 'Inventory Detail',
    },
  },
  {
    path: '/inventory/:id/edit',
    name: 'inventory-edit',
    component: () => import('../components/InventoryForm.vue'),
    meta: {
      requiresAuth: true,
      title: 'Edit Inventory Item',
    },
  },
];
```

### 7. README.md

```markdown
# Inventory Module

## Overview
Module for managing inventory items with full CRUD operations.

## Features
- List inventory items
- View item details
- Create new items
- Update existing items
- Delete items

## Structure
\`\`\`
inventory/
├── components/      # UI components
├── services/        # Business logic
├── interfaces/      # TypeScript types
├── stores/          # State management
├── constants/       # Constants
├── composables/     # Composables
└── router/          # Routes
\`\`\`

## Usage

### Import Module Routes
\`\`\`typescript
import { inventoryRoutes } from '@/modules/inventory/router';

const router = createRouter({
  routes: [
    ...inventoryRoutes,
    // other routes
  ],
});
\`\`\`

### Use Service in Component
\`\`\`vue
<script setup lang="ts">
import { inject } from 'vue';
import type { InventoryService } from './services/inventory.service';

const inventoryService = inject<InventoryService>('inventoryService')!;
const { inventory_data, inventoryGetList } = inventoryService;

inventoryGetList();
</script>
\`\`\`

## API Endpoints
- GET `/api/inventory` - List items
- GET `/api/inventory/:id` - Get item
- POST `/api/inventory` - Create item
- PUT `/api/inventory/:id` - Update item
- DELETE `/api/inventory/:id` - Delete item

## Testing
\`\`\`bash
npm run test:unit -- inventory
\`\`\`
```

## Post-Generation Steps

After module generation:

1. **Register Routes**
```typescript
// src/app/router/index.ts
import { inventoryRoutes } from '@/modules/inventory/router';

routes: [
  ...inventoryRoutes,
  // other routes
]
```

2. **Provide Services**
```typescript
// src/modules/inventory/components/InventoryUI.vue
import { useInventoryService } from '../services/inventory.service';

const inventoryService = useInventoryService();
provide('inventoryService', inventoryService);
```

3. **Add to Navigation**
```typescript
// src/app/constants/menus.constant.ts
{
  label: 'Inventory',
  icon: 'pi pi-box',
  to: '/inventory',
}
```

4. **Update Module Index**
```typescript
// src/modules/index.ts
export * from './inventory';
```

## Best Practices

- Follow naming conventions (`module_prefix`)
- Keep components focused (single responsibility)
- Extract business logic to services
- Use TypeScript for type safety
- Write tests for critical paths
- Document complex logic

---

**Command Version**: 1.0.0
**Last Updated**: November 23, 2025
