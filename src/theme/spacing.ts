const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

/** Bo góc dùng chung. */
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

/** Kích thước cố định: vùng bấm tối thiểu 44×44, icon, ô nhập... */
export const sizes = {
  touch: 44,
  input: 48,
  iconSm: 18,
  icon: 22,
  iconLg: 44,
  dayButton: 48,
  border: 1,
  accentBar: 4,
} as const;

export default spacing;
