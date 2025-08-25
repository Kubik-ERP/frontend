# Role-Based Access Control (RBAC) Implementation

## Overview

This document describes the simplified RBAC (Role-Based Access Control) implementation in the frontend application. The RBAC system now works directly with backend permissions using permission keys from the `/permissions/me` API endpoint, providing a streamlined approach to access control.

**Backend Integration**: The RBAC system is fully integrated with the backend authentication system. After successful sign-in, the frontend automatically calls the `/permissions/me` API to fetch user permissions, which are stored in the authentication store and used throughout the application.

## Architecture

### Core Components

1. **Permission Types** (`expected-result-permission.type.ts`)

   - Defines all available permission keys from the backend

2. **Authentication Store** (`src/modules/authentication/store/index.ts`)

   - Stores user permissions in `authentication_permissions` array
   - Automatically fetches permissions after successful authentication

3. **Composable** (`src/app/composables/useRbac.ts`)

   - Provides reactive permission checking functions
   - Simple API for checking individual or multiple permissions

4. **Directive** (`src/app/directives/rbac.directive.ts`)

   - Vue directive for declarative permission control in templates
   - Supports hide/disable fallback modes

5. **Menu Helper** (`src/app/helpers/menu-permission.helper.ts`)

   - Maps menu paths to required permissions
   - Filters menus based on user permissions

## Backend Integration

The RBAC system works seamlessly with the backend:

```typescript
// After successful sign-in, the system automatically:
// 1. Calls /authentication/login or /authentication/google/redirect
// 2. Fetches user profile from /authentication/profile
// 3. Fetches user permissions from /permissions/me
// 4. Stores permissions in authentication_permissions array

// The permissions API returns:
interface IAuthenticationPermissionResponse {
  data: string[]; // Array of permission keys like ['set_up_cash_drawer', 'close_cash_register', ...]
}
```

**Backend Permission Keys** (from `expected-result-permission.type.ts`):

- `access_all_store` - Full access to all store operations
- `set_up_cash_drawer` - Permission to set up cash drawer
- `close_cash_register` - Permission to close cash register
- `check_out_sales` - Permission to process sales transactions
- `customer_management` - Permission to manage customers
- And many more...

## Usage Examples

### 1. Using Composable Approach (Recommended)

The `useRbac()` composable provides reactive permission checkers:

```typescript
// In script setup
import { useRbac } from '@/app/composables/useRbac';

const rbac = useRbac();

// Individual permission checking
const canSetupCashDrawer = rbac.canSetupCashDrawer; // Reactive computed ref
const canCloseCashRegister = rbac.canCloseCashRegister; // Reactive computed ref

// Programmatic permission checking
const hasCreatePermission = rbac.hasPermission('set_up_cash_drawer');
const hasMultiplePermissions = rbac.hasAllPermissions(['set_up_cash_drawer', 'close_cash_register']);
const hasAnyPermission = rbac.hasAnyPermission(['customer_management', 'supplier_management']);

// Get all user permissions
const allPermissions = rbac.getCurrentUserPermissions();
```

```vue
<!-- In template -->
<template>
  <div>
    <!-- Using reactive computed refs -->
    <button v-if="canSetupCashDrawer">Setup Cash Drawer</button>
    <button v-if="canCloseCashRegister">Close Register</button>

    <!-- Using permission checking methods -->
    <button v-if="rbac.hasPermission('check_out_sales')">Process Sale</button>
  </div>
</template>
```

### 2. Using RBAC Custom Directive (Declarative)

The `v-rbac` directive provides a clean, declarative way to control element visibility:

```vue
<template>
  <!-- Hide element if no permission (default behavior) -->
  <button v-rbac="{ permission: 'set_up_cash_drawer' }">Setup Cash Drawer</button>

  <!-- Disable element instead of hiding -->
  <button v-rbac="{ permission: 'close_cash_register', fallback: 'disable' }">Close Register</button>

  <!-- For sales-related buttons -->
  <button v-rbac="{ permission: 'check_out_sales' }">Process Sale</button>
  <button v-rbac="{ permission: 'cancel_invoice' }">Cancel Invoice</button>
  <button v-rbac="{ permission: 'refund_invoice' }">Refund Invoice</button>
</template>
```

### 3. Menu Filtering

