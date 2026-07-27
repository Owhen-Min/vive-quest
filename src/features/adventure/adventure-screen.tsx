import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function AdventureScreen() {
  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="px-4 py-3">

        {/* Title */}
        <View className="mb-4">
          <Text className="text-2xl font-bold text-main">Adventure Map</Text>
          <Text className="text-xs text-sub-main font-semibold mt-1">※ 모험 기능은 구현 우선순위가 낮아 플레이스홀더 상태입니다.</Text>
        </View>

        {/* Map Placeholder Card (Level1 Container) */}
        <View className="bg-level1 rounded-3xl p-5 border border-level3 shadow-sm mb-6 items-center">
          <View className="w-full h-64 bg-level2 rounded-2xl border border-level3 items-center justify-center relative overflow-hidden">
            
            {/* Mock Map Background grid */}
            <View className="absolute inset-0 opacity-10 flex-wrap flex-row">
              {Array.from({ length: 48 }).map((_, i) => (
                <View key={i} className="w-10 h-10 border border-main" />
              ))}
            </View>

            <Text className="text-base text-main font-bold mb-2">🗺️ 가상 지도 시뮬레이터</Text>
            <Text className="text-[11px] text-main/60 mb-4">현재 위치 및 근처 광고지/꽃피우기 표시 예정</Text>
            
            <View className="flex-row gap-3">
              <TouchableOpacity className="bg-level3 px-3 py-1.5 rounded-xl">
                <Text className="text-xs text-main font-bold">📍 내 위치로</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-level3 px-3 py-1.5 rounded-xl">
                <Text className="text-xs text-main font-bold">🌸 꽃 피우기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Pedometer Indicator Card (Level1 Container) */}
        <View className="bg-level1 rounded-3xl p-5 border border-level3 shadow-sm items-center">
          <Text className="text-sm font-bold text-sub-main mb-3">🚶 만보기 (Pedometer)</Text>
          
          <View className="w-full bg-level2 p-4 rounded-2xl border border-level3 mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-xs text-main font-bold">오늘 걸음 수</Text>
              <Text className="text-lg font-extrabold text-main">2,462 걸음</Text>
            </View>
            
            {/* Progress gauge */}
            <View className="w-full h-3 bg-level3 rounded-full overflow-hidden">
              <View className="w-[24.6%] h-full bg-main" />
            </View>
            <View className="flex-row justify-between mt-1">
              <Text className="text-[9px] text-main/50">0</Text>
              <Text className="text-[9px] text-main/50">5천보</Text>
              <Text className="text-[9px] text-main/50">1만보 (목표)</Text>
            </View>
          </View>

          <TouchableOpacity className="w-full bg-main py-4 rounded-2xl items-center shadow-sm">
            <Text className="text-white font-bold text-sm">발걸음 시뮬레이션 (+500걸음)</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}
