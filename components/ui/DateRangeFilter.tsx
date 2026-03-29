import React, { useState } from 'react'
import { View, Text, Modal, Pressable, ScrollView, FlatList } from 'react-native'
import { Calendar, DateData } from 'react-native-calendars'
import { X, ChevronDown } from 'lucide-react-native'

interface Props {
  visible: boolean
  onClose: () => void
  onApply: (from: string | null, to: string | null) => void
  initialFrom?: string | null
  initialTo?: string | null
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i)

const DateRangePicker = ({ visible, onClose, onApply, initialFrom, initialTo }: Props) => {
  const today = new Date()
  const [startDate, setStartDate] = useState<string | null>(initialFrom ?? null)
  const [endDate, setEndDate] = useState<string | null>(initialTo ?? null)
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear2, setCurrentYear2] = useState(today.getFullYear())
  const [showYearPicker, setShowYearPicker] = useState(false)
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [isAllTime, setIsAllTime] = useState(!initialFrom && !initialTo)

  const calendarKey = `${currentYear2}-${currentMonth}`
  const currentMonthStr = `${currentYear2}-${String(currentMonth + 1).padStart(2, '0')}`
  const todayStr = today.toISOString().split('T')[0]

  const buildMarked = () => {
    if (!startDate) return {}
    const marked: Record<string, any> = {
      [startDate]: { startingDay: true, color: '#155183', textColor: '#fff' },
    }
    if (endDate && endDate !== startDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const current = new Date(start)
      current.setDate(current.getDate() + 1)
      while (current < end) {
        const key = current.toISOString().split('T')[0]
        marked[key] = { color: '#d0e8f7', textColor: '#155183' }
        current.setDate(current.getDate() + 1)
      }
      marked[endDate] = { endingDay: true, color: '#155183', textColor: '#fff' }
    } else if (endDate === startDate) {
      marked[startDate] = { startingDay: true, endingDay: true, color: '#155183', textColor: '#fff' }
    }
    return marked
  }

  const handleDayPress = (day: DateData) => {
    setIsAllTime(false)
    const pressed = day.dateString
    if (!startDate || (startDate && endDate)) {
      setStartDate(pressed)
      setEndDate(null)
    } else {
      if (pressed < startDate) {
        setEndDate(startDate)
        setStartDate(pressed)
      } else {
        setEndDate(pressed)
      }
    }
  }

  const handleAllTime = () => {
    setIsAllTime(true)
    setStartDate(null)
    setEndDate(null)
  }

  const handleApply = () => {
    if (isAllTime) {
      onApply(null, null)
      onClose()
    } else if (startDate && endDate) {
      onApply(startDate, endDate)
      onClose()
    }
  }

  const handleClear = () => {
    setStartDate(null)
    setEndDate(null)
    setIsAllTime(false)
  }

  const canApply = isAllTime || (!!startDate && !!endDate)

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 30 }}
        >
          {/* Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: '#f4f4f5' }}>
            <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 16, color: '#18181b' }}>Select Date Range</Text>
            <Pressable onPress={onClose}>
              <X size={20} color="#71717a" />
            </Pressable>
          </View>

          {/* All time toggle */}
          <Pressable
            onPress={handleAllTime}
            style={{
              marginHorizontal: 18, marginTop: 12,
              paddingVertical: 10, paddingHorizontal: 14,
              borderRadius: 10, borderWidth: 1.5,
              borderColor: isAllTime ? '#155183' : '#e4e4e7',
              backgroundColor: isAllTime ? '#eff6ff' : 'white',
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
            }}
          >
            <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 13, color: isAllTime ? '#155183' : '#71717a' }}>All time</Text>
            {isAllTime && (
              <View style={{ width: 16, height: 16, borderRadius: 99, backgroundColor: '#155183', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 10 }}>✓</Text>
              </View>
            )}
          </Pressable>

          {/* Selected range display */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 18 }}>
            <View style={{ flex: 1, backgroundColor: '#f4f4f5', borderRadius: 10, padding: 10, alignItems: 'center' }}>
              <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 10, color: '#a1a1aa', marginBottom: 2 }}>FROM</Text>
              <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 13, color: startDate ? '#155183' : '#d4d4d8' }}>
                {isAllTime ? 'All time' : startDate
                  ? new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'Pick start'}
              </Text>
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={{ color: '#d4d4d8', fontSize: 18 }}>→</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: '#f4f4f5', borderRadius: 10, padding: 10, alignItems: 'center' }}>
              <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 10, color: '#a1a1aa', marginBottom: 2 }}>TO</Text>
              <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 13, color: endDate ? '#155183' : '#d4d4d8' }}>
                {isAllTime ? 'All time' : endDate
                  ? new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'Pick end'}
              </Text>
            </View>
          </View>

          {/* Month / Year selector row */}
          {!isAllTime && (
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, paddingHorizontal: 18, marginBottom: 4 }}>
              {/* Month picker */}
              <Pressable
                onPress={() => { setShowMonthPicker(prev => !prev); setShowYearPicker(false) }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f4f4f5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}
              >
                <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 13, color: '#18181b' }}>{MONTHS[currentMonth]}</Text>
                <ChevronDown size={14} color="#71717a" />
              </Pressable>

              {/* Year picker */}
              <Pressable
                onPress={() => { setShowYearPicker(prev => !prev); setShowMonthPicker(false) }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f4f4f5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}
              >
                <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 13, color: '#18181b' }}>{currentYear2}</Text>
                <ChevronDown size={14} color="#71717a" />
              </Pressable>
            </View>
          )}

          {/* Month dropdown */}
          {showMonthPicker && (
            <View style={{ marginHorizontal: 18, backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: '#e4e4e7', maxHeight: 180, zIndex: 99, position: 'absolute', top: 230, left: 18, right: 18 }}>
              <FlatList
                data={MONTHS}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item, index }) => (
                  <Pressable
                    onPress={() => { setCurrentMonth(index); setShowMonthPicker(false) }}
                    style={{ padding: 12, backgroundColor: currentMonth === index ? '#eff6ff' : 'white', borderRadius: 8 }}
                  >
                    <Text style={{ fontFamily: currentMonth === index ? 'PoppinsSemiBold' : 'PoppinsRegular', color: currentMonth === index ? '#155183' : '#18181b', fontSize: 13 }}>{item}</Text>
                  </Pressable>
                )}
              />
            </View>
          )}

          {/* Year dropdown */}
          {showYearPicker && (
            <View style={{ marginHorizontal: 18, backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: '#e4e4e7', maxHeight: 180, zIndex: 99, position: 'absolute', top: 230, left: 18, right: 18 }}>
              <FlatList
                data={YEARS}
                keyExtractor={(item) => item.toString()}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => { setCurrentYear2(item); setShowYearPicker(false) }}
                    style={{ padding: 12, backgroundColor: currentYear2 === item ? '#eff6ff' : 'white', borderRadius: 8 }}
                  >
                    <Text style={{ fontFamily: currentYear2 === item ? 'PoppinsSemiBold' : 'PoppinsRegular', color: currentYear2 === item ? '#155183' : '#18181b', fontSize: 13 }}>{item}</Text>
                  </Pressable>
                )}
              />
            </View>
          )}

          {/* Calendar */}
          {!isAllTime && (
            <Calendar
              key={calendarKey}
              current={`${currentMonthStr}-01`}
              markingType="period"
              markedDates={buildMarked()}
              onDayPress={handleDayPress}
              maxDate={todayStr}
              hideArrows={false}
              onMonthChange={(month) => {
                setCurrentMonth(month.month - 1)
                setCurrentYear2(month.year)
              }}
              renderHeader={() => <View />}  // hide default header since we have our own
              theme={{
                todayTextColor: '#155183',
                arrowColor: '#155183',
                selectedDayBackgroundColor: '#155183',
                dotColor: '#155183',
                textDayFontFamily: 'PoppinsRegular',
                textMonthFontFamily: 'PoppinsSemiBold',
                textDayHeaderFontFamily: 'PoppinsMedium',
                textDayFontSize: 13,
                textMonthFontSize: 14,
                textDayHeaderFontSize: 11,
              }}
            />
          )}

          {/* Footer buttons */}
          <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 18, paddingTop: 12 }}>
            <Pressable
              onPress={handleClear}
              style={{ flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#d4d4d8', alignItems: 'center' }}
            >
              <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 14, color: '#71717a' }}>Clear</Text>
            </Pressable>
            <Pressable
              onPress={handleApply}
              disabled={!canApply}
              style={{ flex: 2, paddingVertical: 12, borderRadius: 12, alignItems: 'center', backgroundColor: canApply ? '#155183' : '#e4e4e7' }}
            >
              <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 14, color: canApply ? '#fff' : '#a1a1aa' }}>Apply</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

export default DateRangePicker