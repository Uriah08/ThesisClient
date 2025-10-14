import { View, Text } from 'react-native'
import React from 'react'

type Props = {
    farmId: number;
    sessionActive: string
    setSessionActive: React.Dispatch<React.SetStateAction<number>>
}

const Session = ({ farmId, sessionActive, setSessionActive }: Props) => {
  return (
    <View>
      <Text>Session</Text>
    </View>
  )
}

export default Session