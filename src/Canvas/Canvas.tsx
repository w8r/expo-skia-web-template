import React from "react";
import {
  Skia,
  Canvas,
  Circle,
  Group,
  Text,
  useFont,
} from "@shopify/react-native-skia";
import { GestureHandler } from "./GestureHandler";
import { makeMutable } from "react-native-reanimated";
import { Platform, Dimensions } from "react-native";
import { getTransformFromShapes } from "./utils";

// phyllotaxis
// https://en.wikipedia.org/wiki/Phyllotaxis
const phyllotaxis = (n: number) => {
  const theta = Math.PI * (3 - Math.sqrt(5));
  return (i: number) => {
    const r = Math.sqrt(i / n) * 50;
    const th = i * theta;
    return { x: r * Math.cos(th), y: r * Math.sin(th), radius: 1 };
  };
};

const getPoint = phyllotaxis(400);
const points = Array.from({ length: 400 }, (_, i) => getPoint(i));
const getRandomHexColor = () => {
  const hex = Math.floor(Math.random() * 0xffffff).toString(16);
  return `#${hex.padStart(6, "0")}`;
};

// add zooming an panning

const Container = () => {
  const { width, height } = Dimensions.get("window");
  const r = width * 0.13;
  const matrix = makeMutable(
    getTransformFromShapes(
      points,
      // [
      //   { x: r, y: r, radius: r },
      //   { x: width - r, y: r, radius: r },
      //   { x: width / 2, y: width - r, radius: r },
      // ],
      width,
      height
    )
  );
  const fontSize = 1;
  const font = useFont(require("../../assets/SpaceMono-Regular.ttf"), fontSize);

  return (
    <GestureHandler matrix={matrix}>
      <Canvas style={{ width, height, overflow: "hidden" }}>
        <Group blendMode="multiply" matrix={matrix}>
          {/* <Circle cx={r} cy={r} r={r} color="cyan" />
          <Circle cx={width - r} cy={r} r={r} color="magenta" />
          <Circle cx={width / 2} cy={width - r} r={r} color="yellow" /> */}
          {points.map(({ x, y, radius }, i) => (
            <Group key={i}>
              <Circle cx={x} cy={y} r={radius} color={getRandomHexColor()} />
              {/* <Text font={font} x={x} y={y + 1.5} color={"blue"} text="text" /> */}
            </Group>
          ))}
        </Group>
      </Canvas>
    </GestureHandler>
  );
};

export default Container;
