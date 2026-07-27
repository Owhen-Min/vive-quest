import { Canvas, Image, useImage } from '@shopify/react-native-skia';

import {
  AVATAR_BODY_SOURCES,
  AVATAR_DRESS_SOURCES,
  AVATAR_EYE_SOURCES,
  AVATAR_HAIR_SOURCES,
  AVATAR_HAND_ACCESSORY_SOURCES,
  DEFAULT_AVATAR_CONFIG,
  type AvatarConfig,
} from './avatar-catalog';

export interface AvatarCanvasProps extends Partial<AvatarConfig> {
  /** Width/height of the (square) canvas, in dp. */
  size?: number;
}

/**
 * Composites the layered chibi-doll sprites from `avatar-catalog.ts` into a
 * single avatar. Every source PNG shares the same 1000x1000 canvas and is
 * already aligned, so layers just need to be drawn bottom-to-top:
 * body -> eyes -> hair -> dress -> hand accessory.
 *
 * Only ever reached through `avatar-loader.tsx` - see `skia-loader.tsx`.
 */
export default function AvatarCanvas({ size = 220, ...overrides }: AvatarCanvasProps) {
  const config: AvatarConfig = { ...DEFAULT_AVATAR_CONFIG, ...overrides };

  const body = useImage(AVATAR_BODY_SOURCES[config.body]);
  const eye = useImage(AVATAR_EYE_SOURCES[config.eye]);
  const hair = useImage(AVATAR_HAIR_SOURCES[config.hair]);
  const dress = useImage(AVATAR_DRESS_SOURCES[config.dress]);
  const handAccessory = useImage(
    config.handAccessory ? AVATAR_HAND_ACCESSORY_SOURCES[config.handAccessory] : undefined
  );

  const rect = { x: 0, y: 0, width: size, height: size };

  return (
    <Canvas style={{ width: size, height: size }}>
      {body && <Image image={body} {...rect} fit="contain" />}
      {eye && <Image image={eye} {...rect} fit="contain" />}
      {hair && <Image image={hair} {...rect} fit="contain" />}
      {dress && <Image image={dress} {...rect} fit="contain" />}
      {handAccessory && <Image image={handAccessory} {...rect} fit="contain" />}
    </Canvas>
  );
}
