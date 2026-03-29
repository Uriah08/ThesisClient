import { View, Text, ScrollView, ActivityIndicator, Pressable, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useGetProductionQuery, useUpdateProductionMutation } from '@/store/productionApi'
import { ChevronLeft, MapPin, Package, Calendar, Pencil, Trash2, Check, X, PhilippinePeso } from 'lucide-react-native'
import Toast from 'react-native-toast-message'
import DeleteClass from '@/components/containers/dialogs/Delete'

const EMOJIS = ['😞', '😐', '🙂', '😊', '😁']
const LABELS = ['Not Satisfied', 'Slightly Satisfied', 'Neutral', 'Satisfied', 'Very Satisfied']
const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e']

// ── Read-only satisfaction display ─────────────────────────────────────────
const SatisfactionDisplay = ({ value }: { value: number }) => {
  const TRACK_WIDTH = 280
  const STEPS = 5
  const STEP_WIDTH = TRACK_WIDTH / (STEPS - 1)
  const thumbX = (value - 1) * STEP_WIDTH

  return (
    <View style={{ marginTop: 4 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }}>
        {EMOJIS.map((emoji, i) => {
          const active = value === i + 1
          return (
            <View key={i} style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: active ? 28 : 20, opacity: active ? 1 : 0.3 }}>{emoji}</Text>
              <Text style={{
                fontSize: 8, textAlign: 'center', marginTop: 3,
                opacity: active ? 1 : 0.3,
                color: active ? COLORS[i] : '#71717a',
                fontFamily: active ? 'PoppinsSemiBold' : 'PoppinsRegular',
              }}>
                {LABELS[i]}
              </Text>
            </View>
          )
        })}
      </View>
      <View style={{ height: 8, width: TRACK_WIDTH, backgroundColor: '#e4e4e7', borderRadius: 4, alignSelf: 'center' }}>
        <View style={{ height: 8, width: thumbX, backgroundColor: COLORS[value - 1], borderRadius: 4 }} />
        {Array.from({ length: STEPS }).map((_, i) => (
          <View key={i} style={{
            position: 'absolute', left: i * STEP_WIDTH - 3, top: 1,
            width: 6, height: 6, borderRadius: 3,
            backgroundColor: value > i ? COLORS[value - 1] : '#a1a1aa',
          }} />
        ))}
        <View style={{
          position: 'absolute', top: -8,
          width: 24, height: 24, borderRadius: 12,
          backgroundColor: COLORS[value - 1],
          borderWidth: 3, borderColor: '#fff',
          shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, elevation: 3,
          transform: [{ translateX: thumbX - 12 }],
        }} />
      </View>
    </View>
  )
}

const EditField = ({ label, value, onChange, multiline = false, keyboardType = 'default' }: {
  label: string; value: string; onChange: (v: string) => void
  multiline?: boolean; keyboardType?: any
}) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 11, color: '#a1a1aa', marginBottom: 6, letterSpacing: 0.4 }}>
      {label.toUpperCase()}
    </Text>
    <TextInput
      value={value}
      onChangeText={onChange}
      multiline={multiline}
      keyboardType={keyboardType}
      textAlignVertical={multiline ? 'top' : 'center'}
      style={{
        borderWidth: 1, borderColor: '#e4e4e7', borderRadius: 8,
        paddingHorizontal: 12, paddingVertical: 10,
        fontFamily: 'PoppinsRegular', fontSize: 14, color: '#18181b',
        backgroundColor: '#fafafa', height: multiline ? 80 : undefined,
      }}
    />
  </View>
)

const Divider = () => <View style={{ height: 1, backgroundColor: '#f4f4f5', marginVertical: 14 }} />

