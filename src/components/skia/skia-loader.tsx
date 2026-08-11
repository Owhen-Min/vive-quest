import type { ComponentType, ReactNode } from 'react';

export interface SkiaLoaderProps<TProps extends object> {
  /**
   * Dynamic import of the Skia-dependent component's module, e.g.
   * `() => import('./avatar-canvas')`. Only used by the web implementation
   * (`skia-loader.web.tsx`) to load CanvasKit before mounting.
   */
  getComponent: () => Promise<{ default: ComponentType<TProps> }>;
  /**
   * Statically imported by the caller (see `isometric-room-loader.tsx` /
   * `avatar-loader.tsx`) and rendered as-is - native has no async loading
   * step, so this must NOT be a `lazy()`-wrapped component. Metro's async
   * `import()` chunk for this module has proven unreliable on Android/iOS
   * (intermittent phantom `SyntaxError`s from the async-require fetch), so
   * native deliberately avoids `React.lazy`/`Suspense` entirely.
   */
  NativeComponent: ComponentType<TProps>;
  componentProps: TProps;
  fallback: ReactNode;
}

/**
 * Native implementation of the cross-platform Skia mount point. On iOS and
 * Android, Skia is available synchronously (no wasm to fetch), so this just
 * renders the component directly - no `lazy()`/`Suspense` involved.
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
}: SkiaLoaderProps<TProps>) {
  return <NativeComponent {...componentProps} />;
}
