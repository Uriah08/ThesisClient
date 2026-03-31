import { Text, Animated, View } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import SplashScreen from '@/components/pages/SplashScreen';
import { useFonts } from 'expo-font';
import { useSelector, useDispatch } from 'react-redux';
import { setHasShownSplash } from '@/store';
import NetInfo from '@react-native-community/netinfo';
import Toast, { ToastConfig } from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckCircle, XCircle } from 'lucide-react-native';

const PRIMARY = '#155183';
const PRIMARY_LIGHT = '#E6F1FB';
const ERROR = '#dc2626';
const ERROR_LIGHT = '#fef2f2';

const toastConfig: ToastConfig = {
  success: ({ text1, text2 }) => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: '#ffffff',
      marginHorizontal: 16,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 14,
      borderWidth: 0.5,
      borderColor: '#f4f4f5',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 4,
    }}>
      {/* Icon badge */}
      <View style={{
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: PRIMARY_LIGHT,
        alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <CheckCircle size={18} color={PRIMARY} />
      </View>

      {/* Text */}
      <View style={{ flex: 1, gap: 1 }}>
        {text1 && (
          <Text style={{
            fontSize: 13,
            fontFamily: 'PoppinsSemiBold',
            color: '#18181b',
          }}>
            {text1}
          </Text>
        )}
        {text2 && (
          <Text style={{
            fontSize: 12,
            fontFamily: 'PoppinsRegular',
            color: '#a1a1aa',
          }}>
            {text2}
          </Text>
        )}
      </View>

      {/* Left accent bar */}
      <View style={{
        position: 'absolute',
        left: 0, top: 10, bottom: 10,
        width: 3,
        backgroundColor: PRIMARY,
        borderRadius: 99,
      }} />
    </View>
  ),

  error: ({ text1, text2 }) => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: '#ffffff',
      marginHorizontal: 16,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 14,
      borderWidth: 0.5,
      borderColor: '#f4f4f5',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 4,
    }}>
      {/* Icon badge */}
      <View style={{
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: ERROR_LIGHT,
        alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <XCircle size={18} color={ERROR} />
      </View>

      {/* Text */}
      <View style={{ flex: 1, gap: 1 }}>
        {text1 && (
          <Text style={{
            fontSize: 13,
            fontFamily: 'PoppinsSemiBold',
            color: '#18181b',
          }}>
            {text1}
          </Text>
        )}
        {text2 && (
          <Text style={{
            fontSize: 12,
            fontFamily: 'PoppinsRegular',
            color: '#a1a1aa',
          }}>
            {text2}
          </Text>
        )}
      </View>

      {/* Left accent bar */}
      <View style={{
        position: 'absolute',
        left: 0, top: 10, bottom: 10,
        width: 3,
        backgroundColor: ERROR,
        borderRadius: 99,
      }} />
    </View>
  ),
};

const Network = ({ children }: { children: React.ReactNode }) => {
  const [loaded] = useFonts({
    PoppinsBold: require('@/assets/fonts/Poppins-Bold.ttf'),
    PoppinsSemiBold: require('@/assets/fonts/Poppins-SemiBold.ttf'),
    PoppinsMedium: require('@/assets/fonts/Poppins-Medium.ttf'),
    PoppinsRegular: require('@/assets/fonts/Poppins-Regular.ttf'),
    PoppinsLight: require('@/assets/fonts/Poppins-Light.ttf'),
    PoppinsExtraLight: require('@/assets/fonts/Poppins-ExtraLight.ttf'),
    PoppinsThin: require('@/assets/fonts/Poppins-Thin.ttf'),
    PoppinsExtraBold: require('@/assets/fonts/Poppins-ExtraBold.ttf'),
  });

  const dispatch = useDispatch();
  const hasShownSplash = useSelector((state: any) => state.global.hasShownSplash);
  const [isLoading, setIsLoading] = useState(!hasShownSplash);
  const [isConnected, setIsConnected] = useState(true);
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = Boolean(state.isConnected) && state.isInternetReachable !== false;
      setIsConnected(connected);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loaded && !hasShownSplash) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        dispatch(setHasShownSplash(true));
      }, 1000);

      return () => clearTimeout(timer);
    } else if (hasShownSplash && loaded) {
      setIsLoading(false);
    }
  }, [loaded, hasShownSplash, dispatch]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isConnected ? -100 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isConnected, slideAnim]);

                                                          const printUser = async () => {
                                                            try {
                                                              const expoToken = await AsyncStorage.getItem('expoPushToken');
                                                              const storedUser = await AsyncStorage.getItem('user');
                                                              const token = await AsyncStorage.getItem('authToken')
                                                              if (storedUser !== null && token !== null) {
                                                                const parsedUser = JSON.parse(storedUser);
                                                                console.log('User:', parsedUser);
                                                                console.log('Token:', token);
                                                                console.log('Expo Push Token:', expoToken);
                                                                
                                                              } else {
                                                                console.log('No user found in AsyncStorage.');
                                                                console.log('Expo Push Token:', expoToken);
                                                              }
                                                            } catch (error) {
                                                              console.error('Error reading user from AsyncStorage:', error);
                                                            }
                                                          };

                                                          useEffect(() => {
                                                            printUser();
                                                          }, []);

  
  if (isLoading) {
    return <SplashScreen />;
  }
  
  return (
    <>
      {children}

      <Animated.View
        style={{
          transform: [{ translateY: slideAnim }],
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: '#dc2626',
          zIndex: 9999,
          height: 45,
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <Text
        className='text-white text-center absolute text-sm'
          style={{
            fontFamily: 'PoppinsRegular',
          }}
        >
          No Internet Connection
        </Text>
      </Animated.View>
      <Toast config={toastConfig}/>
    </>
  );
};

export default Network;