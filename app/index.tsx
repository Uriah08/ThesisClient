import { View, Image, Text, Pressable, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import useAuthRedirect from '@/components/hooks/useAuthRedirect';
import { TestTubeDiagonal } from 'lucide-react-native';

const PRIMARY = '#155183';
const PRIMARY_LIGHT = '#e8f0f8';

export default function Index() {
  const { checking } = useAuthRedirect();

  if (checking) return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size={30} color={PRIMARY} />
    </View>
  );

  return (
    <View className="flex-1 bg-white px-7 pt-[60px] pb-8 items-center">

      {/* Test button */}
      <Pressable
        onPress={() => router.push('/test')}
        className="absolute top-14 right-6 p-2 rounded-xl"
        style={{ backgroundColor: PRIMARY_LIGHT }}
      >
        <TestTubeDiagonal size={16} color={PRIMARY} />
      </Pressable>

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
          AI-Powered Sun-Dried Fish Quality Check
        </Text>
      </View>

      {/* Title */}
      <Text
        className="text-[26px] text-[#111] mt-5 leading-[34px]"
        style={{ fontFamily: 'PoppinsRegular' }}
      >
        Welcome to
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
        Smart detection for sun-dried fish — know exactly when they&apos;re ready to harvest.
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
            Login
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
            Create an account
          </Text>
        </Pressable>
      </View>

      {/* Footer */}
      <Text
        className="mt-auto text-[11px] text-[#bbb] tracking-widest"
        style={{ fontFamily: 'PoppinsRegular' }}
      >
        Powered by AI · Built for fishers
      </Text>
    </View>
  );
}