const Production = () => {
  const { id } = useLocalSearchParams()
  const router = useRouter()

  const { data: production, isLoading: isFetching } = useGetProductionQuery(Number(id))
  const [updateProduction, { isLoading: isUpdating }] = useUpdateProductionMutation()
  const [active, setActive] = useState(false)

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ title: '', notes: '', quantity: '', total: '', landing: '' })

  useEffect(() => {
    if (production) {
      setForm({
        title: production.title ?? '',
        notes: production.notes ?? '',
        quantity: String(production.quantity ?? ''),
        total: String(production.total ?? ''),
        landing: production.landing ?? '',
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
    })
  }

  if (isFetching) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator color="#155183" size="large" />
      </View>
    )
  }

  if (!production) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text style={{ fontSize: 36, marginBottom: 8 }}>📦</Text>
        <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 15, color: '#3f3f46' }}>Record not found</Text>
      </View>
    )
  }

  const date = new Date(production.created_at).toLocaleDateString('en-PH', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
  const satisfactionColor = COLORS[(production.satisfaction ?? 3) - 1]

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <DeleteClass visible={active} setVisible={setActive} type='production' productionId={Number(id)}/>

      {/* ── Nav bar ── */}
      <View style={{
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 52, paddingBottom: 12, paddingHorizontal: 16,
        borderBottomWidth: 1, borderBottomColor: '#f4f4f5',
        backgroundColor: '#fff',
      }}>
        <Pressable onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          <ChevronLeft color="#155183" size={20} />
        </Pressable>

        <View style={{ flexDirection: 'row', gap: 6 }}>
          {editing ? (
            <>
              <Pressable onPress={cancelEdit} style={{ padding: 8, borderRadius: 8, backgroundColor: '#f4f4f5' }}>
                <X size={16} color="#71717a" />
              </Pressable>
              <Pressable onPress={handleUpdate} disabled={isUpdating} style={{ padding: 8, borderRadius: 8, backgroundColor: '#155183' }}>
                {isUpdating ? <ActivityIndicator size={16} color="#fff" /> : <Check size={16} color="#fff" />}
              </Pressable>
            </>
          ) : (
            <>
              <Pressable onPress={() => setActive(true)} style={{ padding: 8, borderRadius: 8, backgroundColor: '#fef2f2' }}>
                <Trash2 size={16} color="#ef4444" />
              </Pressable>
              <Pressable onPress={() => setEditing(true)} style={{ padding: 8, borderRadius: 8, backgroundColor: '#f4f4f5' }}>
                <Pencil size={16} color="#3f3f46" />
              </Pressable>
            </>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>

        {/* ── Title block ── */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#a1a1aa' }}>#{production.id}</Text>
            <View style={{ width: 3, height: 3, borderRadius: 2, backgroundColor: '#d4d4d8' }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Calendar size={11} color="#a1a1aa" />
              <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#a1a1aa' }}>{date}</Text>
            </View>
          </View>

          <Text style={{ fontFamily: 'PoppinsBold', fontSize: 22, color: '#18181b', lineHeight: 30 }}>
            {production.title}
          </Text>

          {/* Satisfaction badge */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <Text style={{ fontSize: 18 }}>{EMOJIS[(production.satisfaction ?? 3) - 1]}</Text>
            <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, backgroundColor: satisfactionColor + '18' }}>
              <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 11, color: satisfactionColor }}>
                {LABELS[(production.satisfaction ?? 3) - 1]}
              </Text>
            </View>
          </View>
        </View>

        <Divider />

        {editing ? (
          // ── Edit form ──
          <View style={{ marginTop: 4 }}>
            <EditField label="Title" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} />
            <EditField label="Quantity (kg)" value={form.quantity} onChange={v => setForm(f => ({ ...f, quantity: v }))} keyboardType="numeric" />
            <EditField label="Landing Site" value={form.landing} onChange={v => setForm(f => ({ ...f, landing: v }))} />
              <EditField label="Total Sales" value={form.total} onChange={v => setForm(f => ({ ...f, total: v }))} />
            <EditField label="Notes" value={form.notes} onChange={v => setForm(f => ({ ...f, notes: v }))} multiline />
          </View>
        ) : (
          // ── View mode ──
          <View style={{ gap: 14 }}>
            {/* Quantity */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Package size={15} color="#a1a1aa" />
                <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#71717a' }}>Quantity</Text>
              </View>
              <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 13, color: '#18181b' }}>
                {production.quantity} kg
              </Text>
            </View>

            {/* Landing */}
            {production.landing && (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <MapPin size={15} color="#a1a1aa" />
                  <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#71717a' }}>Landing Site</Text>
                </View>
                <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 13, color: '#18181b' }}>
                  {production.landing}
                </Text>
              </View>
            )}

            {production.total && (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <PhilippinePeso size={15} color="#a1a1aa" />
                  <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#71717a' }}>Total Sale</Text>
                </View>
                <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 13, color: '#18181b' }}>
                  ₱{Number(production.total).toLocaleString('en-PH')}
                </Text>
              </View>
            )}

            {/* Notes */}
            {production.notes && (
              <>
                <Divider />
                <View>
                  <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 11, color: '#a1a1aa', marginBottom: 6, letterSpacing: 0.4 }}>
                    NOTES
                  </Text>
                  <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 14, color: '#3f3f46', lineHeight: 22 }}>
                    {production.notes}
                  </Text>
                </View>
              </>
            )}
          </View>
        )}

        <Divider />

        {/* ── Satisfaction (always visible) ── */}
        <View style={{ marginTop: 4 }}>
          <Text style={{ fontFamily: 'PoppinsSemiBold', fontSize: 11, color: '#a1a1aa', marginBottom: 14, letterSpacing: 0.4 }}>
            SATISFACTION
          </Text>
          <SatisfactionDisplay value={production.satisfaction ?? 3} />
        </View>

      </ScrollView>
    </View>
  )
}

export default Production