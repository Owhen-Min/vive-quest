/**
 * Data-only catalog of the layered avatar assets under `assets/images/avatar`.
 * Each layer is a full 1000x1000 transparent PNG pre-aligned to the same
 * canvas, so composing them is just stacking `<Image>`s in z-order - see
 * `avatar-canvas.tsx` for the actual Skia rendering.
 *
 * This file has no Skia dependency on purpose: it's safe to import from
 * anywhere (e.g. to render plain thumbnail `<Image>`s in a picker UI)
 * without pulling Skia into a route's initial bundle.
 */

// Only one body sprite exists today; keeping it as a record-of-one keeps the
// shape consistent if more skins are added later.
export const AVATAR_BODY_SOURCES = {
  default: require('@/assets/images/avatar/body/01-budy 2.png'),
} as const;
export type AvatarBodyId = keyof typeof AVATAR_BODY_SOURCES;

export const AVATAR_EYE_SOURCES = {
  brown: require('@/assets/images/avatar/eye/01-brown-eye 2.png'),
  mika: require('@/assets/images/avatar/eye/02-Mika 2.png'),
} as const;
export type AvatarEyeId = keyof typeof AVATAR_EYE_SOURCES;

export const AVATAR_HAIR_SOURCES = {
  brownShort: require('@/assets/images/avatar/hair/01-brown-short 2.png'),
  yellowUpdo: require('@/assets/images/avatar/hair/01-yelow-hair 2.png'),
} as const;
export type AvatarHairId = keyof typeof AVATAR_HAIR_SOURCES;

export const AVATAR_DRESS_SOURCES = {
  tshirt: require('@/assets/images/avatar/dress/01-T-shirt 2.png'),
  greenDress: require('@/assets/images/avatar/dress/02-green-dress 2.png'),
} as const;
export type AvatarDressId = keyof typeof AVATAR_DRESS_SOURCES;

export const AVATAR_HAND_ACCESSORY_SOURCES = {
  flowerWand: require('@/assets/images/avatar/hand_accessory/flowe -wick02 1.png'),
} as const;
export type AvatarHandAccessoryId = keyof typeof AVATAR_HAND_ACCESSORY_SOURCES;

export interface AvatarConfig {
  body: AvatarBodyId;
  eye: AvatarEyeId;
  hair: AvatarHairId;
  dress: AvatarDressId;
  /** Optional - not every avatar needs to be holding something. */
  handAccessory?: AvatarHandAccessoryId;
}

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  body: 'default',
  eye: 'brown',
  hair: 'brownShort',
  dress: 'tshirt',
};
