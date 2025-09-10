import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import * as Notifications from "expo-notifications";
import { registerPushNotifications } from "@/utils/lib/registerPushNotification";
import { useRegisterDeviceTokenMutation } from "@/store/api";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  error: string | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [registerDeviceToken] = useRegisterDeviceTokenMutation();

  useEffect(() => {
    // Register for push notifications
    registerPushNotifications()
      .then(async (token) => {
        if (token) {
          
          setExpoPushToken(token);
          setError(null);

          try {
            await registerDeviceToken({ token }).unwrap();
          } catch (err) {
            console.error("Error Passing token to backend:", err);
          }
        }
      })
      .catch((error: any) => {
        const errorMessage = error instanceof Error ? error.message : String(error);
        setError(errorMessage);
        console.error('Failed to register for push notifications:', errorMessage);
      });

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('🔔 Notification Received:', notification);
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('🔔 Notification Response:', response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [registerDeviceToken]);

  return (
    <NotificationContext.Provider
      value={{ expoPushToken, notification, error }}
    >
      {children}
    </NotificationContext.Provider>
  );
};