Menus are automatically filtered based on user permissions using the menu helper:

```typescript
// The sidebar automatically filters menus based on permissions
import { filterMenusByPermissions } from '@/app/helpers/menu-permission.helper';

// In sidebar component
const filteredMenus = computed(() => {
  return filterMenusByPermissions(LIST_SIDEBAR_MENUS, authentication_permissions.value);
});
```

## Available Reactive Permission Checkers

The `useRbac()` composable provides these reactive computed refs:

### Store Management

- `canAccessAllStore` - access_all_store
- `canManageStore` - store_management
- `canViewDashboard` - dashboard_view

### Cash Management

- `canSetupCashDrawer` - set_up_cash_drawer
- `canCloseCashRegister` - close_cash_register
- `canManageCashInOut` - cash_in_out

### Sales Operations

- `canCheckOutSales` - check_out_sales
- `canCancelInvoice` - cancel_invoice
- `canRefundInvoice` - refund_invoice
- `canProcessUnpaidInvoice` - process_unpaid_invoice
- `canViewDailySales` - daily_sales
- `canManageQueue` - queue

### Customer Management

- `canManageCustomers` - customer_management
- `canViewCustomerProfile` - view_customer_profile
- `canManageCustomerLoyaltyPoints` - management_customer_loyalty_point

### Product Management

- `canManageProducts` - product_management
- `canManageProductCategory` - product_category
- `canManageCategories` - category_management
- `canManageItems` - manage_item

### Inventory Management

- `canManageStockAdjustment` - stock_adjustment
- `canManageBrand` - manage_brand
- `canManageStockOpname` - manage_stock_opname
- `canManageStorageLocation` - manage_storage_location
- `canManagePurchaseOrder` - manage_purchase_order

### Staff Management

- `canManageStaffMember` - manage_staff_member
- `canManageStaffAttendance` - manage_staff_attendance

### Configuration

- `canConfigureDevices` - connected_device_configuration
- `canConfigurePaymentMethods` - payment_method_configuration
- `canConfigureLoyaltyPoints` - general_loyalty_point_configuration
- `canConfigureTaxAndService` - tax_and_service_charge_configuration

## Implementation in Components

### Cash Drawer Example

```vue
<script setup lang="ts">
import { useRbac } from '@/app/composables/useRbac';

const rbac = useRbac();
const { canSetupCashDrawer, canCloseCashRegister } = rbac;
</script>

<template>
  <div class="cash-drawer-actions">
    <!-- Cash In button - requires set_up_cash_drawer permission -->
    <button v-if="canSetupCashDrawer" @click="openCashInDialog">Cash In</button>

    <!-- Cash Out button - requires set_up_cash_drawer permission -->
    <button v-if="canSetupCashDrawer" @click="openCashOutDialog">Cash Out</button>

    <!-- Close Register button - requires close_cash_register permission -->
    <button v-if="canCloseCashRegister" @click="closeRegister">Close Register</button>
  </div>
</template>
```

## Menu Permission Mapping

The system automatically maps menu paths to required permissions:

```typescript
const MENU_PERMISSION_MAPPING = {
  '/cashier': ['check_out_sales'],
  '/cash-drawer': ['set_up_cash_drawer', 'close_cash_register'],
  '/customer': ['customer_management'],
  '/inventory': ['manage_item', 'stock_adjustment'],
  '/purchase-order': ['manage_purchase_order'],
  // ... more mappings
};
```

## Authentication Flow

1. User select the outlet
2. System will set value of selected outlet into the state
3. System automatically calls `/permissions/me` to get user permissions
4. Permissions are stored in `authentication_permissions` array
5. All RBAC checks use this permissions array
6. Menus and UI elements are filtered/hidden based on permissions

## Benefits of This Approach

- **Simplified**: Direct mapping of backend permissions to frontend checks
- **Real-time**: Permissions are fetched fresh on each login
- **Flexible**: Easy to add new permissions without complex role management
- **Maintainable**: Single source of truth for permissions
- **Scalable**: Works with any number of permission keys
- **Secure**: All permissions come directly from backend validation

## Migration from Complex RBAC

The previous complex role-based system has been simplified to use direct permission keys. This provides:

- Easier maintenance and debugging
- Direct backend integration
- Clearer permission granularity
- Simplified testing and development
- Better alignment with backend security model
