/**
 * Limites alinhados ao RFC 5321:
 * - local part (antes do @): máx 64 chars
 * - domain part (depois do @): máx 255 chars
 *
 * O upper bound impede o backtracking super-linear que regex sem limite causa.
 */
const EMAIL_LOCAL_MAX = 64;
const EMAIL_DOMAIN_MAX = 255;

const EMAIL_REGEX = new RegExp(
  `^[^\\s@]{1,${EMAIL_LOCAL_MAX}}@[^\\s@]{1,${EMAIL_DOMAIN_MAX}}\\.[^\\s@]{1,${EMAIL_DOMAIN_MAX}}$`,
);

export const isValidEmail = (value: string): boolean => EMAIL_REGEX.test(value);

export const isNotEmpty = (value: string | null | undefined): boolean =>
  typeof value === "string" && value.trim().length > 0;
