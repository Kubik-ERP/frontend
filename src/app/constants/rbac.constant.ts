import type { IModulePermissions, IRole } from '../interfaces/rbac.interface';

/**
 * @description Default permissions for super admin role
 */
export const SUPER_ADMIN_PERMISSIONS: IModulePermissions = {
  // Sales modules
  cashier: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
    isCanExport: true,
    isCanPrint: true,
  },
  salesOrder: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
    isCanExport: true,
    isCanPrint: true,
  },
  queue: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },
  kitchenQueue: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },
  report: {
    isCanCreate: false,
    isCanRead: true,
    isCanUpdate: false,
    isCanDelete: false,
    isCanExport: true,
    isCanPrint: true,
  },
  catalog: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
    isCanImport: true,
    isCanExport: true,
  },
  catalogCategories: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },
  catalogProducts: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },
  customer: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
    isCanImport: true,
    isCanExport: true,
  },
  customerWaitingList: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },
  dailySales: {
    isCanCreate: false,
    isCanRead: true,
    isCanUpdate: false,
    isCanDelete: false,
    isCanExport: true,
  },
  invoice: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
    isCanPrint: true,
  },

  // Operations modules
  store: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },
  inventory: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
    isCanImport: true,
    isCanExport: true,
  },
  purchaseOrder: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
    isCanApprove: true,
    isCanPrint: true,
  },
  marketing: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },
  voucher: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },
  staff: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },
  staffMember: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },

  // Settings modules
  account: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },
  posSettings: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },
  integrations: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },
  outlet: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },
  pointConfiguration: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },

  // Dashboard
  dashboard: {
    isCanCreate: false,
    isCanRead: true,
    isCanUpdate: false,
    isCanDelete: false,
  },

  // Cash drawer
  cashDrawer: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },
  cashInOut: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },
};

/**
 * @description Default permissions for manager role
 */
export const MANAGER_PERMISSIONS: IModulePermissions = {
  // Sales modules
  cashier: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
    isCanPrint: true,
  },
  salesOrder: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
    isCanExport: true,
    isCanPrint: true,
  },
  queue: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
  },
  kitchenQueue: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
  },
  report: {
    isCanCreate: false,
    isCanRead: true,
    isCanUpdate: false,
    isCanDelete: false,
    isCanExport: true,
    isCanPrint: true,
  },
  catalog: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
    isCanExport: true,
  },
  catalogCategories: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
  },
  catalogProducts: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
  },
  customer: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
    isCanExport: true,
  },
  customerWaitingList: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
  },
  dailySales: {
    isCanCreate: false,
    isCanRead: true,
    isCanUpdate: false,
    isCanDelete: false,
    isCanExport: true,
  },
  invoice: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
    isCanPrint: true,
  },

  // Operations modules
  store: {
    isCanCreate: false,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
  },
  inventory: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
    isCanExport: true,
  },
  purchaseOrder: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
    isCanApprove: true,
    isCanPrint: true,
  },
  marketing: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
  },
  voucher: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
  },
  staff: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
  },
  staffMember: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
  },

  // Settings modules
  account: {
    isCanCreate: false,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
  },
  posSettings: {
    isCanCreate: false,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
  },
  integrations: {
    isCanCreate: false,
    isCanRead: true,
    isCanUpdate: false,
    isCanDelete: false,
  },
  outlet: {
    isCanCreate: false,
    isCanRead: true,
    isCanUpdate: false,
    isCanDelete: false,
  },
  pointConfiguration: {
    isCanCreate: false,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
  },

  // Dashboard
  dashboard: {
    isCanCreate: false,
    isCanRead: true,
    isCanUpdate: false,
    isCanDelete: false,
  },

  // Cash drawer
  cashDrawer: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
  },
  cashInOut: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
  },
};

/**
 * @description Default permissions for cashier role
 */
