import { Image, TouchableOpacity, Text, View } from 'react-native';

/** One row of tappable thumbnails for a single avatar layer (hair, eyes, ...). */
export function AvatarSwatchRow<TId extends string>({
  label,
  sources,
  selected,
  onSelect,
}: {
  label: string;
  sources: Record<TId, number>;
  selected: TId;
  onSelect: (id: TId) => void;
}) {
  return (
    <View className="mb-3 w-full">
      <Text className="text-[10px] text-main/50 mb-1.5">{label}</Text>
      <View className="flex-row gap-2">
        {(Object.keys(sources) as TId[]).map((id) => (
          <TouchableOpacity
            key={id}
            onPress={() => onSelect(id)}
            className={`w-12 h-12 rounded-xl border-2 overflow-hidden bg-level2 items-center justify-center ${
              selected === id ? 'border-sub-main' : 'border-level3'
            }`}
          >
            <Image
              source={sources[id]}
              className="w-full h-full"
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
