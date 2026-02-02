import { View, Text, ScrollView, Image, Pressable, TextInput, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ChevronLeft, Pencil } from 'lucide-react-native'
import { router } from 'expo-router'
import useAuthRedirect from '@/components/hooks/useAuthRedirect'
import * as ImagePicker from 'expo-image-picker';
import CountryPicker, { Country, CountryCode } from "react-native-country-picker-modal";
import Toast from 'react-native-toast-message'
import { useUpdateProfileMutation } from '@/store/userApi'
import { replaceImageInSupabase } from '@/utils/lib/supabase'
import AsyncStorage from '@react-native-async-storage/async-storage'

const EditProfile = () => {
  const { user } = useAuthRedirect()
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [supabaseLoading, setSupabaseLoading] = useState(false)
  const [isFocused, setIsFocused] = useState('')

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
        setUsername(user.username || '');
        setEmail(user.email || '');
        setMobileNumber(user.mobile_number ? user.mobile_number.replace(/^\+\d{1,3}/, '') : '');
    }
    }, [user]);

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [mobileNumber, setMobileNumber] = useState(user?.mobile_number ? user.mobile_number.replace(/^\+\d{1,3}/, '') : '');

  const [countryCode, setCountryCode] = useState<CountryCode>("PH");
  const [callingCode, setCallingCode] = useState("+63");
  const [visible, setVisible] = useState(false);

  const handleSubmit = async () => {
      if (!validate()) return
      let imageURL = ''
      try {
        if (image) {
        const uploadedUrl = await replaceImageInSupabase(
            image,
            'profile',
            user?.profile_picture || undefined,
            setSupabaseLoading
        );
        if (uploadedUrl) imageURL = uploadedUrl;
        }
        const response = await updateProfile({
            username,
            email,
            mobile_number: callingCode + mobileNumber,
            ...(imageURL && { profile_picture: imageURL }),
        }).unwrap()

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
  
        Toast.show({
          type: 'success',
          text1: 'Profile Updated Successfully!',
        });
  
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
      }
    };

  const validate = async () => {
    const newErrors: { [key: string]: string } = {};
    const emailValidator = await fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=a270cfe23edc4084a9665add430b88c9&email=${email}`)
    const validatedEmail = await emailValidator.json();

    if (!username.trim()) {
      newErrors.username = 'Username is required.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (validatedEmail.deliverability !== 'DELIVERABLE') {
      newErrors.email = 'Email is not deliverable.';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Enter a valid email.';
    }

    if(!mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required.';
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

  const onSelect = (country: Country) => {
    setCountryCode(country.cca2);
    setCallingCode("+" + country.callingCode[0]);
    setVisible(false);
  };

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


  return (
    <View className='flex-1 bg-white'>
      <ChevronLeft onPress={() => router.back()} style={{ marginTop: 50, marginLeft: 30 }} color="black" size={32} />
      <Text className='mt-10 mx-7 text-2xl' style={{
        fontFamily: 'PoppinsSemiBold',
      }}> Edit your
      <Text className='text-primary'> profile.</Text></Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mx-7 flex-1 items-center">
          <View className="border-[3px] border-primary mt-10 rounded-full p-1 relative">
            <Image
              source={
                image
                  ? { uri: image } :
                  user?.profile_picture ? 
                { uri: user.profile_picture }
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

          <TextInput
            className={`rounded-md p-3 mt-10 w-full text-base text-black ${
              isFocused === 'username' ? 'border-[2px] border-black' : 'border border-zinc-300'
            }`}
            onFocus={() => setIsFocused('username')}
            onBlur={() => setIsFocused('')}
            placeholder="Username"
            placeholderTextColor="#9ca3af"
            value={username}
            onChangeText={setUsername}
          />
          {errors.username && (
            <Text className="text-error mt-1 ml-1 text-sm w-full">{errors.username}</Text>
          )}

          <TextInput
            className={`rounded-md p-3 mt-5 w-full text-base text-black ${
              isFocused === 'email' ? 'border-[2px] border-black' : 'border border-zinc-300'
            }`}
            onFocus={() => setIsFocused('email')}
            onBlur={() => setIsFocused('')}
            placeholder="Email"
            textContentType='emailAddress'
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
          />
          {errors.email && (
            <Text className="text-error mt-1 ml-1 text-sm w-full">{errors.email}</Text>
          )}

        <View
          className={`flex-row items-center mt-5 rounded-md border ${
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
        <Pressable
            onPress={() => handleSubmit()}
            className='mt-14 w-full bg-primary py-3 rounded-lg'
            disabled={isLoading || supabaseLoading}
        >
            {isLoading || supabaseLoading ? (
            <ActivityIndicator color={'#ffffff'}/>
            ) : (
            <Text 
                className='text-white text-center'
                style={{
                fontFamily: 'PoppinsRegular',
                }}
            >Update Profile</Text>
            )}    
        </Pressable>
        </View>

      </ScrollView>
    </View>
  )
}

export default EditProfile