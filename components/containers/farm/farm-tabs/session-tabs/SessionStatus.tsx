import { View } from 'react-native'
import React from 'react'

const SessionStatus = ({ sessionStatus }: { sessionStatus: string }) => {
  return (
    <View style={{ height: 8, width: 8, borderRadius: 99, marginBottom: 3, 
        backgroundColor: sessionStatus === 'inactive' ? '#52525b' : sessionStatus === 'active' ? '#16a34a' : '#2563eb'}}/>
  )
}

export default SessionStatus