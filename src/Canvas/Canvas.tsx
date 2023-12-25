import React from "react";
import { Skia, Canvas, Circle, Group } from "@shopify/react-native-skia";
import { GestureHandler } from "./GestureHandler";
import { makeMutable } from "react-native-reanimated";
import { Dimensions } from "react-native";
import { getTransformFromShapes } from "./utils";

// add zooming an panning

const Container = () => {
  const { width, height } = Dimensions.get("window");
  const r = width * 0.13;
  const matrix = makeMutable(
    getTransformFromShapes(
      [
        { x: r, y: r, radius: r },
        { x: width - r, y: r, radius: r },
        { x: width / 2, y: width - r, radius: r },
      ],
      width,
      height
    )
  );

  console.log({ width, height });
  return (
    <GestureHandler matrix={matrix}>
      <Canvas style={{ width, height, overflow: "hidden" }}>
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
