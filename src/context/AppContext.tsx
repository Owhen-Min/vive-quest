import React, { createContext, useContext, useState, useEffect } from 'react';

// === Types ===

export interface VibeLog {
  id: string;
  date: string;       // e.g., "2026-07-22"
  score: number;      // -5 to 5
  sleepHours: number; // e.g., 6.5
  emotions: string[];  // e.g., ["행복", "차분"]
  timestamp: string;  // e.g., "14:20"
}

export interface Quest {
  id: string;
  title: string;
  category: string;
  completed: boolean;
}

export interface Preset {
  id: string;
  title: string;
  category: string;
}

export interface Currency {
  gem: number;
  coin: number;
  starDust: number;
}

export interface AppState {
  vibeLogs: VibeLog[];
  quests: Quest[];
  presets: Preset[];
  currency: Currency;
  inventory: string[]; // List of purchased item IDs
  equipped: {
    // Character customizations
    hair: string;
    eyes: string;
    face: string;
    skin: string;
    outfit: string;
    shoes: string;
    accessory1: string;
    accessory2: string;
    // Room customizations
    wallpaper: string;
    floor: string;
    door: string;
    window: string;
    furnitureLarge: string;
    furnitureSmall: string;
  };
}

interface AppContextType extends AppState {
  addVibeLog: (score: number, sleepHours: number, emotions: string[]) => void;
  addQuest: (title: string, category: string) => void;
  toggleQuest: (id: string) => void;
  deleteQuest: (id: string) => void;
  addPreset: (title: string, category: string) => void;
  removePreset: (id: string) => void;
  startPreset: () => void;
  buyItem: (itemId: string, price: number, currencyType: keyof Currency) => boolean;
  equipItem: (category: string, itemId: string) => void;
}

// === Initial Data ===

const initialVibeLogs: VibeLog[] = [
  { id: '1', date: '6일 전', score: -2, sleepHours: 5.5, emotions: ['슬픔'], timestamp: '22:10' },
  { id: '2', date: '5일 전', score: 1.5, sleepHours: 7.0, emotions: ['보통'], timestamp: '21:30' },
  { id: '3', date: '4일 전', score: 0.2, sleepHours: 6.0, emotions: ['기쁨'], timestamp: '23:05' },
  { id: '4', date: '3일 전', score: 2.3, sleepHours: 8.0, emotions: ['설렘'], timestamp: '20:15' },
  { id: '5', date: '2일 전', score: 4.0, sleepHours: 8.5, emotions: ['설렘', '기쁨'], timestamp: '22:45' },
  { id: '6', date: '어제', score: 1.5, sleepHours: 6.5, emotions: ['보통'], timestamp: '23:00' },
  { id: '7', date: '오늘', score: -0.8, sleepHours: 5.0, emotions: ['피곤'], timestamp: '01:30' },
];

const initialQuests: Quest[] = [
  { id: 'q1', title: '걷기 (581 / 1000보)', category: '운동', completed: false },
  { id: 'q2', title: '아침식사', category: '생활', completed: false },
  { id: 'q3', title: '한 줄 글쓰기', category: '공부', completed: true },
];

const initialPresets: Preset[] = [
  { id: 'p1', title: '독서 30분', category: '공부' },
  { id: 'p2', title: '스트레칭', category: '운동' },
  { id: 'p3', title: '물 2L 마시기', category: '생활' },
];

// === Context ===

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vibeLogs, setVibeLogs] = useState<VibeLog[]>(initialVibeLogs);
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const [presets, setPresets] = useState<Preset[]>(initialPresets);
  const [currency, setCurrency] = useState<Currency>({ gem: 381, coin: 320, starDust: 530 });
  const [inventory, setInventory] = useState<string[]>(['default_skin', 'default_wallpaper']);
  const [equipped, setEquipped] = useState<AppState['equipped']>({
    hair: 'default',
    eyes: 'default',
    face: 'default',
    skin: 'default_skin',
    outfit: 'default',
    shoes: 'default',
    accessory1: 'default',
    accessory2: 'default',
    wallpaper: 'default_wallpaper',
    floor: 'default',
    door: 'default',
    window: 'default',
    furnitureLarge: 'default',
    furnitureSmall: 'default',
  });

  // Vibe Actions
  const addVibeLog = (score: number, sleepHours: number, emotions: string[]) => {
    const today = new Date();
    const timeStr = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;
    
    const newLog: VibeLog = {
      id: Date.now().toString(),
      date: '오늘',
      score,
      sleepHours,
      emotions,
      timestamp: timeStr,
    };

    setVibeLogs((prev) => {
      // Replace existing "오늘" if there is one, or append it
      const filtered = prev.filter(log => log.date !== '오늘');
      // If we replaced "오늘", we rename the old "오늘" to "어제" and cascade,
      // but for mockup simplicity we just replace/update the log for "오늘"
      return [...filtered, newLog];
    });

    // Reward player with a few coins for logging vibe!
    setCurrency(prev => ({ ...prev, coin: prev.coin + 10 }));
  };

  // Quest Actions
  const addQuest = (title: string, category: string) => {
    const newQuest: Quest = {
      id: Date.now().toString(),
      title,
      category,
      completed: false,
    };
    setQuests((prev) => [...prev, newQuest]);
  };

  const toggleQuest = (id: string) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, completed: !q.completed } : q))
    );
    // Give rewards when completed
    const quest = quests.find(q => q.id === id);
    if (quest && !quest.completed) {
      setCurrency(prev => ({ ...prev, gem: prev.gem + 5 }));
    }
  };

  const deleteQuest = (id: string) => {
    setQuests((prev) => prev.filter((q) => q.id !== id));
  };

  // Preset Actions
  const addPreset = (title: string, category: string) => {
    const newPreset: Preset = {
      id: Date.now().toString(),
      title,
      category,
    };
    setPresets((prev) => [...prev, newPreset]);
  };

  const removePreset = (id: string) => {
    setPresets((prev) => prev.filter((p) => p.id !== id));
  };

  const startPreset = () => {
    // Copy all presets into active quests
    const newQuests = presets.map((p) => ({
      id: `${p.id}_${Date.now()}`,
      title: p.title,
      category: p.category,
      completed: false,
    }));
    setQuests((prev) => [...prev, ...newQuests]);
  };

  // Shop & Inventory Actions
  const buyItem = (itemId: string, price: number, currencyType: keyof Currency): boolean => {
    if (inventory.includes(itemId)) {
      return false; // Already owned
    }
    if (currency[currencyType] < price) {
      return false; // Insufficient funds
    }

    setCurrency((prev) => ({
      ...prev,
      [currencyType]: prev[currencyType] - price,
    }));
    setInventory((prev) => [...prev, itemId]);
    return true;
  };

  const equipItem = (category: string, itemId: string) => {
    setEquipped((prev) => ({
      ...prev,
      [category]: itemId,
    }));
  };

  return (
    <AppContext.Provider
      value={{
        vibeLogs,
        quests,
        presets,
        currency,
        inventory,
        equipped,
        addVibeLog,
        addQuest,
        toggleQuest,
        deleteQuest,
        addPreset,
        removePreset,
        startPreset,
        buyItem,
        equipItem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
