import { View, Text, ScrollView, ActivityIndicator, Pressable, TextInput, PanResponder } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useGetProductionQuery, useUpdateProductionMutation } from '@/store/productionApi'
import { ChevronLeft, MapPin, Package, Calendar, Pencil, Trash2, Check, X, PhilippinePeso } from 'lucide-react-native'
import Toast from 'react-native-toast-message'
import DeleteClass from '@/components/containers/dialogs/Delete'

const EMOJIS = ['😞', '😐', '🙂', '😊', '😁']
const LABELS = ['Not Satisfied', 'Slightly Satisfied', 'Neutral', 'Satisfied', 'Very Satisfied']
const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e']
const PRIMARY = '#155183'
const TRACK_WIDTH = 280
const STEPS = 5
const STEP_WIDTH = TRACK_WIDTH / (STEPS - 1)

// ── Read-only ────────────────────────────────────────────────────────────────
const SatisfactionDisplay = ({ value }: { value: number }) => {
  const thumbX = (value - 1) * STEP_WIDTH
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        {EMOJIS.map((emoji, i) => {
          const active = value === i + 1
          return (
            <View key={i} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: active ? 26 : 18, opacity: active ? 1 : 0.25 }}>{emoji}</Text>
              <Text style={{
                fontSize: 7.5, textAlign: 'center', opacity: active ? 1 : 0,
                color: COLORS[i], fontFamily: 'PoppinsSemiBold', letterSpacing: 0.2,
              }}>{LABELS[i]}</Text>
            </View>
          )
        })}
      </View>
      <View style={{ height: 4, width: TRACK_WIDTH, backgroundColor: '#f0f0f0', borderRadius: 4, alignSelf: 'center' }}>
        <View style={{ height: 4, width: thumbX, backgroundColor: COLORS[value - 1], borderRadius: 4 }} />
        {Array.from({ length: STEPS }).map((_, i) => (
          <View key={i} style={{
            position: 'absolute', left: i * STEP_WIDTH - 3, top: -1,
            width: 6, height: 6, borderRadius: 3,
            backgroundColor: value > i ? COLORS[value - 1] : '#d4d4d8',
          }} />
        ))}
        <View style={{
          position: 'absolute', top: -10,
          width: 22, height: 22, borderRadius: 11,
          backgroundColor: COLORS[value - 1],
          borderWidth: 3, borderColor: '#fff',
          shadowColor: COLORS[value - 1], shadowOpacity: 0.4, shadowRadius: 6, elevation: 4,
          transform: [{ translateX: thumbX - 11 }],
        }} />
      </View>
    </View>
  )
}

// ── Interactive (edit mode) ──────────────────────────────────────────────────
const SatisfactionSlider = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => {
  const thumbX = (value - 1) * STEP_WIDTH
  const startX = useRef(0)
  const startVal = useRef(value)

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (_, gs) => {
        startX.current = gs.x0
        startVal.current = value
      },
      onPanResponderMove: (_, gs) => {
        const newX = (startVal.current - 1) * STEP_WIDTH + gs.dx
        const clamped = Math.max(0, Math.min(TRACK_WIDTH, newX))
        const step = Math.round(clamped / STEP_WIDTH) + 1
        if (step !== value) onChange(step)
      },
    })
  ).current

  return (
    <View>
      {/* Emoji row — tappable */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        {EMOJIS.map((emoji, i) => {
          const active = value === i + 1
          return (
            <Pressable key={i} onPress={() => onChange(i + 1)} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: active ? 30 : 20, opacity: active ? 1 : 0.3 }}>{emoji}</Text>
              <Text style={{
                fontSize: 7.5, textAlign: 'center', opacity: active ? 1 : 0,
                color: COLORS[i], fontFamily: 'PoppinsSemiBold', letterSpacing: 0.2,
              }}>{LABELS[i]}</Text>
            </Pressable>
          )
        })}
      </View>

      {/* Track + draggable thumb */}
      <View
        style={{ height: 44, width: TRACK_WIDTH, alignSelf: 'center', justifyContent: 'center' }}
        {...panResponder.panHandlers}
      >
        {/* Track bg */}
        <View style={{ height: 4, backgroundColor: '#f0f0f0', borderRadius: 4 }}>
          <View style={{ height: 4, width: thumbX, backgroundColor: COLORS[value - 1], borderRadius: 4 }} />
          {Array.from({ length: STEPS }).map((_, i) => (
            <View key={i} style={{
              position: 'absolute', left: i * STEP_WIDTH - 3, top: -1,
              width: 6, height: 6, borderRadius: 3,
              backgroundColor: value > i ? COLORS[value - 1] : '#d4d4d8',
            }} />
          ))}
        </View>

        {/* Thumb */}
        <View style={{
          position: 'absolute',
          width: 26, height: 26, borderRadius: 13,
          backgroundColor: COLORS[value - 1],
          borderWidth: 3, borderColor: '#fff',
          shadowColor: COLORS[value - 1], shadowOpacity: 0.45, shadowRadius: 8, elevation: 5,
          transform: [{ translateX: thumbX - 2 }],
        }} />
      </View>
    </View>
  )
}

