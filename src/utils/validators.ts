export const isValidEmail = (value: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export const isNotEmpty = (value: string | null | undefined): boolean => {
  return typeof value === "string" && value.trim().length > 0;
};
