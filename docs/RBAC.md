# Role-Based Access Control (RBAC) Implementation

## Overview

This document describes the RBAC (Role-Based Access Control) implementation in the frontend application. The RBAC system provides fine-grained permission control for different user roles across all modules in the application.

**Authentication Integration**: The RBAC system is integrated with the existing authentication store (`authentication.store.ts`) to automatically read user roles from `authentication_userData.roles`. This ensures a single source of truth for user data while maintaining the flexibility to manually set roles for testing purposes.

## Architecture

### Core Components

1. **Interfaces** (`src/app/interfaces/rbac.interface.ts`)

   - Defines all RBAC-related types and interfaces
   - Base permissions: Create, Read, Update, Delete
   - Extended permissions: Export, Import, Print, Approve, Cancel, Void

2. **Constants** (`src/app/constants/rbac.constant.ts`)

   - Default role configurations (Super Admin, Manager, Cashier)
   - Route permission mappings
   - RBAC system constants

3. **Store** (`src/app/store/rbac.store.ts`)

   - Pinia store for managing RBAC state
   - **Integrated with authentication store for user roles**
   - Handles role assignment and permission checking
   - Provides menu filtering based on permissions
   - Maps authentication role IDs to RBAC role identifiers

4. **Composable** (`src/app/composables/useRbac.ts`)

   - Main service for interacting with RBAC system
   - Provides reactive permission checkers
   - Easy-to-use API for components

5. **Directive** (`src/app/directives/rbac.directive.ts`)
   - Vue directive for declarative permission control
   - Supports hide/disable fallback modes

## Authentication Integration

The RBAC system automatically reads user role information from the authentication store:

```typescript
// Authentication store structure (authentication_userData.roles)
interface UserRole {
  id: number | string;
  name: string;
}

// RBAC system maps authentication roles to internal role IDs:
// Role ID Mapping:
// 1: 'owner' - Business Owner
// 2: 'super-admin' - Technical Administrator
// 3: 'manager' - Operational Manager
// 4: 'staff' - Regular Employee
// 5: 'cashier' - Point of Sale Operator
// - Maps by exact string match of role names (case-insensitive)
// - Fallback to string representation of role ID
// - Default fallback to 'staff' for unknown roles
```

**Benefits of Integration**:

- Single source of truth for user data
- Automatic role detection on authentication
- Seamless permission checking across the application
- Maintains backward compatibility with manual role setting for testing
- Intelligent role mapping with sensible defaults (unknown roles default to 'staff')

## Default Roles

The RBAC system includes five predefined roles with different permission levels:

### Owner

- Ultimate business owner access to all modules and functionalities
- Full administrative control over all business operations
- Can perform all CRUD operations and extended actions
- Has complete system access including sensitive configurations

### Super Admin

- Technical administrator with full system access
- Can perform all CRUD operations and extended actions
- Has administrative privileges for system management
- Similar to Owner but focused on technical administration

### Manager

- Operational manager with extensive but controlled access
- Access to most modules with limited administrative permissions
- Cannot delete critical data in most modules
- Can approve and manage day-to-day operations
- Focused on business operations rather than system administration

### Staff

- Regular employee with operational access
- Can perform most day-to-day operational tasks
- Limited administrative access
- Cannot delete critical data or access sensitive configurations
- Focused on routine business tasks and customer service

### Cashier

- Point-of-sale focused role with restricted access
- Limited to sales, customer operations, and cash management
- Cannot access administrative features or sensitive data
- Optimized for front-line customer service and transaction processing

## Usage Examples

## Usage

There are **three main ways** to implement RBAC in your components:

### 1. Using Composable Approach (Recommended)

The `useRbac()` composable provides reactive permission checkers and is the most flexible approach.

```typescript
// In script setup
import { useRbac } from '@/app/composables/useRbac';

const rbac = useRbac();

// Reactive permission checkers - these are computed refs that update automatically
const canCreatePO = rbac.canCreate('purchaseOrder');
const canUpdatePO = rbac.canUpdate('purchaseOrder');
const canDeletePO = rbac.canDelete('purchaseOrder');
const canApprovePO = rbac.canApprove('purchaseOrder');

// Role checkers
const isOwner = rbac.isOwner;
const isSuperAdmin = rbac.isSuperAdmin;
const isManager = rbac.isManager;
const isStaff = rbac.isStaff;
const isCashier = rbac.isCashier;
const currentRoleName = rbac.getCurrentRoleName;

// Programmatic permission checking (for logic)
const hasCreatePermission = rbac.hasPermission('purchaseOrder', 'isCanCreate');
const hasApprovePermission = rbac.hasExtendedPermission('purchaseOrder', 'isCanApprove');
const hasAnyPOPermission = rbac.hasAnyPermission('purchaseOrder');
const canAccessRoute = rbac.checkRoutePermission('purchase-order.create');
```

