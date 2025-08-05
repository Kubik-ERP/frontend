// Constant
import { LIST_TABS_POINT_CONFIGURATION } from '../constants/point-configuration.constant';

// Type
import { IPointConfigurationProvided } from '../interfaces/point-configuration.interface';
// Service

export const usePointConfigurationService = (): IPointConfigurationProvided => {
  const pointConfiguration_activeTab = ref<string>('loyalty-point-benefit');

  watch(
    pointConfiguration_activeTab,
    async newTab => {
      switch (newTab.toUpperCase()) {
        case 'LOYALTY-POINT-BENEFIT': {
          // Handle logic for loyalty point benefit tab
          break;
        }
        case 'LOYALTY-POINT-SETTING': {
          // Handle logic for loyalty point setting tab
          break;
        }
      }
    },
    { immediate: true },
  );

  return {
    pointConfiguration_activeTab,
    pointConfiguration_listTabs: LIST_TABS_POINT_CONFIGURATION,
  };
};
