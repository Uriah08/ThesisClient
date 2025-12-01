import { View, Text, Pressable } from 'react-native'
import React, { useState} from 'react'
import { ChevronRight, Pen, Trash } from 'lucide-react-native';
import DeleteClass from '@/components/containers/dialogs/Delete';
import RenameClass from '@/components/containers/dialogs/Rename';

const settingsMenu = [
  {
    icon: Pen,
    label: 'Rename',
  },
  {
    icon: Trash,
    label: 'Delete',
  }
];

type Props = {
  sessionId?: number
  onBack: () => void,
}

const SessionSettings = ({ sessionId, onBack }: Props) => {
  const [showDelete, setShowDelete] = useState(false)
  const [showRename, setShowRename] = useState(false)
  return (
    <View className='flex-1 p-5'>
      <DeleteClass setVisible={setShowDelete} visible={showDelete} type='session' sessionId={sessionId} onBack={onBack}/>
      <RenameClass setVisible={setShowRename} visible={showRename} type='session' sessionId={sessionId}/>
      <Text
        className="text-zinc-500 text-sm"
        style={{ marginVertical: 20, fontFamily: 'PoppinsMedium' }}
      >
        Session Settings
      </Text>
      {settingsMenu.map((item, i) => (
        <Pressable
          key={i}
          onPress={item.label === 'Rename' ? () => setShowRename(true) : () => setShowDelete(true)}
          className="flex flex-row items-center"
          android_ripple={{ color: '#d3d3d3', borderless: false }}
          style={{
            justifyContent: 'space-between',
            borderTopWidth: 1,
            borderBottomWidth: item.label === 'Delete' ? 1 : 0,
            borderColor: '#e8e8e8',
            paddingVertical: 20,
            paddingLeft: 10
          }}
        >
          <View className="flex flex-row items-center gap-5">
            <item.icon size={20} color={'#a1a1aa'} />
            <Text
              className="text-lg"
              style={{ fontFamily: 'PoppinsMedium' }}
            >
              {item.label}
            </Text>
          </View>
          {item.label !== 'Delete' && <ChevronRight size={18} />}
        </Pressable>
      ))}
    </View>
  )
}

export default SessionSettings