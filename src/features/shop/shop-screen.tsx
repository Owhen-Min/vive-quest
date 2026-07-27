import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useApp, Currency } from '@/context/AppContext';
import { useTopBarOptions } from '@/context/TopBarContext';

type ShopCategory = 'new' | 'outfit' | 'furniture' | 'wallpaper';

interface ShopItem {
  id: string;
  name: string;
  category: ShopCategory;
  price: number;
  currencyType: keyof Currency;
  icon: string; // Emoji representing the item
  tag?: 'NEW' | '인기' | '한정';
  tagColor?: string;
}

const SHOP_ITEMS: ShopItem[] = [
  // NEW / Popular Items
  { id: 'water_bed', name: '물침대', category: 'furniture', price: 500, currencyType: 'gem', icon: '🛏️', tag: 'NEW', tagColor: 'bg-orange-500' },
  { id: 'dolphin_tube', name: '돌고래 튜브', category: 'furniture', price: 500, currencyType: 'coin', icon: '🐬', tag: '인기', tagColor: 'bg-red-500' },
  { id: 'straw_hat', name: '밀짚모자', category: 'outfit', price: 100, currencyType: 'starDust', icon: '👒', tag: '한정', tagColor: 'bg-purple-500' },
  
  // Outfits
  { id: 'summer_shirt', name: '여름 바캉스 셔츠', category: 'outfit', price: 200, currencyType: 'coin', icon: '👕' },
  { id: 'sunglasses', name: '선글라스', category: 'outfit', price: 120, currencyType: 'gem', icon: '🕶️' },
  
  // Furniture/Decorations
  { id: 'house_plant', name: '화분', category: 'furniture', price: 150, currencyType: 'coin', icon: '🪴' },
  { id: 'wooden_chair', name: '나무 의자', category: 'furniture', price: 250, currencyType: 'coin', icon: '🪑' },

  // Wallpapers
  { id: 'sea_wallpaper', name: '바다 벽지', category: 'wallpaper', price: 300, currencyType: 'starDust', icon: '🌊' },
  { id: 'forest_wallpaper', name: '숲속 벽지', category: 'wallpaper', price: 300, currencyType: 'starDust', icon: '🌳' },
];

