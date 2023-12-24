import { Skia, type SkMatrix, vec } from "@shopify/react-native-skia";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import type { SharedValue } from "react-native-reanimated";
import { useSharedValue } from "react-native-reanimated";
import { rotateZ, scale, translate } from "./MatrixHelpers";

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
  const gesture = Gesture.Race(pan, pinch, rotate);

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={gesture}>{children}</GestureDetector>
    </GestureHandlerRootView>
  );
};
