import React, { ReactNode } from 'react'
import { Portal, Dialog } from 'react-native-paper';
import { KeyboardAvoidingView, Platform, ScrollView, View, Text, Pressable } from 'react-native';

type DialogsProps = {
  onVisible: (visible: boolean) => void;
  visible: boolean;
  title: string
  subtitle?: string
  children: ReactNode
};

const Dialogs = ({ onVisible, visible, title, subtitle, children }: DialogsProps) => {
  return (
    <Portal>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -40}
      >
        <Dialog
          visible={visible}
          onDismiss={() => onVisible(false)}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 16,
            overflow: 'hidden',
            paddingBottom: 0,
          }}
        >
          {/* Header */}
          <View style={{
            paddingHorizontal: 20,
            paddingBottom: 13,
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            borderBottomWidth: 0.5,
            borderBottomColor: '#e4e4e7',
          }}>
            <View style={{ gap: 2 }}>
              {subtitle ? (
                <Text style={{
                  fontFamily: 'PoppinsRegular',
                  fontSize: 10.5,
                  color: '#a1a1aa',
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                  marginBottom: 1,
                }}>
                  {subtitle}
                </Text>
              ) : null}
              <Text style={{
                fontFamily: 'PoppinsSemiBold',
                fontSize: 15,
                color: '#18181b',
                letterSpacing: -0.1,
              }}>
                {title}
              </Text>
            </View>

            <Pressable
              onPress={() => onVisible(false)}
              hitSlop={8}
              style={({ pressed }) => ({
                width: 28,
                height: 28,
                borderRadius: 14,
                borderWidth: 0.5,
                borderColor: '#e4e4e7',
                backgroundColor: pressed ? '#f4f4f5' : '#fafafa',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 1,
              })}
            >
              <Text style={{ fontSize: 13, color: '#71717a', lineHeight: 16 }}>✕</Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </Dialog>
      </KeyboardAvoidingView>
    </Portal>
  )
}

export default Dialogs