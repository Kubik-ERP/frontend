export interface ISettingRoundingServiceProvided {
  settingRounding_isEnabled: Ref<boolean>;
  settingRounding_roundingMode: Ref<string>;
  settingRounding_roundingAmount: Ref<number>;
  settingRounding_handleIncrement: () => void;
  settingRounding_handleDecrement: () => void;
}
