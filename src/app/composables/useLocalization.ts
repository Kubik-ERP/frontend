import { useI18n } from 'vue-i18n';

export function useLocalization(key: string) {
  const { t } = useI18n();

  return t(key);
}