export const CASHIER_PERMISSIONS: IModulePermissions = {
  // Sales modules
  cashier: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: false,
    isCanDelete: false,
    isCanPrint: true,
  },
  salesOrder: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: false,
    isCanDelete: false,
    isCanPrint: true,
  },
  queue: {
    isCanCreate: false,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
  },
  kitchenQueue: {
    isCanCreate: false,
    isCanRead: true,
    isCanUpdate: false,
    isCanDelete: false,
  },
  customer: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
  },
  customerWaitingList: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
  },
  invoice: {
    isCanCreate: false,
    isCanRead: true,
    isCanUpdate: false,
    isCanDelete: false,
    isCanPrint: true,
  },

  // Dashboard
  dashboard: {
    isCanCreate: false,
    isCanRead: true,
    isCanUpdate: false,
    isCanDelete: false,
  },

  // Cash drawer
  cashDrawer: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: false,
    isCanDelete: false,
  },
  cashInOut: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: false,
    isCanDelete: false,
  },
};

/**
 * @description Default permissions for owner role
 */
export const OWNER_PERMISSIONS: IModulePermissions = {
  // Sales modules
  cashier: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
    isCanExport: true,
    isCanPrint: true,
  },
  salesOrder: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
    isCanExport: true,
    isCanPrint: true,
  },
  queue: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },
  kitchenQueue: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },
  report: {
    isCanCreate: false,
    isCanRead: true,
    isCanUpdate: false,
    isCanDelete: false,
    isCanExport: true,
    isCanPrint: true,
  },
  catalog: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
    isCanImport: true,
    isCanExport: true,
  },
  catalogCategories: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },
  catalogProducts: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },
  customer: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
    isCanImport: true,
    isCanExport: true,
  },
  customerWaitingList: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },
  dailySales: {
    isCanCreate: false,
    isCanRead: true,
    isCanUpdate: false,
    isCanDelete: false,
    isCanExport: true,
  },
  invoice: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
    isCanPrint: true,
  },

  // Operations modules
  store: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },
  inventory: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
    isCanImport: true,
    isCanExport: true,
  },
  purchaseOrder: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
    isCanApprove: true,
    isCanPrint: true,
  },
  marketing: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },
  voucher: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },
  staff: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },
  staffMember: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },

  // Settings modules
  account: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },
  posSettings: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },
  integrations: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },
  outlet: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },
  pointConfiguration: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },

  // Dashboard
  dashboard: {
    isCanCreate: false,
    isCanRead: true,
    isCanUpdate: false,
    isCanDelete: false,
  },

  // Cash drawer
  cashDrawer: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },
  cashInOut: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: true,
  },
};

/**
 * @description Default permissions for staff role
 */
export const STAFF_PERMISSIONS: IModulePermissions = {
  // Sales modules
  cashier: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
    isCanPrint: true,
  },
  salesOrder: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
    isCanPrint: true,
  },
  queue: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
  },
  kitchenQueue: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
  },
  report: {
    isCanCreate: false,
    isCanRead: true,
    isCanUpdate: false,
    isCanDelete: false,
    isCanExport: false,
    isCanPrint: true,
  },
  catalog: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
    isCanExport: false,
  },
  catalogCategories: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
  },
  catalogProducts: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
  },
  customer: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
    isCanExport: false,
  },
  customerWaitingList: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
  },
  dailySales: {
    isCanCreate: false,
    isCanRead: true,
    isCanUpdate: false,
    isCanDelete: false,
    isCanExport: false,
  },
  invoice: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
    isCanPrint: true,
  },

  // Operations modules
  store: {
    isCanCreate: false,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
  },
  inventory: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
    isCanExport: false,
  },
  purchaseOrder: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
    isCanApprove: false,
    isCanPrint: true,
  },
  marketing: {
    isCanCreate: false,
    isCanRead: true,
    isCanUpdate: false,
    isCanDelete: false,
  },
  voucher: {
    isCanCreate: false,
    isCanRead: true,
    isCanUpdate: false,
    isCanDelete: false,
  },
  staff: {
    isCanCreate: false,
    isCanRead: true,
    isCanUpdate: false,
    isCanDelete: false,
  },
  staffMember: {
    isCanCreate: false,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
  },

  // Settings modules
  account: {
    isCanCreate: false,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
  },
  posSettings: {
    isCanCreate: false,
    isCanRead: true,
    isCanUpdate: false,
    isCanDelete: false,
  },
  integrations: {
    isCanCreate: false,
    isCanRead: true,
    isCanUpdate: false,
    isCanDelete: false,
  },
  outlet: {
    isCanCreate: false,
    isCanRead: true,
    isCanUpdate: false,
    isCanDelete: false,
  },
  pointConfiguration: {
    isCanCreate: false,
    isCanRead: true,
    isCanUpdate: false,
    isCanDelete: false,
  },

  // Dashboard
  dashboard: {
    isCanCreate: false,
    isCanRead: true,
    isCanUpdate: false,
    isCanDelete: false,
  },

  // Cash drawer
  cashDrawer: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
  },
  cashInOut: {
    isCanCreate: true,
    isCanRead: true,
    isCanUpdate: true,
    isCanDelete: false,
  },
};

