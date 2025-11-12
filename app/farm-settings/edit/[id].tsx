import { View, Text, ActivityIndicator, TextInput, Image, Pressable } from 'react-native'
import React, { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { useEditFarmMutation, useGetFarmQuery } from '@/store/farmApi';
import { ChevronLeft, ImagePlusIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { replaceImageInSupabase } from '@/utils/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditFarm = () => {
  const { id } = useLocalSearchParams();
  const { data, isLoading } = useGetFarmQuery(Number(id));

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isFocused, setIsFocused] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [supabaseLoading, setSupabaseLoading] = useState(false)
  const [editFarm, { isLoading : isLoadingEdit}] = useEditFarmMutation();

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
    }
  const handleSubmit = async () => {
    if (!validate()) return; 
    let imageURL = ''
    console.log(name, description, image, id);
    try {
      if (image) {
        const uploadedUrl = await replaceImageInSupabase(
          image,
          'farm',
          data?.image_url || undefined,
          setSupabaseLoading
        );
        if (uploadedUrl) imageURL = uploadedUrl;
      }

      const updatedFarm = await editFarm({
        id: data?.id,
        name,
        description,
        ...(imageURL && { image_url: imageURL }),
      }).unwrap();

      await AsyncStorage.setItem('farm', JSON.stringify({ farm: updatedFarm.farm }));

      setName('');
      setDescription('');
      setImage('');

       Toast.show({
        type: 'success',
        text1: 'Farm updated successfully!',
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
  }

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Farm name is required.';
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

  if (isLoading) return (
      <View className='flex-1 items-center justify-center bg-white'>
        <ActivityIndicator size={30} color="#155183" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
      </View>
    );
  
  return (
    <View className='flex-1 bg-white'>
      <ChevronLeft onPress={() => router.back()} style={{ marginTop: 50, marginLeft: 30 }} color="black" size={32} />
        <Text className='mt-10 mx-7 text-2xl' style={{
          fontFamily: 'PoppinsSemiBold',
        }}> Change your
      <Text className='text-primary'> farm</Text> details.</Text>
      <View className='mx-7'>
        <Text className='mt-14 text-sm' style={{
          fontFamily: 'PoppinsMedium'
        }}>Farm Name</Text>
        <TextInput
          className={`rounded-md mt-1 p-3 text-base text-black ${ errors.name ? 'border-[2px] border-error/50':
            isFocused === 'name' ? 'border-[2px] border-black' : 'border border-zinc-300'
          }`}
          onFocus={() => setIsFocused('name')}
          onBlur={() => setIsFocused('')}
          placeholder={data?.name}
          placeholderTextColor="#9ca3af"
          value={name}
          onChangeText={setName}
        />
        {errors.name && (
          <Text className="text-error mt-1 ml-1 text-sm">{errors.name}</Text>
        )}
        <Text className='mt-5 text-sm' style={{
          fontFamily: 'PoppinsMedium'
        }}>Farm Description</Text>
        <TextInput
          style={{ height: 70 }}
          className={`rounded-md mt-1 p-3 text-base text-black ${ errors.description ? 'border-[2px] border-error/50':
            isFocused === 'description' ? 'border-[2px] border-black' : 'border border-zinc-300'
          }`}
          onFocus={() => setIsFocused('description')}
          onBlur={() => setIsFocused('')}
          placeholder={data?.description || 'Description'}
          placeholderTextColor="#9ca3af"
          secureTextEntry={true}
          multiline={true}
          numberOfLines={3}
          textAlignVertical="top" 
          value={description}
          onChangeText={setDescription}
        />
        {errors.description && (
          <Text className="text-error mt-1 ml-1 text-sm">{errors.description}</Text>
        )}
        <Text className='mt-5 text-sm' style={{
          fontFamily: 'PoppinsMedium'
        }}>Farm Image</Text>
        <Pressable onPress={pickImage}>
          <View className='w-full mt-1 flex items-center justify-center'
          style={{
            borderStyle: 'dashed',
            borderWidth: 2,
            borderColor: '#d4d4d8',
            borderRadius: 8,
          }}>
            {image ? (
              <Image 
              source={{ uri: image}}
              style={{ width: '100%', height: 100 }}
              resizeMode="cover"/>
            ) : (
              <>
              <ImagePlusIcon color={'#d4d4d8'} style={{ marginTop: 30}}/>
              <Text style={{
                fontFamily: 'PoppinsBold',
                color: '#d4d4d8',
                marginBottom: 30
              }}>INSERT FARM COVER IMAGE</Text>
              </>
            )}
          </View>
        </Pressable>
        {errors.image && (
          <Text className="text-error mt-1 ml-1 text-sm">{errors.image}</Text>
        )}
        <Pressable
          disabled={isLoadingEdit || supabaseLoading}
          onPress={() => handleSubmit()}
          className='mt-10 w-full bg-primary py-3 rounded-lg'
        >
          {isLoadingEdit || supabaseLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text 
            className='text-white text-center'
            style={{
              fontFamily: 'PoppinsRegular',
            }}
          >Change Farm</Text>  
          )}
        </Pressable>
      </View>
    </View>
  )
}

export default EditFarm