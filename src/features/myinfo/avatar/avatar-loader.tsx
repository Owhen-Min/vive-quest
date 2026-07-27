import { lazy } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import type { AvatarCanvasProps } from "./avatar-canvas";
import { SkiaLoader } from "@/components/skia/skia-loader";

const NativeAvatarCanvas = lazy(() => import("./avatar-canvas"));

function LoadingFallback({ size = 220 }: AvatarCanvasProps) {
  return (
    <View style={[styles.fallback, { width: size, height: size }]}>
      <ActivityIndicator />
    </View>
  );
}

/**
 * Cross-platform entry point for the Skia avatar canvas. Route files should
 * only ever import *this* loader, not `./avatar-canvas` directly - see
 * `skia-loader.tsx` for why.
 */
export function AvatarLoader({ size = 220, ...config }: AvatarCanvasProps) {
  return (
    <SkiaLoader
      getComponent={() => import("./avatar-canvas")}
      NativeComponent={NativeAvatarCanvas}
      componentProps={{ size, ...config }}
      fallback={<LoadingFallback size={size} />}
    />
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: "center",
    justifyContent: "center",
  },
});
