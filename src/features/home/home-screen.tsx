import { MoodTrendChart } from "@/components/ui/mood-trend-chart";
import { useApp } from "@/context/AppContext";
import { Image } from "expo-image";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { MoodRecordModal } from "./components/mood-record-modal";

export default function HomeScreen() {
  const { vibeLogs, addVibeLog } = useApp();
  const [modalVisible, setModalVisible] = useState(false);

  const handleSave = (
    score: number,
    sleepMinutes: number,
    emotions: string[],
  ) => {
    addVibeLog(score, sleepMinutes / 60, emotions);
    Alert.alert("저장 완료", "오늘의 기분이 기록되었습니다. (10 코인 획득!)");
    setModalVisible(false);
  };

  return (
    <View
      className="flex-1 bg-background"
      style={{
        padding: 20,
      }}
    >
      {/* Top Info Bar */}
      <View className="flex-row justify-between items-center px-5 pt-4 mb-5">
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
        <View className="bg-level1 rounded-3xl p-6 border border-level3 shadow-sm flex-row items-center justify-between">
          {/* Left: Speech Bubble + Trigger Button */}
          <View className="flex-1 pr-2">
            {/* Speech Bubble */}
            <View className="flex-row items-center mb-6">
              <View className="bg-level2 w-full px-5 py-4 rounded-3xl border border-level3 items-center justify-center">
                <Text className="text-3xl text-main text-center leading-6">
                  오늘의{"\n"}기분은 어때?
                </Text>
              </View>
              {/* Bubble tail (points right, toward character) */}
              <View className="w-4 h-4 bg-level2 border-t border-r border-level3 rotate-45 -ml-2" />
            </View>

            {/* Trigger Button (Main Color) */}
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="self-start bg-main py-4 px-6 rounded-2xl shadow items-center"
            >
              <Text className="text-white font-bold text-lg">기록하기 📝</Text>
            </TouchableOpacity>
          </View>

          {/* Right: Character */}
          <Image
            source={require("@/assets/images/avatar/snapshot/snapshot.png")}
            style={{ width: 180, height: 180 }}
            contentFit="contain"
          />
        </View>

        {/* Record Mood Modal */}
        <MoodRecordModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleSave}
        />

        {/* Skia & Reanimated Interactive Wagmi Mood Line Chart */}
        <View className="px-5 pb-5">
          <MoodTrendChart vibeLogs={vibeLogs} />
        </View>
      </ScrollView>
    </View>
  );
}
