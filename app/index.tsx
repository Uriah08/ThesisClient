import { View, Image, Text, Pressable, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import useAuthRedirect from '@/components/hooks/useAuthRedirect';
import { TestTubeDiagonal, BookMarked, Languages } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

const PRIMARY = '#155183';
const PRIMARY_LIGHT = '#e8f0f8';

export default function Index() {
  const { checking } = useAuthRedirect();
  const { t, i18n } = useTranslation();

  useEffect(() => {
      AsyncStorage.getItem('locale').then(saved => {
        if (saved) i18n.changeLanguage(saved)
      })
    }, [i18n])

  const toggleLanguage = () => {
    const next = i18n.language === 'en' ? 'fil' : 'en';
    i18n.changeLanguage(next);
    AsyncStorage.setItem('locale', next);
  };

  if (checking) return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size={30} color={PRIMARY} />
    </View>
  );

  return (
    <View className="flex-1 bg-white px-7 pt-[60px] pb-8 items-center">

      {/* Top-right buttons */}
      <View className="flex flex-row absolute top-14 right-6 gap-2">
        <Pressable
          onPress={() => router.push('/test')}
          className="p-2 rounded-xl"
          style={{ backgroundColor: PRIMARY_LIGHT }}
        >
          <TestTubeDiagonal size={16} color={PRIMARY} />
        </Pressable>
        <Pressable
          onPress={() => router.push('/help')}
          className="p-2 rounded-xl"
          style={{ backgroundColor: PRIMARY_LIGHT }}
        >
          <BookMarked size={16} color={PRIMARY} />
        </Pressable>

        {/* Language toggle */}
        <Pressable
          onPress={toggleLanguage}
          className="flex-row items-center gap-1.5 px-3 rounded-xl"
          style={{ backgroundColor: PRIMARY_LIGHT, paddingVertical: 6 }}
        >
          <Languages size={14} color={PRIMARY} />
          <Text style={{
            fontFamily: 'PoppinsSemiBold',
            fontSize: 11,
            color: PRIMARY,
            letterSpacing: 0.4,
          }}>
            {i18n.language === 'en' ? 'EN' : 'FIL'}
          </Text>
        </Pressable>
      </View>

      {/* Hero image with soft halo */}
      <View className="mt-10 items-center justify-center">
        <Image
          source={require('@/assets/images/hero-image.png')}
          style={{ width: 260, height: 260 }}
          resizeMode="contain"
        />
      </View>

      {/* Badge pill */}
      <View
        className="flex-row items-center px-4 py-1.5 rounded-full mt-5 gap-1.5"
        style={{ backgroundColor: PRIMARY_LIGHT }}
      >
        <View className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: PRIMARY }} />
        <Text
          className="text-[11px] tracking-wide"
          style={{ fontFamily: 'PoppinsSemiBold', color: PRIMARY }}
        >
          {t('landing_badge')}
        </Text>
      </View>

      {/* Title */}
      <Text
        className="text-[26px] text-[#111] mt-5 leading-[34px]"
        style={{ fontFamily: 'PoppinsRegular' }}
      >
        {t('landing_welcome')}
      </Text>
      <Text
        className="text-[32px] text-[#111] leading-[40px]"
        style={{ fontFamily: 'PoppinsSemiBold' }}
      >
        Fi<Text style={{ color: PRIMARY }}>Scan</Text>
      </Text>

      {/* Tagline */}
      <Text
        className="text-center text-[13px] text-[#888] mt-2.5 leading-[21px] px-2"
        style={{ fontFamily: 'PoppinsRegular' }}
      >
        {t('landing_tagline')}
      </Text>

      {/* Thin decorative divider */}
      <View
        className="w-10 h-0.5 rounded-full mt-6 opacity-35"
        style={{ backgroundColor: PRIMARY }}
      />

      {/* Buttons */}
      <View className="w-full mt-7 gap-3">
        <Pressable
          className="w-full py-[15px] rounded-2xl items-center bg-primary"
          style={({ pressed }) => ({
            opacity: pressed ? 0.88 : 1,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
            elevation: 5,
          })}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text
            className="text-white text-[15px] tracking-wide"
            style={{ fontFamily: 'PoppinsSemiBold' }}
          >
            {t('landing_login')}
          </Text>
        </Pressable>

        <Pressable
          className="w-full py-[14px] rounded-2xl items-center border border-[#e2e2e2]"
          style={({ pressed }) => ({
            backgroundColor: pressed ? PRIMARY_LIGHT : '#fff',
          })}
          onPress={() => router.push('/(auth)/register')}
        >
          <Text
            className="text-[#333] text-[15px] tracking-wide"
            style={{ fontFamily: 'PoppinsRegular' }}
          >
            {t('landing_register')}
          </Text>
        </Pressable>
      </View>

      {/* Footer */}
      <Text
        className="mt-10 text-[11px] text-[#bbb] tracking-widest"
        style={{ fontFamily: 'PoppinsRegular' }}
      >
        {t('landing_footer')}
      </Text>
    </View>
  );
}