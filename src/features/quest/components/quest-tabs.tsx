import { TouchableOpacity, View, Text } from 'react-native';

export type TabType = 'daily' | 'list' | 'preset';

interface QuestTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function QuestTabs({ activeTab, onTabChange }: QuestTabsProps) {
  return (
    <View className="bg-level2 p-1.5 rounded-2xl flex-row justify-between mb-4 border border-level3">
      <TouchableOpacity
        onPress={() => onTabChange('daily')}
        className={`flex-1 py-2.5 rounded-xl items-center ${activeTab === 'daily' ? 'bg-main shadow-sm' : ''}`}
      >
        <Text
          className={`font-bold text-xs ${activeTab === 'daily' ? 'text-white' : 'text-main'}`}
        >
          일일
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onTabChange('list')}
        className={`flex-1 py-2.5 rounded-xl items-center ${activeTab === 'list' ? 'bg-main shadow-sm' : ''}`}
      >
        <Text
          className={`font-bold text-xs ${activeTab === 'list' ? 'text-white' : 'text-main'}`}
        >
          목록
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onTabChange('preset')}
        className={`flex-1 py-2.5 rounded-xl items-center ${activeTab === 'preset' ? 'bg-main shadow-sm' : ''}`}
      >
        <Text
          className={`font-bold text-xs ${activeTab === 'preset' ? 'text-white' : 'text-main'}`}
        >
          프리셋
        </Text>
      </TouchableOpacity>
    </View>
  );
}
