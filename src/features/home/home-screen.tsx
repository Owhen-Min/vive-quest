import { useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useApp } from '@/context/AppContext';
import { VibeLogList } from './components/vibe-log-list';
import { MoodRecordModal } from './components/mood-record-modal';

export default function HomeScreen() {
  const { vibeLogs, addVibeLog } = useApp();
  const [modalVisible, setModalVisible] = useState(false);

  const handleSave = (score: number, sleepMinutes: number, emotions: string[]) => {
    addVibeLog(score, sleepMinutes / 60, emotions);
    Alert.alert('저장 완료', '오늘의 기분이 기록되었습니다. (10 코인 획득!)');
    setModalVisible(false);
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        className="px-4 py-3"
      >
        {/* Top Info Bar */}
        <View className="flex-row justify-between items-center mb-4">
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

        {/* Graph Card */}
        <VibeLogList vibeLogs={vibeLogs} />

        {/* Record trigger card (Level1 Container) */}
        <View className="bg-level1 rounded-3xl p-5 border border-level3 shadow-sm items-center">
          <View className="bg-level2 px-4 py-2 rounded-2xl mb-4 border border-level3">
            <Text className="text-sm font-semibold text-main text-center">
              오늘의 기분은 어때?
            </Text>
          </View>

          {/* Character Placeholder Box */}
          <View className="w-24 h-24 bg-level2 rounded-full border border-level3 justify-center items-center mb-4">
            <Text className="text-4xl">🧝</Text>
          </View>

          {/* Trigger Button (Main Color) */}
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="w-full bg-main py-4.5 rounded-2xl shadow items-center"
          >
            <Text className="text-white font-bold text-lg">기록하기 📝</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Record Mood Modal */}
      <MoodRecordModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
      />
    </View>
  );
}
