import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { ChevronLeft } from 'lucide-react-native'
import { router } from 'expo-router'

const About = () => {
  return (
    <View className="flex-1 bg-white">
      <ChevronLeft
        onPress={() => router.push('/settings')}
        style={{ marginTop: 50, marginLeft: 30 }}
        color="black"
        size={32}
      />

      <Text
        className="text-2xl mx-7 mt-10"
        style={{ fontFamily: 'PoppinsSemiBold' }}
      >
        About
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mt-5 mx-7">
          <Text
            className="text-sm mt-3"
            style={{ fontFamily: 'PoppinsRegular', lineHeight: 22 }}
          >
            This application is designed to assist tuyo producers in monitoring, managing, and improving the sun-drying
            process through data-driven tools and intelligent analysis.
          </Text>

          <Text
            className="text-sm mt-2"
            style={{ fontFamily: 'PoppinsRegular', lineHeight: 22 }}
          >
            The system integrates weather forecasting, drying area management, and image-based scanning to help users
            make informed decisions and reduce the risk of improper drying.
          </Text>

          <Text
            className="text-base mt-5"
            style={{ fontFamily: 'PoppinsMedium' }}
          >
            Key Features
          </Text>

          <Text
            className="text-sm mt-2"
            style={{ fontFamily: 'PoppinsRegular', lineHeight: 22 }}
          >
            • Weather-based alerts and drying recommendations{'\n'}
            • Drying area and tray management with role-based access{'\n'}
            • Image scanning for dried fish quality assessment{'\n'}
            • Notifications for drying activities and announcements
          </Text>

          <Text
            className="text-base mt-5"
            style={{ fontFamily: 'PoppinsMedium' }}
          >
            Purpose
          </Text>

          <Text
            className="text-sm mt-2"
            style={{ fontFamily: 'PoppinsRegular', lineHeight: 22 }}
          >
            This application was developed to support traditional tuyo drying practices by combining modern technology
            with practical field requirements, helping users achieve safer and more consistent drying results.
          </Text>

          <Text
            className="text-base mt-5"
            style={{ fontFamily: 'PoppinsMedium' }}
          >
            Contact
          </Text>

          <Text
            className="text-sm mt-2"
            style={{ fontFamily: 'PoppinsRegular', lineHeight: 22 }}
          >
            If you encounter issues not covered in the Help Center or have feedback regarding the application,
            you may contact the developer through the official project channels.
          </Text>
        </View>
        <View className='mt-20'/>
      </ScrollView>
    </View>
  )
}

export default About