```vue
<!-- In template -->
<template>
  <div>
    <button v-if="canCreatePO" @click="createPurchaseOrder">Create Purchase Order</button>
    <button v-if="canUpdatePO" @click="editPurchaseOrder">Edit Purchase Order</button>
    <button v-if="canDeletePO" @click="deletePurchaseOrder">Delete Purchase Order</button>

    <div v-if="isOwner" class="owner-panel">
      <!-- Owner-only content -->
    </div>

    <div v-if="isSuperAdmin" class="admin-panel">
      <!-- Admin-only content -->
    </div>

    <div v-if="isManager" class="manager-panel">
      <!-- Manager-only content -->
    </div>

    <div v-if="isStaff" class="staff-panel">
      <!-- Staff-only content -->
    </div>

    <p>Current Role: {{ currentRoleName }}</p>
  </div>
</template>
```

### 2. Using RBAC Custom Directive (Declarative)

The `v-rbac` directive provides a clean, declarative way to control element visibility and state.

```vue
<template>
  <!-- Hide element if no permission (default behavior) -->
  <button v-rbac="{ module: 'purchaseOrder', action: 'isCanCreate' }">Create PO</button>

  <!-- Disable element if no permission instead of hiding -->
  <button v-rbac="{ module: 'purchaseOrder', action: 'isCanUpdate', fallback: 'disable' }">Edit PO</button>

  <!-- Works with any element -->
  <div v-rbac="{ module: 'inventory', action: 'isCanRead' }">
    <h3>Inventory Section</h3>
    <!-- This entire section will be hidden if user can't read inventory -->
  </div>

  <!-- Extended permissions -->
  <button v-rbac="{ module: 'purchaseOrder', action: 'isCanApprove' }">Approve PO</button>
</template>
```

**Directive Options:**

- `module`: The module to check (e.g., 'purchaseOrder', 'inventory')
- `action`: The permission action (e.g., 'isCanCreate', 'isCanRead', 'isCanApprove')
- `fallback`: 'hide' (default) or 'disable'
  - `'hide'`: Element is completely hidden (`display: none`)
  - `'disable'`: Element is disabled and visually dimmed with a tooltip

### 3. Using Template Helper Functions

The `useRbacDirective()` composable provides helper functions for template conditions.

```typescript
// In script setup
import { useRbacDirective } from '@/app/composables/useRbac';

const rbacDirective = useRbacDirective();

// These return boolean values for v-if usage
const {
  checkPermission,
  checkExtendedPermission,
  checkModuleAccess,
  isOwner,
  isSuperAdmin,
  isManager,
  isStaff,
  isCashier,
  hasRole,
} = rbacDirective;
```

```vue
<!-- In template -->
<template>
  <div>
    <!-- Basic permission checking -->
    <button v-if="checkPermission('purchaseOrder', 'isCanCreate')">Create Purchase Order</button>

    <!-- Extended permission checking -->
    <button v-if="checkExtendedPermission('purchaseOrder', 'isCanApprove')">Approve Purchase Order</button>

    <!-- Module access checking -->
    <section v-if="checkModuleAccess('inventory')">
      <!-- Show if user has any permission for inventory module -->
    </section>

    <!-- Role-based conditions -->
    <div v-if="isOwner">Owner Dashboard</div>
    <div v-if="isSuperAdmin">Admin Panel</div>
    <div v-if="isManager">Manager Tools</div>
    <div v-if="isStaff">Staff Interface</div>
    <div v-if="isCashier">Cashier Interface</div>
  </div>
</template>
```

## When to Use Each Approach

### Use **Composable Approach** when:

- You need reactive permission states
- You have complex logic involving permissions
- You want TypeScript autocompletion and type safety
- You need to combine permissions with other reactive data

