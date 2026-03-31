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
    category: 'Account',
    question: 'How do I reset my password?',
    answers: [
      "Go to the login screen and tap 'Forgot Password'.",
      'Enter your registered email address.',
      'Follow the reset link sent to your email.',
    ],
    iconBg: '#E6F1FB', iconColor: '#185FA5', icon: CircleUserIcon,
  },
  {
    category: 'Profile',
    question: 'How can I update my profile information?',
    answers: [
      'Open the Profile section.',
      'Tap on Edit Profile.',
      'Update your details and save the changes.',
    ],
    iconBg: '#E1F5EE', iconColor: '#0F6E56', icon: UserIcon,
  },
  {
    category: 'Security',
    question: 'Is my personal data safe?',
    answers: [
      'Yes, we use industry-standard encryption.',
      'Your data is stored securely.',
      'Access is limited to authorized systems only.',
    ],
    iconBg: '#EEEDFE', iconColor: '#534AB7', icon: ShieldIcon,
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