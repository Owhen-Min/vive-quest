import { useEffect, useState } from 'react';
import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';

import type { SkiaLoaderProps } from './skia-loader';

/**
 * Web implementation of the cross-platform Skia mount point (Metro resolves
 * this file instead of `skia-loader.tsx` when bundling for web).
 *
 * Skia's web renderer needs its CanvasKit .wasm blob loaded before any Skia
 * component runs, and Expo Router's static web export server-renders every
 * route in Node (no browser/WASM support there) - so the actual component
 * must only mount client-side, after hydration, and only ever be reached
 * through a dynamic `import()`.
 */
export function SkiaLoader<TProps extends object>({
  getComponent,
  componentProps,
  fallback,
}: SkiaLoaderProps<TProps>) {
  // `useEffect` never runs during Node-side static rendering, so this stays
  // false there and we only render the (SSR-safe) fallback. This is the
  // standard client-hydration guard, so it's fine to flip synchronously.
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{fallback}</>;
  }

  return (
    <WithSkiaWeb
      getComponent={getComponent}
      fallback={fallback}
      componentProps={componentProps}
      opts={{ locateFile: (file: string) => `/${file}` }}
    />
  );
}
