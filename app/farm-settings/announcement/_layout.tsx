import React from 'react'
import { Tabs, useLocalSearchParams } from 'expo-router'
import { Megaphone, Pen } from 'lucide-react-native'
import { Platform, TouchableNativeFeedback, View } from 'react-native'

const CustomTabBarButton = (props: any) => {
  const { children, onPress, ...rest } = props;
  if (Platform.OS === 'android') {
    return (
      <View style={{ flex: 1, borderRadius: 10 }}>
        <TouchableNativeFeedback
          onPress={onPress}
          background={TouchableNativeFeedback.Ripple('rgba(21, 81, 131, 0.2)', false)}
          useForeground={true}
          {...rest}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {children}
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }
}

const TrayLayout = () => {
  const { id } = useLocalSearchParams();
  return (
    <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#155183',
            tabBarInactiveTintColor: '#999',
            tabBarStyle: {
              elevation: 0,
              shadowOpacity: 0,
              borderTopWidth: 0,
              backgroundColor: '#fff',
            },
            headerShadowVisible: false,
          }}
        >
            <Tabs.Screen
                name="[id]"
                options={{
                    title: 'Announcements',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Megaphone color={color} size={size} />,
                    tabBarButton: (props) => <CustomTabBarButton {...props} />,
                }}
                initialParams={{ id }}
            />
            <Tabs.Screen
                name="edit"
                options={{
                    title: 'Create',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Pen color={color} size={size} />,
                    tabBarButton: (props) => <CustomTabBarButton {...props} />,
                }}
                initialParams={{ id }}
            />
    </Tabs>
  )
}

export default TrayLayout