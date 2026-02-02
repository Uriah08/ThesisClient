import { View, Text, ScrollView, Image, Pressable, TextInput } from 'react-native'
import { ChevronLeft, Pencil } from 'lucide-react-native'
import { router } from 'expo-router'
import useAuthRedirect from '@/components/hooks/useAuthRedirect'

const Profile = () => {
  const { user } = useAuthRedirect()

  return (
    <View className='flex-1 bg-white'>
      <ChevronLeft onPress={() => router.push('/settings')} style={{ marginTop: 50, marginLeft: 30 }} color="black" size={32} />

        <Pressable 
          onPress={() => router.push('/settings/edit')}
          android_ripple={{ color: "#ffffff50", borderless: false }} 
          className='gap-2 flex-row items-center absolute right-5 z-10' 
          style={{ 
            backgroundColor: '#155183', 
            paddingVertical: 6, 
            paddingHorizontal: 12, 
            borderRadius: 9999,
            marginTop: 50,
            }}>
              <Pencil size={14} color={'#ffffff'}/>
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 12, color: '#ffffff' }}>Edit Profile</Text>
          </Pressable>
      <Text className='mt-10 mx-7 text-2xl' style={{
        fontFamily: 'PoppinsSemiBold',
      }}> Your
      <Text className='text-primary'> profile.</Text></Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mx-7 flex-1 items-center">
          <View className="border-[3px] border-primary mt-10 rounded-full p-1 relative">
            <Image
              source={
                user?.profile_picture
                  ? { uri: user?.profile_picture }
                  : 
                  require('@/assets/images/default-profile.png')
              }
              style={{ width: 80, height: 80, borderRadius: 999 }}
              resizeMode="cover"
            />
          </View>
            
          <Text className='mt-14 text-sm text-start w-full' style={{
            fontFamily: 'PoppinsMedium'
          }}>Username</Text>
          <TextInput
            className={`rounded-md p-3 mt-1 w-full text-base text-black border border-zinc-300`}
            placeholder="Username"
            placeholderTextColor="#9ca3af"
            value={user?.username || ''}
            editable={false}
            selectTextOnFocus={false}
          />

          <Text className='mt-5 text-sm text-start w-full' style={{
            fontFamily: 'PoppinsMedium'
          }}>Email</Text>
          <TextInput
            className={`rounded-md p-3 mt-1 w-full text-base text-black border border-zinc-300`}
            placeholder="Username"
            placeholderTextColor="#9ca3af"
            value={user?.email || ''}
            editable={false}
            selectTextOnFocus={false}
          />

          <Text className='mt-5 text-sm text-start w-full' style={{
            fontFamily: 'PoppinsMedium'
          }}>First Name</Text>
          <TextInput
            className={`rounded-md p-3 mt-1 w-full text-base text-black border border-zinc-300`}
            placeholder="Username"
            placeholderTextColor="#9ca3af"
            value={user?.first_name || ''}
            editable={false}
            selectTextOnFocus={false}
          />

          <Text className='mt-5 text-sm text-start w-full' style={{
            fontFamily: 'PoppinsMedium'
          }}>Last Name</Text>
          <TextInput
            className={`rounded-md p-3 mt-1 w-full text-base text-black border border-zinc-300`}
            placeholder="Username"
            placeholderTextColor="#9ca3af"
            value={user?.last_name || ''}
            editable={false}
            selectTextOnFocus={false}
          />

          <Text className='mt-5 text-sm text-start w-full' style={{
            fontFamily: 'PoppinsMedium'
          }}>Mobile Number</Text>
          <TextInput
            className={`rounded-md p-3 mt-1 w-full text-base text-black border border-zinc-300`}
            placeholder="Username"
            placeholderTextColor="#9ca3af"
            value={user?.mobile_number || ''}
            editable={false}
            selectTextOnFocus={false}
          />
          
        </View>
      </ScrollView>
    </View>
  )
}

export default Profile