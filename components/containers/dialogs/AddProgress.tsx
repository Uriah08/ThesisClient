import { View, Text, Pressable, TextInput, Image } from 'react-native'
import React, { useState} from 'react'
import Dialogs from './Dialog'
import { ActivityIndicator, Dialog } from 'react-native-paper'
import { AlertCircle, CheckCircle, ImagePlusIcon, Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageToSupabase } from '@/utils/lib/supabase';
import { useCreateTrayProgressMutation, useHarvestTrayMutation } from '@/store/trayApi';

type DialogsProps = {
  setVisible: (visible: boolean) => void;
  visible: boolean;
  setFocus: (focus: string) => void;
  focus: string;
  trayId: number
};

const AddProgress = ({ setVisible, visible, setFocus, focus, trayId}: DialogsProps) => {
    const [isFocused, setIsFocused] = useState('');
    const [title, setTitle] = useState('Checking Progress')
    const [description, setDescription] = useState('')

    const [image, setImage] = useState<string | null>(null);
    const [supabaseLoading, setSupabaseLoading] = useState(false)

    const [createTrayProgress, { isLoading }] = useCreateTrayProgressMutation()
    const [harvestTray, { isLoading: harvestLoading }] = useHarvestTrayMutation();

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleSubmit = async () => {
            if (!validate()) return;
            let imageURL = ''
            try {
                if (image) {
                    const uploadedUrl = await uploadImageToSupabase(image, 'tray', setSupabaseLoading);
                    if (uploadedUrl) imageURL = uploadedUrl;
                }

                await createTrayProgress({ title, description, image: imageURL, tray: trayId }).unwrap()
                setVisible(false)
                setIsFocused('')
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
    
        const handleHarvest = async () => {
            try {
                await harvestTray(trayId).unwrap()
                Toast.show({
                    type: 'success',
                    text1: 'Tray Harvested Successfully',
                });
                setVisible(false);
                setIsFocused('')
            } catch (error: any) {
                console.log(error);
                                  
                if (error?.data?.detail) {
                Toast.show({
                    type: 'error',
                    text1: error.data.detail,
                });
                } 
            }
        }
    
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
    <Dialogs onVisible={setVisible} visible={visible} title={'Add Progress'}>
        <Dialog.Content>
            {focus === 'custom' ? (
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
                    />
                    <Pressable onPress={pickImage}>
                        <View className='w-full mt-5 flex items-center justify-center'
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
                            }}>INSERT IMAGE</Text>
                            </>
                            )}
                        </View>
                        </Pressable>
                        {errors.image && (
                            <Text className="text-error mt-1 ml-1 text-sm">{errors.image}</Text>
                        )}
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
                            Create
                            </Text>
                        </Pressable>
                    </View>
                </View>
            ) : focus === 'harvest' ? (
                <View>
                    <View className='flex-row gap-3 justify-center items-center bg-zinc-200 p-2 rounded-full' style={{ marginBottom: 15 }}>
                        <AlertCircle color={'#155183'}/>
                        <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 12 }}>This process cannot be undone.</Text>
                    </View>
                    <Text style={{ fontFamily: 'PoppinsRegular' }}>Are you sure you want to harvest this tray?</Text>
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
                        <Pressable
                        onPress={handleHarvest}
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
                        disabled={isLoading}
                        >
                            {harvestLoading ? (
                                <ActivityIndicator size={15} color={'#ffffff'}/>
                            ) : (
                                <CheckCircle color={'#ffffff'} size={15} />
                            )}
                        <Text
                            className="text-white"
                            style={{
                                fontFamily: 'PoppinsRegular',
                            }}
                            >
                            Harvest
                            </Text>
                        </Pressable>
                    </View>
                </View>
            ) : (
                <View className='flex gap-3 '>
                <View
                    style={{ overflow: "hidden", borderRadius: 8 }}
                >
                    <Pressable
                    onPress={() => setFocus('custom')}
                    android_ripple={{ color: "#ffffff50", borderless: false }}
                    className={`flex flex-row items-center gap-3 px-5 bg-primary rounded-lg justify-center`}
                    style={{ paddingVertical: 10 }}
                    >
                    <Text
                        className="text-white"
                        style={{ fontFamily: "PoppinsSemiBold" }}
                    >
                        Add Custom Progress
                    </Text>
                    </Pressable>
                </View>
                <View
                    style={{ overflow: "hidden", borderRadius: 8 }}
                >
                    <Pressable
                    onPress={() => {setVisible(false); router.push({ pathname: '/trays/[id]/scan', params: { id: trayId.toString() }});}}
                    android_ripple={{ color: "#ffffff50", borderless: false }}
                    className={`flex flex-row items-center gap-3 px-5 bg-primary rounded-lg justify-center`}
                    style={{ paddingVertical: 10 }}
                    >
                    <Text
                        className="text-white"
                        style={{ fontFamily: "PoppinsSemiBold" }}
                    >
                        Camera
                    </Text>
                    </Pressable>
                </View>
                <View
                    style={{ overflow: "hidden", borderRadius: 8 }}
                >
                    <Pressable
                    onPress={() => setFocus('harvest')}
                    android_ripple={{ color: "#ffffff50", borderless: false }}
                    className={`flex flex-row items-center gap-3 px-5 bg-primary rounded-lg justify-center`}
                    style={{ paddingVertical: 10 }}
                    >
                    <Text
                        className="text-white"
                        style={{ fontFamily: "PoppinsSemiBold" }}
                    >
                        Harvest
                    </Text>
                    </Pressable>
                </View>
            </View>
            )}
        </Dialog.Content>
    </Dialogs>
  )
}

export default AddProgress