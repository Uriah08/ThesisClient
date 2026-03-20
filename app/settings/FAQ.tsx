import {
  View,
  Text,
  ScrollView,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
} from 'react-native'
import React, { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react-native'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true)
}

const faqs: { category: string; question: string; answers: string[] }[] = [
  {
    category: 'Account',
    question: 'How do I reset my password?',
    answers: [
      "Go to the login screen and tap 'Forgot Password'.",
      'Enter your registered email address.',
      'Follow the reset link sent to your email.',
    ],
  },
  {
    category: 'Profile',
    question: 'How can I update my profile information?',
    answers: [
      'Open the Profile section.',
      'Tap on Edit Profile.',
      'Update your details and save the changes.',
    ],
  },
  {
    category: 'Security',
    question: 'Is my personal data safe?',
    answers: [
      'Yes, we use industry-standard encryption.',
      'Your data is stored securely.',
      'Access is limited to authorized systems only.',
    ],
  },
]

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const handleRemoveUser = async () => {
    try {
      await AsyncStorage.removeItem('user')
      router.push('/login')
    } catch (error) {
      console.log(error);
    }
  }

  // one Animated.Value per item
  const rotations = useRef(faqs.map(() => new Animated.Value(0))).current

  const toggle = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

    const isOpening = openIndex !== index

    Animated.timing(rotations[index], {
      toValue: isOpening ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start()

    // close previous
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
    <View className="flex-1 bg-white">
      <ChevronLeft
        onPress={() => router.push('/settings')}
        style={{ marginTop: 50, marginLeft: 30 }}
        color="black"
        size={32}
      />
      {/* <ChevronLeft
        onPress={() => handleRemoveUser()}
        style={{ marginTop: 50, marginLeft: 60 }}
        color="black"
        size={32}
      /> */}

      <Text
        className="mt-10 mx-7 text-2xl"
        style={{ fontFamily: 'PoppinsSemiBold' }}
      >
        Frequenlty asked
        <Text className="text-primary" onPress={handleRemoveUser}> questions.</Text>
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mt-5" style={{ marginHorizontal: 20 }}>
          {faqs.map((faq, index) => {
            const rotate = rotations[index].interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '90deg'],
            })

            return (
              <React.Fragment key={index}>
                <Pressable
                  onPress={() => toggle(index)}
                  className="flex flex-row items-center"
                  android_ripple={{ color: '#d3d3d3', borderless: false }}
                  style={{
                    justifyContent: 'space-between',
                    borderTopWidth: 1,
                    borderBottomWidth: openIndex === index ? 0 : 1,
                    borderColor: '#e8e8e8',
                    paddingVertical: 20,
                    paddingLeft: 10,
                  }}
                >
                  <Text
                    className="text-lg"
                    style={{
                      fontFamily: 'PoppinsMedium',
                      width: 300,
                    }}
                  >
                    {faq.question}
                  </Text>

                  <Animated.View style={{ transform: [{ rotate }] }}>
                    <ChevronRight size={18} />
                  </Animated.View>
                </Pressable>

                {openIndex === index && (
                  <View
                    style={{
                      paddingLeft: 20,
                      paddingBottom: 15,
                      borderBottomWidth: 1,
                      borderColor: '#e8e8e8',
                    }}
                  >
                    {faq.answers.map((answer, i) => (
                      <Text
                        key={i}
                        className="text-sm text-zinc-600 mt-2"
                        style={{ fontFamily: 'PoppinsRegular' }}
                      >
                        • {answer}
                      </Text>
                    ))}
                  </View>
                )}
              </React.Fragment>
            )
          })}
        </View>
      </ScrollView>
    </View>
  )
}

export default FAQ
