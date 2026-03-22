import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { ChevronLeft, CircleCheck, CircleX, PanelLeftDashed, Play, Scan, Smartphone } from 'lucide-react-native'

const HelpCenter = () => {
  return (
    <View className="flex-1 bg-white">
      <ChevronLeft
        onPress={() => router.push('/settings')}
        style={{ marginTop: 50, marginLeft: 30 }}
        color="black"
        size={32}
      />

      <Text
        className="mt-10 mx-7 text-2xl"
        style={{ fontFamily: 'PoppinsSemiBold' }}
      >
        Help
        <Text className="text-primary"> Center.</Text>
      </Text>
      <ScrollView showsVerticalScrollIndicator={false} className='mx-7 mt-5 mb-10'>
        <View className='flex flex-row items-center gap-2 mt-5'>
          <View className='bg-primary p-2 rounded-full'>
            <Play size={15} color={'#ffffff'}/>
          </View>
          <Text className='text-lg' style={{ fontFamily: 'PoppinsMedium', lineHeight: 24 }}>Getting Started</Text>
        </View>
        <Text className='text-base mt-2' style={{ fontFamily: 'PoppinsMedium', lineHeight: 24 }}>1. Create an account</Text>
        <Text className='text-sm mt-1' style={{ fontFamily: 'PoppinsRegular' }}>Open the app and tap <Text className='text-primary' style={{ fontFamily: 'PoppinsMedium' }}>Register.</Text></Text>
        <Text className='text-sm' style={{ fontFamily: 'PoppinsRegular' }}>Enter your username, email, create a password, and follow the complete profile steps.</Text>
        <Text className='text-sm mt-1' style={{ fontFamily: 'PoppinsRegular' }}>A success message will appear once your registration is complete before proceeding to the app.</Text>

        <Text className='text-base mt-2' style={{ fontFamily: 'PoppinsMedium', lineHeight: 24 }}>2. Logging in your account</Text>
        <Text className='text-sm mt-1' style={{ fontFamily: 'PoppinsRegular' }}>Tap <Text className='text-primary' style={{ fontFamily: 'PoppinsMedium' }}>Log In</Text>, enter your registered email and password, then press <Text className='text-primary' style={{ fontFamily: 'PoppinsMedium' }}>Login.</Text></Text>
        <Text className='text-sm mt-1' style={{ fontFamily: 'PoppinsRegular' }}>You&apos;ll see a confirmation message when login is successful before being redirected to complete your profile.</Text>

        <Text className='text-base mt-2' style={{ fontFamily: 'PoppinsMedium', lineHeight: 24 }}>3. Complete your profile</Text>
        <Text className='text-sm mt-1' style={{ fontFamily: 'PoppinsRegular' }}>After your first login, you&apos;ll be directed to the <Text className='text-primary' style={{ fontFamily: 'PoppinsMedium' }}>Complete Profile</Text> page.</Text>
        <Text className='text-sm' style={{ fontFamily: 'PoppinsRegular' }}>Fill in all required information including your full name, birthdate, mobile number, and other farmer details.</Text>
        <Text className='text-sm mt-1' style={{ fontFamily: 'PoppinsRegular' }}>Once completed, you&apos;ll be redirected to the dashboard and can start using the app.</Text>

        <View className='flex flex-row items-center gap-2 mt-5'>
          <View className='bg-primary p-2 rounded-full'>
            <Smartphone size={15} color={'#ffffff'}/>
          </View>
          <Text className='text-lg' style={{ fontFamily: 'PoppinsMedium', lineHeight: 24 }}>Navigating the App</Text>
        </View>

        <Text className='text-base mt-2' style={{ fontFamily: 'PoppinsMedium', lineHeight: 24 }}>1. Dashboard</Text>
        <Text className='text-sm mt-1' style={{ fontFamily: 'PoppinsRegular' }}>Your main hub displays a personalized welcome message, today&apos;s weather forecast, and drying recommendations.</Text>
        <Text className='text-sm' style={{ fontFamily: 'PoppinsRegular' }}>View weather charts and receive warnings about <Text className='text-primary' style={{ fontFamily: 'PoppinsMedium' }}>whether conditions</Text> are suitable for sun-drying your tuyo today.</Text>

        <Text
          className="text-base mt-4"
          style={{ fontFamily: 'PoppinsMedium', lineHeight: 24 }}
        >
          Weather Icons Guide
        </Text>

        <Text
          className="text-sm mt-1"
          style={{ fontFamily: 'PoppinsRegular' }}
        >
          The app uses weather icons to help you quickly understand current weather
          conditions and determine whether it is safe and effective to sun-dry tuyo.
          Each icon represents a specific weather condition that may affect the drying
          process.
        </Text>

       <View className="mt-4">
        <View className="flex-row gap-2 items-center mt-2">
          <Image
            style={{ width: 30, height: 30 }}
            resizeMode="contain"
            source={require('@/assets/images/weather-icons/1.png')}
          />
          <Text className="text-sm" style={{ fontFamily: 'PoppinsMedium' }}>
            Clear Sky
          </Text>
        </View>
        <Text
          className="text-sm ml-10"
          style={{ fontFamily: 'PoppinsRegular', lineHeight: 20 }}
        >
          Ideal drying conditions with strong sunlight and clear skies.
        </Text>

        <View className="flex-row gap-2 items-center mt-3">
          <Image
            style={{ width: 30, height: 30 }}
            resizeMode="contain"
            source={require('@/assets/images/weather-icons/2.png')}
          />
          <Text className="text-sm" style={{ fontFamily: 'PoppinsMedium' }}>
            Few Clouds
          </Text>
        </View>
        <Text
          className="text-sm ml-10"
          style={{ fontFamily: 'PoppinsRegular', lineHeight: 20 }}
        >
          Mostly sunny with minimal cloud cover. Drying is still recommended.
        </Text>

        <View className="flex-row gap-2 items-center mt-3">
          <Image
            style={{ width: 30, height: 30 }}
            resizeMode="contain"
            source={require('@/assets/images/weather-icons/3.png')}
          />
          <Text className="text-sm" style={{ fontFamily: 'PoppinsMedium' }}>
            Scattered Clouds
          </Text>
        </View>
        <Text
          className="text-sm ml-10"
          style={{ fontFamily: 'PoppinsRegular', lineHeight: 20 }}
        >
          Partial cloud coverage. Drying may take longer but remains possible.
        </Text>

        <View className="flex-row gap-2 items-center mt-3">
          <Image
            style={{ width: 30, height: 30 }}
            resizeMode="contain"
            source={require('@/assets/images/weather-icons/4.png')}
          />
          <Text className="text-sm" style={{ fontFamily: 'PoppinsMedium' }}>
            Broken Clouds
          </Text>
        </View>
        <Text
          className="text-sm ml-10"
          style={{ fontFamily: 'PoppinsRegular', lineHeight: 20 }}
        >
          Cloudy skies with limited sunlight. Drying efficiency may be reduced.
        </Text>

        <View className="flex-row gap-2 items-center mt-3">
          <Image
            style={{ width: 30, height: 30 }}
            resizeMode="contain"
            source={require('@/assets/images/weather-icons/6.png')}
          />
          <Text className="text-sm" style={{ fontFamily: 'PoppinsMedium' }}>
            Shower Rain
          </Text>
        </View>
        <Text
          className="text-sm ml-10"
          style={{ fontFamily: 'PoppinsRegular', lineHeight: 20 }}
        >
          Light or intermittent rain. Sun-drying is not recommended.
        </Text>

        <View className="flex-row gap-2 items-center mt-3">
          <Image
            style={{ width: 30, height: 30 }}
            resizeMode="contain"
            source={require('@/assets/images/weather-icons/5.png')}
          />
          <Text className="text-sm" style={{ fontFamily: 'PoppinsMedium' }}>
            Rain
          </Text>
        </View>
        <Text
          className="text-sm ml-10"
          style={{ fontFamily: 'PoppinsRegular', lineHeight: 20 }}
        >
          Continuous rainfall. Drying is unsafe and ineffective.
        </Text>

        <View className="flex-row gap-2 items-center mt-3">
          <Image
            style={{ width: 30, height: 30 }}
            resizeMode="contain"
            source={require('@/assets/images/weather-icons/7.png')}
          />
          <Text className="text-sm" style={{ fontFamily: 'PoppinsMedium' }}>
            Thunderstorm
          </Text>
        </View>
        <Text
          className="text-sm ml-10"
          style={{ fontFamily: 'PoppinsRegular', lineHeight: 20 }}
        >
          Severe weather with heavy rain and thunderstorm. Drying should be avoided.
        </Text>
      </View>

      <Text
        className="text-base mt-4"
        style={{ fontFamily: 'PoppinsMedium', lineHeight: 24 }}
      >
        Weather Alerts for Drying Fish
      </Text>

      <Text
        className="text-sm mt-1"
        style={{ fontFamily: 'PoppinsRegular' }}
      >
        Our app provides weather-based alerts to help you determine whether it is safe and effective to sun-dry your fish. 
        Alerts are calculated using the current rain probability and cloud coverage. Each alert level indicates the 
        expected drying conditions and the risk associated with drying fish outdoors.
      </Text>

      <View className="mt-4 border border-zinc-300 rounded-lg overflow-hidden">
        {/* Header */}
        <View className="flex-row bg-zinc-100">
          <Text className="flex-1 p-3 text-sm font-semibold" style={{ fontFamily: 'PoppinsSemiBold' }}>
            Rain %
          </Text>
          <Text className="flex-1 p-3 text-sm font-semibold" style={{ fontFamily: 'PoppinsSemiBold' }}>
            Cloud %
          </Text>
          <Text className="flex-1 p-3 text-sm font-semibold" style={{ fontFamily: 'PoppinsSemiBold' }}>
            Alert
          </Text>
        </View>

        {/* Excellent */}
        <View className="flex-row border-t border-zinc-200">
          <Text className="flex-1 p-3 text-sm" style={{ fontFamily: 'PoppinsRegular' }}>
            0%
          </Text>
          <Text className="flex-1 p-3 text-sm" style={{ fontFamily: 'PoppinsRegular' }}>
            Below 50%
          </Text>
          <Text
            className="flex-1 p-3 text-sm"
            style={{ fontFamily: 'PoppinsSemiBold', color: '#22c55e' }}
          >
            Excellent
          </Text>
        </View>

        {/* Good */}
        <View className="flex-row border-t border-zinc-200">
          <Text className="flex-1 p-3 text-sm" style={{ fontFamily: 'PoppinsRegular' }}>
            0%
          </Text>
          <Text className="flex-1 p-3 text-sm" style={{ fontFamily: 'PoppinsRegular' }}>
            50% – 100%
          </Text>
          <Text
            className="flex-1 p-3 text-sm"
            style={{ fontFamily: 'PoppinsSemiBold', color: '#3b82f6' }}
          >
            Good
          </Text>
        </View>

        {/* Caution */}
        <View className="flex-row border-t border-zinc-200">
          <Text className="flex-1 p-3 text-sm" style={{ fontFamily: 'PoppinsRegular' }}>
            1% – 80%
          </Text>
          <Text className="flex-1 p-3 text-sm" style={{ fontFamily: 'PoppinsRegular' }}>
            Up to 100%
          </Text>
          <Text
            className="flex-1 p-3 text-sm"
            style={{ fontFamily: 'PoppinsSemiBold', color: '#eab308' }}
          >
            Caution
          </Text>
        </View>

        {/* Warning */}
        <View className="flex-row border-t border-zinc-200">
          <Text className="flex-1 p-3 text-sm" style={{ fontFamily: 'PoppinsRegular' }}>
            81% – 98%
          </Text>
          <Text className="flex-1 p-3 text-sm" style={{ fontFamily: 'PoppinsRegular' }}>
            Any
          </Text>
          <Text
            className="flex-1 p-3 text-sm"
            style={{ fontFamily: 'PoppinsSemiBold', color: '#f97316' }}
          >
            Warning
          </Text>
        </View>

        {/* Danger */}
        <View className="flex-row border-t border-zinc-200">
          <Text className="flex-1 p-3 text-sm" style={{ fontFamily: 'PoppinsRegular' }}>
            99% – 100%
          </Text>
          <Text className="flex-1 p-3 text-sm" style={{ fontFamily: 'PoppinsRegular' }}>
            Any
          </Text>
          <Text
            className="flex-1 p-3 text-sm"
            style={{ fontFamily: 'PoppinsSemiBold', color: '#ef4444' }}
          >
            Danger
          </Text>
        </View>
      </View>

      <Text className='text-base mt-2' style={{ fontFamily: 'PoppinsMedium', lineHeight: 24 }}>
        2. Drying
      </Text>
      <Text className='text-sm mt-1' style={{ fontFamily: 'PoppinsRegular' }}>
        Monitor and track your <Text className='text-primary' style={{ fontFamily: 'PoppinsMedium' }}>sun-dried fish drying process</Text>. View ongoing batches and drying progress.
      </Text>
      <Text className='text-sm mt-1' style={{ fontFamily: 'PoppinsRegular' }}>
        The Drying page also includes a dedicated drying module, designed for beginners and new users in tuyo farming. 
        Here, you can create your own drying area to start a batch, or join existing drying areas to collaborate with other users.
      </Text>
      <Text className='text-sm mt-1' style={{ fontFamily: 'PoppinsRegular' }}>
        The module provides step-by-step guidance, real-time updates, and <Text className='text-primary' style={{ fontFamily: 'PoppinsMedium' }}>progress tracking</Text> to help ensure optimal drying conditions for your tuyo batches.
      </Text>

        <Text className='text-base mt-2' style={{ fontFamily: 'PoppinsMedium', lineHeight: 24 }}>
          3. Scan
        </Text>
        <Text className='text-sm mt-1' style={{ fontFamily: 'PoppinsRegular' }}>
          Capture images of your tuyo to analyze quality, detect defects, and get instant assessment results.
        </Text>
        <Text className='text-sm mt-1' style={{ fontFamily: 'PoppinsRegular' }}>
          Users can choose between using the <Text className='text-primary' style={{ fontFamily: 'PoppinsMedium' }}>phone camera</Text> or selecting a saved picture from their gallery. 
          Once the picture is taken or chosen, tap <Text className='text-primary' style={{ fontFamily: 'PoppinsMedium' }}>Scan</Text> to start the analysis.
        </Text>
        <Text className='text-sm mt-1' style={{ fontFamily: 'PoppinsRegular' }}>
          The app will provide instant results or remarks, detecting whether the tuyo is <Text className='text-primary' style={{ fontFamily: 'PoppinsMedium' }}>undried, dry, or rejected</Text>.
        </Text>

        <Text className='text-base mt-2' style={{ fontFamily: 'PoppinsMedium', lineHeight: 24 }}>
          4. Notifications
        </Text>
        <Text className='text-sm mt-1' style={{ fontFamily: 'PoppinsRegular' }}>
          Stay updated with alerts, reminders, and important updates about your drying batches and app activities.
        </Text>
        <Text className='text-sm mt-1' style={{ fontFamily: 'PoppinsRegular' }}>
          The app sends <Text className='text-primary' style={{ fontFamily: 'PoppinsMedium' }}>weather notifications</Text> up to two days in advance, timed to your scheduled drying activities, so you can prepare ahead.
        </Text>
        <Text className='text-sm mt-1' style={{ fontFamily: 'PoppinsRegular' }}>
          You will also receive updates about <Text className='text-primary' style={{ fontFamily: 'PoppinsMedium' }}>drying progress</Text> and important <Text className='text-primary' style={{ fontFamily: 'PoppinsMedium' }}>announcements</Text> related to app features and system updates.
        </Text>

        <Text className='text-base mt-2' style={{ fontFamily: 'PoppinsMedium', lineHeight: 24 }}>
          5. Settings
        </Text>
        <Text className='text-sm mt-1' style={{ fontFamily: 'PoppinsRegular' }}>
          Manage your profile, adjust app preferences, access help center, and customize your experience.
        </Text>
        <Text className='text-sm mt-1' style={{ fontFamily: 'PoppinsRegular' }}>
          In Settings, users can view and update their <Text className='text-primary' style={{ fontFamily: 'PoppinsMedium' }}>user profile</Text>, change their password, and manage account information.
        </Text>
        <Text className='text-sm mt-1' style={{ fontFamily: 'PoppinsRegular' }}>
          This section also provides access to the <Text className='text-primary' style={{ fontFamily: 'PoppinsMedium' }}>FAQ</Text>, <Text className='text-primary' style={{ fontFamily: 'PoppinsMedium' }}>Help Center</Text>, <Text className='text-primary' style={{ fontFamily: 'PoppinsMedium' }}>Terms of Service</Text>, and <Text className='text-primary' style={{ fontFamily: 'PoppinsMedium' }}>About</Text> pages, as well as the option to securely <Text className='text-primary' style={{ fontFamily: 'PoppinsMedium' }}>log out</Text> of the app.
        </Text>

        <View className='flex flex-row items-center gap-2 mt-5'>
          <View className='bg-primary p-2 rounded-full'>
            <PanelLeftDashed size={15} color={'#ffffff'} />
          </View>
          <Text className='text-lg' style={{ fontFamily: 'PoppinsMedium', lineHeight: 24 }}>
            Drying Area Roles & Permissions
          </Text>
        </View>

        <Text className='text-sm mt-2' style={{ fontFamily: 'PoppinsRegular' }}>
          After joining or creating a drying area, users are assigned roles that determine what actions they can perform within that area.
        </Text>

        <Text className='text-base mt-3' style={{ fontFamily: 'PoppinsMedium' }}>
          Admin (Drying Area Owner)
        </Text>

        <Text className='text-sm mt-1' style={{ fontFamily: 'PoppinsRegular' }}>
          Users who <Text className='text-primary' style={{ fontFamily: 'PoppinsMedium' }}>create a drying area</Text> automatically become the admin and have full control over its management.
        </Text>

        <Text className='text-sm mt-1' style={{ fontFamily: 'PoppinsRegular' }}>
          Admins can edit drying area information, <Text className='text-primary' style={{ fontFamily: 'PoppinsMedium' }}>create and delete trays</Text>, manage drying timelines, harvest batches, and delete the entire drying area when necessary.
        </Text>

        <Text className='text-base mt-3' style={{ fontFamily: 'PoppinsMedium' }}>
          Member
        </Text>

        <Text className='text-sm mt-1' style={{ fontFamily: 'PoppinsRegular' }}>
          Members have limited access and can only use trays created by the admin. They can create drying timelines, monitor drying progress, and harvest their assigned batches.
        </Text>

        <Text className='text-sm mt-1' style={{ fontFamily: 'PoppinsRegular' }}>
          This role-based setup ensures proper control, organized workflows, and smooth collaboration inside each drying area.
        </Text>

        <View className='flex flex-row items-center gap-2 mt-5'>
          <View className='bg-primary p-2 rounded-full'>
            <Scan size={15} color={'#ffffff'} />
          </View>
          <Text className='text-lg' style={{ fontFamily: 'PoppinsMedium', lineHeight: 24 }}>
            Scan Methods & Guidelines
          </Text>
        </View>

        <Text className='text-sm mt-2' style={{ fontFamily: 'PoppinsRegular' }}>
            The Scan feature allows users to analyze dried fish quality using image recognition. There are two ways to access the scan feature within the app.
          </Text>

          <Text className='text-sm mt-1' style={{ fontFamily: 'PoppinsRegular' }}>
            The first scan option is available from the <Text className='text-primary' style={{ fontFamily: 'PoppinsMedium' }}>main hub</Text>, located between the Drying and Notifications sections. 
            The second scan option can be accessed inside a tray, positioned in the middle of the timeline and history view.
          </Text>

          <Text className='text-sm mt-1' style={{ fontFamily: 'PoppinsRegular' }}>
            When Scan is tapped, users may open the camera or choose an image from the gallery. After taking or selecting a photo, tap <Text className='text-primary' style={{ fontFamily: 'PoppinsMedium' }}>Scan</Text> to begin image analysis.
          </Text>

          <Text className='text-sm mt-1' style={{ fontFamily: 'PoppinsRegular' }}>
            For accurate results, the fish must be <Text className='text-primary' style={{ fontFamily: 'PoppinsMedium' }}>laid flat</Text>, not tilted, and the camera distance should be no more than <Text className='text-primary' style={{ fontFamily: 'PoppinsMedium' }}>30 cm</Text> to properly capture texture details.
          </Text>

          <View className='flex flex-row gap-3 mt-3 justify-between'>
            <View className='flex gap-2 items-center justify-center'>
              <View
                style={{
                  borderRadius: 12,
                  overflow: 'hidden',
                  width: 145,
                  height: 200,
                }}
              >
                <Image
                  style={{ width: '100%', height: '100%' }}
                  resizeMode='cover'
                  source={require('@/assets/images/help/good.jpg')}
                />
              </View>
              <CircleCheck size={20} color={'#00B44A'}/>
            </View>
            <View className='flex gap-2 items-center justify-center'>
              <View
                style={{
                  borderRadius: 12,
                  overflow: 'hidden',
                  width: 145,
                  height: 200,
                }}
              >
                <Image
                  style={{ width: '100%', height: '100%' }}
                  resizeMode='cover'
                  source={require('@/assets/images/help/slant.jpg')}
                />
              </View>
              <CircleX size={20} color={'#FF0000'}/>
            </View>
          </View>

      
          <Text className='text-sm mt-3' style={{ fontFamily: 'PoppinsRegular' }}>
            This scanning feature is designed specifically for <Text className='text-primary' style={{ fontFamily: 'PoppinsMedium' }}>lawlaw fish</Text>. Scanning other fish types may result in inaccurate results.
          </Text>

          <Text className='text-sm mt-1' style={{ fontFamily: 'PoppinsRegular' }}>
            The scan result will identify whether the fish is <Text className='text-primary' style={{ fontFamily: 'PoppinsMedium' }}>dry</Text>, <Text className='text-primary' style={{ fontFamily: 'PoppinsMedium' }}>undried</Text>, or <Text className='text-primary' style={{ fontFamily: 'PoppinsMedium' }}>rejected</Text>.
          </Text>

          <Text
            className="text-base mt-6"
            style={{ fontFamily: 'PoppinsMedium', lineHeight: 24 }}
          >
            Sun-Dried Fish Classification
          </Text>

          <Text
            className="text-sm mt-1"
            style={{ fontFamily: 'PoppinsRegular' }}
          >
            The scan feature classifies your fish based on dryness level and quality.
            Each result is color-coded for quick identification.
          </Text>

          <View className="mt-4 border border-zinc-300 rounded-lg overflow-hidden">
            {/* Header */}
            <View className="flex-row bg-zinc-100">
              <Text
                className="p-3 text-sm"
                style={{ width: '40%', fontFamily: 'PoppinsSemiBold' }}
              >
                Status
              </Text>
              <Text
                className="p-3 text-sm"
                style={{ width: '60%', fontFamily: 'PoppinsSemiBold' }}
              >
                Description
              </Text>
            </View>

            {/* Reject */}
            <View className="flex-row border-t border-zinc-200">
              <Text
                className="p-3 text-sm"
                style={{ width: '40%', fontFamily: 'PoppinsSemiBold', color: '#961515' }}
              >
                Reject
              </Text>
              <Text
                className="p-3 text-sm"
                style={{ width: '60%', fontFamily: 'PoppinsRegular' }}
              >
                Not suitable due to spoilage or defects.
              </Text>
            </View>

            {/* Undried */}
            <View className="flex-row border-t border-zinc-200">
              <Text
                className="p-3 text-sm"
                style={{ width: '40%', fontFamily: 'PoppinsSemiBold', color: '#c47f00' }}
              >
                Undried
              </Text>
              <Text
                className="p-3 text-sm"
                style={{ width: '60%', fontFamily: 'PoppinsRegular' }}
              >
                Still moist and needs more drying time.
              </Text>
            </View>

            {/* Dry */}
            <View className="flex-row border-t border-zinc-200">
              <Text
                className="p-3 text-sm"
                style={{ width: '40%', fontFamily: 'PoppinsSemiBold', color: '#127312' }}
              >
                Dry
              </Text>
              <Text
                className="p-3 text-sm"
                style={{ width: '60%', fontFamily: 'PoppinsRegular' }}
              >
                Fully dried and ready for storage or selling.
              </Text>
            </View>
          </View>

          <Text className='text-base mt-6' style={{ fontFamily: 'PoppinsMedium', lineHeight: 24 }}>
            Need more help?
          </Text>

          <Text className='text-sm mt-1' style={{ fontFamily: 'PoppinsRegular', lineHeight: 22 }}>
            If you have additional questions or need further assistance, feel free to explore the Help Center, review the FAQ, 
            or check the Terms of Service and About sections for more information.
          </Text>

          <Text className='text-sm mt-1' style={{ fontFamily: 'PoppinsRegular', lineHeight: 22 }}>
            We are committed to helping you achieve better and safer tuyo drying through reliable tools and clear guidance.
          </Text>

          <Text className='text-sm mt-2' style={{ fontFamily: 'PoppinsRegular', lineHeight: 22 }}>
            If you encounter issues not covered here, you may contact the developer through the About section.
          </Text>

        <View className='mt-10'/>
      </ScrollView>
    </View>
  )
}

export default HelpCenter