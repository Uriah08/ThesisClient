import React, { ReactNode } from 'react'
import { Portal, Dialog } from 'react-native-paper';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

type DialogsProps = {
  onVisible: (visible: boolean) => void;
  visible: boolean;
  title: string
  children: ReactNode
};

const Dialogs = ({ onVisible, visible, title, children }: DialogsProps) => {
  return (
    <Portal>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -30}
      >
        <Dialog
          visible={visible}
          onDismiss={() => onVisible(false)}
          style={{ backgroundColor: '#ffffff', overflow: 'hidden' }}
        >
          <Dialog.Title style={{ fontFamily: 'PoppinsSemiBold' }}>
            {title}
          </Dialog.Title>
          <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
        </Dialog>
      </KeyboardAvoidingView>
    </Portal>
  )
}

export default Dialogs