import { useEffect } from "react";
import type { ReactNode } from "react";
import { Modal, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export interface BottomSheetModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Cap on how tall the sheet can grow, as a percentage of screen height. */
  maxHeightPercent?: number;
  /** Drag distance (px) past which releasing the handle dismisses the sheet. */
  dismissDistance?: number;
  /** Fling velocity (px/s) past which releasing the handle dismisses the sheet, regardless of distance. */
  dismissVelocity?: number;
}

/**
 * Generic bottom-sheet modal shell: slides up from the bottom, rounded top
 * corners, grows to fit its `children` up to `maxHeightPercent` of the
 * screen, and can be swiped away by dragging the handle down.
 *
 * Layout/scrolling of the content is entirely up to the caller - this only
 * owns the backdrop, sheet chrome, and the drag-to-dismiss gesture.
 */
export function BottomSheetModal({
  visible,
  onClose,
  children,
  maxHeightPercent = 90,
  dismissDistance = 120,
  dismissVelocity = 800,
}: BottomSheetModalProps) {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(0);

  // Reset the drag offset whenever the sheet is (re)opened, since the
  // component stays mounted between opens (only `visible` toggles).
  useEffect(() => {
    if (visible) {
      translateY.value = 0;
    }
  }, [visible, translateY]);

  const closeModal = () => {
    onClose();
  };

  const dragGesture = Gesture.Pan()
    .activeOffsetY([-5, 10])
    .onUpdate((event) => {
      // Only allow dragging downward.
      translateY.value = Math.max(0, event.translationY);
    })
    .onEnd((event) => {
      const pastDistance = translateY.value > dismissDistance;
      const flungDown = event.velocityY > dismissVelocity;
      if (pastDistance || flungDown) {
        translateY.value = withTiming(600, { duration: 200 }, () => {
          runOnJS(closeModal)();
        });
      } else {
        translateY.value = withSpring(0, { damping: 18, stiffness: 200 });
      }
    });

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* Modal renders in its own native surface, so gesture-handler needs
          its own root here too - the one in _layout.tsx doesn't cover it. */}
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View className="flex-1 bg-black/30 justify-end">
          <Animated.View
            className="bg-background rounded-t-[32px] overflow-hidden"
            style={[
              {
                maxHeight: `${maxHeightPercent}%`,
                paddingBottom: insets.bottom,
              },
              sheetAnimatedStyle,
            ]}
          >
            {/* Drag handle - swipe down to dismiss */}
            <GestureDetector gesture={dragGesture}>
              <View className="items-center pt-4 pb-3">
                <View className="w-10 h-1.5 rounded-full bg-level3" />
              </View>
            </GestureDetector>

            {children}
          </Animated.View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}
