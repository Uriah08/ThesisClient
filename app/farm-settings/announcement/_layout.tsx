import React from 'react'
import { Tabs, useLocalSearchParams } from 'expo-router'
import { Megaphone, Pen } from 'lucide-react-native'
import { Platform, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native'

const PRIMARY = '#155183'

const CustomTabBarButton = (props: any) => {
  const { children, onPress, ...rest } = props;

  if (Platform.OS === 'android') {
    return (
      <View style={{ flex: 1, borderRadius: 10 }}>
        <TouchableNativeFeedback
          onPress={onPress}
          background={TouchableNativeFeedback.Ripple('rgba(21, 81, 131, 0.15)', false)}
          useForeground
          {...rest}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {children}
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  );
}

const TrayLayout = () => {
  const { id } = useLocalSearchParams();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: '#c4c4c8',
        tabBarStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderTopWidth: 0.5,
          borderTopColor: '#f4f4f5',
          backgroundColor: '#ffffff',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          marginBottom: 35,
        },
        tabBarLabelStyle: {
          fontFamily: 'PoppinsRegular',
          fontSize: 10,
          marginTop: 2,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="[id]"
        options={{
          title: 'Announcements',
          headerShown: false,
          tabBarIcon: ({ color }) => <Megaphone color={color} size={20} />,
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
        initialParams={{ id }}
      />
      <Tabs.Screen
        name="edit"
        options={{
          title: 'Create',
          headerShown: false,
          tabBarIcon: ({ color }) => <Pen color={color} size={20} />,
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
        initialParams={{ id }}
      />
    </Tabs>
  )
}

export default TrayLayout