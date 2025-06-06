import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2196F3',
    secondary: '#03A9F4',
    accent: '#FFC107',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    error: '#F44336',
    text: '#333333',
    disabled: '#9E9E9E',
  },
  roundness: 8,
  animation: {
    scale: 1,
  },
};
