import type { SQLiteDatabase } from "expo-sqlite";

import {
  getRecentLocalDateRange,
  MoodRepository,
} from "@/storage/mood";

describe("moodRepository", () => {
  test("기준일을 포함한 최근 7일 날짜 범위를 계산한다", () => {
    const referenceDate = new Date(2026, 7, 12, 12);

    expect(getRecentLocalDateRange(7, referenceDate)).toEqual({
      startDate: "2026-08-06",
      endDate: "2026-08-12",
    });
  });

  test("최근 기록과 감정 목록을 함께 조회한다", async () => {
    const getAllAsync = jest.fn().mockResolvedValue([
      {
        id: "mood-1",
        local_date: "2026-08-12",
        recorded_at: "2026-08-12T09:00:00.000Z",
        score: 3,
        sleep_minutes: 450,
        note: null,
        created_at: "2026-08-12T09:00:00.000Z",
        updated_at: "2026-08-12T09:00:00.000Z",
        emotion: "기쁨",
      },
      {
        id: "mood-1",
        local_date: "2026-08-12",
        recorded_at: "2026-08-12T09:00:00.000Z",
        score: 3,
        sleep_minutes: 450,
        note: null,
        created_at: "2026-08-12T09:00:00.000Z",
        updated_at: "2026-08-12T09:00:00.000Z",
        emotion: "차분",
      },
    ]);
    const db = { getAllAsync } as unknown as SQLiteDatabase;
    const repository = new MoodRepository(async () => db);

    const entries = await repository.findRecentDays(
      7,
      new Date(2026, 7, 12, 12),
    );

    expect(getAllAsync).toHaveBeenCalledWith(
      expect.stringContaining(
        "WHERE entry.local_date BETWEEN $startDate AND $endDate",
      ),
      {
        $startDate: "2026-08-06",
        $endDate: "2026-08-12",
      },
    );
    expect(entries).toEqual([
      {
        id: "mood-1",
        localDate: "2026-08-12",
        recordedAt: "2026-08-12T09:00:00.000Z",
        score: 3,
        sleepMinutes: 450,
        emotions: ["기쁨", "차분"],
        note: undefined,
        createdAt: "2026-08-12T09:00:00.000Z",
        updatedAt: "2026-08-12T09:00:00.000Z",
      },
    ]);
  });

  test("0일 조회는 거부한다", () => {
    expect(() => getRecentLocalDateRange(0)).toThrow(
      "조회 일수는 1 이상의 정수여야 합니다.",
    );
  });
});
