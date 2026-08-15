import React, { createContext, useContext, useState, useEffect } from 'react';
import { moodRepository, toLocalDateKey, type MoodEntry } from '@/storage';

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
  isVibeLogsLoading: boolean;
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
  addVibeLog: (score: number, sleepHours: number, emotions: string[]) => Promise<void>;
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

// vibeLogs는 더 이상 mock으로 초기화하지 않고, AppProvider 마운트 시 SQLite에서 불러온다.
// (아래 "Vibe Log Loading" 섹션 참고)

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

// === Vibe Log Mapping Helpers ===

/** "HH:MM" 형식의 현지 시각 문자열을 만든다. */
function formatTimeHHMM(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

/** localDate("YYYY-MM-DD")와 오늘 날짜의 차이를 "오늘"/"어제"/"N일 전"으로 변환한다. */
function getRelativeDateLabel(localDate: string, today: Date = new Date()): string {
  const [year, month, day] = localDate.split('-').map(Number);
  const target = new Date(year, (month ?? 1) - 1, day ?? 1);
  const base = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const diffDays = Math.round((base.getTime() - target.getTime()) / 86400000);

  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '어제';
  if (diffDays > 1) return `${diffDays}일 전`;
  // 미래 날짜(기기 시간 변경 등 예외 상황)는 날짜를 그대로 보여준다.
  return localDate;
}

/** SQLite의 MoodEntry를 화면에서 쓰는 VibeLog 형태로 변환한다. */
function mapMoodEntryToVibeLog(entry: MoodEntry): VibeLog {
  return {
    id: entry.id,
    date: getRelativeDateLabel(entry.localDate),
    score: entry.score,
    sleepHours: (entry.sleepMinutes ?? 0) / 60,
    emotions: entry.emotions,
    timestamp: formatTimeHHMM(new Date(entry.recordedAt)),
  };
}

// === Context ===

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vibeLogs, setVibeLogs] = useState<VibeLog[]>([]);
  const [isVibeLogsLoading, setIsVibeLogsLoading] = useState(true);
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

  // Vibe Log Loading (SQLite)
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const entries = await moodRepository.findRecentDays(30);
        if (!isMounted) return;
        setVibeLogs(entries.map(mapMoodEntryToVibeLog));
      } catch (error) {
        console.error('[AppContext] 감정 기록을 불러오지 못했습니다.', error);
      } finally {
        if (isMounted) setIsVibeLogsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Vibe Actions
  const addVibeLog = async (score: number, sleepHours: number, emotions: string[]) => {
    const now = new Date();
    const localDate = toLocalDateKey(now);
    // 날짜 기반 고정 ID를 사용해, 같은 날 다시 기록하면 새 행을 만들지 않고 갱신되게 한다.
    const id = `mood-${localDate}`;
    const sleepMinutes = Math.round(sleepHours * 60);

    await moodRepository.save({
      id,
      localDate,
      recordedAt: now.toISOString(),
      score,
      sleepMinutes,
      emotions,
    });

    const newLog: VibeLog = {
      id,
      date: '오늘',
      score,
      sleepHours,
      emotions,
      timestamp: formatTimeHHMM(now),
    };

    setVibeLogs((prev) => {
      const filtered = prev.filter((log) => log.id !== id);
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
        isVibeLogsLoading,
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
