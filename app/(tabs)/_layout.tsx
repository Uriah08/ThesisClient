import { Tabs, usePathname } from 'expo-router';
import React from 'react';
import {
  HomeIcon,
  FishSymbolIcon,
  BellIcon,
  SettingsIcon,
  Aperture,
} from 'lucide-react-native';
import {
  Platform,
  View,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import useAuthRedirect from '@/components/hooks/useAuthRedirect';
import { useDispatch } from 'react-redux';
import { setScanTabPressed } from '@/store';
import { useGetNotificationsQuery } from '@/store/notificationApi';

const PRIMARY = '#155183'

// ── Camera FAB button ─────────────────────────────────────────────────────────
const CameraTabBarButton = ({ children, onPress }: any) => {
  const pathname = usePathname()
  const dispatch = useDispatch()

  const handlePress = () => {
    if (pathname === '/scan') dispatch(setScanTabPressed(true))
    onPress?.()
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{ top: -16, justifyContent: 'center', alignItems: 'center' }}
    >
      <View style={{
        width: 56, height: 56, borderRadius: 28,
        backgroundColor: PRIMARY,
        justifyContent: 'center', alignItems: 'center',
        elevation: 5,
        borderWidth: 3, borderColor: '#ffffff',
      }}>
        {children}
      </View>
    </TouchableOpacity>
  )
}

// ── Standard tab button with ripple on Android ────────────────────────────────
const CustomTabBarButton = ({ children, onPress, ...rest }: any) => {
  const { checking } = useAuthRedirect()

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
    )
  }

  if (checking) return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size={30} color={PRIMARY} />
    </View>
  )

  return (
    <TouchableOpacity onPress={onPress} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} {...rest}>
      {children}
    </TouchableOpacity>
  )
}

// ── Layout ────────────────────────────────────────────────────────────────────
const AppLayout = () => {
  const { data, isLoading } = useGetNotificationsQuery()
  const notifications = data?.filter((n) => !n.read) || []

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
          marginBottom: 40,
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
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <HomeIcon color={color} size={20} />,
          tabBarButton: props => <CustomTabBarButton {...props} />,
        }}
      />

      <Tabs.Screen
        name="farm"
        options={{
          title: 'Drying',
          headerShown: false,
          tabBarIcon: ({ color }) => <FishSymbolIcon color={color} size={20} />,
          tabBarButton: props => <CustomTabBarButton {...props} />,
        }}
      />

      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          headerShown: false,
          tabBarIcon: () => <Aperture color="#ffffff" size={24} />,
          tabBarButton: props => <CameraTabBarButton {...props} />,
          tabBarLabel: () => null,
        }}
      />

      <Tabs.Screen
        name="notification"
        options={{
          title: 'Notifications',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <View style={{ position: 'relative' }}>
              <BellIcon color={color} size={20} />
              {!isLoading && notifications.length > 0 && (
                <View style={{
                  position: 'absolute',
                  top: -4, right: -4,
                  backgroundColor: 'red',
                  borderRadius: 8,
                  minWidth: 16, height: 16,
                  justifyContent: 'center', alignItems: 'center',
                  paddingHorizontal: 2,
                }}>
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>
                    {notifications.length > 9 ? '9+' : notifications.length}
                  </Text>
                </View>
              )}
            </View>
          ),
          tabBarButton: props => <CustomTabBarButton {...props} />,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color }) => <SettingsIcon color={color} size={20} />,
          tabBarButton: props => <CustomTabBarButton {...props} />,
        }}
      />
    </Tabs>
  )
}

export default AppLayout