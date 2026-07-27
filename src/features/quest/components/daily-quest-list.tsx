import { Text, TouchableOpacity, View } from 'react-native';
import type { Quest } from '@/context/AppContext';

interface DailyQuestListProps {
  quests: Quest[];
  onToggle: (id: string) => void;
  onAddPress: () => void;
}

export function DailyQuestList({ quests, onToggle, onAddPress }: DailyQuestListProps) {
  const activeQuests = quests.filter((q) => !q.completed);
  const completedQuests = quests.filter((q) => q.completed);

  return (
    <View>
      {/* Quest count summary */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-sub-main">
          퀘스트({activeQuests.length}) / 완료({completedQuests.length})
        </Text>
      </View>

      {/* Empty State */}
      {activeQuests.length === 0 ? (
        <TouchableOpacity
          onPress={onAddPress}
          className="bg-level1 border-2 border-dashed border-level3 rounded-3xl p-10 items-center justify-center mb-4"
        >
          <Text className="text-5xl mb-3">➕</Text>
          <Text className="text-main font-bold text-base text-center">
            퀘스트를 추가해 주세요
          </Text>
          <Text className="text-[11px] text-main/50 text-center mt-1">
            여기를 누르면 퀘스트 목록으로 이동합니다.
          </Text>
        </TouchableOpacity>
      ) : (
        /* Quest List */
        <View className="gap-3">
          {activeQuests.map((q) => (
            <View
              key={q.id}
              className="bg-level1 border border-level3 rounded-3xl p-4 flex-row items-center justify-between shadow-sm"
            >
              <View className="flex-row items-center flex-1 pr-3">
                <View className="bg-level2 w-10 h-10 rounded-2xl justify-center items-center mr-3 border border-level3">
                  <Text className="text-base">
                    {q.category === '운동'
                      ? '🏃'
                      : q.category === '공부'
                        ? '📖'
                        : q.category === '생활'
                          ? '🍳'
                          : '✨'}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-main">
                    {q.title}
                  </Text>
                  <Text className="text-[10px] text-sub-main font-semibold mt-0.5">
                    {q.category}
                  </Text>
                </View>
              </View>

              {/* Complete Checkbox */}
              <TouchableOpacity
                onPress={() => onToggle(q.id)}
                className="w-8 h-8 rounded-xl border-2 border-sub-main bg-level2 justify-center items-center"
              >
                <Text className="text-[10px]">⬜</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Add quest floating-like button at bottom */}
      {activeQuests.length > 0 && (
        <TouchableOpacity
          onPress={onAddPress}
          className="mt-6 bg-level2 border border-level3 border-dashed py-4 rounded-3xl items-center flex-row justify-center gap-2"
        >
          <Text className="text-sub-main font-extrabold text-base">
            ➕ 퀘스트 추가하기
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
