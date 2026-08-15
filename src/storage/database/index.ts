import {
  openDatabaseAsync,
  type SQLiteDatabase,
} from "expo-sqlite";

import { migrateDatabase } from "./migrations";

const DATABASE_NAME = "vibe-quest.db";

let databasePromise: Promise<SQLiteDatabase> | undefined;

export function getDatabase(): Promise<SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = initializeDatabase().catch((error: unknown) => {
      databasePromise = undefined;
      throw error;
    });
  }

  return databasePromise;
}

async function initializeDatabase(): Promise<SQLiteDatabase> {
  const db = await openDatabaseAsync(DATABASE_NAME);
  await migrateDatabase(db);
  return db;
}

export { migrateDatabase } from "./migrations";
