import { MoodTrendChart } from "@/components/ui/mood-trend-chart";
import { useApp } from "@/context/AppContext";
import { Image } from "expo-image";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { MoodRecordModal } from "./components/mood-record-modal";

export default function HomeScreen() {
  const { vibeLogs, addVibeLog } = useApp();
  const [modalVisible, setModalVisible] = useState(false);

  const handleSave = async (
    score: number,
    sleepMinutes: number,
    emotions: string[],
  ) => {
    try {
      await addVibeLog(score, sleepMinutes / 60, emotions);
      Alert.alert("저장 완료", "오늘의 기분이 기록되었습니다. (10 코인 획득!)");
      setModalVisible(false);
    } catch (error) {
      console.error("[HomeScreen] 기분 기록 저장 실패", error);
      Alert.alert(
        "저장 실패",
        "기분을 저장하는 중 문제가 발생했습니다. 다시 시도해 주세요.",
      );
    }
  };

  return (
    <View
      className="flex-1 bg-background"
      style={{
        padding: 20,
      }}
    >
      {/* Top Info Bar */}
      <View className="flex-row justify-between items-center px-5 mb-2">
        <Text className="text-2xl font-bold text-main">VIBE</Text>
        <View className="flex-row gap-2">
          <TouchableOpacity className="bg-level1 p-2 rounded-xl border border-level3">
            <Text className="text-xs text-sub-main font-bold">📅 달력</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-level1 p-2 rounded-xl border border-level3">
            <Text className="text-xs text-sub-main font-bold">📊 통계</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView className="px-5 py-4">
        {/* Record trigger card (Level1 Container) */}
        <View className="overflow-visible bg-level1 rounded-3xl p-6 border border-level3 shadow-sm flex-row items-center justify-between">
          {/* Left: Speech Bubble + Trigger Button (2/3) */}
          <View className="flex-[2] pr-2">
            {/* Speech Bubble */}
            <View className="w-full flex-row items-center mb-6">
              <View className="flex-1 bg-white px-3 py-2 rounded-3xl border border-level3 items-center justify-center">
                <Text className="text-2xl text-main font-semibold text-center leading-10">
                  오늘의{"\n"}기분은 어때?
                </Text>
              </View>
              {/* Bubble tail (points right, toward character) */}
              <View className="w-4 h-4 bg-white border-t border-r border-level3 rotate-45 -ml-2 mt-5" />
            </View>

            {/* Trigger Button (Main Color) */}
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="self-center bg-main py-4 px-4 rounded-2xl shadow items-center"
            >
              <Text className="text-white font-bold text-lg">기록하기 📝</Text>
            </TouchableOpacity>
          </View>

          {/* Right: Character (1/3 slot; visually scaled to 150% without changing flex layout) */}
          <View className="flex-1 overflow-visible">
            <Image
              source={require("@/assets/images/avatar/snapshot/snapshot.png")}
              style={{
                width: "100%",
                aspectRatio: 1,
                transform: [{ scale: 1.8 }],
              }}
              contentFit="contain"
            />
          </View>
        </View>

        {/* Record Mood Modal */}
        <MoodRecordModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleSave}
        />

        {/* Skia & Reanimated Interactive Wagmi Mood Line Chart */}
        <View className="mt-5 ">
          <MoodTrendChart vibeLogs={vibeLogs} />
        </View>
      </ScrollView>
    </View>
  );
}
