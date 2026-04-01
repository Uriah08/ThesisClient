import { View, Text, TextInput, Pressable, ActivityIndicator, Animated, PanResponder } from 'react-native'
import React, { useRef, useState } from 'react'
import Dialogs from './Dialog'
import { Dialog } from 'react-native-paper'
import { PlusCircleIcon } from 'lucide-react-native'
import Toast from 'react-native-toast-message'
import { useCreateProductionMutation } from '@/store/productionApi'

const PRIMARY = '#155183'

type DialogsProps = {
  setVisible: (visible: boolean) => void
  visible: boolean
  farmId: number
}

type InputProps = {
  label: string
  value: string
  setValue: (text: string) => void
  placeholder: string
  field: string
  keyboardType?: any
  isFocused: string
  setIsFocused: (field: string) => void
  errors: { [key: string]: string }
  optional?: boolean
  multiline?: boolean
}

const Input = ({
  label,
  value,
  setValue,
  placeholder,
  field,
  keyboardType = 'default',
  isFocused,
  setIsFocused,
  errors,
  optional = false,
  multiline = false,
}: InputProps) => {
  const hasError = !!errors[field]
  const focused = isFocused === field

  return (
    <View style={{ gap: 5 }}>
      <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11.5, color: '#71717a', fontWeight: '500' }}>
        {label}
        {optional
          ? <Text style={{ color: '#a1a1aa', fontSize: 11, fontWeight: '400' }}> (optional)</Text>
          : <Text style={{ color: '#ef4444' }}> *</Text>
        }
      </Text>
      <TextInput
        style={{
          borderWidth: focused ? 1 : 0.5,
          borderColor: hasError ? '#ef4444' : focused ? PRIMARY : '#e4e4e7',
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 9,
          fontSize: 13.5,
          color: '#18181b',
          backgroundColor: focused ? '#f4f8fc' : '#fafafa',
          fontFamily: 'PoppinsRegular',
          ...(multiline ? { minHeight: 76, textAlignVertical: 'top' } : {}),
        }}
        onFocus={() => setIsFocused(field)}
        onBlur={() => setIsFocused('')}
        placeholder={placeholder}
        placeholderTextColor="#c4c4c8"
        value={value}
        keyboardType={keyboardType}
        onChangeText={(t) => setValue(t)}
        multiline={multiline}
      />
      {hasError && (
        <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#ef4444', marginLeft: 1 }}>
          {errors[field]}
        </Text>
      )}
    </View>
  )
}

const DraggableSatisfaction = ({
  value,
  setValue,
}: {
  value: number
  setValue: (val: number) => void
}) => {
  const emojis = ['😞', '😐', '🙂', '😊', '😁']
  const labels = ['Not\nSatisfied', 'Slightly\nSatisfied', 'Neutral', 'Satisfied', 'Very\nSatisfied']
  const TRACK_WIDTH = 250
  const STEPS = emojis.length
  const STEP_WIDTH = TRACK_WIDTH / (STEPS - 1)

  const valueRef = useRef(value)
  React.useEffect(() => { valueRef.current = value }, [value])
  const thumbX = useRef(new Animated.Value((value - 1) * STEP_WIDTH)).current
  const dragStartX = useRef(0)

  const clamp = (x: number, min: number, max: number) => Math.min(Math.max(x, min), max)
  const snapValue = (x: number) => Math.round(clamp(x, 0, TRACK_WIDTH) / STEP_WIDTH) + 1

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        dragStartX.current = (valueRef.current - 1) * STEP_WIDTH
      },
      onPanResponderMove: (_, gesture) => {
        const rawX = clamp(dragStartX.current + gesture.dx, 0, TRACK_WIDTH)
        thumbX.setValue(rawX)
        setValue(snapValue(rawX))
      },
      onPanResponderRelease: (_, gesture) => {
        const rawX = clamp(dragStartX.current + gesture.dx, 0, TRACK_WIDTH)
        const snapped = snapValue(rawX)
        setValue(snapped)
        Animated.spring(thumbX, {
          toValue: (snapped - 1) * STEP_WIDTH,
          useNativeDriver: false,
          bounciness: 6,
        }).start()
      },
    })
  ).current

  return (
    <View style={{ gap: 5 }}>
      <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11.5, color: '#71717a', fontWeight: '500' }}>
        Satisfaction <Text style={{ color: '#ef4444' }}>*</Text>
      </Text>

      {/* Emoji row */}
      <View style={{
        backgroundColor: '#f4f8fc',
        borderWidth: 0.5,
        borderColor: '#e4e4e7',
        borderRadius: 10,
        padding: 12,
        gap: 12,
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {emojis.map((emoji, index) => {
            const active = value === index + 1
            return (
              <View key={index} style={{ flex: 1, alignItems: 'center', gap: 3 }}>
                <Text style={{ fontSize: active ? 26 : 20, opacity: active ? 1 : 0.3 }}>
                  {emoji}
                </Text>
                <Text style={{
                  fontSize: 8,
                  textAlign: 'center',
                  opacity: active ? 1 : 0.35,
                  color: active ? PRIMARY : '#71717a',
                  fontFamily: active ? 'PoppinsSemiBold' : 'PoppinsRegular',
                  lineHeight: 11,
                }}>
                  {labels[index]}
                </Text>
              </View>
            )
          })}
        </View>

        {/* Track */}
        <View style={{
          height: 6,
          width: TRACK_WIDTH,
          backgroundColor: '#e4e4e7',
          borderRadius: 3,
          alignSelf: 'center',
        }}>
          {/* Step dots */}
          {Array.from({ length: STEPS }).map((_, i) => (
            <View key={i} style={{
              position: 'absolute',
              left: i * STEP_WIDTH - 3,
              top: 0,
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: value > i ? PRIMARY : '#d4d4d8',
            }} />
          ))}

          {/* Fill */}
          <Animated.View style={{
            height: 6,
            width: thumbX.interpolate({
              inputRange: [0, TRACK_WIDTH],
              outputRange: [0, TRACK_WIDTH],
              extrapolate: 'clamp',
            }),
            backgroundColor: PRIMARY,
            borderRadius: 3,
          }} />

          {/* Thumb */}
          <Animated.View
            {...panResponder.panHandlers}
            style={{
              position: 'absolute',
              top: -9,
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: PRIMARY,
              borderWidth: 3,
              borderColor: '#fff',
              elevation: 4,
              shadowColor: '#000',
              shadowOpacity: 0.15,
              shadowRadius: 4,
              transform: [{
                translateX: thumbX.interpolate({
                  inputRange: [0, TRACK_WIDTH],
                  outputRange: [-12, TRACK_WIDTH - 12],
                  extrapolate: 'clamp',
                }),
              }],
            }}
          />
        </View>
      </View>
    </View>
  )
}

