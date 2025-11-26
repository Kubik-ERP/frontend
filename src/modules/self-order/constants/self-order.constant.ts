/**
 * @description Self Order View Constants
 */
export const SELF_ORDER_VIEW_GRID = 'grid' as const;
export const SELF_ORDER_VIEW_LIST = 'list' as const;

export type SelfOrderView = typeof SELF_ORDER_VIEW_GRID | typeof SELF_ORDER_VIEW_LIST;
