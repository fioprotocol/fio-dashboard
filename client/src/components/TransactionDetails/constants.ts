export const VALUE_POSITIONS = {
  LEFT: 'left',
  RIGHT: 'right',
} as const;

export type ValuePosition = typeof VALUE_POSITIONS[keyof typeof VALUE_POSITIONS];
