import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Set the app badge count (number on app icon)
 * This is what appears on the launcher/home screen
 */
export async function setBadgeCount(count: number): Promise<void> {
  try {
    await Notifications.setBadgeCountAsync(count);
  } catch (error) {
    console.log('Error setting badge count:', error);
  }
}

/**
 * Get the current badge count
 */
export async function getBadgeCount(): Promise<number> {
  try {
    return await Notifications.getBadgeCountAsync();
  } catch (error) {
    console.log('Error getting badge count:', error);
    return 0;
  }
}

/**
 * Clear the badge (set to 0)
 */
export async function clearBadge(): Promise<void> {
  await setBadgeCount(0);
}

/**
 * Request notification permissions
 */
export async function requestPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

/**
 * Schedule a local notification
 */
export async function scheduleNotification(
  title: string,
  body: string,
  trigger: Notifications.NotificationTriggerInput = null
): Promise<string> {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      badge: 1,
    },
    trigger,
  });
  return id;
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Initialize notifications (call on app start)
 */
export async function initNotifications(): Promise<void> {
  await requestPermissions();

  // Set up notification channels for Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#4ade80',
    });
  }
}
