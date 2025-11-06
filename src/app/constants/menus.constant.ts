export const LIST_ADDITIONAL_MENUS = [
  // {
  //   name: 'Report',
  //   iconName: 'report-secondary',
  //   path: '/',
  //   isHaveSubMenus: false,
  //   subMenus: [],
  // },
  // {
  //   name: 'Help Desk',
  //   iconName: 'help-desk',
  //   path: '/',
  //   isHaveSubMenus: false,
  //   subMenus: [],
  // },
];

export const LIST_SIDEBAR_MENUS = [
  {
    name: '',
    translationKey: '',
    menus: [
      {
        name: 'Dashboard',
        translationKey: 'app.menus.dashboard',
        iconName: 'dashboard',
        path: '/dashboard',
        isHaveSubMenus: false,
        subMenus: [],
      },
    ],
  },
  {
    name: 'Cashier',
    translationKey: 'app.menu-categories.cashier',
    menus: [
      {
        name: 'Cashier',
        translationKey: 'app.menus.cashier',
        iconName: 'cashier',
        path: '/cashier',
        isHaveSubMenus: false,
        subMenus: [],
      },
    ],
  },
  {
    name: 'Sales',
    translationKey: 'app.menu-categories.sales',
    menus: [
      {
        name: 'Sales Order',
        translationKey: 'app.menus.sales-order',
        iconName: 'sales',
        path: '/sales-order',
        isHaveSubMenus: false,
        subMenus: [],
      },
      {
        name: 'Queue',
        translationKey: 'app.menus.queue',
        iconName: 'queue',
        path: '/queue',
        isHaveSubMenus: true,
        subMenus: [
          {
            name: 'Customer Queue',
            translationKey: 'app.menus.customer-queue',
            path: '/queue',
          },
          {
            name: 'Kitchen Queue',
            translationKey: 'app.menus.kitchen-queue',
            path: '/queue/kitchen-display',
          },
        ],
      },
      {
        name: 'Report',
        translationKey: 'app.menus.report',
        iconName: 'report',
        path: '/report',
        isHaveSubMenus: true,
        subMenus: [
          {
            name: 'Financial Report',
            translationKey: 'app.menus.financial-report',
            path: '/report/financial-report',
          },
          // {
          //   name: 'Loss Report',
          //   path: '/report/loss-report',
          // },
          {
            name: 'Sales Report',
            translationKey: 'app.menus.sales-report',
            path: '/report/sales-report',
          },
          {
            name: 'Inventory Report',
            translationKey: 'app.menus.inventory-report',
            path: '/report/inventory-report',
          },
          // {
          //   name: 'Raw Material Report',
          //   path: '/report/raw-material-report',
          // },
          {
            name: 'Voucher Report',
            translationKey: 'app.menus.voucher-report',
            path: '/report/voucher-report',
          },
          // {
          //   name: 'Staff Report',
          //   path: '/report/staff-report',
          // },
          {
            name: 'Customer Report',
            path: '/report/customer-report',
          },
          // {
          //   name: 'Commision Report',
          //   path: '/report/commision-report',
          // },
          {
            name: 'Loyalty Point Report',
            path: '/report/loyalty-point-report',
          }
        ],
      },
      {
        name: 'Catalog',
        translationKey: 'app.menus.catalog',
        iconName: 'catalog',
        path: '/catalog',
        isHaveSubMenus: true,
        subMenus: [
          {
            name: 'Categories',
            translationKey: 'app.menus.categories',
            path: '/catalog/categories',
          },
          {
            name: 'Products',
            translationKey: 'app.menus.products',
            path: '/catalog/products',
          },
          {
            name: 'Product Bundling',
            translationKey: 'app.menus.product-bundling',
            path: '/catalog/product-bundling',
          },
        ],
      },
      {
        name: 'Customer',
        translationKey: 'app.menus.customer',
        iconName: 'customer',
        path: '/customer',
        isHaveSubMenus: false,
        subMenus: [],
      },
    ],
  },
  {
    name: 'Operations',
    translationKey: 'app.menu-categories.operations',
    menus: [
      {
        name: 'Inventory',
        translationKey: 'app.menus.inventory',
        iconName: 'inventory',
        path: '/inventory',
        isHaveSubMenus: true,
        subMenus: [
          {
            name: 'Master Item',
            translationKey: 'app.menus.master-item',
            path: '/items',
          },
          {
            name: 'Master Supplier',
            translationKey: 'app.menus.master-supplier',
            path: '/supplier',
          },
          {
            name: 'Master Brand',
            translationKey: 'app.menus.master-brand',
            path: '/brand',
          },
          {
            name: 'Inventory Categories',
            translationKey: 'app.menus.inventory-categories',
            path: '/inventory-category',
          },
          {
            name: 'Purchase Order',
            translationKey: 'app.menus.purchase-order',
            path: '/purchase-order',
          },
          {
            name: 'Stock Opname',
            translationKey: 'app.menus.stock-opname',
            path: '/stock-opname',
          },
          {
            name: 'Storage Location',
            translationKey: 'app.menus.storage-location',
            path: '/storage-location',
          },
        ],
      },
      {
        name: 'Recipe',
        translationKey: 'app.menus.recipe',
        iconName: 'recipe',
        path: '/recipe',
        isHaveSubMenus: true,
        subMenus: [
          {
            name: 'Menu Recipe',
            translationKey: 'app.menus.menu-recipe',
            path: '/recipe/menu-recipe',
          },
          {
            name: 'Prep & Batch Management',
            translationKey: 'app.menus.prep-batch-management',
            path: '/recipe/prep-batch-management',
          },
          {
            name: 'Waste Log',
            translationKey: 'app.menus.waste-log',
            path: '/recipe/waste-log',
          },
        ],
      },
      {
        name: 'Marketing',
        translationKey: 'app.menus.marketing',
        iconName: 'marketing',
        path: '/marketing',
        isHaveSubMenus: true,
        subMenus: [
          {
            name: 'Voucher',
            translationKey: 'app.menus.voucher',
            path: '/marketing/voucher',
          },
          {
            name: 'Discount',
            translationKey: 'app.menus.discount',
            path: '/marketing/discount',
          },
        ],
      },
      {
        name: 'Staff',
        translationKey: 'app.menus.staff',
        iconName: 'staff',
        path: '/staff',
        isHaveSubMenus: true,
        subMenus: [
          {
            name: 'Staff Members',
            translationKey: 'app.menus.staff-members',
            path: '/staff/staff-member',
          },
          // {
          //   name: 'Working Hours',
          //   translationKey: 'app.menus.working-hours',
          //   path: '/staff/working-hours',
          // },
          // {
          //   name: 'Attendance',
          //   translationKey: 'app.menus.attendance',
          //   path: '/staff/attendance',
          // },
          {
            name: 'User Permission',
            translationKey: 'app.menus.user-permission',
            path: '/user-permission',
          },
        ],
      },
    ],
  },
  {
    name: 'Settings',
    translationKey: 'app.menu-categories.settings',
    menus: [
      {
        name: 'Account',
        translationKey: 'app.menus.account',
        iconName: 'account-company',
        path: '/account',
        isHaveSubMenus: false,
        subMenus: [],
      },
      {
        name: 'POS Settings',
        translationKey: 'app.menus.pos-settings',
        iconName: 'gear',
        path: '/pos-setting',
        isHaveSubMenus: true,
        subMenus: [
          {
            name: 'Device',
            translationKey: 'app.menus.device',
            path: '/pos-setting/connected-device',
          },
          {
            name: 'Payment Method',
            translationKey: 'app.menus.payment-method',
            path: '/pos-setting/payment-method',
          },
          {
            name: 'Loyalty Point',
            translationKey: 'app.menus.loyalty-point',
            path: '/pos-setting/point-configuration',
          },
          {
            name: 'Rounding',
            translationKey: 'app.menus.rounding',
            path: '/pos-setting/rounding',
          },
          {
            name: 'Tax & Service Charge',
            translationKey: 'app.menus.tax-service-charge',
            path: '/pos-setting/tax-service',
          },
          // {
          //   name: 'Notification',
          //   path: '/',
          // },
          {
            name: 'Invoice',
            translationKey: 'app.menus.invoice',
            path: '/pos-setting/invoice',
          },
        ],
      },
      {
        name: 'Integrations',
        iconName: 'integrations',
        path: '/integrations',
        isHaveSubMenus: false,
        subMenus: [],
      },
    ],
  },
];
