const colors = {
  primary: '#4F46E5',
  primaryDark: '#3730A3',
  primaryLight: '#EEF2FF',
  accent: '#0891B2',
  accentLight: '#CFFAFE',
  success: '#059669',
  successLight: '#D1FAE5',
  warning: '#B45309',
  warningLight: '#FEF3C7',
  danger: '#DC2626',
  dangerLight: '#FEE2E2',
  background: '#F5F7FB',
  surface: '#FFFFFF',
  surfaceMuted: '#F1F5F9',
  white: '#FFFFFF',
  text: '#172033',
  textMuted: '#64748B',
  border: '#E2E8F0',
  offline: '#1F2937',
  offlineText: '#FFFFFF',
  transparent: 'transparent',
} as const;

export type ColorName = keyof typeof colors;
export default colors;
