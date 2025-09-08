export interface ISettingRoundingServiceProvided {
  settingRounding_isEnabled: Ref<boolean>;
  settingRounding_roundingType: Ref<string>;
  settingRounding_roundingValue: Ref<number>;
  settingRounding_handleIncrement: () => void;
  settingRounding_handleDecrement: () => void;
}
