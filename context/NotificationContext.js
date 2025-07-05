import React, { createContext, useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import registerForPushNotificationsAsync from '../utils/registerForPushNotificationsAsync';

export const NotificationContext = createContext({
  expoPushToken: null,
  notification: null,
  registerForPushNotifications: async () => {},
});

export const NotificationProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  const registerForPushNotifications = async () => {
    try {
      const token = await registerForPushNotificationsAsync();
      setExpoPushToken(token);
    } catch (e) {
      console.warn('Error registering for push notifications', e);
    }
  };

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(n => {
      setNotification(n);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(r => {
      console.log('User tapped notification:', r);
    });

    return () => {
      if (notificationListener.current) Notifications.removeNotificationSubscription(notificationListener.current);
      if (responseListener.current) Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ expoPushToken, notification, registerForPushNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
