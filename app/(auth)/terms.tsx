import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { ChevronLeft } from 'lucide-react-native'
import { router } from 'expo-router'

const Terms = () => {
  return (
    <View className='bg-white flex-1'>
        <ChevronLeft onPress={() => router.back()} style={{ marginTop: 50, marginLeft: 30 }} color="black" size={32} />
            <Text
              className="mt-10 mx-7 text-2xl"
              style={{ fontFamily: 'PoppinsSemiBold' }}
            >
              Terms of
              <Text className="text-primary"> Service.</Text>
            </Text>
            <Text className='text-zinc-500 mx-7' style={{
                fontFamily: 'PoppinsMedium',
                fontSize: 16,
                lineHeight: 24,
              }}>
                Last updated on April 01, 2026
              </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
            <View className='mx-7 mt-5 mb-10'>
                
              <Text className='text-base mb-2' style={{ fontFamily: 'PoppinsMedium', lineHeight: 24 }}>Summary</Text>
              <Text className='text-zinc-500 text-sm mb-6' style={{
                fontFamily: 'PoppinsRegular',
                lineHeight: 22,
              }}>
                This application is designed to assist tuyo farmers in Labac, Naic, Cavite with image processing and quality assessment of sun-dried fish. By using this app, you agree to provide accurate personal information and use the service for its intended agricultural purposes.
              </Text>
      
              <Text className='text-base mb-2' style={{ fontFamily: 'PoppinsMedium', lineHeight: 24 }}>1. Acceptance of Terms</Text>
              <Text className='text-zinc-500 text-sm mb-6' style={{
                fontFamily: 'PoppinsRegular',
                lineHeight: 22,
              }}>
                By creating an account and using this sun-dried fish image processing application, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the application.
              </Text>
      
              <Text className='text-base mb-2' style={{ fontFamily: 'PoppinsMedium', lineHeight: 24 }}>2. User Registration and Account</Text>
              <Text className='text-zinc-500 text-sm mb-6' style={{
                fontFamily: 'PoppinsRegular',
                lineHeight: 22,
              }}>
                To use this application, you must register and provide accurate personal information including your full name, date of birth, mobile number, and other required details. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must be a tuyo farmer or authorized representative from Labac, Naic, Cavite to use this service.
              </Text>
      
              <Text className='text-base mb-2' style={{ fontFamily: 'PoppinsMedium', lineHeight: 24 }}>3. Data Collection and Usage</Text>
              <Text className='text-zinc-500 text-sm mb-6' style={{
                fontFamily: 'PoppinsRegular',
                lineHeight: 22,
              }}>
                We collect personal information including name, birthdate, mobile number, and other basic data necessary for account creation and service delivery. This information is used solely for the purpose of providing image processing services for sun-dried fish quality assessment and improving our application. Your data will be stored securely and will not be shared with third parties without your consent, except as required by law or for research purposes related to this thesis project.
              </Text>
      
              <Text className='text-base mb-2' style={{ fontFamily: 'PoppinsMedium', lineHeight: 24 }}>4. Image Processing Services</Text>
              <Text className='text-zinc-500 text-sm mb-6' style={{
                fontFamily: 'PoppinsRegular',
                lineHeight: 22,
              }}>
                This application provides image processing capabilities to analyze and assess the quality of sun-dried fish (tuyo). The results provided by the application are based on image analysis algorithms and should be used as a guide. We do not guarantee 100% accuracy in quality assessment and recommend using the results in conjunction with traditional assessment methods and professional judgment.
              </Text>
      
              <Text className='text-base mb-2' style={{ fontFamily: 'PoppinsMedium', lineHeight: 24 }}>5. User Responsibilities</Text>
              <Text className='text-zinc-500 text-sm mb-6' style={{
                fontFamily: 'PoppinsRegular',
                lineHeight: 22,
              }}>
                You agree to use this application only for lawful purposes related to sun-dried fish farming and quality assessment. You must provide clear and accurate images for processing. You are responsible for any content you upload to the application and must ensure you have the right to use and share such images. Misuse of the application, including providing false information or attempting to manipulate results, may result in account suspension or termination.
              </Text>
      
              <Text className='text-base mb-2' style={{ fontFamily: 'PoppinsMedium', lineHeight: 24 }}>6. Research and Academic Use</Text>
              <Text className='text-zinc-500 text-sm mb-6' style={{
                fontFamily: 'PoppinsRegular',
                lineHeight: 22,
              }}>
                This application is developed as part of a thesis project. Anonymized data and usage statistics may be used for academic research purposes. Your personal information will be kept confidential, and any published research will not include identifiable personal information without your explicit consent.
              </Text>
      
              <Text className='text-base mb-2' style={{ fontFamily: 'PoppinsMedium', lineHeight: 24 }}>7. Limitation of Liability</Text>
              <Text className='text-zinc-500 text-sm mb-6' style={{
                fontFamily: 'PoppinsRegular',
                lineHeight: 22,
              }}>
                This application is provided &quot;as is&quot; for educational and research purposes. We are not liable for any losses, damages, or issues arising from the use of the application or reliance on its image processing results. Users should exercise their own judgment when making business decisions based on the application&apos;s assessments.
              </Text>
      
              <Text className='text-base mb-2' style={{ fontFamily: 'PoppinsMedium', lineHeight: 24 }}>8. Modifications to Service</Text>
              <Text className='text-zinc-500 text-sm mb-6' style={{
                fontFamily: 'PoppinsRegular',
                lineHeight: 22,
              }}>
                We reserve the right to modify, suspend, or discontinue any aspect of the application at any time without prior notice. We may also update these Terms of Service periodically. Continued use of the application after such changes constitutes acceptance of the new terms.
              </Text>
      
              <Text className='text-base mb-2' style={{ fontFamily: 'PoppinsMedium', lineHeight: 24 }}>9. Account Termination</Text>
              <Text className='text-zinc-500 text-sm mb-6' style={{
                fontFamily: 'PoppinsRegular',
                lineHeight: 22,
              }}>
                You may terminate your account at any time by contacting us through the application. We reserve the right to terminate or suspend accounts that violate these terms or engage in inappropriate use of the service. Upon termination, your access to the application will be revoked, though some data may be retained for research and record-keeping purposes.
              </Text>
      
              <Text className='text-base mb-2' style={{ fontFamily: 'PoppinsMedium', lineHeight: 24 }}>10. Contact Information</Text>
              <Text className='text-zinc-500 text-sm mb-6' style={{
                fontFamily: 'PoppinsRegular',
                lineHeight: 22,
              }}>
                For questions, concerns, or support regarding these Terms of Service or the application, please contact us through the Help Center within the application or reach out to our support team. We are committed to assisting tuyo farmers in Labac, Naic, Cavite with their sun-dried fish quality assessment needs.
              </Text>
      
              <Text className='text-base mb-2' style={{ fontFamily: 'PoppinsMedium', lineHeight: 24 }}>11. Governing Law</Text>
              <Text className='text-zinc-500 text-sm mb-8' style={{
                fontFamily: 'PoppinsRegular',
                lineHeight: 22,
              }}>
                These Terms of Service are governed by the laws of the Republic of the Philippines. Any disputes arising from the use of this application shall be resolved in accordance with Philippine law and jurisdiction.
              </Text>
              </View>
            </ScrollView>
          </View>
  )
}

export default Terms