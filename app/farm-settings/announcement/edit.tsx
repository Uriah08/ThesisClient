import { View, Text, Pressable, TextInput, ActivityIndicator, Platform, ScrollView } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import dayjs from 'dayjs'
import { Calendar, Clock, MegaphoneIcon, ChevronLeft } from 'lucide-react-native'
import { useCreateAnnouncementMutation } from '@/store/farmApi'
import Toast from 'react-native-toast-message'
import { router, useLocalSearchParams } from 'expo-router'

// ─── field wrapper ─────────────────────────────────────────────────────────────
const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <View style={{ marginTop: 16 }}>
    <Text style={{
      fontSize: 11, fontFamily: 'PoppinsMedium',
      color: '#a1a1aa', letterSpacing: 0.4, marginBottom: 6,
    }}>
      {label}
    </Text>
    {children}
    {error && (
      <Text style={{
        fontSize: 11, fontFamily: 'PoppinsRegular',
        color: '#ef4444', marginTop: 4, marginLeft: 2,
      }}>
        {error}
      </Text>
    )}
  </View>
)

// ─── main screen ───────────────────────────────────────────────────────────────
const CreateAnnouncement = () => {
  const { id } = useLocalSearchParams()
  const [title, setTitle]       = useState('')
  const [content, setContent]   = useState('')
  const [expiresAt, setExpiresAt] = useState<Date | null>(dayjs().add(1, 'day').toDate())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [errors, setErrors]     = useState<{ [key: string]: string }>({})
  const [isFocused, setIsFocused] = useState('')
  const [createAnnouncement, { isLoading }] = useCreateAnnouncementMutation()

  const inputStyle = (key: string) => ({
    borderRadius: 10,
    borderWidth: errors[key] ? 1.5 : isFocused === key ? 1.5 : 0.5,
    borderColor: errors[key] ? '#ef444480' : isFocused === key ? '#155183' : '#e4e4e7',
    backgroundColor: '#fafafa',
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 13, fontFamily: 'PoppinsRegular',
    color: '#18181b',
  })

  const validate = () => {
    const e: { [key: string]: string } = {}
    if (!title.trim())   e.title   = 'Title is required.'
    if (!content.trim()) e.content = 'Content is required.'
    if (!expiresAt)      e.expiresAt = 'Expiration date is required.'
    else if (expiresAt < new Date()) e.expiresAt = 'Expiration cannot be in the past.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleCreate = async () => {
    if (!validate()) return
    try {
      await createAnnouncement({
        farm: Number(id), title, content,
        expires_at: expiresAt?.toISOString(),
      }).unwrap()
      Toast.show({ type: 'success', text1: 'Announcement Created Successfully!' })
      setTitle(''); setContent('')
    } catch (error: any) {
      if (error?.data?.detail)
        Toast.show({ type: 'error', text1: error.data.detail })
    }
  }

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === 'set' && selectedDate) {
      setExpiresAt(prev => {
        const cur = prev || new Date()
        return new Date(
          selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(),
          cur.getHours(), cur.getMinutes()
        )
      })
    }
    setShowDatePicker(false)
  }

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (event.type === 'set' && selectedTime) {
      setExpiresAt(prev => {
        const cur = prev || new Date()
        return new Date(
          cur.getFullYear(), cur.getMonth(), cur.getDate(),
          selectedTime.getHours(), selectedTime.getMinutes()
        )
      })
    }
    setShowTimePicker(false)
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>

      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 12,
        paddingTop: 56, paddingHorizontal: 24, paddingBottom: 8,
      }}>
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 36, height: 36, borderRadius: 18,
            backgroundColor: '#f4f4f5',
            alignItems: 'center', justifyContent: 'center',
          }}>
          <ChevronLeft size={18} color="#18181b" />
        </Pressable>
        <Text style={{ fontSize: 17, fontFamily: 'PoppinsSemiBold', color: '#18181b' }}>
          Create Announcement
        </Text>
      </View>

      {/* Subtitle chip */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 8,
        paddingHorizontal: 24, paddingVertical: 12,
      }}>
        <View style={{
          width: 28, height: 28, borderRadius: 8,
          backgroundColor: '#FAEEDA',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <MegaphoneIcon size={13} color="#854F0B" />
        </View>
        <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>
          Notify your farm members
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >

        {/* Title */}
        <Field label="Title" error={errors.title}>
          <TextInput
            style={inputStyle('title')}
            placeholder="Announcement title"
            placeholderTextColor="#d4d4d8"
            value={title}
            onChangeText={setTitle}
            onFocus={() => setIsFocused('title')}
            onBlur={() => setIsFocused('')}
          />
        </Field>

        {/* Content */}
        <Field label="Content" error={errors.content}>
          <TextInput
            style={[inputStyle('content'), { height: 110, textAlignVertical: 'top' }]}
            placeholder="Write your announcement…"
            placeholderTextColor="#d4d4d8"
            value={content}
            onChangeText={setContent}
            onFocus={() => setIsFocused('content')}
            onBlur={() => setIsFocused('')}
            multiline
            numberOfLines={4}
          />
        </Field>

        {/* Expiration */}
        <Field label="Set Expiration" error={errors.expiresAt}>
          <View style={{ flexDirection: 'row', gap: 10 }}>

            {/* Date picker */}
            <Pressable
              onPress={() => setShowDatePicker(true)}
              style={{
                flex: 1, flexDirection: 'row', alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 10, borderWidth: 0.5, borderColor: '#e4e4e7',
                backgroundColor: '#fafafa', paddingHorizontal: 14, paddingVertical: 12,
              }}>
              <Text style={{ fontSize: 13, fontFamily: 'PoppinsRegular', color: '#18181b' }}>
                {expiresAt ? dayjs(expiresAt).format('MMM D, YYYY') : 'Date'}
              </Text>
              <Calendar size={14} color="#a1a1aa" />
            </Pressable>

            {/* Time picker */}
            <Pressable
              onPress={() => setShowTimePicker(true)}
              style={{
                flex: 1, flexDirection: 'row', alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 10, borderWidth: 0.5, borderColor: '#e4e4e7',
                backgroundColor: '#fafafa', paddingHorizontal: 14, paddingVertical: 12,
              }}>
              <Text style={{ fontSize: 13, fontFamily: 'PoppinsRegular', color: '#18181b' }}>
                {expiresAt ? dayjs(expiresAt).format('HH:mm') : 'Time'}
              </Text>
              <Clock size={14} color="#a1a1aa" />
            </Pressable>

          </View>
        </Field>

        {showDatePicker && (
          <DateTimePicker
            value={expiresAt || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            minimumDate={new Date()}
            onChange={handleDateChange}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={expiresAt || new Date()}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
          />
        )}

        {/* Submit */}
        <Pressable
          onPress={handleCreate}
          disabled={isLoading}
          android_ripple={{ color: '#ffffff20', borderless: false }}
          style={{
            marginTop: 28, backgroundColor: isLoading ? '#7bafd4' : '#155183',
            paddingVertical: 13, borderRadius: 12,
            alignItems: 'center', justifyContent: 'center',
          }}>
          {isLoading
            ? <ActivityIndicator color="#ffffff" />
            : <Text style={{ fontSize: 13, fontFamily: 'PoppinsMedium', color: '#ffffff' }}>
                Create Announcement
              </Text>
          }
        </Pressable>

      </ScrollView>
    </View>
  )
}

export default CreateAnnouncement