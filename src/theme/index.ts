export const colors = {
  primary: '#1D4ED8',
  primaryDark: '#173FAF',
  secondary: '#3B82F6',
  tertiary: '#10B981',
  neutral: '#0F172A',
  background: '#F5F6FF',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF1FF',
  text: '#172554',
  textSecondary: '#64748B',
  border: '#DCE3F2',
  danger: '#DC2626',
  dangerSoft: '#FEF2F2',
  success: '#059669',
  successSoft: '#ECFDF5',
  warning: '#D97706',
  white: '#FFFFFF',
  disabled: '#CBD5E1',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  pill: 999,
} as const;

export const typography = {
  caption: 12,
  small: 13,
  body: 14,
  subtitle: 16,
  heading: 21,
  display: 27,
} as const;

export const shadows = {
  card: {
    elevation: 2,
    shadowColor: '#1E3A8A',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.07,
    shadowRadius: 9,
  },
} as const;