export default function ShopScreen() {
  const { inventory, buyItem, equipItem, equipped } = useApp();
  const [activeCategory, setActiveCategory] = useState<ShopCategory>('new');
  const [viewMode, setViewMode] = useState<'room' | 'character'>('room');

  // 상점에서는 스타더스트도 소비하므로 상단바에 세 재화를 모두 노출한다.
  useTopBarOptions({ currencies: ['gem', 'coin', 'starDust'] });

  const handlePurchase = (item: ShopItem) => {
    if (inventory.includes(item.id)) {
      // If already owned, equip it
      let equipCategory = '';
      if (item.category === 'outfit') {
        // Simple mapping for demo
        if (item.id === 'straw_hat' || item.id === 'sunglasses') equipCategory = 'accessory1';
        else equipCategory = 'outfit';
      } else if (item.category === 'furniture') {
        equipCategory = 'furnitureLarge';
      } else if (item.category === 'wallpaper') {
        equipCategory = 'wallpaper';
      }

      if (equipCategory) {
        equipItem(equipCategory, item.id);
        Alert.alert('장착 완료', `"${item.name}"을(를) 장착했습니다.`);
      }
      return;
    }

    const success = buyItem(item.id, item.price, item.currencyType);
    if (success) {
      Alert.alert('구매 성공', `"${item.name}"을(를) 구매했습니다! 인벤토리에 추가되었습니다.`);
    } else {
      Alert.alert('구매 실패', '재화가 부족합니다.');
    }
  };

  // Filter items based on active category
  const displayedItems = SHOP_ITEMS.filter((item) => {
    if (activeCategory === 'new') {
      return item.tag !== undefined; // Show items with tags in 'NEW' tab
    }
    return item.category === activeCategory;
  });

  const getCurrencyEmoji = (type: keyof Currency) => {
    if (type === 'gem') return '💎';
    if (type === 'coin') return '🪙';
    return '✨';
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="px-4 py-3">

        {/* Isometric Room / Character Viewer Area (Level1 Container) */}
        <View className="bg-level1 rounded-3xl p-4 mb-5 border border-level3 shadow-sm relative">
          
          {/* View toggle (Room vs Character) */}
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row bg-level2 p-1 rounded-xl border border-level3">
              <TouchableOpacity 
                onPress={() => setViewMode('room')}
                className={`px-3 py-1.5 rounded-lg ${viewMode === 'room' ? 'bg-main' : ''}`}
              >
                <Text className={`text-[10px] font-bold ${viewMode === 'room' ? 'text-white' : 'text-main'}`}>방</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setViewMode('character')}
                className={`px-3 py-1.5 rounded-lg ${viewMode === 'character' ? 'bg-main' : ''}`}
              >
                <Text className={`text-[10px] font-bold ${viewMode === 'character' ? 'text-white' : 'text-main'}`}>캐릭터</Text>
              </TouchableOpacity>
            </View>
            
            {/* Inventory Icon placeholder */}
            <TouchableOpacity className="bg-level2 p-2 rounded-xl border border-level3">
              <Text className="text-xs">💼 인벤토리</Text>
            </TouchableOpacity>
          </View>

          {/* Graphical representation box (Isometric room mock) */}
          <View className="h-44 bg-level2 rounded-2xl border border-level3 items-center justify-center relative overflow-hidden">
            {viewMode === 'room' ? (
              <View className="items-center justify-center">
                <Text className="text-xs text-sub-main font-bold mb-2">🏡 나의 아이소메트릭 방</Text>
                <Text className="text-5xl">🛌🪑🪴</Text>
                
                {/* Active wallpaper indicator */}
                <Text className="text-[10px] text-main/50 mt-2">
                  벽지: {equipped.wallpaper === 'default_wallpaper' ? '기본 벽지' : equipped.wallpaper} | 가구: {equipped.furnitureLarge === 'default' ? '없음' : equipped.furnitureLarge}
                </Text>
              </View>
            ) : (
              <View className="items-center justify-center">
                <Text className="text-xs text-sub-main font-bold mb-2">🧝 나의 캐릭터</Text>
                <Text className="text-5xl">👒👕🕶️</Text>
                
                {/* Active outfits indicator */}
                <Text className="text-[10px] text-main/50 mt-2">
                  의상: {equipped.outfit === 'default' ? '기본' : equipped.outfit} | 액세서리: {equipped.accessory1 === 'default' ? '없음' : equipped.accessory1}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Shop Category Tabs */}
        <View className="flex-row gap-2 mb-4">
          {(['new', 'outfit', 'furniture', 'wallpaper'] as ShopCategory[]).map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setActiveCategory(cat)}
                className={`flex-1 py-2.5 rounded-xl border items-center justify-center ${
                  isSelected ? 'bg-sub-main border-sub-main' : 'bg-level1 border-level3'
                }`}
              >
                <Text className={`text-[11px] font-bold ${isSelected ? 'text-white' : 'text-main'}`}>
                  {cat === 'new' ? 'NEW ✨' : cat === 'outfit' ? '의상' : cat === 'furniture' ? '장식' : '벽지'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Promotional Season Package (Level1 Container) */}
        {activeCategory === 'new' && (
          <View className="bg-level1 rounded-3xl p-4 mb-5 border border-level3 shadow-sm flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-[10px] text-blue-500 font-bold mb-1">🌊 Summer Season</Text>
              <Text className="text-lg font-bold text-main mb-2">여름 바다 패키지</Text>
              <TouchableOpacity className="bg-sub-main px-3 py-1.5 rounded-xl self-start">
                <Text className="text-white text-[10px] font-bold">보러가기!</Text>
              </TouchableOpacity>
            </View>
            <View className="w-20 h-20 bg-level2 rounded-2xl justify-center items-center border border-level3">
              <Text className="text-4xl">🐬👒</Text>
            </View>
          </View>
        )}

        {/* Shop Items Grid (2 columns layout) */}
        <View className="flex-row flex-wrap justify-between gap-y-4">
          {displayedItems.map((item) => {
            const isOwned = inventory.includes(item.id);
            let isEquipped = false;
            if (item.category === 'outfit') {
              isEquipped = equipped.outfit === item.id || equipped.accessory1 === item.id;
            } else if (item.category === 'furniture') {
              isEquipped = equipped.furnitureLarge === item.id;
            } else if (item.category === 'wallpaper') {
              isEquipped = equipped.wallpaper === item.id;
            }

            return (
              <View 
                key={item.id}
                className="bg-level1 border border-level3 w-[48%] rounded-3xl p-3.5 items-center shadow-sm relative"
              >
                {/* Tag badge (Top Left) */}
                {item.tag && (
                  <View className={`absolute top-2 left-2 ${item.tagColor || 'bg-sub-main'} px-2 py-0.5 rounded-full z-10`}>
                    <Text className="text-[8px] text-white font-bold">{item.tag}</Text>
                  </View>
                )}

                {/* Item Display Icon */}
                <View className="w-16 h-16 bg-level2 rounded-2xl justify-center items-center border border-level3 mb-3 mt-1">
                  <Text className="text-3xl">{item.icon}</Text>
                </View>

                {/* Item Name */}
                <Text className="text-xs font-bold text-main text-center mb-2" numberOfLines={1}>
                  {item.name}
                </Text>

                {/* Purchase/Equip Button */}
                <TouchableOpacity
                  onPress={() => handlePurchase(item)}
                  className={`w-full py-2.5 rounded-xl flex-row justify-center items-center border ${
                    isEquipped 
                      ? 'bg-level3 border-level3' 
                      : isOwned 
                        ? 'bg-level2 border-sub-main' 
                        : 'bg-level2 border-level3'
                  }`}
                >
                  {isEquipped ? (
                    <Text className="text-[10px] text-main font-bold">장착 중 👕</Text>
                  ) : isOwned ? (
                    <Text className="text-[10px] text-sub-main font-bold">장착하기 💾</Text>
                  ) : (
                    <>
                      <Text className="text-[10px] mr-1">{getCurrencyEmoji(item.currencyType)}</Text>
                      <Text className="text-[10px] text-main font-bold">{item.price}</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

      </ScrollView>
    </View>
  );
}
