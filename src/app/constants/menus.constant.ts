export const LIST_ADDITIONAL_MENUS = [
  {
    name: 'Report',
    iconName: 'report-secondary',
    path: '/',
    isHaveSubMenus: false,
    subMenus: [],
  },
  {
    name: 'Help Desk',
    iconName: 'help-desk',
    path: '/',
    isHaveSubMenus: false,
    subMenus: [],
  },
];

export const LIST_SIDEBAR_MENUS = [
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
        subMenus: [],
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
        name: 'Store',
        iconName: 'store',
        path: '/store',
        isHaveSubMenus: false,
        subMenus: [],
      },
      {
        name: 'Inventory',
        iconName: 'inventory',
        path: '/inventory',
        isHaveSubMenus: false,
        subMenus: [
          {
            name: 'Master Item',
            path: '/',
          },
          {
            name: 'Master Supplier',
            path: '/supplier',
          },
          {
            name: 'Master Brand',
            path: '/',
          },
          {
            name: 'Inventory Categories',
            path: '/',
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
        path: '/marketing',
        isHaveSubMenus: true,
        subMenus: [
          {
            name: 'Master Voucher',
            path: '/voucher',
          },
        ],
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
            path: '/',
          },
          {
            name: 'Attendance',
            path: '/',
          },
          {
            name: 'Commision Report',
            path: '/',
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
            name: 'Tax & Service Charge',
            path: '/pos-setting/tax-service',
          },
          {
            name: 'Invoice',
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
