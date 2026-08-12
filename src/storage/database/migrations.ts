import type { SQLiteDatabase } from "expo-sqlite";

const DATABASE_VERSION = 1;

const MIGRATIONS: readonly {
  version: number;
  statements: string;
}[] = [
  {
    version: 1,
    statements: `
      CREATE TABLE IF NOT EXISTS mood_entries (
        id TEXT PRIMARY KEY NOT NULL,
        local_date TEXT NOT NULL,
        recorded_at TEXT NOT NULL,
        score REAL NOT NULL CHECK (score >= -5 AND score <= 5),
        sleep_minutes INTEGER CHECK (
          sleep_minutes IS NULL OR
          (sleep_minutes >= 0 AND sleep_minutes <= 1440)
        ),
        note TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_mood_entries_local_date
        ON mood_entries (local_date DESC);

      CREATE INDEX IF NOT EXISTS idx_mood_entries_recorded_at
        ON mood_entries (recorded_at DESC);

      CREATE TABLE IF NOT EXISTS mood_entry_emotions (
        entry_id TEXT NOT NULL,
        emotion TEXT NOT NULL,
        PRIMARY KEY (entry_id, emotion),
        FOREIGN KEY (entry_id) REFERENCES mood_entries (id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_mood_entry_emotions_emotion
        ON mood_entry_emotions (emotion);
    `,
  },
];

export async function migrateDatabase(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
  `);

  const versionRow = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  );
  const currentVersion = versionRow?.user_version ?? 0;

  if (currentVersion > DATABASE_VERSION) {
    throw new Error(
      `지원하지 않는 데이터베이스 버전입니다: ${currentVersion}`,
    );
  }

  if (currentVersion === DATABASE_VERSION) {
    return;
  }

  await db.withTransactionAsync(async () => {
    for (const migration of MIGRATIONS) {
      if (migration.version > currentVersion) {
        await db.execAsync(migration.statements);
      }
    }

    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
  });
}
