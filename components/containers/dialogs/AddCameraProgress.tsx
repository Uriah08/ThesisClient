import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import Dialogs from './Dialog'
import { Dialog } from 'react-native-paper'
import { useCreateTrayProgressMutation } from '@/store/trayApi';
import { uploadImageToSupabase } from '@/utils/lib/supabase';
import Toast from 'react-native-toast-message';
import { Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import * as FileSystem from 'expo-file-system';

type DialogsProps = {
  setVisible: (visible: boolean) => void;
  visible: boolean;
  trayId: number
  image: string | undefined
  defaultDescription?: string
  rejects?: number
  detected?: number
  activetrayId: number
};

const AddCameraProgress = ({ setVisible, visible, trayId, image, defaultDescription, rejects, detected, activetrayId }: DialogsProps) => {
    const [isFocused, setIsFocused] = useState('');
    const [title, setTitle] = useState('Tray Status')
    const [description, setDescription] = useState(defaultDescription || '')
    const [supabaseLoading, setSupabaseLoading] = useState(false)

    const [createTrayProgress, { isLoading }] = useCreateTrayProgressMutation()

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (defaultDescription) {
            setDescription(defaultDescription);
        }
        }, [defaultDescription]);


    const handleSubmit = async () => {
  if (!validate()) return;
  let imageURL = '';

  try {
    if (image) {
      setSupabaseLoading(true);
      let localPath = image;

      const date = new Date();
      const timestamp = `${date.getFullYear()}${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}${date
        .getDate()
        .toString()
        .padStart(2, '0')}_${date
        .getHours()
        .toString()
        .padStart(2, '0')}${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}${date
        .getSeconds()
        .toString()
        .padStart(2, '0')}`;

      if (image.startsWith('http')) {
        const fileUri = `${FileSystem.cacheDirectory}_${timestamp}temp_image.jpg`;
        const downloaded = await FileSystem.downloadAsync(image, fileUri);
        localPath = downloaded.uri;
      }

      const uploadedUrl = await uploadImageToSupabase(
        localPath,
        'tray',
        setSupabaseLoading
      );

      if (uploadedUrl) imageURL = uploadedUrl;
      setSupabaseLoading(false);
    }

    await createTrayProgress({
      title,
      description,
      image: imageURL,
      tray: activetrayId,
      rejects,
      detected
    }).unwrap();

    setVisible(false);
    setIsFocused('');
    
    router.push({
      pathname: '/tray/[id]/timeline',
      params: { id: trayId.toString() },
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

    
    const validate = () => {
            const newErrors: { [key: string]: string } = {};
    
            if (!title.trim()) {
              newErrors.title = 'Progress title is required.';
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
    
  return (
    <Dialogs onVisible={setVisible} visible={visible} title="Add Progress">
        <Dialog.Content>
            <View>
                <TextInput
                    className={`rounded-md p-3 text-base text-black ${ 
                    isFocused === 'title' ? 'border-[2px] border-black' : 'border border-zinc-300'
                    }`}
                    onFocus={() => setIsFocused('title')}
                    onBlur={() => setIsFocused('')}
                    placeholder="Progress Title"
                    placeholderTextColor="#9ca3af"
                    value={title}
                    onChangeText={setTitle}
                />
                {errors.name && (
                    <Text className="text-error mt-1 ml-1 text-sm">{errors.title}</Text>
                )}
                <TextInput
                    className={`rounded-md mt-5 p-3 text-base text-black ${ 
                    isFocused === 'description' ? 'border-[2px] border-black' : 'border border-zinc-300'
                    }`}
                    onFocus={() => setIsFocused('description')}
                    onBlur={() => setIsFocused('')}
                    placeholder="Decription"
                    placeholderTextColor="#9ca3af"
                    value={description}
                    onChangeText={setDescription}
                    multiline={true}
                    numberOfLines={5}
                    textAlignVertical="top" 
                />
                <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginTop: 20,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: 10,
                }}
                >
                    <Pressable onPress={() => setVisible(false)} className='border border-zinc-300 p-2 rounded-lg'
                    style={{
                        borderWidth: 1,
                        borderColor: '#d4d4d8',
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 8,
                    }}>
                    <Text className='text-zinc-500' style={{
                    fontFamily: 'PoppinsRegular'
                    }}>Cancel</Text>
                    </Pressable>
                    <Pressable onPress={() => handleSubmit()}
                    style={{
                        backgroundColor: '#155183',
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 8,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                    }}
                    disabled={isLoading || supabaseLoading}
                    >
                    {isLoading || supabaseLoading ? (
                        <ActivityIndicator size={15} color={'#ffffff'}/>
                    ) : (
                        <Plus color={'#ffffff'} size={15}/>
                    )}
                    <Text
                        className="text-white"
                        style={{
                            fontFamily: 'PoppinsRegular',
                        }}
                        >
                        Add
                        </Text>
                    </Pressable>
                </View>
            </View>
        </Dialog.Content>
    </Dialogs>
  )
}

export default AddCameraProgress