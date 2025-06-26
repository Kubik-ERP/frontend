import { createI18n, I18n } from 'vue-i18n';

// Define the type for the messages object
interface Messages {
  [key: string]: Record<string, string>;
}

const autoLoadLocalization = async (): Promise<I18n> => {
  const modules = import.meta.glob('/**/*.locale.*.json', { eager: false });
  const messages: Messages = {};

  for (const path in modules) {
    // Extract locale from filename, e.g., 'authentication.locale.en.json' -> 'en'
    const matched = path.match(/\.locale\.([a-z\d]+)\.json$/i);
    if (matched && matched[1]) {
      const locale = matched[1];

      // Load the module
      const module = await modules[path]();
      const moduleMessages = module as { default: Record<string, string> };

      if (messages[locale]) {
        messages[locale] = { ...messages[locale], ...moduleMessages.default };
      } else {
        messages[locale] = moduleMessages.default;
      }
    }
  }

  const i18n = createI18n({
    locale: localStorage.getItem('lang') ?? 'en',
    fallbackLocale: 'en',
    messages,
    legacy: false,
  });

  return i18n;
};

export default autoLoadLocalization;
