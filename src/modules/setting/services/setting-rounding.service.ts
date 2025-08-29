import { ISettingRoundingServiceProvided } from '../interfaces/setting-rounding.interface';

export const useRoundingService = (): ISettingRoundingServiceProvided => {
  const settingRounding_isEnabled = ref(false);

  const settingRounding_roundingMode = ref('up');
  const settingRounding_roundingAmount = ref(100);

  const settingRounding_handleIncrement = () => {
    settingRounding_roundingAmount.value = settingRounding_roundingAmount.value * 10;
  };

  const settingRounding_handleDecrement = () => {
    if (settingRounding_roundingAmount.value > 10) {
      settingRounding_roundingAmount.value = settingRounding_roundingAmount.value / 10;
    }
  };

  return {
    settingRounding_isEnabled,
    settingRounding_roundingMode,
    settingRounding_roundingAmount,
    settingRounding_handleIncrement,
    settingRounding_handleDecrement,
  };
};
