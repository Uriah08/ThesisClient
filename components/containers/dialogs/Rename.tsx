import { View, Text, Pressable, TextInput, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import Dialogs from './Dialog'
import { Dialog } from 'react-native-paper'
import { Pen } from 'lucide-react-native'
import Toast from 'react-native-toast-message'
import { useRenameSessionMutation } from '@/store/sessionApi'
import { useRenameFarmTrayMutation } from '@/store/farmTrayApi'

const PRIMARY = '#155183'

type DialogsProps = {
  setVisible: (visible: boolean) => void
  visible: boolean
  type: 'tray' | 'session' | 'farm-tray'
  defaultValue?: string
  trayId?: number
  sessionId?: number
}

const RenameClass = ({ setVisible, visible, type, defaultValue, trayId, sessionId }: DialogsProps) => {
  const [renameSession, { isLoading }]            = useRenameSessionMutation()
  const [renameFarmTray, { isLoading: farmTrayLoading }] = useRenameFarmTrayMutation()
  const [name, setName]       = useState(defaultValue ?? '')
  const [isFocused, setIsFocused] = useState(false)
  const [errors, setErrors]   = useState<{ [key: string]: string }>({})

  const isBusy  = isLoading || farmTrayLoading
  const isRenaming = type === 'tray' || type === 'farm-tray'
  const title   = isRenaming ? 'Rename Tray' : 'Rename Session'
  const subtitle = isRenaming ? 'Edit tray' : 'Edit session'

  const validate = () => {
    const newErrors: { [key: string]: string } = {}
    if (!name?.trim()) newErrors.name = 'Name is required.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRename = async () => {
    if (!validate()) return
    try {
      if (type === 'session') {
        await renameSession({ name, sessionId }).unwrap()
      } else if (type === 'farm-tray') {
        await renameFarmTray({ name, trayId }).unwrap()
      }
      setName('')
      setVisible(false)
    } catch (error: any) {
      if (error?.data?.detail) {
        Toast.show({ type: 'error', text1: error.data.detail })
      }
      if (error?.data) {
        const serverErrors: { [key: string]: string } = {}
        for (const key in error.data) serverErrors[key] = error.data[key][0]
        setErrors((prev) => ({ ...prev, ...serverErrors }))
      }
    }
  }

  return (
    <Dialogs onVisible={setVisible} visible={visible} title={title} subtitle={subtitle}>
      <Dialog.Content style={{ paddingHorizontal: 20, paddingBottom: 20, gap: 14, marginTop: 10 }}>

        {/* Name input */}
        <View style={{ gap: 5 }}>
          <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11.5, color: '#71717a', fontWeight: '500' }}>
            Name <Text style={{ color: '#ef4444' }}>*</Text>
          </Text>
          <TextInput
            style={{
              borderWidth: isFocused ? 1 : 0.5,
              borderColor: errors.name ? '#ef4444' : isFocused ? PRIMARY : '#e4e4e7',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 9,
              fontSize: 13.5,
              color: '#18181b',
              backgroundColor: isFocused ? '#f4f8fc' : '#fafafa',
              fontFamily: 'PoppinsRegular',
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter a name"
            placeholderTextColor="#c4c4c8"
            value={name}
            onChangeText={(t) => { setName(t); setErrors((p) => ({ ...p, name: '' })) }}
          />
          {errors.name && (
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 11, color: '#ef4444', marginLeft: 1 }}>
              {errors.name}
            </Text>
          )}
        </View>

        {/* Footer */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
          <Pressable
            onPress={() => setVisible(false)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 8,
              borderWidth: 0.5,
              borderColor: '#d4d4d8',
              backgroundColor: '#fafafa',
            }}
          >
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#71717a' }}>Cancel</Text>
          </Pressable>

          <Pressable
            onPress={handleRename}
            disabled={isBusy}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 8,
              backgroundColor:  PRIMARY,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              opacity: isBusy ? 0.75 : 1,
            }}
          >
            {isBusy
              ? <ActivityIndicator size={14} color="#fff" />
              : <Pen color="#fff" size={14} />
            }
            <Text style={{ fontFamily: 'PoppinsRegular', fontSize: 13, color: '#fff' }}>Rename</Text>
          </Pressable>
        </View>

      </Dialog.Content>
    </Dialogs>
  )
}

export default RenameClass