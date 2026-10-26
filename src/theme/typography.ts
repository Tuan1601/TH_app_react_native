import type { TextStyle } from 'react-native';

const typography = {
  h1: { fontSize: 26, fontWeight: '800' },
  h2: { fontSize: 22, fontWeight: '800' },
  h3: { fontSize: 18, fontWeight: '700' },
  body: { fontSize: 15 },
  bodyBold: { fontSize: 15, fontWeight: '700' },
  caption: { fontSize: 13 },
  captionBold: { fontSize: 13, fontWeight: '700' },
  small: { fontSize: 11, fontWeight: '700' },
  stat: { fontSize: 24, fontWeight: '800' },
} satisfies Record<string, TextStyle>;

export default typography;
