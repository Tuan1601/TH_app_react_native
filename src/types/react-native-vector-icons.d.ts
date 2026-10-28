declare module 'react-native-vector-icons/MaterialCommunityIcons' {
  import type {ComponentType} from 'react';

  type MaterialCommunityIconProps = {
    name: string;
    size?: number;
    color?: string;
  };

  const MaterialCommunityIcons: ComponentType<MaterialCommunityIconProps>;
  export default MaterialCommunityIcons;
}
