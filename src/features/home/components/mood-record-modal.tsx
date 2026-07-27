import { useState } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { EMOTIONS } from '../constants';

interface MoodRecordModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (score: number, sleepMinutes: number, emotions: string[]) => void;
}

export function MoodRecordModal({ visible, onClose, onSave }: MoodRecordModalProps) {
  const [selectedScore, setSelectedScore] = useState<number>(0);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [sleepMinutes, setSleepMinutes] = useState<number>(360); // 6 hours default (360 mins)

  const handleToggleEmotion = (emotion: string) => {
    if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions((prev) => prev.filter((e) => e !== emotion));
    } else {
      setSelectedEmotions((prev) => [...prev, emotion]);
    }
  };

  const handleAdjustSleep = (amount: number) => {
    setSleepMinutes((prev) => Math.max(0, prev + amount));
  };

  const formatSleepTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  const handleSave = () => {
    onSave(selectedScore, sleepMinutes, selectedEmotions);
    // Reset form
    setSelectedScore(0);
    setSelectedEmotions([]);
    setSleepMinutes(360);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-background rounded-t-3xl p-6 border-t border-level3 max-h-[85%]">
          {/* Modal Header */}
          <View className="flex-row justify-between items-center mb-5 pb-3 border-b border-level3">
            <Text className="text-xl font-bold text-main">
              오늘의 상태 기록
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-lg font-bold text-sub-main">닫기</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="space-y-6">
            {/* 1. Mood Score Selection */}
            <View className="mb-5">
              <Text className="text-sm font-bold text-main mb-3">
                1. 기분 점수 선택 (-5 ~ 5)
              </Text>
              <View className="flex-row justify-between flex-wrap gap-1">
                {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((score) => {
                  const isSelected = selectedScore === score;
                  return (
                    <TouchableOpacity
                      key={score}
                      onPress={() => setSelectedScore(score)}
                      className={`w-10 h-10 rounded-full justify-center items-center border ${
                        isSelected
                          ? 'bg-main border-main'
                          : 'bg-level1 border-level3'
                      }`}
                    >
                      <Text
                        className={`font-bold ${isSelected ? 'text-white' : 'text-main'}`}
                      >
                        {score > 0 ? `+${score}` : score}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 2. Emotion Stamps Selection */}
            <View className="mb-5">
              <Text className="text-sm font-bold text-main mb-3">
                2. 감정 스탬프 (다중 선택)
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {EMOTIONS.map((emotion) => {
                  const isSelected = selectedEmotions.includes(emotion);
                  return (
                    <TouchableOpacity
                      key={emotion}
                      onPress={() => handleToggleEmotion(emotion)}
                      className={`px-4 py-2.5 rounded-2xl border ${
                        isSelected
                          ? 'bg-sub-main border-sub-main'
                          : 'bg-level1 border-level3'
                      }`}
                    >
                      <Text
                        className={`font-semibold ${isSelected ? 'text-white' : 'text-main'}`}
                      >
                        {emotion}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 3. Sleep Hours Editor */}
            <View className="mb-6">
              <Text className="text-sm font-bold text-main mb-3">
                3. 수면 시간 작성
              </Text>
              <View className="bg-level1 border border-level3 p-4 rounded-2xl flex-row justify-between items-center">
                <TouchableOpacity
                  onPress={() => handleAdjustSleep(-30)}
                  className="bg-level2 w-12 h-12 rounded-xl justify-center items-center border border-level3"
                >
                  <Text className="text-lg font-bold text-main">-30m</Text>
                </TouchableOpacity>

                <View className="items-center">
                  <Text className="text-2xl font-extrabold text-main">
                    {formatSleepTime(sleepMinutes)}
                  </Text>
                  <Text className="text-[10px] text-sub-main font-semibold mt-1">
                    기본값 06:00
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleAdjustSleep(30)}
                  className="bg-level2 w-12 h-12 rounded-xl justify-center items-center border border-level3"
                >
                  <Text className="text-lg font-bold text-main">+30m</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Buttons */}
            <View className="flex-row gap-3 mt-4 mb-8">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 bg-level2 py-4 rounded-2xl border border-level3 items-center"
              >
                <Text className="text-main font-bold">취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                className="flex-1 bg-main py-4 rounded-2xl items-center"
              >
                <Text className="text-white font-bold">저장하기 💾</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
