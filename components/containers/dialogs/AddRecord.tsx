import { View, Text, TextInput, Pressable, ActivityIndicator, Animated, PanResponder } from 'react-native'
import React, { useRef, useState } from 'react'
import Dialogs from './Dialog'
import { Dialog } from 'react-native-paper'
import { PlusCircleIcon } from 'lucide-react-native'
import Toast from 'react-native-toast-message'
import { useCreateProductionMutation } from '@/store/productionApi'

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
}: InputProps) => {
  return (
    <View className="mt-4">
      <Text
        className="text-xs text-zinc-600 mb-1"
        style={{ fontFamily: 'PoppinsSemiBold' }}
      >
        {label}
      </Text>

      <TextInput
        className={`rounded-md p-3 text-base text-black ${
          isFocused === field
            ? 'border-[2px] border-black'
            : 'border border-zinc-300'
        }`}
        onFocus={() => setIsFocused(field)}
        onBlur={() => setIsFocused('')}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        value={value}
        keyboardType={keyboardType}
        onChangeText={setValue}
      />

      {errors[field] && (
        <Text style={{ color: "#ef4444" }} className="mt-1 ml-1 text-sm">
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
    <View className="mt-4">
      <Text
        className="text-xs text-zinc-600 mb-1"
        style={{ fontFamily: 'PoppinsSemiBold' }}
      >
        Are you satisfied with your production?
      </Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
        {emojis.map((emoji, index) => {
          const labels = ['Not\nSatisfied', 'Slightly\nSatisfied', 'Neutral', 'Satisfied', 'Very\nSatisfied']
          const active = value === index + 1
          return (
            <View key={index} style={{ flex: 1, alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: active ? 26 : 20,
                  textAlign: 'center',
                  opacity: active ? 1 : 0.35,
                }}
              >
                {emoji}
              </Text>
              <Text
                style={{
                  fontSize: 8,
                  textAlign: 'center',
                  opacity: active ? 1 : 0.35,
                  color: active ? '#155183' : '#71717a',
                  fontFamily: active ? 'PoppinsSemiBold' : 'PoppinsRegular',
                  marginTop: 2,
                }}
              >
                {labels[index]}
              </Text>
            </View>
          )
        })}
      </View>

      <View
        style={{
          height: 8,
          width: TRACK_WIDTH,
          backgroundColor: '#d4d4d8',
          borderRadius: 4,
          alignSelf: 'center',
        }}
      >
        {Array.from({ length: STEPS }).map((_, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: i * STEP_WIDTH - 3,
              top: 1,
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: value > i ? '#155183' : '#a1a1aa',
            }}
          />
        ))}

        <Animated.View
          style={{
            height: 8,
            width: thumbX.interpolate({
              inputRange: [0, TRACK_WIDTH],
              outputRange: [0, TRACK_WIDTH],
              extrapolate: 'clamp',
            }),
            backgroundColor: '#155183',
            borderRadius: 4,
          }}
        />

        <Animated.View
          {...panResponder.panHandlers}
          style={{
            position: 'absolute',
            top: -8,
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: '#155183',
            borderWidth: 3,
            borderColor: '#fff',
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 4,
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

  const [createProduction, { isLoading }] = useCreateProductionMutation()

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validate = () => {
    const newErrors: { [key: string]: string } = {}

    if (!saleTitle.trim()) {
      newErrors.saleTitle = 'Sale title is required.'
    }
    if (!quantitySold.trim()) {
      newErrors.quantitySold = 'Quantity sold is required.'
    }
    if (!totalSales.trim()) {
      newErrors.totalSales = 'Total sales is required.'
    }
    // FIX 6: validate number, not string — no more .trim() on a number
    if (!satisfaction || satisfaction < 1 || satisfaction > 5) {
      newErrors.satisfaction = 'Customer satisfaction is required.'
    }
    if (!salesLocation.trim()) {
      newErrors.salesLocation = 'Sales location is required.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    try {
      const payload = {
        title: saleTitle,
        notes,
        quantity: quantitySold,
        total: totalSales,
        satisfaction: satisfaction,
        landing: salesLocation,
        farm: farmId,
      }

      await createProduction(payload)

      Toast.show({
        type: 'success',
        text1: 'Record created successfully',
      })

      setVisible(false)
      setSaleTitle('')
      setNotes('')
      setQuantitySold('')
      setTotalSales('')
      setSatisfaction(3)
      setSalesLocation('')

    } catch (error: any) {
      const serverErrors: { [key: string]: string } = {}

      try {
        const data = error?.data

        // Non-object errors (string, null, undefined, network errors)
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
          Toast.show({ type: 'error', text1: data?.detail ?? 'Something went wrong. Please try again.' })
          return
        }

        // Map field-level validation errors from the server
        for (const key of Object.keys(data)) {
          const val = data[key]
          if (Array.isArray(val) && val.length > 0) {
            serverErrors[key] = val[0]
          } else if (typeof val === 'string') {
            serverErrors[key] = val
          }
        }

        if (Object.keys(serverErrors).length > 0) {
          setErrors((prev) => ({ ...prev, ...serverErrors }))
        } else {
          Toast.show({ type: 'error', text1: data?.detail ?? 'Something went wrong. Please try again.' })
        }

      } catch {
        Toast.show({ type: 'error', text1: 'Something went wrong. Please try again.' })
      }
    }
  }

  return (
    <Dialogs onVisible={setVisible} visible={visible} title='Add Sales Record'>
      <Dialog.Content>

        <Input
          label="Sale Title"
          value={saleTitle}
          setValue={setSaleTitle}
          placeholder="Enter sale title"
          field="saleTitle"
          isFocused={isFocused}
          setIsFocused={setIsFocused}
          errors={errors}
        />

        <Input
          label="Quantity Sold (kg)"
          value={quantitySold}
          setValue={setQuantitySold}
          placeholder="Enter quantity sold"
          field="quantitySold"
          keyboardType="numeric"
          isFocused={isFocused}
          setIsFocused={setIsFocused}
          errors={errors}
        />

        <Input
          label="Total Sales"
          value={totalSales}
          setValue={setTotalSales}
          placeholder="₱ 10,000.00"
          field="totalSales"
          keyboardType="numeric"
          isFocused={isFocused}
          setIsFocused={setIsFocused}
          errors={errors}
        />

        <Input
          label="Sales Location"
          value={salesLocation}
          setValue={setSalesLocation}
          placeholder="Where was it sold?"
          field="salesLocation"
          isFocused={isFocused}
          setIsFocused={setIsFocused}
          errors={errors}
        />

        <DraggableSatisfaction
          value={satisfaction}
          setValue={setSatisfaction}
        />
        {errors.satisfaction && (
          <Text className="text-red-500 mt-1 ml-1 text-sm">{errors.satisfaction}</Text>
        )}

        <View className="mt-4">
          <Text
            className="text-xs text-zinc-600 mb-1"
            style={{ fontFamily: 'PoppinsSemiBold' }}
          >
            Notes (Optional)
          </Text>

          <TextInput
            className={`rounded-md p-3 text-base text-black ${
              isFocused === 'notes'
                ? 'border-[2px] border-black'
                : 'border border-zinc-300'
            }`}
            style={{ height: 80 }}
            onFocus={() => setIsFocused('notes')}
            onBlur={() => setIsFocused('')}
            placeholder="You can tell here why..."
            placeholderTextColor="#9ca3af"
            value={notes}
            onChangeText={setNotes}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Pressable
            onPress={() => setVisible(false)}
            className='border border-zinc-300 p-2 rounded-lg'
          >
            <Text className='text-zinc-500' style={{ fontFamily: 'PoppinsRegular' }}>
              Cancel
            </Text>
          </Pressable>

          <Pressable
            onPress={handleSubmit}
            style={{
              backgroundColor: '#155183',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <PlusCircleIcon color={'#ffffff'} size={15} />
            )}

            <Text
              className="text-white"
              style={{ fontFamily: 'PoppinsRegular' }}
            >
              Create
            </Text>
          </Pressable>
        </View>

      </Dialog.Content>
    </Dialogs>
  )
}

export default AddRecord