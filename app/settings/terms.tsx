import { View, Text, ScrollView, Pressable } from 'react-native'
import React from 'react'
import { ChevronLeft, FileTextIcon } from 'lucide-react-native'
import { router } from 'expo-router'

type Section = { title: string; body: string }

const sections: Section[] = [
  {
    title: '1. Acceptance of Terms',
    body: 'By creating an account, you agree to comply with these Terms. If you do not agree, please do not use the application.',
  },
  {
    title: '2. User Registration',
    body: 'You must register with accurate personal information. You must be a tuyo farmer from Naic, Cavite.',
  },
  {
    title: '3. Data Collection',
    body: 'We collect basic account information used solely to provide our services. Your data will not be shared with third parties without consent, except as required by law.',
  },
  {
    title: '4. Image Processing',
    body: 'Results from image analysis are guides only. We do not guarantee 100% accuracy and recommend using results alongside traditional assessment methods.',
  },
  {
    title: '5. User Responsibilities',
    body: 'Use this app only for lawful purposes. Provide clear, accurate images. Misuse may result in account suspension.',
  },
  {
    title: '6. Research & Academic Use',
    body: 'This app is part of a thesis project. Anonymized data may be used for academic research. Personal information will remain confidential.',
  },
  {
    title: '7. Limitation of Liability',
    body: 'This app is provided "as is" for educational purposes. We are not liable for losses arising from use or reliance on its results.',
  },
  {
    title: '8. Modifications',
    body: 'We may modify or discontinue the service at any time. Continued use after changes constitutes acceptance of new terms.',
  },
  {
    title: '9. Account Termination',
    body: 'You may terminate your account anytime. We may suspend accounts that violate these terms. Some data may be retained for record-keeping.',
  },
  {
    title: '10. Contact',
    body: 'For questions or support, contact us through the Help Center within the application.',
  },
  {
    title: '11. Governing Law',
    body: 'These terms are governed by the laws of the Republic of the Philippines.',
  },
]

const Terms = () => {
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
        <Text style={{ fontSize: 17, fontFamily: 'PoppinsSemiBold', color: '#18181b' }}>
          Terms of Service
        </Text>
      </View>

      {/* Last updated */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 8,
        paddingHorizontal: 24, paddingVertical: 12,
      }}>
        <View style={{
          width: 28, height: 28, borderRadius: 8,
          backgroundColor: '#EEEDFE',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <FileTextIcon size={13} color="#534AB7" />
        </View>
        <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>
          Last updated — April 01, 2026
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 60, gap: 0 }}>

        {/* Summary card */}
        <View style={{
          padding: 14, backgroundColor: '#fafafa',
          borderRadius: 12, borderWidth: 0.5, borderColor: '#f4f4f5',
          marginBottom: 16,
        }}>
          <Text style={{
            fontSize: 11, fontFamily: 'PoppinsMedium',
            color: '#a1a1aa', letterSpacing: 0.8,
            textTransform: 'uppercase', marginBottom: 6,
          }}>
            Summary
          </Text>
          <Text style={{ fontSize: 12, fontFamily: 'PoppinsRegular', color: '#52525b', lineHeight: 20 }}>
            This app assists tuyo farmers in Naic, Cavite with image processing and quality assessment
            of sun-dried fish. By using this app, you agree to provide accurate information and use the service
            for its intended agricultural purposes.
          </Text>
        </View>

        {/* Sections */}
        {sections.map((section, i) => (
          <View key={i} style={{
            paddingVertical: 14,
            borderBottomWidth: i < sections.length - 1 ? 0.5 : 0,
            borderBottomColor: '#f4f4f5',
          }}>
            <Text style={{
              fontSize: 13, fontFamily: 'PoppinsMedium',
              color: '#18181b', marginBottom: 5,
            }}>
              {section.title}
            </Text>
            <Text style={{
              fontSize: 12, fontFamily: 'PoppinsRegular',
              color: '#71717a', lineHeight: 20,
            }}>
              {section.body}
            </Text>
          </View>
        ))}

      </ScrollView>
    </View>
  )
}

export default Terms