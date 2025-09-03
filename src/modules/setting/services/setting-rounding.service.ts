import { ISettingRoundingServiceProvided } from '../interfaces/setting-rounding.interface';
import { onMounted, ref, watch } from 'vue';
import { debounce } from '@/app/helpers/debounce.helper';
import { useSettingStore } from '../store';
import { SETTING_ROUNDING_BASE_ENDPOINT } from '../constants/setting-api.constant';

export const useRoundingService = (): ISettingRoundingServiceProvided => {
  const { httpAbort_registerAbort } = useHttpAbort();

  const store = useSettingStore();

  const settingRounding_isEnabled = ref(false);
  const settingRounding_roundingType = ref('up');
  const settingRounding_roundingValue = ref(100);

  const fetchRoundingSettings = async () => {
    const response = await store.fetchSetting_getRoundingSetting({
      ...httpAbort_registerAbort(SETTING_ROUNDING_BASE_ENDPOINT),
    });
    const data = response as { isEnabled: boolean; roundingMode: string; roundingAmount: number };

    settingRounding_isEnabled.value = data.isEnabled || false;
    settingRounding_roundingType.value = data.roundingMode || 'up';
    settingRounding_roundingValue.value = data.roundingAmount || 100;
  };

  const updateRoundingSettings = debounce(async () => {
    await store.fetchSetting_updateRoundingSetting(
      {
        isEnabled: settingRounding_isEnabled.value,
        roundingType: settingRounding_roundingType.value,
        roundingValue: settingRounding_roundingValue.value,
      },
      {
        ...httpAbort_registerAbort(SETTING_ROUNDING_BASE_ENDPOINT),
      },
    );
  }, 500);

  const settingRounding_handleIncrement = () => {
    settingRounding_roundingValue.value = settingRounding_roundingValue.value * 10;
  };

  const settingRounding_handleDecrement = () => {
    if (settingRounding_roundingValue.value > 10) {
      settingRounding_roundingValue.value = settingRounding_roundingValue.value / 10;
    }
  };

  onMounted(() => {
    fetchRoundingSettings();
  });

  watch([settingRounding_isEnabled, settingRounding_roundingType, settingRounding_roundingValue], () => {
    updateRoundingSettings();
  });

  return {
    settingRounding_isEnabled,
    settingRounding_roundingType,
    settingRounding_roundingValue,
    settingRounding_handleIncrement,
    settingRounding_handleDecrement,
  };
};
