import {
  View,
  Text,
  ActivityIndicator,
  BackHandler,
  Image,
  Pressable,
  TextInput,
  Platform,
  ScrollView
} from 'react-native';
import { useState, useCallback, useRef } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { useCompleteProfileMutation } from '@/store/userApi';
import { Pencil } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs'
import { Checkbox } from 'expo-checkbox';
import Toast from 'react-native-toast-message';
import useAuthRedirect from '@/components/hooks/useAuthRedirect';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { uploadImageToSupabase } from '@/utils/lib/supabase';
import CountryPicker, { Country, CountryCode } from "react-native-country-picker-modal";
import BottomDrawer, { BottomDrawerRef } from '@/components/containers/BottomDrawer';

const CompleteProfile = () => {
  const { checking, user } = useAuthRedirect()
  const drawerRef = useRef<BottomDrawerRef>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const [isFocused, setIsFocused] = useState('')
  const [showPicker, setShowPicker] = useState(false);

  const [isChecked, setChecked] = useState(false);
  const [completeProfile, {isLoading}] = useCompleteProfileMutation()
  const [supabaseLoading, setSupabaseLoading] = useState(false)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [address] = useState('Labac')
  const [date, setDate] = useState<Date | null>(null);
  const formattedDate = date ? new Date(date).toISOString().split('T')[0] : '';

  const [image, setImage] = useState<string | null>(null);

  const [countryCode, setCountryCode] = useState<CountryCode>("PH");
  const [callingCode, setCallingCode] = useState("+63");
  const [visible, setVisible] = useState(false);

  const handlePress = () => {
    if (isDrawerOpen) {
      drawerRef.current?.close();
    } else {
      drawerRef.current?.open();
    }
  }

  const onSelect = (country: Country) => {
    setCountryCode(country.cca2);
    setCallingCode("+" + country.callingCode[0]);
    setVisible(false);
  };

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleComplete = async () => {
    if (!validate()) return;

    let imageURL = ''
    
    try { 
      if (image) {
        const uploadedUrl = await uploadImageToSupabase(image, 'profile', setSupabaseLoading);
        if (uploadedUrl) imageURL = uploadedUrl;
      }

      const response = await completeProfile({
        first_name: firstName,
        last_name: lastName,
        birthday: formattedDate,
        mobile_number: callingCode + mobileNumber,
        address,
        ...(imageURL && { profile_picture: imageURL }),
      }).unwrap();

      Toast.show({
        type: 'success',
        text1: 'User Updated Successfully!',
      });

      await AsyncStorage.setItem(
        'user',
        JSON.stringify({
          username: response.username,
          email: response.email || '', 
          id: response.id || '',
          first_name: response.first_name || '',
          last_name: response.last_name || '',
          birthday: response.birthday || '',
          address: response.address || '',
          is_complete: response.is_complete || false,
          profile_picture: response.profile_picture || '',
          mobile_number: response.mobile_number || '',
        })
      );

      router.replace('/(tabs)/home')
    } catch (error: any) {
      console.log(error);
      
      if (error?.data?.detail) {
        Toast.show({
          type: 'error',
          text1: error.data.detail,
        });
      }
      
      const serverErrors: { [key: string]: string } = {};
      if (error?.data) {
        for (const key in error.data) {
          serverErrors[key] = error.data[key][0];
        }
        setErrors((prev) => ({ ...prev, ...serverErrors }));
      } else {
        console.log('Unexpected error:', error);
      }  
    } finally {
      setSupabaseLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true;
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );
      return () => backHandler.remove();
    }, [])
  );

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('Permission is required to access media library');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };


  const handleChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    const nameRegex = /^[A-Za-z\s'-]+$/;

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required.';
    } else if (!nameRegex.test(firstName)) {
      newErrors.firstName = 'First name should not contain numbers or special characters.';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required.';
    } else if (!nameRegex.test(lastName)) {
      newErrors.lastName = 'Last name should not contain numbers or special characters.';
    }

    if(!mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required.';
    }

    if (!date) {
      newErrors.birthday = 'Birthday is required.';
    }

    if (!address.trim()) {
      newErrors.address = 'Address is required.';
    }

    if (!isChecked) {
      newErrors.agreement = 'You must agree to the terms.';
    }

    if (image) {
      const allowedExtensions = ['jpg', 'jpeg', 'png'];
      const extension = image.split('.').pop()?.toLowerCase();
      if (!extension || !allowedExtensions.includes(extension)) {
        newErrors.profilePicture = 'Only JPEG or PNG images are allowed.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (checking) return (
      <View className='flex-1 items-center justify-center'>
        <ActivityIndicator size={50}/>
      </View>
    );

  return (
    <View className="bg-white flex-1">
      <Text className="mt-24 mx-7 text-3xl" style={{ fontFamily: 'PoppinsSemiBold' }}>
        Hello{' '}
        <Text className="text-primary">
          {user?.username
            ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
            : ''}
          !
        </Text>
      </Text>

      <Text className="mx-7" style={{ fontFamily: 'PoppinsSemiBold', fontSize: 18 }}>
        Finish your profile to proceed.
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
      <View className="mx-7 flex-1 items-center">
        <View className="border-[3px] border-primary mt-10 rounded-full p-1 relative">
          <Image
            source={
              image
                ? { uri: image }
                : require('@/assets/images/default-profile.png')
            }
            style={{ width: 80, height: 80, borderRadius: 999 }}
            resizeMode="cover"
          />
          <Pressable
            onPress={pickImage}
            className="absolute bg-zinc-200 justify-center items-center h-8 w-8 bottom-0 right-0 rounded-full"
          >
            <Pencil size={15} color={'#155183'} />
          </Pressable>
        </View>
        {errors.firstName && (
          <Text className="text-error mt-1 ml-1 text-sm">{errors.profilePicture}</Text>
        )}

        <TextInput
          className={`rounded-md p-3 mt-8 w-full text-base text-black ${
            isFocused === 'fName' ? 'border-[2px] border-black' : 'border border-zinc-300'
          }`}
          onFocus={() => setIsFocused('fName')}
          onBlur={() => setIsFocused('')}
          placeholder="First Name"
          placeholderTextColor="#9ca3af"
          value={firstName}
          onChangeText={setFirstName}
        />
        {errors.firstName && (
          <Text className="text-error mt-1 ml-1 text-sm w-full">{errors.firstName}</Text>
        )}
        <TextInput
          className={`rounded-md p-3 mt-5 w-full text-base text-black ${
            isFocused === 'lName' ? 'border-[2px] border-black' : 'border border-zinc-300'
          }`}
          onFocus={() => setIsFocused('lName')}
          onBlur={() => setIsFocused('')}
          placeholder="Last Name"
          placeholderTextColor="#9ca3af"
          value={lastName}
          onChangeText={setLastName}
        />
        {errors.lastName && (
          <Text className="text-error mt-1 ml-1 text-sm w-full">{errors.lastName}</Text>
        )}
        <Pressable
          onPress={() => setShowPicker(true)}
          className={`rounded-md p-3 mt-5 w-full text-base ${
            isFocused === 'birthday'
              ? 'border-[2px] border-black'
              : 'border border-zinc-300'
          } bg-white`}
          onFocus={() => setIsFocused('birthday')}
          onBlur={() => setIsFocused('')}
        >
          <Text className={`${date ? 'text-black' : 'text-zinc-400'}`}>
            {date ? dayjs(date).format('YYYY-MM-DD') : 'Select Birthday'}
          </Text>
        </Pressable>

        {showPicker && (
          <DateTimePicker
            value={date || new Date(2000, 0, 1)}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            maximumDate={new Date()}
            onChange={handleChange}
          />
        )}
        {errors.birthday && (
          <Text className="text-error mt-1 ml-1 text-sm w-full">{errors.birthday}</Text>
        )}
        <View className="w-full mt-5">
      <View
        className={`flex-row items-center rounded-md border ${
          isFocused === "no"
            ? "border-2 border-black"
            : "border border-zinc-300"
        }`}
      >
        <Pressable
          onPress={() => setVisible(true)}
          className="flex-row items-center"
        >
          <CountryPicker
            withFilter
            withFlag
            withCallingCode
            withEmoji
            withModal
            countryCode={countryCode}
            visible={visible}
            onSelect={onSelect}
            onClose={() => setVisible(false)}
          />
          <Text className="text-base text-black">{callingCode}</Text>
        </Pressable>

        <View className="w-[1px] h-6 bg-gray-300 mx-2" />

        <TextInput
          maxLength={10}
          editable={true}
          selectTextOnFocus={false}
          className="flex-1 text-base text-black"
          onFocus={() => setIsFocused("no")}
          onBlur={() => setIsFocused("")}
          placeholder="912 345 6789"
          placeholderTextColor="#9ca3af"
          keyboardType="phone-pad"
          value={mobileNumber}
          onChangeText={setMobileNumber}
        />
      </View>

      {errors?.mobileNumber && (
        <Text className="text-error mt-1 ml-1 text-sm w-full">
          {errors.mobileNumber}
        </Text>
      )}
    </View>
        <TextInput
          editable={false}
          selectTextOnFocus={false}
          className={`rounded-md p-3 mt-5 w-full text-base text-black ${
            isFocused === 'bgry' ? 'border-[2px] border-black' : 'border border-zinc-300'
          }`}
          onFocus={() => setIsFocused('brgy')}
          onBlur={() => setIsFocused('')}
          placeholder="Barangay"
          placeholderTextColor="#9ca3af"
          value={address}
        />
        {errors.address && (
          <Text className="text-error mt-1 ml-1 text-sm w-full">{errors.address}</Text>
        )}
        <View className="flex-row items-center space-x-2 mt-10">
        <Checkbox value={isChecked} onValueChange={setChecked} color={isChecked ? '#155183' : undefined} style={{
          borderColor: '#155183'
        }}/>
        <Text className="text-sm text-black">
          {'  '}I agree to the{' '}
          <Text onPress={() => handlePress()} className="text-primary underline">Terms of Service</Text>
        </Text>
      </View>
      <Pressable
        onPress={() => handleComplete()}
        className={`mt-3 w-full py-3 rounded-lg ${
          isChecked ? 'bg-primary' : 'bg-gray-400'
        }`}
        disabled={!isChecked || isLoading || supabaseLoading}
      >
        {isLoading || supabaseLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text
            className="text-white text-center"
            style={{
              fontFamily: 'PoppinsRegular',
            }}
          >
            Get Started
          </Text>
        )}
      </Pressable>
      </View>
      <View className='mt-20'/>
      </ScrollView>
      <BottomDrawer ref={drawerRef} onChange={(open) => setIsDrawerOpen(open)} type='none'>
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
        
        <ScrollView showsVerticalScrollIndicator={false} className='mx-7 mt-5 mb-10'>
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
          <View className='mt-20'></View>
        </ScrollView>
      </BottomDrawer>
    </View>
  );
};

export default CompleteProfile;