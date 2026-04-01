import React from 'react'
import { Tabs, useLocalSearchParams, usePathname } from 'expo-router'
import { Aperture, ClockPlus, History, PanelsLeftRightIcon, SettingsIcon } from 'lucide-react-native'
import { Platform, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { setScanTabPressed } from '@/store'
import { useGetTrayByIdQuery } from '@/store/trayApi'

const PRIMARY = '#155183'

// ── Camera FAB button ─────────────────────────────────────────────────────────
const CameraTabBarButton = ({ children, onPress, id }: any) => {
  const pathname = usePathname()
  const dispatch = useDispatch()
  const { data: sessionTray, isLoading: sessionTrayLoading } = useGetTrayByIdQuery(id)
  const active = sessionTray?.active_session_tray

  const handlePress = () => {
    if (pathname === `/tray/${id}/scan`) dispatch(setScanTabPressed(true))
    onPress?.()
  }

  const enabled = !!active && !sessionTrayLoading

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={!enabled}
      style={{ top: -16, justifyContent: 'center', alignItems: 'center' }}
    >
      <View style={{
        width: 56, height: 56, borderRadius: 28,
        backgroundColor: PRIMARY,
        justifyContent: 'center', alignItems: 'center',
        elevation: 5,
        // subtle ring to lift it off the tab bar
        borderWidth: 3, borderColor: '#ffffff',
        opacity: enabled ? 1 : 0.4,
      }}>
        {children}
      </View>
    </TouchableOpacity>
  )
}

// ── Standard tab button with ripple on Android ────────────────────────────────
const CustomTabBarButton = ({ children, onPress, ...rest }: any) => {
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
  return (
    <TouchableOpacity onPress={onPress} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {children}
    </TouchableOpacity>
  )
}

// ── Layout ────────────────────────────────────────────────────────────────────
const TrayLayout = () => {
  const { id } = useLocalSearchParams()

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
        name="dashboard"
        options={{
          title: 'Tray',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <PanelsLeftRightIcon color={color} size={20} />,
          tabBarButton: props => <CustomTabBarButton {...props} />,
        }}
        initialParams={{ id }}
      />

      <Tabs.Screen
        name="timeline"
        options={{
          title: 'Timeline',
          headerShown: false,
          tabBarIcon: ({ color }) => <ClockPlus color={color} size={20} />,
          tabBarButton: props => <CustomTabBarButton {...props} />,
        }}
        initialParams={{ id }}
      />

      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          headerShown: false,
          tabBarIcon: () => <Aperture color="#ffffff" size={24} />,
          tabBarButton: props => <CameraTabBarButton {...props} id={id} />,
          tabBarLabel: () => null,
        }}
        initialParams={{ id }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          headerShown: false,
          tabBarIcon: ({ color }) => <History color={color} size={20} />,
          tabBarButton: props => <CustomTabBarButton {...props} />,
        }}
        initialParams={{ id }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color }) => <SettingsIcon color={color} size={20} />,
          tabBarButton: props => <CustomTabBarButton {...props} />,
        }}
        initialParams={{ id }}
      />
    </Tabs>
  )
}

export default TrayLayout