const EditField = ({ label, value, onChange, multiline = false, keyboardType = 'default' }: {
  label: string; value: string; onChange: (v: string) => void
  multiline?: boolean; keyboardType?: any
}) => (
  <View style={{ marginBottom: 18 }}>
    <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 10, color: '#a1a1aa', marginBottom: 7, letterSpacing: 0.8 }}>
      {label.toUpperCase()}
    </Text>
    <TextInput
      value={value}
      onChangeText={onChange}
      multiline={multiline}
      keyboardType={keyboardType}
      textAlignVertical={multiline ? 'top' : 'center'}
      style={{
        borderWidth: 1, borderColor: '#ebebeb', borderRadius: 10,
        paddingHorizontal: 14, paddingVertical: 11,
        fontFamily: 'PoppinsRegular', fontSize: 14, color: '#18181b',
        backgroundColor: '#fafafa', height: multiline ? 88 : undefined,
      }}
    />
  </View>
)

const Row = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      {icon}
      <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#a1a1aa' }}>{label}</Text>
    </View>
    <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 13, color: '#18181b' }}>{value}</Text>
  </View>
)

const Production = () => {
  const { id } = useLocalSearchParams()
  const router = useRouter()

  const { data: production, isLoading: isFetching } = useGetProductionQuery(Number(id))
  const [updateProduction, { isLoading: isUpdating }] = useUpdateProductionMutation()
  const [active, setActive] = useState(false)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ title: '', notes: '', quantity: '', total: '', landing: '', satisfaction: 3 })

  useEffect(() => {
    if (production) {
      setForm({
        title: production.title ?? '',
        notes: production.notes ?? '',
        quantity: String(production.quantity ?? ''),
        total: String(production.total ?? ''),
        landing: production.landing ?? '',
        satisfaction: production.satisfaction ?? 3,
      })
    }
  }, [production])

  const handleUpdate = async () => {
    try {
      await updateProduction({ productionId: Number(id), ...form, quantity: Number(form.quantity) }).unwrap()
      Toast.show({ type: 'success', text1: 'Record updated' })
      setEditing(false)
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to update. Please try again.' })
    }
  }

  const cancelEdit = () => {
    setEditing(false)
    if (production) setForm({
      title: production.title ?? '',
      notes: production.notes ?? '',
      quantity: String(production.quantity ?? ''),
      total: String(production.total ?? ''),
      landing: production.landing ?? '',
      satisfaction: production.satisfaction ?? 3,
    })
  }

  if (isFetching) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator color={PRIMARY} size="large" />
    </View>
  )

  if (!production) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 36, marginBottom: 8 }}>📦</Text>
      <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 15, color: '#3f3f46' }}>Record not found</Text>
    </View>
  )

  const date = new Date(production.created_at).toLocaleDateString('en-PH', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
  const satIndex = (production.satisfaction ?? 3) - 1
  const satColor = COLORS[satIndex]

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <DeleteClass visible={active} setVisible={setActive} type='production' productionId={Number(id)} />

      {/* ── Nav ── */}
      <View style={{
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 56, paddingBottom: 14, paddingHorizontal: 20, backgroundColor: '#fff',
      }}>
        <Pressable onPress={() => router.back()} style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: '#f5f5f5' }}>
          <ChevronLeft color="#18181b" size={18} />
        </Pressable>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {editing ? (
            <>
              <Pressable onPress={cancelEdit} style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: '#f5f5f5' }}>
                <X size={16} color="#71717a" />
              </Pressable>
              <Pressable onPress={handleUpdate} disabled={isUpdating} style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: PRIMARY }}>
                {isUpdating ? <ActivityIndicator size={14} color="#fff" /> : <Check size={16} color="#fff" />}
              </Pressable>
            </>
          ) : (
            <>
              <Pressable onPress={() => setActive(true)} style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: '#fef2f2' }}>
                <Trash2 size={16} color="#ef4444" />
              </Pressable>
              <Pressable onPress={() => setEditing(true)} style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: '#f5f5f5' }}>
                <Pencil size={15} color="#3f3f46" />
              </Pressable>
            </>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 60 }}>

        {/* ── Header ── */}
        <View style={{ paddingVertical: 24, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#c4c4c8' }}>#{production.id}</Text>
            <View style={{ width: 3, height: 3, borderRadius: 2, backgroundColor: '#e4e4e7' }} />
            <Calendar size={11} color="#c4c4c8" />
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#c4c4c8' }}>{date}</Text>
          </View>
          <Text style={{ fontFamily: 'PoppinsBold', fontSize: 24, color: '#18181b', lineHeight: 32, marginBottom: 14 }}>
            {production.title}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: satColor + '12' }}>
            <Text style={{ fontSize: 15 }}>{EMOJIS[satIndex]}</Text>
            <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 12, color: satColor }}>{LABELS[satIndex]}</Text>
          </View>
        </View>

        {/* ── Edit / View ── */}
        <View style={{ paddingTop: 20 }}>
          {editing ? (
            <View>
              <EditField label="Title" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} />
              <EditField label="Quantity (kg)" value={form.quantity} onChange={v => setForm(f => ({ ...f, quantity: v }))} keyboardType="numeric" />
              <EditField label="Landing Site" value={form.landing} onChange={v => setForm(f => ({ ...f, landing: v }))} />
              <EditField label="Total Sales" value={form.total} onChange={v => setForm(f => ({ ...f, total: v }))} />
              <EditField label="Notes" value={form.notes} onChange={v => setForm(f => ({ ...f, notes: v }))} multiline />

              {/* Satisfaction editor */}
              <View style={{ marginBottom: 18 }}>
                <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 10, color: '#a1a1aa', marginBottom: 16, letterSpacing: 0.8 }}>
                  SATISFACTION
                </Text>
                <SatisfactionSlider
                  value={form.satisfaction}
                  onChange={v => setForm(f => ({ ...f, satisfaction: v }))}
                />
              </View>
            </View>
          ) : (
            <View>
              <Row icon={<Package size={14} color="#c4c4c8" />} label="Quantity" value={`${production.quantity} kg`} />
              {production.landing && (
                <Row icon={<MapPin size={14} color="#c4c4c8" />} label="Landing Site" value={production.landing} />
              )}
              {production.total && (
                <Row icon={<PhilippinePeso size={14} color="#c4c4c8" />} label="Total Sale" value={`₱${Number(production.total).toLocaleString('en-PH')}`} />
              )}
              {production.notes && (
                <View style={{ paddingTop: 22 }}>
                  <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 10, color: '#c4c4c8', letterSpacing: 0.8, marginBottom: 10 }}>NOTES</Text>
                  <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 14, color: '#52525b', lineHeight: 24 }}>{production.notes}</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* ── Satisfaction (view mode only) ── */}
        {!editing && (
          <View style={{ marginTop: 32, paddingTop: 24, borderTopWidth: 1, borderTopColor: '#f5f5f5' }}>
            <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 10, color: '#c4c4c8', letterSpacing: 0.8, marginBottom: 20 }}>SATISFACTION</Text>
            <SatisfactionDisplay value={production.satisfaction ?? 3} />
          </View>
        )}

      </ScrollView>
    </View>
  )
}

export default Production