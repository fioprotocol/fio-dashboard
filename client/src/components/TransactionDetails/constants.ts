export const POSITIONS = {
  LEFT: 'left',
  RIGHT: 'right',
} as const;

export type PositionValue = typeof POSITIONS[keyof typeof POSITIONS];