const AddRecord = ({ setVisible, visible, farmId }: DialogsProps) => {
  const [isFocused, setIsFocused] = useState('')
  const [saleTitle, setSaleTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [quantitySold, setQuantitySold] = useState('')
  const [totalSales, setTotalSales] = useState('')
  const [satisfaction, setSatisfaction] = useState<number>(3)
  const [salesLocation, setSalesLocation] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const [createProduction, { isLoading }] = useCreateProductionMutation()

  const validate = () => {
    const newErrors: { [key: string]: string } = {}
    if (!saleTitle.trim())      newErrors.saleTitle      = 'Sale title is required.'
    if (!quantitySold.trim())   newErrors.quantitySold   = 'Quantity sold is required.'
    if (!totalSales.trim())     newErrors.totalSales     = 'Total sales is required.'
    if (!salesLocation.trim())  newErrors.salesLocation  = 'Sales location is required.'
    if (!satisfaction || satisfaction < 1 || satisfaction > 5)
      newErrors.satisfaction = 'Satisfaction rating is required.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    try {
      await createProduction({
        title: saleTitle,
        notes,
        quantity: quantitySold,
        total: totalSales,
        satisfaction,
        landing: salesLocation,
        farm: farmId,
      })
      Toast.show({ type: 'success', text1: 'Record created successfully.' })
      setVisible(false)
      setSaleTitle(''); setNotes(''); setQuantitySold('')
      setTotalSales(''); setSatisfaction(3); setSalesLocation('')
    } catch (error: any) {
      try {
        const data = error?.data
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
          Toast.show({ type: 'error', text1: data?.detail ?? 'Something went wrong.' })
          return
        }
        const serverErrors: { [key: string]: string } = {}
        for (const key of Object.keys(data)) {
          const val = data[key]
          if (Array.isArray(val) && val.length > 0) serverErrors[key] = val[0]
          else if (typeof val === 'string') serverErrors[key] = val
        }
        if (Object.keys(serverErrors).length > 0) {
          setErrors((prev) => ({ ...prev, ...serverErrors }))
        } else {
          Toast.show({ type: 'error', text1: data?.detail ?? 'Something went wrong.' })
        }
      } catch {
        Toast.show({ type: 'error', text1: 'Something went wrong. Please try again.' })
      }
    }
  }

  const sharedInputProps = { isFocused, setIsFocused, errors }

  return (
    <Dialogs onVisible={setVisible} visible={visible} title="Add Sales Record" subtitle="New record">
      <Dialog.Content style={{ paddingHorizontal: 20, paddingBottom: 20, gap: 14, marginTop: 10 }}>

        <Input
          label="Sale Title" value={saleTitle} setValue={setSaleTitle}
          placeholder="Enter sale title" field="saleTitle"
          {...sharedInputProps}
        />

        <Input
          label="Quantity Sold (kg)" value={quantitySold} setValue={setQuantitySold}
          placeholder="e.g. 50" field="quantitySold" keyboardType="numeric"
          {...sharedInputProps}
        />

        <Input
          label="Total Sales" value={totalSales} setValue={setTotalSales}
          placeholder="₱ 10,000.00" field="totalSales" keyboardType="numeric"
          {...sharedInputProps}
        />

        <Input
          label="Sales Location" value={salesLocation} setValue={setSalesLocation}
          placeholder="Where was it sold?" field="salesLocation"
          {...sharedInputProps}
        />

        <DraggableSatisfaction value={satisfaction} setValue={setSatisfaction} />
        {errors.satisfaction && (
          <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#ef4444', marginLeft: 1, marginTop: -8 }}>
            {errors.satisfaction}
          </Text>
        )}

        <Input
          label="Notes" value={notes} setValue={setNotes}
          placeholder="Anything worth noting…" field="notes"
          optional multiline
          {...sharedInputProps}
        />

        {/* Footer */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <Pressable
            onPress={() => setVisible(false)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 8,
              borderWidth: 0.5,
              borderColor: '#d4d4d8',
              backgroundColor:'#fafafa',
            }}
          >
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#71717a' }}>Cancel</Text>
          </Pressable>

          <Pressable
            onPress={handleSubmit}
            disabled={isLoading}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 8,
              backgroundColor: PRIMARY,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              opacity: isLoading ? 0.75 : 1,
            }}
          >
            {isLoading
              ? <ActivityIndicator color="#fff" size={14} />
              : <PlusCircleIcon color="#fff" size={14} />
            }
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#fff' }}>Add Record</Text>
          </Pressable>
        </View>

      </Dialog.Content>
    </Dialogs>
  )
}

export default AddRecord