import { Text, TouchableOpacity, View } from 'react-native';
import type { Preset } from '@/context/AppContext';

interface PresetManagerProps {
  presets: Preset[];
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onRemovePreset: (id: string) => void;
  onStartPreset: () => void;
  onAddPress: () => void;
}

export function PresetManager({
  presets,
  isEditMode,
  onToggleEditMode,
  onRemovePreset,
  onStartPreset,
  onAddPress,
}: PresetManagerProps) {
  return (
    <View>
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-sm font-semibold text-sub-main">
          저장된 일일 프리셋 ({presets.length})
        </Text>
        <TouchableOpacity
          onPress={onToggleEditMode}
          className={`px-3 py-1.5 rounded-xl border ${isEditMode ? 'bg-red-500 border-red-500' : 'bg-level2 border-level3'}`}
        >
          <Text
            className={`text-[10px] font-bold ${isEditMode ? 'text-white' : 'text-main'}`}
          >
            {isEditMode ? '수정 완료' : '프리셋 수정'}
          </Text>
        </TouchableOpacity>
      </View>

      {presets.length === 0 ? (
        <View className="bg-level1 border border-level3 rounded-3xl p-10 items-center justify-center mb-4">
          <Text className="text-main/50 text-sm text-center">
            등록된 프리셋이 없습니다.
          </Text>
          <TouchableOpacity
            onPress={onAddPress}
            className="mt-3 bg-level2 px-4 py-2 rounded-xl border border-level3"
          >
            <Text className="text-xs text-sub-main font-bold">
              ➕ 첫 프리셋 만들기
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="gap-3">
          {presets.map((p) => (
            <View
              key={p.id}
              className="bg-level1 border border-level3 rounded-3xl p-4 flex-row items-center justify-between shadow-sm"
            >
              <View className="flex-row items-center flex-1">
                <View className="bg-level2 w-10 h-10 rounded-2xl justify-center items-center mr-3 border border-level3">
                  <Text className="text-base">
                    {p.category === '운동'
                      ? '🏃'
                      : p.category === '공부'
                        ? '📖'
                        : p.category === '생활'
                          ? '🍳'
                          : '✨'}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-main">
                    {p.title}
                  </Text>
                  <Text className="text-[10px] text-sub-main font-semibold mt-0.5">
                    {p.category}
                  </Text>
                </View>
              </View>

              {/* Edit mode: Delete button (subtraction) */}
              {isEditMode && (
                <TouchableOpacity
                  onPress={() => onRemovePreset(p.id)}
                  className="w-8 h-8 rounded-xl bg-red-100 border border-red-300 justify-center items-center"
                >
                  <Text className="text-red-500 font-extrabold text-xs">
                    ➖
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          {/* Preset Actions (Modify & Start) */}
          {!isEditMode && (
            <View className="flex-row gap-3 mt-6">
              <TouchableOpacity
                onPress={onAddPress}
                className="flex-1 bg-level1 border border-level3 py-4 rounded-3xl items-center"
              >
                <Text className="text-main font-bold text-xs">
                  ➕ 프리셋 추가
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onStartPreset}
                className="flex-1 bg-main py-4 rounded-3xl items-center shadow"
              >
                <Text className="text-white font-bold text-xs">
                  🚀 이 프리셋으로 시작
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
