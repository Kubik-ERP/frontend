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
