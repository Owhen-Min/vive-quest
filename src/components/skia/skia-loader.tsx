import { Suspense } from 'react';
import type { ComponentType, ReactNode } from 'react';

export interface SkiaLoaderProps<TProps extends object> {
  /**
   * Dynamic import of the Skia-dependent component's module, e.g.
   * `() => import('./avatar-canvas')`. Only used by the web implementation
   * (`skia-loader.web.tsx`) to load CanvasKit before mounting.
   */
  getComponent: () => Promise<{ default: ComponentType<TProps> }>;
  /**
   * `lazy(getComponent)`, created once at module scope by the caller (see
   * `isometric-room-loader.tsx` / `avatar-loader.tsx`) so we don't create a
   * fresh lazy component on every render.
   */
  NativeComponent: ComponentType<TProps>;
  componentProps: TProps;
  fallback: ReactNode;
}

/**
 * Native implementation of the cross-platform Skia mount point. On iOS and
 * Android, Skia is available natively so we just lazy-mount the component.
 *
 * IMPORTANT: this file must not import anything from
 * `@shopify/react-native-skia/lib/module/web` - that pulls the web-only
 * `canvaskit-wasm` package (which requires Node's `fs`) into native bundles
 * and breaks Android/iOS bundling. All web-specific logic lives in
 * `skia-loader.web.tsx`, which Metro picks automatically on web.
 */
export function SkiaLoader<TProps extends object>({
  NativeComponent,
  componentProps,
  fallback,
}: SkiaLoaderProps<TProps>) {
  return (
    <Suspense fallback={fallback}>
      <NativeComponent {...componentProps} />
    </Suspense>
  );
}
