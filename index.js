import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { registerRootComponent } from 'expo';
import * as SplashScreen from 'expo-splash-screen';
import analytics from '@react-native-firebase/analytics';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from 'styled-components/native';

import App from './App';
import store from './store';
import theme from './theme';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Error Boundary to catch crashes
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('App crashed:', error, info);
    // You could log this to a service like Sentry
  }

  render() {
    if (this.state.hasError) {
      return <Text>Something went wrong. Please restart the app.</Text>;
    }
    return this.props.children;
  }
}

// Root component with all providers
const Root = () => {
  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Simulate loading assets, fonts, etc.
        await analytics().logAppOpen();
      } catch (e) {
        console.warn('Startup error:', e);
      } finally {
        await SplashScreen.hideAsync();
      }
    };
    prepareApp();
  }, []);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <NavigationContainer>
            <App />
          </NavigationContainer>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
};

registerRootComponent(Root);
