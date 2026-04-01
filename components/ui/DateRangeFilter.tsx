import React, { useRef, useState } from 'react'
import { View, Text, Pressable, FlatList } from 'react-native'
import { Calendar, DateData } from 'react-native-calendars'
import { ChevronDown } from 'lucide-react-native'
import BottomDrawer, { BottomDrawerRef } from '@/components/containers/BottomDrawer'

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
const PRIMARY = '#155183'

const DateRangePicker = ({ visible, onClose, onApply, initialFrom, initialTo }: Props) => {
  const today = new Date()
  const drawerRef = useRef<BottomDrawerRef>(null)

  const [startDate, setStartDate]             = useState<string | null>(initialFrom ?? null)
  const [endDate, setEndDate]                 = useState<string | null>(initialTo ?? null)
  const [currentMonth, setCurrentMonth]       = useState(today.getMonth())
  const [currentYear2, setCurrentYear2]       = useState(today.getFullYear())
  const [showYearPicker, setShowYearPicker]   = useState(false)
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [isAllTime, setIsAllTime]             = useState(!initialFrom && !initialTo)

  const calendarKey     = `${currentYear2}-${currentMonth}`
  const currentMonthStr = `${currentYear2}-${String(currentMonth + 1).padStart(2, '0')}`
  const todayStr        = today.toISOString().split('T')[0]

  // open/close in sync with parent visible prop
  React.useEffect(() => {
    if (visible) drawerRef.current?.open()
    else drawerRef.current?.close()
  }, [visible])

  const buildMarked = () => {
    if (!startDate) return {}
    const marked: Record<string, any> = {
      [startDate]: { startingDay: true, color: PRIMARY, textColor: '#fff' },
    }
    if (endDate && endDate !== startDate) {
      const cur = new Date(startDate)
      cur.setDate(cur.getDate() + 1)
      while (cur < new Date(endDate)) {
        const key = cur.toISOString().split('T')[0]
        marked[key] = { color: '#d0e8f7', textColor: PRIMARY }
        cur.setDate(cur.getDate() + 1)
      }
      marked[endDate] = { endingDay: true, color: PRIMARY, textColor: '#fff' }
    } else if (endDate === startDate) {
      marked[startDate] = { startingDay: true, endingDay: true, color: PRIMARY, textColor: '#fff' }
    }
    return marked
  }

  const handleDayPress = (day: DateData) => {
    setIsAllTime(false)
    const pressed = day.dateString
    if (!startDate || (startDate && endDate)) {
      setStartDate(pressed); setEndDate(null)
    } else {
      if (pressed < startDate) { setEndDate(startDate); setStartDate(pressed) }
      else setEndDate(pressed)
    }
  }

  const handleAllTime = () => { setIsAllTime(true); setStartDate(null); setEndDate(null) }
  const handleClear   = () => { setStartDate(null); setEndDate(null); setIsAllTime(false) }

  const handleApply = () => {
    if (isAllTime) { onApply(null, null); onClose() }
    else if (startDate && endDate) { onApply(startDate, endDate); onClose() }
  }

  const canApply = isAllTime || (!!startDate && !!endDate)

  return (
    <BottomDrawer ref={drawerRef} onChange={open => { if (!open) onClose() }} type="none" snapPoints={['85%']}>
      <View style={{ paddingHorizontal: 20, paddingBottom: 36 }}>

        {/* Title */}
        <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 15, color: '#18181b', marginBottom: 14 }}>
          Filter by Date
        </Text>

        {/* All time toggle */}
        <Pressable
          onPress={handleAllTime}
          style={{
            paddingVertical: 11, paddingHorizontal: 14,
            borderRadius: 12, borderWidth: 1.5,
            borderColor: isAllTime ? PRIMARY : '#e4e4e7',
            backgroundColor: isAllTime ? '#eff6ff' : '#fafafa',
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 13, color: isAllTime ? PRIMARY : '#71717a' }}>
            All time
          </Text>
          {isAllTime && (
            <View style={{ width: 18, height: 18, borderRadius: 99, backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontSize: 11 }}>✓</Text>
            </View>
          )}
        </Pressable>

        {/* From / To display */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
          {['FROM', 'TO'].map((label, i) => {
            const val = i === 0 ? startDate : endDate
            return (
              <View key={label} style={{
                flex: 1, backgroundColor: '#f7f7f7', borderRadius: 12,
                paddingVertical: 10, alignItems: 'center',
                borderWidth: 1, borderColor: '#f0f0f0',
              }}>
                <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 9, color: '#a1a1aa', letterSpacing: 0.6, marginBottom: 3 }}>
                  {label}
                </Text>
                <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 12, color: val ? PRIMARY : '#d4d4d8' }}>
                  {isAllTime ? 'All time' : val
                    ? new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : `Pick ${label === 'FROM' ? 'start' : 'end'}`}
                </Text>
              </View>
            )
          })}
        </View>

        {/* Month / Year row */}
        {!isAllTime && (
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 4 }}>
            <Pressable
              onPress={() => { setShowMonthPicker(p => !p); setShowYearPicker(false) }}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f4f4f5', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 }}
            >
              <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 13, color: '#18181b' }}>{MONTHS[currentMonth]}</Text>
              <ChevronDown size={13} color="#71717a" />
            </Pressable>
            <Pressable
              onPress={() => { setShowYearPicker(p => !p); setShowMonthPicker(false) }}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f4f4f5', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 }}
            >
              <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 13, color: '#18181b' }}>{currentYear2}</Text>
              <ChevronDown size={13} color="#71717a" />
            </Pressable>
          </View>
        )}

        {/* Month dropdown */}
        {showMonthPicker && (
          <View style={{
            backgroundColor: '#fff', borderRadius: 12, borderWidth: 1,
            borderColor: '#e4e4e7', maxHeight: 180,
            shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 8,
            marginBottom: 4,
          }}>
            <FlatList
              data={MONTHS}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item, index }) => (
                <Pressable
                  onPress={() => { setCurrentMonth(index); setShowMonthPicker(false) }}
                  style={{ paddingHorizontal: 14, paddingVertical: 11, backgroundColor: currentMonth === index ? '#eff6ff' : '#fff', borderRadius: 8 }}
                >
                  <Text style={{ fontFamily: currentMonth === index ? 'PoppinsSemiBold' : 'PoppinsRegular', color: currentMonth === index ? PRIMARY : '#18181b', fontSize: 13 }}>
                    {item}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        )}

        {/* Year dropdown */}
        {showYearPicker && (
          <View style={{
            backgroundColor: '#fff', borderRadius: 12, borderWidth: 1,
            borderColor: '#e4e4e7', maxHeight: 180,
            shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 8,
            marginBottom: 4,
          }}>
            <FlatList
              data={YEARS}
              keyExtractor={item => item.toString()}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => { setCurrentYear2(item); setShowYearPicker(false) }}
                  style={{ paddingHorizontal: 14, paddingVertical: 11, backgroundColor: currentYear2 === item ? '#eff6ff' : '#fff', borderRadius: 8 }}
                >
                  <Text style={{ fontFamily: currentYear2 === item ? 'PoppinsSemiBold' : 'PoppinsRegular', color: currentYear2 === item ? PRIMARY : '#18181b', fontSize: 13 }}>
                    {item}
                  </Text>
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
            onMonthChange={month => { setCurrentMonth(month.month - 1); setCurrentYear2(month.year) }}
            renderHeader={() => <View />}
            theme={{
              todayTextColor: PRIMARY,
              arrowColor: PRIMARY,
              selectedDayBackgroundColor: PRIMARY,
              dotColor: PRIMARY,
              textDayFontFamily: 'PoppinsRegular',
              textMonthFontFamily: 'PoppinsSemiBold',
              textDayHeaderFontFamily: 'PoppinsMedium',
              textDayFontSize: 13,
              textMonthFontSize: 14,
              textDayHeaderFontSize: 11,
            }}
          />
        )}

        {/* Footer */}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
          <Pressable
            onPress={handleClear}
            style={{ flex: 1, paddingVertical: 13, borderRadius: 14, borderWidth: 1.5, borderColor: '#e4e4e7', alignItems: 'center' }}
          >
            <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 14, color: '#71717a' }}>Clear</Text>
          </Pressable>
          <Pressable
            onPress={handleApply}
            disabled={!canApply}
            style={{ flex: 2, paddingVertical: 13, borderRadius: 14, alignItems: 'center', backgroundColor: canApply ? PRIMARY : '#f0f0f0' }}
          >
            <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 14, color: canApply ? '#fff' : '#a1a1aa' }}>
              Apply
            </Text>
          </Pressable>
        </View>

      </View>
    </BottomDrawer>
  )
}

export default DateRangePicker