import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { View, Text, Button } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: false,
        shouldShowList: false
    })
})

export default function Notification() {
  const [selectedItems, setSelectedItems] = useState(1);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    const requestPermission = async () => {
      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        setPermissionGranted(finalStatus === "granted");
      } else {
        console.log("Must use physical device for Push Notifications");
      }
    };

    requestPermission();
  }, []);

  const addToCart = async () => {
    if (!permissionGranted) {
      console.log("Notification not granted");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Item added to cart",
        body: `${selectedItems} item(s) added to your cart.`,
        sound: "default",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 5, // fires after 5 seconds
      },
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Select items:</Text>
      <Picker
        selectedValue={selectedItems}
        onValueChange={(itemValue) => setSelectedItems(itemValue)}
        style={{ width: 200, height: 50 }}
      >
        <Picker.Item label="1 item" value={1} />
        <Picker.Item label="2 items" value={2} />
        <Picker.Item label="3 items" value={3} />
        <Picker.Item label="5 items" value={5} />
      </Picker>

      <Button title="Add to Cart" onPress={addToCart} />
    </View>
  );
}