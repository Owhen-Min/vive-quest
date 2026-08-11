import { ActivityIndicator, StyleSheet, View } from 'react-native';

import IsometricRoom, { type IsometricRoomProps } from './isometric-room';
import { SkiaLoader } from '@/components/skia/skia-loader';

function LoadingFallback({ size = 220 }: IsometricRoomProps) {
  return (
    <View style={[styles.fallback, { width: size, height: size }]}>
      <ActivityIndicator />
    </View>
  );
}

/**
 * Cross-platform entry point for the isometric room canvas. Route files
 * should only ever import *this* loader, not `./isometric-room` directly -
 * see `skia-loader.tsx` for why.
 */
export function IsometricRoomLoader({ size = 220 }: IsometricRoomProps) {
  return (
    <SkiaLoader
      getComponent={() => import('./isometric-room')}
      NativeComponent={IsometricRoom}
      componentProps={{ size }}
      fallback={<LoadingFallback size={size} />}
    />
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
