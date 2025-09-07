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
    menus: [
      {
        name: 'Dashboard',
        iconName: 'dashboard',
        path: '/dashboard',
        isHaveSubMenus: false,
        subMenus: [],
      },
    ],
  },
  {
    name: 'Cashier',
    menus: [
      {
        name: 'Cashier',
        iconName: 'cashier',
        path: '/cashier',
        isHaveSubMenus: false,
        subMenus: [],
      },
    ],
  },
  {
    name: 'Sales',
    menus: [
      {
        name: 'Sales Order',
        iconName: 'sales',
        path: '/sales-order',
        isHaveSubMenus: false,
        subMenus: [],
      },
      {
        name: 'Queue',
        iconName: 'queue',
        path: '/queue',
        isHaveSubMenus: true,
        subMenus: [
          {
            name: 'Customer Queue',
            path: '/queue',
          },
          {
            name: 'Kitchen Queue',
            path: '/queue/kitchen-display',
          },
        ],
      },
      {
        name: 'Report',
        iconName: 'report',
        path: '/report',
        isHaveSubMenus: false,
        subMenus: [
          {
            name: 'Financial Report',
            path: '/report/financial-report',
          },
          // {
          //   name: 'Loss Report',
          //   path: '/report/loss-report',
          // },
          {
            name: 'Sales Report',
            path: '/report/sales-report',
          },
          {
            name: 'Inventory Report',
            path: '/report/inventory-report',
          },
          // {
          //   name: 'Raw Material Report',
          //   path: '/report/raw-material-report',
          // },
          {
            name: 'Voucher Report',
            path: '/report/voucher-report',
          },
          // {
          //   name: 'Staff Report',
          //   path: '/report/staff-report',
          // },
          // {
          //   name: 'Customer Report',
          //   path: '/report/customer-report',
          // },
          // {
          //   name: 'Commision Report',
          //   path: '/report/commision-report',
          // },
        ],
      },
      {
        name: 'Catalog',
        iconName: 'catalog',
        path: '/catalog',
        isHaveSubMenus: true,
        subMenus: [
          {
            name: 'Categories',
            path: '/catalog/categories',
          },
          {
            name: 'Products',
            path: '/catalog/products',
          },
          {
            name: 'Product Bundling',
            path: '/catalog/product-bundling',
          },
        ],
      },
      {
        name: 'Customer',
        iconName: 'customer',
        path: '/customer',
        isHaveSubMenus: false,
        subMenus: [],
      },
    ],
  },
  {
    name: 'Operations',
    menus: [
      {
        name: 'Inventory',
        iconName: 'inventory',
        path: '/inventory',
        isHaveSubMenus: false,
        subMenus: [
          {
            name: 'Master Item',
            path: '/items',
          },
          {
            name: 'Master Supplier',
            path: '/supplier',
          },
          {
            name: 'Master Brand',
            path: '/brand',
          },
          {
            name: 'Inventory Categories',
            path: '/inventory-category',
          },
          {
            name: 'Stock Opname',
            path: '/inventory/stock-opname',
          },
          {
            name: 'Storage Location',
            path: '/storage-location',
          },
        ],
      },
      {
        name: 'Purchase Order',
        iconName: 'receipt',
        path: '/purchase-order',
        isHaveSubMenus: false,
        subMenus: [],
      },
      {
        name: 'Marketing',
        iconName: 'marketing',
        path: '/voucher',
        isHaveSubMenus: false,
        subMenus: [],
      },
      {
        name: 'Staff',
        iconName: 'staff',
        path: '/staff',
        isHaveSubMenus: true,
        subMenus: [
          {
            name: 'Staff Members',
            path: '/staff/staff-member',
          },
          {
            name: 'Working Hours',
            path: '/staff/working-hours',
          },
          {
            name: 'Attendance',
            path: '/staff/attendance',
          },
          {
            name: 'User Permission',
            path: '/user-permission',
          },
        ],
      },
    ],
  },
  {
    name: 'Settings',
    menus: [
      {
        name: 'Account',
        iconName: 'account-company',
        path: '/account',
        isHaveSubMenus: false,
        subMenus: [],
      },
      {
        name: 'POS Settings',
        iconName: 'gear',
        path: '/pos-setting',
        isHaveSubMenus: true,
        subMenus: [
          {
            name: 'Device',
            path: '/pos-setting/device',
          },
          {
            name: 'Payment Method',
            path: '/pos-setting/payment-method',
          },
          {
            name: 'Loyalty Point',
            path: '/pos-setting/point-configuration',
          },
          {
            name: 'Rounding',
            path: '/pos-setting/rounding',
          },
          {
            name: 'Tax & Service Charge',
            path: '/pos-setting/tax-service',
          },
          // {
          //   name: 'Notification',
          //   path: '/',
          // },
          {
            name: 'Invoice',
            path: '/pos-setting/invoice',
          },
        ],
      },
      // {
      //   name: 'Integrations',
      //   iconName: 'integrations',
      //   path: '/integrations',
      //   isHaveSubMenus: false,
      //   subMenus: [],
      // },
    ],
  },
];
