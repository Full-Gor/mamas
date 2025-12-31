import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/i18n';
import { HomeScreen } from './src/screens/HomeScreen';
import { initNotifications, setBadgeCount } from './src/services/notifications';

export default function App() {
  useEffect(() => {
    // Initialize notifications and set badge count
    const init = async () => {
      await initNotifications();
      // Set initial badge count (example: 3 notifications)
      await setBadgeCount(3);
    };
    init();
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <HomeScreen />
    </I18nextProvider>
  );
}
