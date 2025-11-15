import { View, Text, Pressable, TextInput, ActivityIndicator, Platform } from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { Calendar, Clock } from 'lucide-react-native';
import { useCreateAnnouncementMutation } from '@/store/farmApi';
import Toast from 'react-native-toast-message';
import { useLocalSearchParams } from 'expo-router';

const Edit = () => {
  const { id } = useLocalSearchParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [expiresAt, setExpiresAt] = useState<Date | null>(dayjs().add(1, 'day').toDate());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isFocused, setIsFocused] = useState('');
  const [createAnnouncement, { isLoading }] = useCreateAnnouncementMutation();

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) newErrors.title = 'Title is required.';
    if (!content.trim()) newErrors.content = 'Content is required.';
    if (!expiresAt) newErrors.expiresAt = 'Expiration date is required.';
    else if (expiresAt < new Date()) newErrors.expiresAt = 'Expiration cannot be in the past.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;
    try {
      await createAnnouncement({ farm: Number(id), title, content, expires_at: expiresAt?.toISOString() }).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Announcement Created Successfully!',
      });
      setContent('');
      setTitle('');
    } catch (error: any) {
      console.log(error);
                  
      if (error?.data?.detail) {
        Toast.show({
          type: 'error',
          text1: error.data.detail,
        });
      }
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === 'set' && selectedDate) {
      setExpiresAt(prev => {
        const current = prev || new Date();
        return new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          current.getHours(),
          current.getMinutes()
        );
      });
    }
    setShowDatePicker(false);
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (event.type === 'set' && selectedTime) {
      setExpiresAt(prev => {
        const current = prev || new Date();
        return new Date(
          current.getFullYear(),
          current.getMonth(),
          current.getDate(),
          selectedTime.getHours(),
          selectedTime.getMinutes()
        );
      });
    }
    setShowTimePicker(false);
  };

  return (
    <View className="flex-1 bg-white">

      <View className="flex-row gap-5 items-center mt-10 p-5">
        <Text
          className="text-3xl"
          style={{ fontFamily: 'PoppinsBold' }}
        >
          Create
        </Text>
      </View>

      <View className="mx-6">

        <Text className="mt-5 text-sm" style={{ fontFamily: 'PoppinsMedium' }}>
          Title
        </Text>
        <TextInput
          className={`rounded-md p-3 text-base text-black ${
            isFocused === 'title'
              ? 'border-[2px] border-black'
              : 'border border-zinc-300'
          }`}
          onFocus={() => setIsFocused('title')}
          onBlur={() => setIsFocused('')}
          placeholder="Announcement Title"
          placeholderTextColor="#9ca3af"
          value={title}
          onChangeText={setTitle}
        />
        {errors.title && <Text className="text-error mt-1 ml-1 text-sm">{errors.title}</Text>}

        <Text className="mt-5 text-sm" style={{ fontFamily: 'PoppinsMedium' }}>
          Content
        </Text>
        <TextInput
          style={{ height: 100 }}
          className={`rounded-md mt-1 p-3 text-base text-black ${
            errors.content
              ? 'border-[2px] border-error/50'
              : isFocused === 'content'
              ? 'border-[2px] border-black'
              : 'border border-zinc-300'
          }`}
          onFocus={() => setIsFocused('content')}
          onBlur={() => setIsFocused('')}
          placeholder="Announcement Content"
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={content}
          onChangeText={setContent}
        />
        {errors.content && <Text className="text-error mt-1 ml-1 text-sm">{errors.content}</Text>}

        <Text className="mt-5 text-sm" style={{ fontFamily: 'PoppinsMedium' }}>
          Set Expiration
        </Text>
        <Pressable
          onPress={() => setShowDatePicker(true)}
          className="flex-row items-center justify-between border border-zinc-300 rounded-md p-3 mt-2"
        >
          <Text className="text-black">
            {expiresAt ? dayjs(expiresAt).format('YYYY-MM-DD') : 'Select Date'}
          </Text>
          <Calendar color="#000" size={20} />
        </Pressable>
        <Pressable
          onPress={() => setShowTimePicker(true)}
          className="flex-row items-center justify-between border border-zinc-300 rounded-md p-3 mt-2"
        >
          <Text className="text-black">
            {expiresAt ? dayjs(expiresAt).format('HH:mm') : 'Select Time'}
          </Text>
          <Clock color="#000" size={20} />
        </Pressable>

        {errors.expiresAt && (
          <Text className="text-error mt-1 ml-1 text-sm">{errors.expiresAt}</Text>
        )}

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

        <Pressable
          onPress={handleCreate}
          disabled={isLoading}
          className="mt-14 w-full bg-primary py-3 rounded-lg"
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              className="text-white text-center"
              style={{
                fontFamily: 'PoppinsRegular',
              }}
            >
              Create Announcement
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default Edit;
