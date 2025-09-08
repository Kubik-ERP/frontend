/**
 * @description Mapping of permissions to their accessible routes
 * Format: 'permission_key': ['route1', 'route2', ...]
 */
const PERMISSION_ROUTES_MAPPING: Record<TPermissions, string[]> = {
  // Store and dashboard access
  access_all_store: ['/'],
  dashboard_view: ['/dashboard'],
  store_management: ['/outlet/list', '/outlet/create', 'outlet/edit/:id'],

  // Sales operations
  check_out_sales: ['/cashier', '/sales-order', '/invoice'],
  cancel_invoice: ['/invoice'],
  refund_invoice: ['/invoice'],
  process_unpaid_invoice: ['/invoice'],
  daily_sales: ['/daily-sales'],
  queue: ['/queue', '/queue/kitchen-display'],

  // Product and catalog management
  product_management: ['/catalog', '/catalog/products', '/catalog/product-bundling'],
  product_category: ['/catalog', '/catalog/categories'],

  // Customer management
  customer_management: ['/customer'],
  view_customer_profile: ['/customer'],
  management_customer_loyalty_point: ['/customer'],

  // Inventory management
  manage_item: ['/inventory', '/items', '/items/view/:id', '/items/create', '/items/edit/:id'],
  category_management: ['/inventory',  '/inventory-category'],
  supplier_management: ['/inventory', '/supplier', '/supplier/create', '/supplier/edit/:id', '/supplier/view/:id'],
  view_supplier_details: ['/inventory', '/supplier/view/:id'],
  stock_adjustment: ['/inventory', '/items', '/items/view/:id'],
  manage_brand: ['/inventory', '/brand'],
  manage_stock_opname: ['/inventory', '/stock-opname', '/stock-opname/issue/:id', '/stock-opname/detail/:id'],
  manage_storage_location: ['/inventory', '/storage-location'],
  manage_purchase_order: ['/inventory', '/purchase-order'],

  // Staff management
  manage_staff_member: ['/staff', '/staff/staff-member', '/user-permission'],
  manage_staff_attendance: ['/staff/attendance'],

  // Cash management
  set_up_cash_drawer: ['/cash-drawer'],
  close_cash_register: ['/cash-drawer'],
  cash_in_out: ['/cash-in-out'],

  // Configuration and settings
  connected_device_configuration: ['/pos-setting', '/pos-setting/connected-device', 'device'],
  payment_method_configuration: ['/pos-setting', '/pos-setting/payment-method'],
  general_loyalty_point_configuration: ['/pos-setting', '/pos-setting/point-configuration'],
  tax_and_service_charge_configuration: ['/pos-setting', '/pos-setting/tax-service'],

  // Marketing and vouchers
  voucher: ['/marketing', '/voucher'],

  // Account management
  accounts: ['/account'],

  // Reports and templates
  reports: [
    '/report',
    '/report/financial-report',
    '/report/sales-report',
    '/report/inventory-report',
    '/report/voucher-report',
  ],
  invoice_templates: ['/pos-setting', '/pos-setting/invoice'],
};

/**
 * @description Check if user has permission to access a menu
 */
export const hasMenuPermission = (menuPath: string, userPermissions: string[]): boolean => {
  // Check if user has any permission that grants access to this route
  return userPermissions.some((permission: string) => {
    const accessibleRoutes = PERMISSION_ROUTES_MAPPING[permission as TPermissions];
    return accessibleRoutes && accessibleRoutes.includes(menuPath);
  });
};

/**
 * @description Check if user has access to all store (super permission)
 */
export const hasAccessAllStore = (userPermissions: string[]): boolean => {
  return userPermissions.includes('access_all_store');
};

export const filterMenusByPermissions = (
  menuCategories: IMenuCategory[],
  userPermissions: string[],
): IMenuCategory[] => {
//   if (hasAccessAllStore(userPermissions)) {
//   return menuCategories;
// }
  return menuCategories
    .map(category => {
      const filteredMenus = category.menus.filter((menu: IMenu) => {
        // 🔹 Cek akses main menu
        console.log('🚀 ~ hasMenuPermission ~ menu.path:', menu);
        const hasMainMenuAccess = hasMenuPermission(menu.path, userPermissions);

        // 🔹 Kalau menu ini store-related dan user punya access_all_store → auto boleh
        const isStoreMenu = menu.path?.includes('/store'); // sesuaikan dengan struktur path
        const allowByAllStore = isStoreMenu && hasAccessAllStore(userPermissions);

        if (!hasMainMenuAccess && !allowByAllStore) {
          return false;
        }

        // 🔹 Filter submenus juga
        if (menu.subMenus && menu.subMenus.length > 0) {
          const filteredSubMenus = menu.subMenus.filter((subMenu: ISubMenu) => {
            const hasSubAccess = hasMenuPermission(subMenu.path, userPermissions);
            const isStoreSub = subMenu.path?.includes('/store');
            return hasSubAccess || (isStoreSub && hasAccessAllStore(userPermissions));
          });

          menu.subMenus = filteredSubMenus;
          return filteredSubMenus.length > 0 || hasMainMenuAccess || allowByAllStore;
        }

        return true;
      });

      return filteredMenus.length > 0 ? { ...category, menus: filteredMenus } : null;
    })
    .filter(Boolean) as IMenuCategory[];
};

/**
 * @description Get permissions that grant access to a specific menu path
 */
export const getMenuPermissionRequirements = (menuPath: string): TPermissions[] => {
  const permissions: TPermissions[] = [];

  // Find all permissions that grant access to this route
  Object.entries(PERMISSION_ROUTES_MAPPING).forEach(([permission, routes]) => {
    if (routes.includes(menuPath)) {
      permissions.push(permission as TPermissions);
    }
  });

  return permissions;
};
