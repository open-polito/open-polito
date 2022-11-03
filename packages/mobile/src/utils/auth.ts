/**
 * @file utils for authentication
 */

/**
 * Login validation error types
 */
export enum LoginValidationResult {
  OK,
  NO_USER,
  NO_PASSWORD,
  INVALID_USERNAME,
}

/**
 * Validates login username and password input.
 * @param username
 * @param password
 * @returns validation result
 */
export const validateLoginInput = (
  username: string,
  password: string,
): LoginValidationResult => {
  if (username === '') {
    return LoginValidationResult.NO_USER;
  }
  if (password === '') {
    return LoginValidationResult.NO_PASSWORD;
  }

  const re1 = new RegExp('[sS]\\d+');
  const re2 = new RegExp('.+@studenti.polito.it');
  if (!re1.test(username) && !re2.test(username)) {
    return LoginValidationResult.INVALID_USERNAME;
  }

  return LoginValidationResult.OK;
};
