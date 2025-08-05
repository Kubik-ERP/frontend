export const LOYALTY_POINT_BENEFIT_LIST_REQUEST = 'LOYALTY_POINT_BENEFIT_LIST_REQUEST';

export const LOYALTY_POINT_BENEFIT_LIST_COLUMNS: IColumnDataTable[] = [
  {
    label: '#',
    sortable: false,
    value: 'index',
  },
  {
    label: 'Type',
    sortable: false,
    value: 'type',
  },
  {
    label: 'Benefit Name',
    sortable: false,
    value: 'benefitName',
  },
  {
    label: 'Point Needs (pts)',
    sortable: false,
    value: 'pointNeeds',
  },
  {
    label: 'Discount/Free Items',
    sortable: false,
    value: 'discountFreeItems',
  },
  {
    label: '',
    sortable: false,
    value: 'action',
  },
];

export const LOYALTY_POINT_BENEFIT_LIST_DATA = [
  {
    type: 'Discount',
    benefitName: 'Discount Rp 10.000',
    pointNeeds: 10,
    discountFreeItems: {
      discount: 10000,
      isPercent: false,
    },
  },
  {
    type: 'Discount',
    benefitName: 'Discount 10%',
    pointNeeds: 5,
    discountFreeItems: {
      discount: 10,
      isPercent: true,
    },
  },
  {
    type: 'Discount',
    benefitName: 'Discount 50%',
    pointNeeds: 20,
    discountFreeItems: {
      discount: 50,
      isPercent: true,
    },
  },
  {
    type: 'Discount',
    benefitName: 'Discount Rp 10.000',
    pointNeeds: 10,
    discountFreeItems: {
      discount: 10000,
      isPercent: false,
    },
  },
  {
    type: 'Discount',
    benefitName: 'Discount Rp 10.000',
    pointNeeds: 20,
    discountFreeItems: {
      discount: 10000,
      isPercent: false,
    },
  },
  {
    type: 'Free Items',
    benefitName: 'Free Product Deals',
    pointNeeds: 10,
    discountFreeItems: [
      {
        id: '1',
        name: 'Spaghetti',
        quantity: 1,
      },
      {
        id: '2',
        name: 'Coke',
        quantity: 1,
      },
      {
        id: '3',
        name: 'French Fries',
        quantity: 1,
      },
      {
        id: '4',
        name: 'Cheese Burger',
        quantity: 1,
      }
    ],
  },
  {
    type: 'Free Items',
    benefitName: 'Birthday Deals',
    pointNeeds: 10,
    discountFreeItems: [
      {
        id: '5',
        name: 'Ice Cream',
        quantity: 1,
      },
      {
        id: '6',
        name: 'Birthday Cake',
        quantity: 1,
      },
    ],
  },
  {
    type: 'Free Items',
    benefitName: 'Independence Day Deals',
    pointNeeds: 10,
    discountFreeItems: [
      {
        id: '7',
        name: 'Spaghetti',
        quantity: 1,
      },
      {
        id: '8',
        name: 'Coke',
        quantity: 1,
      },
      {
        id: '9',
        name: 'French Fries',
        quantity: 1,
      },
      {
        id: '10',
        name: 'Cheese Burger',
        quantity: 1,
      }
    ],
  },
  {
    type: 'Free Items',
    benefitName: 'Happy Meal Deals',
    pointNeeds: 10,
    discountFreeItems: [
      {
        id: '11',
        name: 'Ice Cream',
        quantity: 1,
      },
      {
        id: '12',
        name: 'Croissant',
        quantity: 1,
      },
      {
        id: '13',
        name: 'French Fries',
        quantity: 1,
      }
    ],
  }
];
