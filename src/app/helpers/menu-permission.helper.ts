/**
 * @description Mapping of permissions to their accessible routes
 * Format: 'permission_key': ['route1', 'route2', ...]
 */
const PERMISSION_ROUTES_MAPPING: Record<TPermissions, string[]> = {
  // Store and dashboard access
  access_all_store: ['/'],
  dashboard_view: ['/'],
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
  category_management: ['/catalog/categories', '/inventory/categories'],
  manage_item: ['/catalog/products', '/inventory', '/inventory/items'],

  // Customer management
  customer_management: ['/customer'],
  view_customer_profile: ['/customer'],
  management_customer_loyalty_point: ['/customer'],

  // Inventory management
  stock_adjustment: ['/inventory', '/inventory/stock-adjustment'],
  manage_brand: ['/inventory/brands'],
  manage_stock_opname: ['/inventory/stock-opname'],
  manage_storage_location: ['/inventory/storage-locations'],
  manage_purchase_order: ['/purchase-order'],

  // Staff management
  manage_staff_member: ['/staff', '/staff/staff-member'],
  manage_staff_attendance: ['/staff/attendance'],

  // Cash management
  set_up_cash_drawer: ['/cash-drawer'],
  close_cash_register: ['/cash-drawer'],
  cash_in_out: ['/cash-in-out'],

  // Configuration and settings
  connected_device_configuration: ['/pos-setting', '/integrations'],
  payment_method_configuration: ['/pos-setting'],
  general_loyalty_point_configuration: ['/pos-setting'],
  tax_and_service_charge_configuration: ['/pos-setting'],

  // Marketing and vouchers
  voucher: ['/marketing', '/voucher'],

  // Supplier management
  supplier_management: ['/supplier'],
  view_supplier_details: ['/supplier'],

  // Account management
  accounts: ['/account'],

  // Reports and templates
  reports: ['/report'],
  invoice_templates: ['/invoice'],
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

/**
 * @description Filter menu categories based on user permissions
 */
export const filterMenusByPermissions = (
  menuCategories: IMenuCategory[],
  userPermissions: string[],
): IMenuCategory[] => {
  // If user has access to all stores, return all menus
  if (hasAccessAllStore(userPermissions)) {
    return menuCategories;
  }

  return menuCategories
    .map(category => ({
      ...category,
      menus: category.menus.filter((menu: IMenu) => {
        // Check main menu permission
        const hasMainMenuAccess = hasMenuPermission(menu.path, userPermissions);

        if (!hasMainMenuAccess) {
          return false;
        }

        // If menu has submenus, filter them too
        if (menu.subMenus && menu.subMenus.length > 0) {
          const filteredSubMenus = menu.subMenus.filter((subMenu: ISubMenu) =>
            hasMenuPermission(subMenu.path, userPermissions),
          );

          // Only show menu if it has accessible submenus or is accessible itself
          menu.subMenus = filteredSubMenus;
          return filteredSubMenus.length > 0 || hasMainMenuAccess;
        }

        return hasMainMenuAccess;
      }),
    }))
    .filter(category => category.menus.length > 0); // Remove empty categories
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
