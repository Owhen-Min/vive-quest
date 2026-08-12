import type { SQLiteDatabase } from "expo-sqlite";

import { migrateDatabase } from "@/storage/database";

function createDatabaseMock(userVersion: number) {
  const execAsync = jest.fn().mockResolvedValue(undefined);
  const getFirstAsync = jest
    .fn()
    .mockResolvedValue({ user_version: userVersion });
  const withTransactionAsync = jest.fn(
    async (task: () => Promise<void>) => task(),
  );

  return {
    db: {
      execAsync,
      getFirstAsync,
      withTransactionAsync,
    } as unknown as SQLiteDatabase,
    execAsync,
    withTransactionAsync,
  };
}

describe("migrateDatabase", () => {
  test("새 데이터베이스에 감정 기록 스키마를 생성한다", async () => {
    const { db, execAsync, withTransactionAsync } = createDatabaseMock(0);

    await migrateDatabase(db);

    expect(withTransactionAsync).toHaveBeenCalledTimes(1);
    expect(execAsync).toHaveBeenCalledWith(
      expect.stringContaining("CREATE TABLE IF NOT EXISTS mood_entries"),
    );
    expect(execAsync).toHaveBeenCalledWith("PRAGMA user_version = 1");
  });

  test("현재 버전이면 마이그레이션을 다시 실행하지 않는다", async () => {
    const { db, withTransactionAsync } = createDatabaseMock(1);

    await migrateDatabase(db);

    expect(withTransactionAsync).not.toHaveBeenCalled();
  });

  test("앱보다 새로운 데이터베이스 버전은 거부한다", async () => {
    const { db } = createDatabaseMock(2);

    await expect(migrateDatabase(db)).rejects.toThrow(
      "지원하지 않는 데이터베이스 버전입니다: 2",
    );
  });
});
