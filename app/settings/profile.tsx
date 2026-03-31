import { View, Text, ScrollView, Image, Pressable } from 'react-native'
import { ChevronLeft, Pencil, UserIcon } from 'lucide-react-native'
import { router } from 'expo-router'
import useAuthRedirect from '@/components/hooks/useAuthRedirect'

// ─── read-only field ───────────────────────────────────────────────────────────
type FieldProps = { label: string; value?: string }
const Field = ({ label, value }: FieldProps) => (
  <View style={{ paddingVertical: 13, borderBottomWidth: 0.5, borderBottomColor: '#f4f4f5' }}>
    <Text style={{
      fontSize: 11, fontFamily: 'PoppinsMedium',
      color: '#a1a1aa', letterSpacing: 0.4, marginBottom: 3,
    }}>
      {label}
    </Text>
    <Text style={{
      fontSize: 13, fontFamily: 'PoppinsRegular',
      color: value ? '#18181b' : '#d4d4d8',
    }}>
      {value || '—'}
    </Text>
  </View>
)

// ─── main screen ───────────────────────────────────────────────────────────────
const Profile = () => {
  const { user } = useAuthRedirect()

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>

      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 56, paddingHorizontal: 24, paddingBottom: 8,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
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
            Profile
          </Text>
        </View>

        {/* Edit button */}
        <Pressable
          onPress={() => router.push('/settings/edit')}
          android_ripple={{ color: '#ffffff30', borderless: false }}
          style={{
            flexDirection: 'row', alignItems: 'center', gap: 6,
            backgroundColor: '#155183',
            paddingVertical: 7, paddingHorizontal: 14,
            borderRadius: 999,
          }}>
          <Pencil size={12} color="#ffffff" />
          <Text style={{ fontSize: 12, fontFamily: 'PoppinsMedium', color: '#ffffff' }}>
            Edit
          </Text>
        </Pressable>
      </View>

      {/* subtitle chip */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 8,
        paddingHorizontal: 24, paddingVertical: 12,
      }}>
        <View style={{
          width: 28, height: 28, borderRadius: 8,
          backgroundColor: '#E6F1FB',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <UserIcon size={13} color="#185FA5" />
        </View>
        <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>
          Your account information
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 60 }}
      >

        {/* Avatar card */}
        <View style={{
          alignItems: 'center', gap: 10, padding: 24,
          backgroundColor: '#fafafa', borderRadius: 16,
          borderWidth: 0.5, borderColor: '#f4f4f5',
          marginBottom: 16,
        }}>
          <View style={{
            padding: 3, borderRadius: 999,
            borderWidth: 2, borderColor: '#155183',
          }}>
            <Image
              source={
                user?.profile_picture
                  ? { uri: user.profile_picture }
                  : require('@/assets/images/default-profile.png')
              }
              style={{ width: 72, height: 72, borderRadius: 999 }}
              resizeMode="cover"
            />
          </View>
          <View style={{ alignItems: 'center', gap: 2 }}>
            <Text style={{ fontSize: 14, fontFamily: 'PoppinsSemiBold', color: '#18181b' }}>
              {user?.first_name && user?.last_name
                ? `${user.first_name} ${user.last_name}`
                : user?.username || '—'}
            </Text>
            <Text style={{ fontSize: 12, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>
              {user?.email || '—'}
            </Text>
          </View>
        </View>

        {/* Fields card */}
        <View style={{
          backgroundColor: '#fafafa', borderRadius: 16,
          borderWidth: 0.5, borderColor: '#f4f4f5',
          paddingHorizontal: 14, paddingTop: 4, paddingBottom: 4,
        }}>
          <Text style={{
            fontSize: 11, fontFamily: 'PoppinsMedium',
            color: '#a1a1aa', letterSpacing: 0.8,
            textTransform: 'uppercase',
            paddingTop: 12, paddingBottom: 2,
          }}>
            Account Details
          </Text>
          <Field label="Username"      value={user?.username} />
          <Field label="Email"         value={user?.email} />
          <Field label="First Name"    value={user?.first_name} />
          <Field label="Last Name"     value={user?.last_name} />
          <Field label="Mobile Number" value={user?.mobile_number} />
        </View>

      </ScrollView>
    </View>
  )
}

export default Profile