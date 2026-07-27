import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { Canvas, Fill, Group, Path, Skia } from '@shopify/react-native-skia';

import { Colors } from '@/constants/theme';

export interface IsometricRoomProps {
  /** Width/height of the (square) canvas, in dp. */
  size?: number;
}

/**
 * Basic Skia proof-of-concept for the "my page" isometric room: a floor
 * diamond plus two side walls, drawn with plain `Skia.Path`s so it's easy to
 * swap in real room art/furniture layers later.
 *
 * Always mount this through `IsometricRoomLoader`, never import it directly
 * from a route file - see that file for why.
 */
export default function IsometricRoom({ size = 220 }: IsometricRoomProps) {
  const scheme = useColorScheme();
  const colors = Colors[!scheme || scheme === 'unspecified' ? 'light' : scheme];

  const { floorPath, leftWallPath, rightWallPath } = useMemo(() => {
    const cx = size / 2;
    const cy = size / 2;
    const halfW = size * 0.42;
    const halfH = size * 0.24;
    const wallHeight = size * 0.32;

    const floorPath = Skia.PathBuilder.Make()
      .moveTo(cx, cy - halfH)
      .lineTo(cx + halfW, cy)
      .lineTo(cx, cy + halfH)
      .lineTo(cx - halfW, cy)
      .close()
      .detach();

    const leftWallPath = Skia.PathBuilder.Make()
      .moveTo(cx - halfW, cy)
      .lineTo(cx, cy + halfH)
      .lineTo(cx, cy + halfH - wallHeight)
      .lineTo(cx - halfW, cy - wallHeight)
      .close()
      .detach();

    const rightWallPath = Skia.PathBuilder.Make()
      .moveTo(cx, cy + halfH)
      .lineTo(cx + halfW, cy)
      .lineTo(cx + halfW, cy - wallHeight)
      .lineTo(cx, cy + halfH - wallHeight)
      .close()
      .detach();

    return { floorPath, leftWallPath, rightWallPath };
  }, [size]);

  return (
    <Canvas style={{ width: size, height: size }}>
      <Fill color={colors.level2} />
      <Group>
        <Path path={leftWallPath} color={colors.level3} />
        <Path path={rightWallPath} color={colors.level1} />
        <Path path={floorPath} color={colors.subMain} />
      </Group>
    </Canvas>
  );
}
