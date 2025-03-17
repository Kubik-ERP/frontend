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
        path: '/',
      },
    ],
  },
  {
    name: 'Sales',
    menus: [
      {
        name: 'Sales Order',
        iconName: 'sales',
        path: '/',
        isHaveSubMenus: false,
        subMenus: [],
      },
      {
        name: 'Report',
        iconName: 'report',
        path: '/',
        isHaveSubMenus: false,
        subMenus: [],
      },
      {
        name: 'Catalog',
        iconName: 'catalog',
        path: '',
        isHaveSubMenus: true,
        subMenus: [
          {
            name: 'Categories',
            path: '/',
          },
          {
            name: 'Products',
            path: '/',
          },
        ],
      },
    ],
  },
  {
    name: 'Operations',
    menus: [
      {
        name: 'Store',
        iconName: 'store',
        path: '/',
        isHaveSubMenus: false,
        subMenus: [],
      },
      {
        name: 'Inventory',
        iconName: 'inventory',
        path: '/',
        isHaveSubMenus: false,
        subMenus: [],
      },
      {
        name: 'Marketing',
        iconName: 'marketing',
        path: '/',
        isHaveSubMenus: false,
        subMenus: [],
      },
      {
        name: 'Staff',
        iconName: 'staff',
        path: '/',
        isHaveSubMenus: true,
        subMenus: [
          {
            name: 'Staff Members',
            path: '/',
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
      {
        name: 'Purchasing',
        iconName: 'receipt',
        path: '/',
        isHaveSubMenus: false,
        subMenus: [],
      },
    ],
  },
  {
    name: 'Settings',
    menus: [
      {
        name: 'Account',
        iconName: 'account-company',
        path: '/',
        isHaveSubMenus: false,
        subMenus: [],
      },
      {
        name: 'Point of Sales',
        iconName: 'sales',
        path: '/',
        isHaveSubMenus: false,
        subMenus: [],
      },
      {
        name: 'Integrations',
        iconName: 'integrations',
        path: '/',
        isHaveSubMenus: false,
        subMenus: [],
      },
    ],
  },
];
