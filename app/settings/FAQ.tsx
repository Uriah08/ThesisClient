import {
  View, Text, ScrollView, Pressable,
  LayoutAnimation, Platform, UIManager, Animated,
} from 'react-native'
import React, { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, UserIcon, ShieldIcon, CircleUserIcon } from 'lucide-react-native'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true)
}

type FAQ = { category: string; question: string; answers: string[]; iconBg: string; iconColor: string; icon: any }

const faqs: FAQ[] = [
  {
    category: 'Technical & Scanning',
    question: 'What is the ideal lighting and distance for a scan?',
    answers: [
      'Use natural daylight or bright, even artificial lighting.',
      'Hold the camera 30–50 cm away from the drying rack.',
      'Avoid shadows or direct glare on the fish surface.',
    ],
    iconBg: '#E6F1FB', iconColor: '#185FA5', icon: CircleUserIcon,
  },
  {
    category: 'Technical & Scanning',
    question: 'Does the system work without an internet connection?',
    answers: [
      'An active internet connection is required to use the app.',
      'Scanning, species recognition, and data sync all rely on internet access.',
      'Please ensure you are connected before starting a session.',
    ],
    iconBg: '#E6F1FB', iconColor: '#185FA5', icon: CircleUserIcon,
  },
  {
    category: 'Quality & Monitoring',
    question: 'What parameters determine "Harvest Readiness"?',
    answers: [
      'Color, and texture are the primary indicators.',
      'The app cross-references these with species-specific drying standards.',
      'A readiness score is calculated after each scan.',
    ],
    iconBg: '#E1F5EE', iconColor: '#0F6E56', icon: UserIcon,
  },
  {
    category: 'Quality & Monitoring',
    question: 'Why did the quality assessment change between scans?',
    answers: [
      'Environmental changes like humidity can affect drying progress.',
      'Scan angle and lighting differences may influence results.',
      'Multiple scans over time provide a more accurate trend.',
    ],
    iconBg: '#E1F5EE', iconColor: '#0F6E56', icon: UserIcon,
  },
  {
    category: 'Quality & Monitoring',
    question: 'Which specific fish species are currently supported?',
    answers: [
      'The app currently supports one species: Sardinella fimbriata, locally known as Law-law or Tuyo.',
      'Support for additional species may be added in future updates.',
    ],
    iconBg: '#E1F5EE', iconColor: '#0F6E56', icon: UserIcon,
  },
  {
    category: 'Environmental Factors',
    question: 'Does the app account for nighttime or low-light conditions?',
    answers: [
      'Scanning is recommended during daylight hours for accuracy.'
    ],
    iconBg: '#FEF3E6', iconColor: '#B45309', icon: ShieldIcon,
  },
  {
    category: 'Data & History',
    question: 'How long is my harvest history stored in the app?',
    answers: [
      'Harvest records are stored indefinitely while your account is active.',
      'Local cache is retained on your device for offline access.',
      'Deleting the app will remove local data; cloud data remains intact.',
    ],
    iconBg: '#EEEDFE', iconColor: '#534AB7', icon: ShieldIcon,
  },
  {
    category: 'Account & Support',
    question: 'How do I reset my password?',
    answers: [
      "Go to the settings screen and tap 'Change Password'."
    ],
    iconBg: '#E6F1FB', iconColor: '#185FA5', icon: CircleUserIcon,
  },
  {
    category: 'Account & Support',
    question: 'Is there a community forum for local fish processors?',
    answers: [
      'There\'s no dedicated forum within the app yet.',
    ],
    iconBg: '#E6F1FB', iconColor: '#185FA5', icon: CircleUserIcon,
  },
]

// eslint-disable-next-line @typescript-eslint/no-redeclare
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const rotations = useRef(faqs.map(() => new Animated.Value(0))).current

  const handleRemoveUser = async () => {
    try {
      await AsyncStorage.removeItem('user')
      router.push('/login')
    } catch (error) {
      console.log(error)
    }
  }

  const toggle = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    const isOpening = openIndex !== index

    Animated.timing(rotations[index], {
      toValue: isOpening ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start()

    if (openIndex !== null && openIndex !== index) {
      Animated.timing(rotations[openIndex], {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }

    setOpenIndex(isOpening ? index : null)
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>

      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 12,
        paddingTop: 56, paddingHorizontal: 24, paddingBottom: 8,
      }}>
        <Pressable
          onPress={() => router.push('/settings')}
          style={{
            width: 36, height: 36, borderRadius: 18,
            backgroundColor: '#f4f4f5',
            alignItems: 'center', justifyContent: 'center',
          }}>
          <ChevronLeft size={18} color="#18181b" />
        </Pressable>
        <Text onPress={handleRemoveUser} style={{ fontSize: 17, fontFamily: 'PoppinsSemiBold', color: '#18181b' }}>FAQ</Text>
      </View>

      {/* Title — easter egg on "questions." tap */}
      {/* <View style={{ paddingHorizontal: 24, paddingBottom: 16 }}>
        <Text style={{ fontSize: 22, fontFamily: 'PoppinsSemiBold', color: '#18181b' }}>
          Frequently asked{' '}
          <Text
            style={{ color: '#155183' }}
            onPress={handleRemoveUser}>
            questions.
          </Text>
        </Text>
      </View> */}

      <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 60, gap: 10 }}>

        {faqs.map((faq, index) => {
          const rotate = rotations[index].interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '90deg'],
          })
          const isOpen = openIndex === index

          return (
            <View key={index} style={{
              borderRadius: 14, borderWidth: 0.5,
              borderColor: isOpen ? '#e4e4e7' : '#f4f4f5',
              overflow: 'hidden', backgroundColor: '#fafafa',
            }}>
              <Pressable
                onPress={() => toggle(index)}
                android_ripple={{ color: '#e4e4e7', borderless: false }}
                style={{
                  flexDirection: 'row', alignItems: 'center',
                  justifyContent: 'space-between', padding: 16, gap: 12,
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                  <View style={{
                    width: 30, height: 30, borderRadius: 8,
                    backgroundColor: faq.iconBg,
                    alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <faq.icon size={13} color={faq.iconColor} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#a1a1aa', marginBottom: 2 }}>
                      {faq.category}
                    </Text>
                    <Text style={{ fontSize: 13, fontFamily: 'PoppinsMedium', color: '#18181b' }}>
                      {faq.question}
                    </Text>
                  </View>
                </View>
                <Animated.View style={{ transform: [{ rotate }] }}>
                  <ChevronRight size={14} color="#d4d4d8" />
                </Animated.View>
              </Pressable>

              {isOpen && (
                <View style={{
                  paddingHorizontal: 16, paddingBottom: 16,
                  borderTopWidth: 0.5, borderTopColor: '#f4f4f5',
                  gap: 8, paddingTop: 12,
                }}>
                  {faq.answers.map((answer, i) => (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                      <View style={{
                        width: 18, height: 18, borderRadius: 9,
                        backgroundColor: faq.iconBg,
                        alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, marginTop: 1,
                      }}>
                        <Text style={{ fontSize: 10, fontFamily: 'PoppinsMedium', color: faq.iconColor }}>
                          {i + 1}
                        </Text>
                      </View>
                      <Text style={{
                        fontSize: 12, fontFamily: 'PoppinsRegular',
                        color: '#52525b', lineHeight: 20, flex: 1,
                      }}>
                        {answer}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )
        })}

      </ScrollView>
    </View>
  )
}

export default FAQ