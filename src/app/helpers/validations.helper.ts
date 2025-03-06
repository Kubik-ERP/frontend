/**
 * @description Handle business logic for checking if password is valid by using regex.
 */
export const isPasswordValid = (password: string): boolean => REGEX_PASSWORD.test(password);

/**
 * @description Handle business logic for checking if phone code is valid by using regex.
 */
export const isPhoneCodeValid = (phoneCode: string): boolean => REGEX_PHONE_CODE.test(phoneCode);

/**
 * @description Handle business logic for checking if phone number is valid by using regex.
 */
export const isPhoneNumberValid = (phoneNumber: string): boolean => REGEX_PHONE_NUMBER.test(phoneNumber);
