import { useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useApp } from '@/context/AppContext';
import { CATEGORIES } from './constants';
import { QuestTabs, type TabType } from './components/quest-tabs';
import { DailyQuestList } from './components/daily-quest-list';
import { PresetManager } from './components/preset-manager';

export default function QuestScreen() {
  const {
    quests,
    presets,
    toggleQuest,
    deleteQuest,
    addQuest,
    addPreset,
    removePreset,
    startPreset,
  } = useApp();

  const [activeTab, setActiveTab] = useState<TabType>('daily');

  // Create Quest Form State
  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('운동');
  const [isAddingToPreset, setIsAddingToPreset] = useState(false);

  // Preset Edit State
  const [isPresetEditMode, setIsPresetEditMode] = useState(false);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'daily') setIsPresetEditMode(false);
  };

  const handleAddQuestSubmit = () => {
    if (!newQuestTitle.trim()) {
      Alert.alert('오류', '퀘스트 제목을 입력해주세요.');
      return;
    }

    if (isAddingToPreset) {
      addPreset(newQuestTitle.trim(), selectedCategory);
      Alert.alert(
        '프리셋 추가',
        `"${newQuestTitle}"이(가) 프리셋에 추가되었습니다.`,
      );
    } else {
      addQuest(newQuestTitle.trim(), selectedCategory);
      Alert.alert(
        '퀘스트 추가',
        `"${newQuestTitle}"이(가) 일일 퀘스트에 추가되었습니다.`,
      );
    }

    setNewQuestTitle('');
    setActiveTab(isAddingToPreset ? 'preset' : 'daily');
  };

  const handleStartPreset = () => {
    if (presets.length === 0) {
      Alert.alert('알림', '등록된 프리셋이 없습니다.');
      return;
    }
    startPreset();
    Alert.alert(
      '프리셋 시작',
      '프리셋 퀘스트들이 일일 퀘스트에 추가되었습니다!',
    );
    setActiveTab('daily');
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        className="px-4 py-3"
      >
        {/* Title & Calendar icon placeholder */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-main">Quest</Text>
          <TouchableOpacity className="bg-level1 p-2.5 rounded-xl border border-level3">
            <Text className="text-main">📅</Text>
          </TouchableOpacity>
        </View>

        {/* Quest Tabs */}
        <QuestTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {/* ==================== 1. DAILY TAB ==================== */}
        {activeTab === 'daily' && (
          <DailyQuestList
            quests={quests}
            onToggle={toggleQuest}
            onAddPress={() => {
              setActiveTab('list');
              setIsAddingToPreset(false);
            }}
          />
        )}

        {/* ==================== 2. LIST (ADD QUEST) TAB ==================== */}
        {activeTab === 'list' && (
          <View className="bg-level1 border border-level3 p-5 rounded-3xl shadow-sm">
            <Text className="text-lg font-bold text-main mb-4">
              새 퀘스트 추가하기
            </Text>

            {/* Target choice (Daily vs Preset) */}
            <View className="flex-row gap-2 mb-4">
              <TouchableOpacity
                onPress={() => setIsAddingToPreset(false)}
                className={`flex-1 py-2.5 rounded-xl items-center border ${!isAddingToPreset ? 'bg-sub-main border-sub-main' : 'bg-level2 border-level3'}`}
              >
                <Text
                  className={`font-semibold text-xs ${!isAddingToPreset ? 'text-white' : 'text-main'}`}
                >
                  일일 퀘스트에 추가
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsAddingToPreset(true)}
                className={`flex-1 py-2.5 rounded-xl items-center border ${isAddingToPreset ? 'bg-sub-main border-sub-main' : 'bg-level2 border-level3'}`}
              >
                <Text
                  className={`font-semibold text-xs ${isAddingToPreset ? 'text-white' : 'text-main'}`}
                >
                  프리셋에 추가
                </Text>
              </TouchableOpacity>
            </View>

            {/* Input Field */}
            <View className="mb-4">
              <Text className="text-xs font-bold text-main mb-2">
                퀘스트 내용
              </Text>
              <TextInput
                value={newQuestTitle}
                onChangeText={setNewQuestTitle}
                placeholder="예: 물 500ml 마시기, 책 10페이지 읽기"
                placeholderTextColor="#a0aec0"
                className="bg-level2 border border-level3 px-4 py-3.5 rounded-2xl text-main text-sm"
              />
            </View>

            {/* Category selection */}
            <View className="mb-6">
              <Text className="text-xs font-bold text-main mb-2">카테고리</Text>
              <View className="flex-row justify-between gap-1">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setSelectedCategory(cat)}
                      className={`flex-1 py-2.5 rounded-xl items-center border ${isSelected ? 'bg-main border-main' : 'bg-level2 border-level3'}`}
                    >
                      <Text
                        className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-main'}`}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Submit button */}
            <TouchableOpacity
              onPress={handleAddQuestSubmit}
              className="bg-main py-4.5 rounded-2xl items-center"
            >
              <Text className="text-white font-extrabold text-base">
                {isAddingToPreset
                  ? '프리셋에 등록하기 💾'
                  : '일일 퀘스트에 추가하기 ➕'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ==================== 3. PRESET TAB ==================== */}
        {activeTab === 'preset' && (
          <PresetManager
            presets={presets}
            isEditMode={isPresetEditMode}
            onToggleEditMode={() => setIsPresetEditMode(!isPresetEditMode)}
            onRemovePreset={removePreset}
            onStartPreset={handleStartPreset}
            onAddPress={() => {
              setActiveTab('list');
              setIsAddingToPreset(true);
            }}
          />
        )}
      </ScrollView>
    </View>
  );
}
