import { ISettingRoundingServiceProvided } from '../interfaces/setting-rounding.interface';
import { onMounted, ref, watch } from 'vue';
import { debounce } from '@/app/helpers/debounce.helper';
import { useSettingStore } from '../store';
import { SETTING_ROUNDING_BASE_ENDPOINT } from '../constants/setting-api.constant';

export const useRoundingService = (): ISettingRoundingServiceProvided => {
  const { httpAbort_registerAbort } = useHttpAbort();

  const store = useSettingStore();

  const settingRounding_isEnabled = ref(false);
  const settingRounding_roundingMode = ref('up');
  const settingRounding_roundingAmount = ref(100);

  const fetchRoundingSettings = async () => {
    const response = await store.fetchSetting_getRoundingSetting({
      ...httpAbort_registerAbort(SETTING_ROUNDING_BASE_ENDPOINT),
    });
    const data = response as { isEnabled: boolean; roundingMode: string; roundingAmount: number };

    settingRounding_isEnabled.value = data.isEnabled;
    settingRounding_roundingMode.value = data.roundingMode;
    settingRounding_roundingAmount.value = data.roundingAmount;
  };

  const updateRoundingSettings = debounce(async () => {
    await store.fetchSetting_updateRoundingSetting(
      {
        isEnabled: settingRounding_isEnabled.value,
        roundingMode: settingRounding_roundingMode.value,
        roundingAmount: settingRounding_roundingAmount.value,
      },
      {
        ...httpAbort_registerAbort(SETTING_ROUNDING_BASE_ENDPOINT),
      },
    );
  }, 500);

  const settingRounding_handleIncrement = () => {
    settingRounding_roundingAmount.value = settingRounding_roundingAmount.value * 10;
  };

  const settingRounding_handleDecrement = () => {
    if (settingRounding_roundingAmount.value > 10) {
      settingRounding_roundingAmount.value = settingRounding_roundingAmount.value / 10;
    }
  };

  onMounted(() => {
    fetchRoundingSettings();
  });

  watch([settingRounding_isEnabled, settingRounding_roundingMode, settingRounding_roundingAmount], () => {
    updateRoundingSettings();
  });

  return {
    settingRounding_isEnabled,
    settingRounding_roundingMode,
    settingRounding_roundingAmount,
    settingRounding_handleIncrement,
    settingRounding_handleDecrement,
  };
};
