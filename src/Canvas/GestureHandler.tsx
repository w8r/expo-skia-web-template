import { Skia, type SkMatrix, vec } from "@shopify/react-native-skia";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import type { SharedValue } from "react-native-reanimated";
import { useSharedValue } from "react-native-reanimated";
import {
  applyTransform,
  invertTransform,
  rotateZ,
  scale,
  translate,
  zoomAroundPoint,
} from "./utils";
import { View } from "react-native";
import { useCallback } from "react";

interface GestureHandlerProps {
  matrix: SharedValue<SkMatrix>;
  debug?: boolean;
  children?: React.ReactNode;
}

export const GestureHandler = ({ matrix, children }: GestureHandlerProps) => {
  const pivot = useSharedValue(Skia.Point(0, 0));
  const offset = useSharedValue(Skia.Matrix());
  const pan = Gesture.Pan().onChange((event) => {
    matrix.value = translate(matrix.value, event.changeX, event.changeY);
  });
  const pinch = Gesture.Pinch()
    .onBegin((event) => {
      offset.value = matrix.value;
      pivot.value = vec(event.focalX, event.focalY);
    })
    .onChange((event) => {
      pivot.value = invertTransform(
        matrix.value,
        vec(event.focalX, event.focalY)
      );
      matrix.value = scale(offset.value, event.scale, pivot.value);
    });

  const rotate = Gesture.Rotation()
    .onBegin((event) => {
      offset.value = matrix.value;
      pivot.value = vec(event.anchorX, event.anchorY);
    })
    .onChange((event) => {
      matrix.value = rotateZ(offset.value, event.rotation, pivot.value);
    });
  const longTap = Gesture.LongPress().onEnd((event) => {
    console.log("long tap", event);
  });

  const gesture = Gesture.Race(pan, pinch, rotate);

  const onWheel = useCallback(
    (event: WheelEvent) => {
      const dz = event.deltaY > 0 ? 0.9 : 1.1;
      pivot.value = invertTransform(
        matrix.value,
        vec(event.clientX, event.clientY)
      );
      matrix.value = zoomAroundPoint(matrix.value, dz, pivot.value);
    },
    [matrix]
  );

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={gesture}>
        {/* @ts-expect-error onWheel */}
        <View onWheel={onWheel}>{children}</View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};
