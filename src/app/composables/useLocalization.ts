import { useI18n } from 'vue-i18n';

/**
 * Custom localization composable that provides translation functionality
 *
 * Usage:
 * ```typescript
 * // Direct usage (auto-imported):
 * useLocalization('some.key')
 *
 * // In template:
 * {{ useLocalization('some.key') }}
 * ```
 */
export function useLocalization(key: string) {
  const { t } = useI18n();

  return t(key);
}
