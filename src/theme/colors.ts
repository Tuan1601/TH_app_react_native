const colors = {
  primary: '#5146E5',
  primaryDark: '#382FA8',
  primaryLight: '#EFEDFF',
  accent: '#0E9F9A',
  accentLight: '#DDF7F3',
  success: '#16876B',
  successLight: '#DDF5EA',
  warning: '#B7791F',
  warningLight: '#FFF4D6',
  danger: '#C94D5B',
  dangerLight: '#FCE8E9',
  background: '#F6F7FC',
  surface: '#FFFFFF',
  surfaceMuted: '#F1F2F9',
  white: '#FFFFFF',
  text: '#20243A',
  textMuted: '#737B91',
  border: '#E6E8F0',
  offline: '#292B42',
  offlineText: '#FFFFFF',
  transparent: 'transparent',
} as const;

export type ColorName = keyof typeof colors;
export default colors;
