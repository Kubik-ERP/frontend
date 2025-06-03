import { DEFAULT_CURRENCY_OPTIONS } from '../constants/useText.constant';

/**
 * @description Handle Capitalize the first letter of each word in a string
 */
export const useCapitalize = (keywords: string): string => {
  const capitalized: Array<unknown> = [];

  keywords.split(' ').forEach((word: string) => {
    capitalized.push(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
  });

  return capitalized.join(' ');
};

/**
 * @description Handle format text to camel case
 */
export const useCamelCase = (keywords: string | undefined): string => {
  if (!keywords) return '';

  return keywords
    .replace(/\s(.)/g, $1 => {
      return $1.toUpperCase();
    })
    .replace(/\s/g, '')
    .replace(/^(.)/, $1 => {
      return $1.toLowerCase();
    });
};

/**
 * @description Handle Currency Format with vanilla javascript
 */
export const useCurrencyFormat = (data: number, options = DEFAULT_CURRENCY_OPTIONS): string => {
  return new Intl.NumberFormat('id-ID', options).format(data);
};

/**
 * @description Handle Parse String HTML to Text
 */
export const useParseStringHtmlToText = (keywords: string): string => {
  return new DOMParser().parseFromString(keywords, 'text/html').body.textContent ?? '';
};

/**
 * @description Handle Remove Special Character
 */
export const useRemoveSpecialCharacter = (keywords: string) => {
  return keywords.replace(/[^a-zA-Z0-9 ]/g, '');
};

/**
 * @description Handle Remove Space
 */
export const useRemoveSpace = (keywords: string) => {
  return keywords.replace(/\s/g, '');
};

/**
 * @description Handle format date
 * - yyyy: year (e.g. 2025)
 * - mm: month (01-12)
 * - dd: day (01-31)
 * - hh: hour (00-23)
 * - MM: minutes (00-59)
 * - ss: seconds (00-59)
 */
export const useFormatDate = (dateInput: string | number | Date, format: string = 'dd/mm/yyyy hh:MM'): string => {
  const date = new Date(dateInput);

  const map: Record<string, string | number> = {
    yyyy: date.getFullYear(),
    mm: String(date.getMonth() + 1).padStart(2, '0'),
    dd: String(date.getDate()).padStart(2, '0'),
    hh: String(date.getHours()).padStart(2, '0'),
    MM: String(date.getMinutes()).padStart(2, '0'),
    ss: String(date.getSeconds()).padStart(2, '0'),
  };

  return format.replace(/yyyy|mm|dd|hh|MM|ss/g, matched => map[matched].toString());
};
