import type { VibeLog } from "@/context/AppContext";
import { Text, View } from "react-native";

interface VibeLogListProps {
  vibeLogs: VibeLog[];
}

/** Convert vibe score (-5 to 5) to height percentage (0% to 100%) for chart rendering */
const getPointHeight = (score: number) => {
  const minScore = -5;
  const maxScore = 5;
  const percentage = ((score - minScore) / (maxScore - minScore)) * 100;
  return `${Math.min(Math.max(percentage, 5), 95)}%`;
};

export function VibeLogList({ vibeLogs }: VibeLogListProps) {
  return (
    <View className="bg-level1 rounded-3xl mb-6 border border-level3 shadow-sm">
      <View className="flex-row items-center mb-3">
        <Text className="text-sm font-bold text-sub-main">
          📈 최근 7일 기분 추이
        </Text>
      </View>

      {/* Graph Layout Container */}
      <View className="h-64 flex-row bg-level2 rounded-2xl p-3 border border-level3 relative">
        {/* Y-axis Labels (Mood score 5 to -5) */}
        <View className="justify-between pr-2 border-r border-level3/40 h-full py-1">
          {[5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5].map((val) => (
            <Text key={val} className="text-[9px] text-main/60 text-right w-4">
              {val}
            </Text>
          ))}
        </View>

        {/* Chart Area */}
        <View className="flex-1 flex-row justify-around items-end h-full relative">
          {/* Zero-line indicator */}
          <View className="absolute left-0 right-0 h-[1px] bg-main/20 bottom-1/2" />

          {/* Data points */}
          {vibeLogs.slice(-7).map((log) => (
            <View
              key={log.id}
              className="items-center h-full justify-end w-10 relative"
            >
              {/* Sleep Hours (Top text) */}
              <Text className="text-[9px] text-sub-main font-semibold absolute top-0 text-center">
                {log.sleepHours.toFixed(1)}h
              </Text>

              {/* Score Point */}
              <View
                style={{ bottom: getPointHeight(log.score) as any }}
                className="absolute w-3 h-3 rounded-full bg-main z-10 border-2 border-level1 justify-center items-center"
              />

              {/* Day Label (Bottom) */}
              <Text className="text-[10px] text-main/80 font-medium mt-1">
                {log.date}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Mood Scale Explanations */}
      <View className="flex-row justify-between mt-3 px-1">
        <Text className="text-[10px] text-red-500 font-bold">
          😡 -5 매우나쁨
        </Text>
        <Text className="text-[10px] text-orange-500 font-bold">
          😕 -2 나쁨
        </Text>
        <Text className="text-[10px] text-yellow-600 font-bold">😐 0 보통</Text>
        <Text className="text-[10px] text-green-600 font-bold">🙂 2 좋음</Text>
        <Text className="text-[10px] text-emerald-600 font-bold">
          😆 5 매우좋음
        </Text>
      </View>
    </View>
  );
}
