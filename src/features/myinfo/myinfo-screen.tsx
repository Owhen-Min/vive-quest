import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import {
  AVATAR_DRESS_SOURCES,
  AVATAR_EYE_SOURCES,
  AVATAR_HAIR_SOURCES,
  DEFAULT_AVATAR_CONFIG,
  type AvatarConfig,
  type AvatarDressId,
  type AvatarEyeId,
  type AvatarHairId,
} from './avatar/avatar-catalog';
import { AvatarLoader } from './avatar/avatar-loader';
import { IsometricRoomLoader } from './room/isometric-room-loader';
import { useApp } from '@/context/AppContext';
import { ProfileCard } from './components/profile-card';
import { AvatarSwatchRow } from './components/avatar-swatch-row';
import { FlowerGrid } from './components/flower-grid';

export default function MyInfoScreen() {
  const { equipped } = useApp();

  // Skia avatar config (hair/eyes/dress). Basic setup - swap layers to see
  // the compositing system work; not yet wired into the shop's inventory.
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(
    DEFAULT_AVATAR_CONFIG,
  );

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        className="px-4 py-3"
      >
        {/* Profile Card */}
        <ProfileCard />

        {/* My Character (Skia avatar, basic setup) */}
        <View className="bg-level1 rounded-3xl p-5 border border-level3 shadow-sm mb-6 items-center">
          <Text className="text-sm font-bold text-sub-main mb-4 self-start">
            🧑 나의 캐릭터
          </Text>
          <AvatarLoader size={200} {...avatarConfig} />

          <View className="w-full mt-4">
            <AvatarSwatchRow<AvatarHairId>
              label="헤어"
              sources={AVATAR_HAIR_SOURCES}
              selected={avatarConfig.hair}
              onSelect={(hair) =>
                setAvatarConfig((prev) => ({ ...prev, hair }))
              }
            />
            <AvatarSwatchRow<AvatarEyeId>
              label="눈"
              sources={AVATAR_EYE_SOURCES}
              selected={avatarConfig.eye}
              onSelect={(eye) => setAvatarConfig((prev) => ({ ...prev, eye }))}
            />
            <AvatarSwatchRow<AvatarDressId>
              label="옷"
              sources={AVATAR_DRESS_SOURCES}
              selected={avatarConfig.dress}
              onSelect={(dress) =>
                setAvatarConfig((prev) => ({ ...prev, dress }))
              }
            />
          </View>
          <Text className="text-[10px] text-main/50 mt-1">
            Skia 레이어 합성 기본 세팅 (추후 상점 인벤토리 연동 예정)
          </Text>
        </View>

        {/* My Room (Skia isometric room, basic setup) */}
        <View className="bg-level1 rounded-3xl p-5 border border-level3 shadow-sm mb-6 items-center">
          <Text className="text-sm font-bold text-sub-main mb-4 self-start">
            🏡 나의 방
          </Text>
          <IsometricRoomLoader size={200} />
          <Text className="text-[10px] text-main/50 mt-3">
            Skia 렌더링 기본 세팅 (추후 가구/캐릭터 배치 예정)
          </Text>
        </View>

        {/* Activity Summary (Level1 Container) */}
        <View className="bg-level1 rounded-3xl p-5 border border-level3 shadow-sm mb-6">
          <Text className="text-sm font-bold text-sub-main mb-4">
            📊 활동 기록 요약
          </Text>

          <View className="flex-row justify-between">
            <View className="items-center flex-1">
              <Text className="text-main/50 text-[10px] mb-1">
                총 걸음 거리
              </Text>
              <Text className="text-base font-bold text-main">1,505.0 km</Text>
            </View>
            <View className="items-center flex-1 border-x border-level3/50">
              <Text className="text-main/50 text-[10px] mb-1">방문한 장소</Text>
              <Text className="text-base font-bold text-main">30 곳</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-main/50 text-[10px] mb-1">
                피운 꽃 개수
              </Text>
              <Text className="text-base font-bold text-main">50 송이</Text>
            </View>
          </View>
        </View>

        {/* Collected Flowers Badge Grid */}
        <FlowerGrid />
      </ScrollView>
    </View>
  );
}
