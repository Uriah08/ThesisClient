import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Modal, View } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export type BottomDrawerRef = {
  open: () => void;
  close: () => void;
};

type BottomDrawerProps = {
  onChange?: (isOpen: boolean) => void;
  children?: React.ReactNode;
  type: 'full' | 'none';
  snapPoints?: string[];
};

const BottomDrawer = forwardRef<BottomDrawerRef, BottomDrawerProps>(
  ({ onChange, children, type, snapPoints: snapPointsProp }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({
      open: () => {
        setVisible(true);
        setTimeout(() => bottomSheetRef.current?.snapToIndex(0), 50);
      },
      close: () => {
        bottomSheetRef.current?.close();
      },
    }));

    const handleSheetChange = (index: number) => {
      if (index === -1) {
        setVisible(false);
      }
      if (onChange) onChange(index !== -1);
    };

    const resolvedSnapPoints = snapPointsProp ?? (type === 'full' ? ['50%'] : ['45%']);

    return (
      <Modal
        visible={visible}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={() => bottomSheetRef.current?.close()}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <BottomSheet
              ref={bottomSheetRef}
              index={0}
              snapPoints={resolvedSnapPoints}
              enablePanDownToClose
              onChange={handleSheetChange}
              backdropComponent={(props) => (
                <BottomSheetBackdrop
                  {...props}
                  disappearsOnIndex={-1}
                  appearsOnIndex={0}
                  opacity={0.5}
                />
              )}
            >
              <BottomSheetScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
              >
                {children}
              </BottomSheetScrollView>
            </BottomSheet>
          </View>
        </GestureHandlerRootView>
      </Modal>
    );
  }
);

BottomDrawer.displayName = 'BottomDrawer';
export default BottomDrawer;