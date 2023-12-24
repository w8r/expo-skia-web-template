import type { SkMatrix, Vector } from "@shopify/react-native-skia";
import { Skia, MatrixIndex } from "@shopify/react-native-skia";

export const scale = (matrix: SkMatrix, s: number, origin: Vector) => {
  "worklet";
  return Skia.Matrix(matrix.get())
    .translate(origin.x, origin.y)
    .scale(s, s)
    .translate(-origin.x, -origin.y);
};

export const rotateZ = (matrix: SkMatrix, theta: number, origin: Vector) => {
  "worklet";
  return Skia.Matrix(matrix.get())
    .translate(origin.x, origin.y)
    .rotate(theta)
    .translate(-origin.x, -origin.y);
};

export const translate = (matrix: SkMatrix, x: number, y: number) => {
  "worklet";
  return Skia.Matrix().translate(x, y).concat(matrix);
};

export const toM4 = (m3: SkMatrix) => {
  "worklet";
  const m = m3.get();
  const tx = m[MatrixIndex.TransX];
  const ty = m[MatrixIndex.TransY];
  const sx = m[MatrixIndex.ScaleX];
  const sy = m[MatrixIndex.ScaleY];
  const skewX = m[MatrixIndex.SkewX];
  const skewY = m[MatrixIndex.SkewY];
  const persp0 = m[MatrixIndex.Persp0];
  const persp1 = m[MatrixIndex.Persp1];
  const persp2 = m[MatrixIndex.Persp2];
  return [
    sx,
    skewY,
    persp0,
    0,
    skewX,
    sy,
    persp1,
    0,
    0,
    0,
    1,
    0,
    tx,
    ty,
    persp2,
    1,
  ];
};
