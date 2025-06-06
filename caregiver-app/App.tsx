import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from './store';
import { theme } from './theme';
import { useAuth } from './hooks/useAuth';
import { useTranslation } from 'react-i18next';

// Navigation
import AuthStack from './navigation/AuthStack';
import MainDrawer from './navigation/MainDrawer';

export default function App() {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StoreProvider>
          <NavigationContainer>
            {isAuthenticated ? (
              <MainDrawer />
            ) : (
              <AuthStack />
            )}
          </NavigationContainer>
        </StoreProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
