import React from "react";
import { Skia, Canvas, Circle, Group } from "@shopify/react-native-skia";
import { GestureHandler } from "./GestureHandler";
import { makeMutable } from "react-native-reanimated";
import { Dimensions } from "react-native";

// add zooming an panning

const Container = () => {
  const window = Dimensions.get("window");
  const width = window.width;
  const height = window.height;
  const r = width * 0.33;
  const matrix = makeMutable(Skia.Matrix());
  return (
    <GestureHandler matrix={matrix}>
      <Canvas style={{ width, height }}>
        <Group blendMode="multiply" matrix={matrix}>
          <Circle cx={r} cy={r} r={r} color="cyan" />
          <Circle cx={width - r} cy={r} r={r} color="magenta" />
          <Circle cx={width / 2} cy={width - r} r={r} color="yellow" />
        </Group>
      </Canvas>
    </GestureHandler>
  );
};

export default Container;
