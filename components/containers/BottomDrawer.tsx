import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';

export type BottomDrawerRef = {
  open: () => void;
  close: () => void;
};

type BottomDrawerProps = {
  onChange?: (isOpen: boolean) => void;
  children?: React.ReactNode;
  type: 'full' | 'none';
};

const BottomDrawer = forwardRef<BottomDrawerRef, BottomDrawerProps>(
  ({ onChange, children, type }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);


    useImperativeHandle(ref, () => ({
      open: () => {
        bottomSheetRef.current?.snapToIndex(0);
      },
      close: () => {
        bottomSheetRef.current?.close();
      },
    }));

    const handleSheetChange = (index: number) => {
      if (onChange) {
        onChange(index !== -1);
      }
    };

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={type === 'full' ? ['50%'] : []}
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
          contentContainerStyle={{flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

BottomDrawer.displayName = 'BottomDrawer';

export default BottomDrawer;