### Use **Custom Directive** when:

- You want simple, declarative permission control
- You need to quickly hide/disable elements
- You prefer clean template syntax
- You want automatic visual feedback (disable state)

### Use **Template Helper Functions** when:

- You're migrating from other RBAC systems
- You prefer explicit function calls in templates
- You need simple boolean checks for v-if conditions
- You want lighter-weight permission checking

## Example: Complete Component Implementation

```vue
<script setup lang="ts">
import { useRbac } from '@/app/composables/useRbac';

const rbac = useRbac();

// Reactive permissions for the template
const canCreate = rbac.canCreate('purchaseOrder');
const canApprove = rbac.canApprove('purchaseOrder');
const isOwner = rbac.isOwner;
const isSuperAdmin = rbac.isSuperAdmin;

// Methods that use programmatic checking
const handleCreatePO = () => {
  if (rbac.hasPermission('purchaseOrder', 'isCanCreate')) {
    // Create logic here
    console.log('Creating purchase order...');
  } else {
    console.log('No permission to create');
  }
};

const handleBulkAction = () => {
  // Check multiple permissions
  const canCreate = rbac.hasPermission('purchaseOrder', 'isCanCreate');
  const canUpdate = rbac.hasPermission('purchaseOrder', 'isCanUpdate');

  if (canCreate && canUpdate) {
    // Bulk action logic
  }
};
</script>

<template>
  <div class="purchase-order-page">
    <!-- Using reactive composable -->
    <button v-if="canCreate" @click="handleCreatePO">Create Purchase Order</button>

    <!-- Using directive with hide fallback -->
    <button v-rbac="{ module: 'purchaseOrder', action: 'isCanUpdate' }">Edit Selected</button>

    <!-- Using directive with disable fallback -->
    <button v-rbac="{ module: 'purchaseOrder', action: 'isCanDelete', fallback: 'disable' }">
      Delete Selected
    </button>

    <!-- Owner-only section -->
    <div v-if="isOwner" class="owner-controls">
      <h3>Business Owner Controls</h3>
      <!-- Owner-specific controls -->
    </div>

    <!-- Admin-only section -->
    <div v-if="isSuperAdmin" class="admin-controls">
      <h3>Administrator Controls</h3>
      <!-- More admin controls -->
    </div>

    <!-- Entire section controlled by directive -->
    <section v-rbac="{ module: 'purchaseOrder', action: 'isCanApprove' }">
      <h3>Approval Section</h3>
      <button @click="approvePO">Approve</button>
      <button @click="rejectPO">Reject</button>
    </section>
  </div>
</template>
```

## Route Protection

Routes are automatically protected based on the `ROUTE_PERMISSION_MAPPING` configuration:

```typescript
// Example route mapping
'purchase-order.create': { module: 'purchaseOrder', action: 'isCanCreate' }
```

The router guard automatically checks permissions and redirects unauthorized users to the "not-authorized" page.

## Menu Filtering

The sidebar menu is automatically filtered based on user permissions. Only accessible menu items are displayed to the user.

## Available Modules

- **Sales**: cashier, salesOrder, queue, kitchenQueue, report, catalog, customer, etc.
- **Operations**: store, inventory, purchaseOrder, marketing, voucher, staff
- **Settings**: account, posSettings, integrations, outlet, pointConfiguration
- **Dashboard**: dashboard
- **Cash Management**: cashDrawer, cashInOut

## Available Permissions

### Base Permissions (CRUD)

- `isCanCreate`: Create new records
- `isCanRead`: View/read records
- `isCanUpdate`: Modify existing records
- `isCanDelete`: Delete records

### Extended Permissions

- `isCanExport`: Export data
- `isCanImport`: Import data
- `isCanPrint`: Print documents
- `isCanApprove`: Approve operations

## Integration with Authentication

The RBAC system integrates with the authentication flow:

1. User signs in
2. Authentication profile is fetched
3. User role is determined from profile data
4. RBAC store is initialized with user's role and permissions
5. All subsequent permission checks use the stored role

## Role Hierarchy and Business Use Cases

### Role Hierarchy (Highest to Lowest Access)

1. **Owner** - Ultimate business control
2. **Super Admin** - Technical system administration
3. **Manager** - Operational management
4. **Staff** - Regular employee operations
5. **Cashier** - Point-of-sale operations

