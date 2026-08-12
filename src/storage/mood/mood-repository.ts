import type { SQLiteDatabase } from "expo-sqlite";

import { getDatabase } from "@/storage/database";
import { getRecentLocalDateRange } from "./local-date";

export interface MoodEntry {
  id: string;
  localDate: string;
  recordedAt: string;
  score: number;
  sleepMinutes?: number;
  emotions: string[];
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaveMoodEntryInput {
  id: string;
  localDate: string;
  recordedAt: string;
  score: number;
  sleepMinutes?: number;
  emotions: string[];
  note?: string;
}

type DatabaseProvider = () => Promise<SQLiteDatabase>;

interface MoodEntryRow {
  id: string;
  local_date: string;
  recorded_at: string;
  score: number;
  sleep_minutes: number | null;
  note: string | null;
  created_at: string;
  updated_at: string;
  emotion: string | null;
}

export class MoodRepository {
  constructor(private readonly databaseProvider: DatabaseProvider = getDatabase) {}

  async save(input: SaveMoodEntryInput): Promise<void> {
    validateMoodEntry(input);

    const db = await this.databaseProvider();
    const now = new Date().toISOString();
    const emotions = [
      ...new Set(input.emotions.map((emotion) => emotion.trim()).filter(Boolean)),
    ];

    await db.withTransactionAsync(async () => {
      await db.runAsync(
        `
          INSERT INTO mood_entries (
            id,
            local_date,
            recorded_at,
            score,
            sleep_minutes,
            note,
            created_at,
            updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            local_date = excluded.local_date,
            recorded_at = excluded.recorded_at,
            score = excluded.score,
            sleep_minutes = excluded.sleep_minutes,
            note = excluded.note,
            updated_at = excluded.updated_at
        `,
        input.id,
        input.localDate,
        input.recordedAt,
        input.score,
        input.sleepMinutes ?? null,
        input.note ?? null,
        now,
        now,
      );

      await db.runAsync(
        "DELETE FROM mood_entry_emotions WHERE entry_id = ?",
        input.id,
      );

      for (const emotion of emotions) {
        await db.runAsync(
          `
            INSERT INTO mood_entry_emotions (entry_id, emotion)
            VALUES (?, ?)
          `,
          input.id,
          emotion,
        );
      }
    });
  }

  async findByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<MoodEntry[]> {
    validateLocalDate(startDate);
    validateLocalDate(endDate);

    if (startDate > endDate) {
      throw new Error("시작일은 종료일보다 늦을 수 없습니다.");
    }

    const db = await this.databaseProvider();
    const rows = await db.getAllAsync<MoodEntryRow>(
      `
        SELECT
          entry.id,
          entry.local_date,
          entry.recorded_at,
          entry.score,
          entry.sleep_minutes,
          entry.note,
          entry.created_at,
          entry.updated_at,
          emotion.emotion
        FROM mood_entries AS entry
        LEFT JOIN mood_entry_emotions AS emotion
          ON emotion.entry_id = entry.id
        WHERE entry.local_date BETWEEN $startDate AND $endDate
        ORDER BY entry.recorded_at ASC, emotion.emotion ASC
      `,
      {
        $startDate: startDate,
        $endDate: endDate,
      },
    );

    return mapMoodRows(rows);
  }

  async findRecentDays(
    days = 7,
    referenceDate = new Date(),
  ): Promise<MoodEntry[]> {
    const { startDate, endDate } = getRecentLocalDateRange(days, referenceDate);
    return this.findByDateRange(startDate, endDate);
  }

  async delete(id: string): Promise<void> {
    const db = await this.databaseProvider();
    await db.runAsync("DELETE FROM mood_entries WHERE id = ?", id);
  }
}

function mapMoodRows(rows: MoodEntryRow[]): MoodEntry[] {
  const entries = new Map<string, MoodEntry>();

  for (const row of rows) {
    let entry = entries.get(row.id);

    if (!entry) {
      entry = {
        id: row.id,
        localDate: row.local_date,
        recordedAt: row.recorded_at,
        score: row.score,
        sleepMinutes: row.sleep_minutes ?? undefined,
        emotions: [],
        note: row.note ?? undefined,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
      entries.set(row.id, entry);
    }

    if (row.emotion !== null) {
      entry.emotions.push(row.emotion);
    }
  }

  return [...entries.values()];
}

function validateMoodEntry(input: SaveMoodEntryInput): void {
  if (!input.id.trim()) {
    throw new Error("감정 기록 ID가 필요합니다.");
  }
  validateLocalDate(input.localDate);

  if (!Number.isFinite(input.score) || input.score < -5 || input.score > 5) {
    throw new Error("기분 점수는 -5 이상 5 이하여야 합니다.");
  }

  if (
    input.sleepMinutes !== undefined &&
    (!Number.isInteger(input.sleepMinutes) ||
      input.sleepMinutes < 0 ||
      input.sleepMinutes > 1440)
  ) {
    throw new Error("수면 시간은 0~1440분 사이의 정수여야 합니다.");
  }

  if (Number.isNaN(Date.parse(input.recordedAt))) {
    throw new Error("기록 시각은 올바른 ISO 날짜여야 합니다.");
  }
}

function validateLocalDate(value: string): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error("로컬 날짜는 YYYY-MM-DD 형식이어야 합니다.");
  }
}
