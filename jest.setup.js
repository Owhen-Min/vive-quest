/* global jest */

// expo-sqlite의 NativeDatabase는 Jest 환경(jest-expo)에서 실제로 동작하지 않으므로,
// AppContext -> moodRepository -> getDatabase() 경로가 컴포넌트 렌더 테스트에서
// 안전하게 동작하도록 최소한의 메모리 기반 SQLite mock을 제공한다.
// - migrations-test.ts / mood-repository-test.ts는 각각 db와 databaseProvider를
//   직접 주입해서 실제 구현을 테스트하므로 이 mock의 영향을 받지 않는다.
jest.mock("expo-sqlite", () => {
  function createInMemoryDatabase() {
    let userVersion = 0;
    const entries = new Map();
    const emotionsByEntryId = new Map();

    return {
      execAsync: jest.fn(async (sql) => {
        const versionMatch = /PRAGMA\s+user_version\s*=\s*(\d+)/i.exec(sql);
        if (versionMatch) {
          userVersion = Number(versionMatch[1]);
        }
      }),
      getFirstAsync: jest.fn(async (sql) => {
        if (/PRAGMA\s+user_version/i.test(sql)) {
          return { user_version: userVersion };
        }
        return null;
      }),
      withTransactionAsync: jest.fn(async (task) => task()),
      runAsync: jest.fn(async (sql, ...args) => {
        if (/INSERT INTO mood_entries/i.test(sql)) {
          const [id, localDate, recordedAt, score, sleepMinutes, note, createdAt, updatedAt] = args;
          entries.set(id, {
            id,
            local_date: localDate,
            recorded_at: recordedAt,
            score,
            sleep_minutes: sleepMinutes,
            note,
            created_at: createdAt,
            updated_at: updatedAt,
          });
        } else if (/DELETE FROM mood_entry_emotions/i.test(sql)) {
          emotionsByEntryId.delete(args[0]);
        } else if (/INSERT INTO mood_entry_emotions/i.test(sql)) {
          const [entryId, emotion] = args;
          if (!emotionsByEntryId.has(entryId)) emotionsByEntryId.set(entryId, new Set());
          emotionsByEntryId.get(entryId).add(emotion);
        } else if (/DELETE FROM mood_entries/i.test(sql)) {
          entries.delete(args[0]);
          emotionsByEntryId.delete(args[0]);
        }
      }),
      getAllAsync: jest.fn(async (sql, params) => {
        if (!/FROM mood_entries/i.test(sql)) return [];

        const startDate = params?.$startDate;
        const endDate = params?.$endDate;
        const rows = [];

        for (const entry of entries.values()) {
          if (startDate && endDate && (entry.local_date < startDate || entry.local_date > endDate)) {
            continue;
          }

          const emotions = emotionsByEntryId.get(entry.id);
          if (emotions && emotions.size > 0) {
            for (const emotion of emotions) {
              rows.push({ ...entry, emotion });
            }
          } else {
            rows.push({ ...entry, emotion: null });
          }
        }

        return rows;
      }),
      closeAsync: jest.fn(async () => {}),
    };
  }

  return {
    openDatabaseAsync: jest.fn(async () => createInMemoryDatabase()),
  };
});

jest.mock("react-native-mmkv", () => ({
  createMMKV: jest.fn((configuration = { id: "mmkv.default" }) => {
    const values = new Map();

    return {
      id: configuration.id,
      set: (key, value) => values.set(key, value),
      getString: (key) => {
        const value = values.get(key);
        return typeof value === "string" ? value : undefined;
      },
      getNumber: (key) => {
        const value = values.get(key);
        return typeof value === "number" ? value : undefined;
      },
      getBoolean: (key) => {
        const value = values.get(key);
        return typeof value === "boolean" ? value : undefined;
      },
      contains: (key) => values.has(key),
      getAllKeys: () => [...values.keys()],
      remove: (key) => values.delete(key),
      clearAll: () => values.clear(),
    };
  }),
}));
