import LoyaltyPointBenefitUI from '@/modules/point-configuration/views/LoyaltyPointBenefitUI.vue';
import LoyaltyPointSettingUI from '@/modules/point-configuration/views/LoyaltyPointSettingUI.vue';

export const LIST_TABS_POINT_CONFIGURATION: ITabs[] = [
  {
    component: LoyaltyPointBenefitUI,
    label: 'Loyalty Point Benefit',
    value: 'loyalty-point-benefit',
  },
  {
    component: LoyaltyPointSettingUI,
    label: 'Loyalty Point Setting',
    value: 'loyalty-point-setting',
  },
];

export const LOYALTY_POINT_SETTINGS_PRODUCT_LIST_COLUMNS: IColumnDataTable[] = [
  {
    label: '#',
    sortable: false,
    value: 'index',
  },
  {
    label: 'Product Name',
    sortable: false,
    value: 'productName',
  },
  {
    label: 'Price',
    sortable: false,
    value: 'price',
  },
  {
    label: 'Point Earned (pts)',
    sortable: false,
    value: 'points',
  },
  {
    label: 'Minimum Purchased Product',
    sortable: false,
    value: 'minimumTransaction',
  },
  {
    label: '',
    sortable: false,
    value: 'action',
  }
];
export const LOYALTY_POINT_SETTINGS_SELECT_PRODUCT_LIST_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Product Name',
    sortable: false,
    value: 'productName',
  },
  {
    label: 'Price',
    sortable: false,
    value: 'price',
  },
  {
    label: 'Point Earned (pts)',
    sortable: false,
    value: 'points',
  },
  {
    label: 'Minimum Purchased Product',
    sortable: false,
    value: 'minimumTransaction',
  },
];