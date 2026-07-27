import { useState } from 'react';
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export function ProfileCard() {
  const [nickname, setNickname] = useState('홍길동');
  const [title, setTitle] = useState('꽃을 사랑하는');
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveProfile = () => {
    setIsEditing(false);
    Alert.alert('프로필 수정', '프로필 정보가 저장되었습니다.');
  };

  return (
    <View className="bg-level1 rounded-3xl p-5 border border-level3 shadow-sm mb-6">
      <View className="flex-row items-center mb-4">
        {/* Character Avatar Box */}
        <View className="w-16 h-16 bg-level2 rounded-full border border-level3 justify-center items-center mr-4">
          <Text className="text-3xl">🧝</Text>
        </View>

        {/* Profile Info Details */}
        <View className="flex-1">
          {isEditing ? (
            <View className="gap-2">
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="칭호"
                className="bg-level2 border border-level3 px-2 py-1 rounded text-xs text-sub-main font-bold"
              />
              <TextInput
                value={nickname}
                onChangeText={handleSaveProfile}
                onSubmitEditing={handleSaveProfile}
                className="bg-level2 border border-level3 px-2 py-1 rounded text-sm text-main font-bold"
              />
            </View>
          ) : (
            <View>
              <Text className="text-xs text-sub-main font-bold mb-0.5">
                {title}
              </Text>
              <Text className="text-lg font-bold text-main">
                {nickname}
              </Text>
              <Text className="text-[10px] text-main/50">
                시작 날짜: 2026-07-19
              </Text>
            </View>
          )}
        </View>

        {/* Profile Edit Trigger */}
        <TouchableOpacity
          onPress={() => {
            if (isEditing) handleSaveProfile();
            else setIsEditing(true);
          }}
          className="bg-level2 px-3 py-2 rounded-xl border border-level3"
        >
          <Text className="text-[10px] font-bold text-main">
            {isEditing ? '완료' : '수정'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Level / XP Progress Bar */}
      <View className="bg-level2 p-4 rounded-2xl border border-level3">
        <View className="flex-row justify-between items-center mb-1.5">
          <Text className="text-xs font-bold text-main">Lv. 36</Text>
          <Text className="text-[10px] font-semibold text-sub-main">
            50,000 / 100,000 XP
          </Text>
        </View>
        <View className="w-full h-3 bg-level3 rounded-full overflow-hidden">
          <View className="w-[50%] h-full bg-main" />
        </View>
      </View>
    </View>
  );
}