### Typical Business Scenarios

**Small Business Setup:**

- Owner: Business owner manages everything
- Staff: Part-time employees handle daily operations
- Cashier: Dedicated POS operators during busy hours

**Medium Business Setup:**

- Owner: Business owner with strategic oversight
- Manager: Store/department managers
- Staff: Regular employees
- Cashier: Dedicated checkout personnel

**Enterprise Setup:**

- Owner: C-level executives or business owners
- Super Admin: IT administrators managing system
- Manager: Department heads and supervisors
- Staff: Regular employees across departments
- Cashier: POS operators and customer service

### Permission Inheritance

The system follows a **restrictive permission model** where each role has specifically defined permissions rather than inheriting from higher roles. This provides:

- **Clear Permission Boundaries**: Each role has explicitly defined capabilities
- **Security by Design**: No accidental permission inheritance
- **Flexible Configuration**: Easy to customize permissions per business needs
- **Audit Trail**: Clear understanding of what each role can do

### Role Selection Guidelines

**Choose Owner when:**

- User needs ultimate business control
- User manages business finances and critical operations
- User sets company-wide policies and configurations

**Choose Super Admin when:**

- User handles technical system administration
- User manages integrations and system settings
- User needs access to all technical features

**Choose Manager when:**

- User supervises departments or teams
- User needs operational oversight capabilities
- User handles day-to-day business management

**Choose Staff when:**

- User performs routine business operations
- User serves customers and processes standard transactions
- User needs operational access without administrative rights

**Choose Cashier when:**

- User primarily operates point-of-sale systems
- User handles customer checkout and payments
- User needs minimal system access beyond sales functions

## Testing

A comprehensive testing panel is available at `/rbac-demo` that allows:

- Switching between different roles
- Real-time permission visualization
- Testing permission-based UI changes

## Backend Integration

When the backend is ready, you'll need to:

1. **Update Authentication API Response**:

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": {
      "id": 3,
      "name": "Manager",
      "permissions": {
        "purchaseOrder": {
          "isCanCreate": true,
          "isCanRead": true,
          "isCanUpdate": true,
          "isCanDelete": false
        }
      }
    }
  }
}
```

**Role ID Reference for Backend:**

- `1`: Owner (Business Owner)
- `2`: Super Admin (Technical Administrator)
- `3`: Manager (Operational Manager)
- `4`: Staff (Regular Employee)
- `5`: Cashier (POS Operator)

2. **Create Role Management APIs**:

   - `GET /roles` - List all roles
   - `POST /roles` - Create new role
   - `PUT /roles/:id` - Update role
   - `DELETE /roles/:id` - Delete role
   - `GET /roles/:id/permissions` - Get role permissions

3. **Update Permission Mappings**:
   - Replace static role configurations with dynamic data from backend
   - Implement real-time permission updates

## Best Practices

1. **Always Use Reactive Checkers**: Use computed properties from the composable for reactive permission checking
2. **Check Permissions at Multiple Levels**: Implement checks in both templates and route guards
3. **Provide Fallback UI**: Show appropriate messages for restricted access
4. **Keep Permissions Granular**: Use specific module and action combinations
5. **Test Across Roles**: Always test functionality across different user roles

## File Structure

```
src/
├── app/
│   ├── interfaces/
│   │   └── rbac.interface.ts
│   ├── constants/
│   │   └── rbac.constant.ts
│   ├── store/
│   │   └── rbac.store.ts
│   ├── composables/
│   │   └── useRbac.ts
│   ├── directives/
│   │   └── rbac.directive.ts
│   ├── components/
│   │   └── common/
│   │       └── AppRbacTestingPanel.vue
│   ├── routes/
│   │   └── rbac-demo.route.ts
│   └── views/
│       └── RbacDemoUI.vue
```

## Future Enhancements

1. **Dynamic Permission Loading**: Load permissions from backend APIs
2. **Permission Caching**: Implement caching for better performance
3. **Audit Trail**: Track permission-based actions for security
4. **Role Hierarchy**: Implement role inheritance and hierarchy
5. **Context-Based Permissions**: Add support for context-specific permissions
6. **Permission Groups**: Group related permissions for easier management

This RBAC implementation provides a solid foundation for access control in your application while remaining flexible for future backend integration and enhancements.
