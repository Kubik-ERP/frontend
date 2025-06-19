export const useParamsSerializer = (params: Record<string, unknown> = {}) => {
  return new URLSearchParams(
    Object.entries(params).flatMap(([key, value]) => {
      if (value === null || value === undefined) {
        return [];
      }

      if (Array.isArray(value)) {
        return value.filter(v => v !== null && v !== undefined).map(v => [key, v]);
      }

      return [[key, value]];
    }),
  ).toString();
};