/**
 * @description Default roles configuration
 */
export const DEFAULT_ROLES: IRole[] = [
  {
    id: 'owner',
    name: 'Owner',
    description: 'Business owner with full control over all operations and settings',
    permissions: OWNER_PERMISSIONS,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'super-admin',
    name: 'Super Admin',
    description: 'Full access to all modules and functionalities',
    permissions: SUPER_ADMIN_PERMISSIONS,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Access to most modules with limited administrative permissions',
    permissions: MANAGER_PERMISSIONS,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'staff',
    name: 'Staff',
    description: 'Regular staff member with operational access but limited administrative rights',
    permissions: STAFF_PERMISSIONS,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cashier',
    name: 'Cashier',
    description: 'Limited access focused on sales and customer operations',
    permissions: CASHIER_PERMISSIONS,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * @description Route permission mapping for navigation control
 */
export const ROUTE_PERMISSION_MAPPING = {
  // Dashboard
  dashboard: { module: 'dashboard', action: 'isCanRead' },

  // Cashier
  cashier: { module: 'cashier', action: 'isCanRead' },

  // Sales Order
  'sales-order': { module: 'salesOrder', action: 'isCanRead' },
  'sales-order.create': { module: 'salesOrder', action: 'isCanCreate' },
  'sales-order.edit': { module: 'salesOrder', action: 'isCanUpdate' },

  // Queue
  queue: { module: 'queue', action: 'isCanRead' },
  'queue.kitchen-display': { module: 'kitchenQueue', action: 'isCanRead' },

  // Report
  report: { module: 'report', action: 'isCanRead' },

  // Catalog
  catalog: { module: 'catalog', action: 'isCanRead' },
  'catalog.categories': { module: 'catalogCategories', action: 'isCanRead' },
  'catalog.products': { module: 'catalogProducts', action: 'isCanRead' },

  // Customer
  customer: { module: 'customer', action: 'isCanRead' },
  'customer.create': { module: 'customer', action: 'isCanCreate' },
  'customer.edit': { module: 'customer', action: 'isCanUpdate' },

  // Store
  store: { module: 'store', action: 'isCanRead' },

  // Inventory
  inventory: { module: 'inventory', action: 'isCanRead' },

  // Purchase Order
  'purchase-order.index': { module: 'purchaseOrder', action: 'isCanRead' },
  'purchase-order.create': { module: 'purchaseOrder', action: 'isCanCreate' },
  'purchase-order.edit': { module: 'purchaseOrder', action: 'isCanUpdate' },

  // Marketing
  marketing: { module: 'marketing', action: 'isCanRead' },
  voucher: { module: 'voucher', action: 'isCanRead' },

  // Staff
  staff: { module: 'staff', action: 'isCanRead' },
  'staff.staff-member': { module: 'staffMember', action: 'isCanRead' },

  // Settings
  account: { module: 'account', action: 'isCanRead' },
  'pos-setting': { module: 'posSettings', action: 'isCanRead' },
  'pos-setting.point-configuration': { module: 'pointConfiguration', action: 'isCanRead' },
  integrations: { module: 'integrations', action: 'isCanRead' },

  // Outlet
  'outlet.list': { module: 'outlet', action: 'isCanRead' },
  'outlet.create': { module: 'outlet', action: 'isCanCreate' },
  'outlet.edit': { module: 'outlet', action: 'isCanUpdate' },
} as const;

/**
 * @description RBAC related constants
 */
export const RBAC_CONSTANTS = {
  STORE_KEY: 'rbac',
  LOCAL_STORAGE_KEY: 'rbac_user_role',
  DEFAULT_REDIRECT_ROUTE: 'dashboard',
  UNAUTHORIZED_ROUTE: 'not-authorized',
} as const;
