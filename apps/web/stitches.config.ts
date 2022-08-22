import { createStitches, type CSS as StitchesCSS } from "@stitches/react";

const stitches = createStitches();
export const {
  css,
  getCssText,
  globalCss,
  keyframes,
  styled,
  reset,
  theme,
  createTheme,
} = stitches;

export type CSS = StitchesCSS<typeof stitches>;
