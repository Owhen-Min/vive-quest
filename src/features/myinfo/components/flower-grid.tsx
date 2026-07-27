import { Alert, Text, TouchableOpacity, View } from 'react-native';

interface FlowerItem {
  id: string;
  name: string;
  emoji: string;
  collected: boolean;
  count: number;
}

const FLOWERS: FlowerItem[] = [
  { id: 'rose', name: '장미', emoji: '🌹', collected: true, count: 3 },
  { id: 'sunflower', name: '해바라기', emoji: '🌻', collected: true, count: 1 },
  { id: 'tulip', name: '튤립', emoji: '🌷', collected: false, count: 0 },
  { id: 'hibiscus', name: '무궁화', emoji: '🌺', collected: true, count: 5 },
  { id: 'cherry', name: '벚꽃', emoji: '🌸', collected: false, count: 0 },
  { id: 'blossom', name: '양귀비', emoji: '🌼', collected: true, count: 2 },
  { id: 'clover', name: '클로버', emoji: '🍀', collected: true, count: 12 },
  { id: 'herb', name: '허브', emoji: '🌿', collected: false, count: 0 },
];

export function FlowerGrid() {
  const handleFlowerPress = (flower: FlowerItem) => {
    if (flower.collected) {
      Alert.alert(flower.name, `총 ${flower.count}송이를 수집했습니다! 🌸`);
    } else {
      Alert.alert(
        '미수집',
        `아직 발견하지 못한 꽃입니다. 모험을 통해 씨앗을 틔워보세요.`,
      );
    }
  };

  return (
    <View className="bg-level1 rounded-3xl p-5 border border-level3 shadow-sm">
      <Text className="text-sm font-bold text-sub-main mb-4">
        🌸 수집한 꽃 도감
      </Text>

      <View className="flex-row flex-wrap justify-between gap-y-4">
        {FLOWERS.map((flower) => (
          <TouchableOpacity
            key={flower.id}
            onPress={() => handleFlowerPress(flower)}
            className={`w-[22%] bg-level2 aspect-square rounded-2xl border justify-center items-center ${
              flower.collected
                ? 'border-sub-main/50 opacity-100'
                : 'border-level3 opacity-30'
            }`}
          >
            <Text className="text-2xl mb-1">{flower.emoji}</Text>
            {flower.collected && flower.count > 1 && (
              <View className="absolute bottom-1 right-1 bg-sub-main w-4 h-4 rounded-full justify-center items-center">
                <Text className="text-[8px] text-white font-bold">
                  {flower.count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
