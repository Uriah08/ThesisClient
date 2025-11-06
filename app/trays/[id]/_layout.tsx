import React from 'react'
import { Tabs, useLocalSearchParams, usePathname } from 'expo-router'
import { Aperture, GitCommitVertical, SettingsIcon } from 'lucide-react-native'
import { Platform, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { setScanTabPressed } from '@/store'

const CameraTabBarButton = ({ children, onPress }: any) => {
  const pathname = usePathname()
  const dispatch = useDispatch();

  const handlePress = () => {
    if (pathname === '/scan') {
      dispatch(setScanTabPressed(true));
    }
    onPress?.();
  };
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        top: -10,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: '#155183',
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 5,
        }}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
};

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
                name="progress"
                options={{
                    title: 'Status',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <GitCommitVertical color={color} size={size} />,
                    tabBarButton: (props) => <CustomTabBarButton {...props} />,
                }}
                initialParams={{ id }}
            />
            <Tabs.Screen
                name="scan"
                options={{
                    title: 'Scan',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Aperture color={'#ffffff'} size={28} />,
                    tabBarButton: (props) => <CameraTabBarButton {...props} />,
                    tabBarLabel: () => null
                }}
                initialParams={{ id }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <SettingsIcon color={color} size={size} />,
                    tabBarButton: (props) => <CustomTabBarButton {...props} />,
                }}
                initialParams={{ id }}
            />
    </Tabs>
  )
}

export default TrayLayout