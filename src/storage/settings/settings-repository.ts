export type ThemePreference = "system" | "light" | "dark";
export type MoodChartPeriod = 7 | 30;

export interface AppSettings {
  theme: ThemePreference;
  onboardingCompleted: boolean;
  moodChartPeriod: MoodChartPeriod;
  lastSyncAt?: string;
}

export interface KeyValueStorage {
  set(key: string, value: string | number | boolean): void;
  getString(key: string): string | undefined;
  getBoolean(key: string): boolean | undefined;
  getNumber(key: string): number | undefined;
  remove(key: string): boolean;
  clearAll(): void;
}

const SETTINGS_KEYS = {
  theme: "theme",
  onboardingCompleted: "onboarding-completed",
  moodChartPeriod: "mood-chart-period",
  lastSyncAt: "last-sync-at",
} as const;

const DEFAULT_SETTINGS: AppSettings = {
  theme: "system",
  onboardingCompleted: false,
  moodChartPeriod: 7,
};

export class SettingsRepository {
  constructor(private readonly storage: KeyValueStorage) {}

  getAll(): AppSettings {
    const storedTheme = this.storage.getString(SETTINGS_KEYS.theme);
    const storedPeriod = this.storage.getNumber(SETTINGS_KEYS.moodChartPeriod);

    return {
      theme: isThemePreference(storedTheme)
        ? storedTheme
        : DEFAULT_SETTINGS.theme,
      onboardingCompleted:
        this.storage.getBoolean(SETTINGS_KEYS.onboardingCompleted) ??
        DEFAULT_SETTINGS.onboardingCompleted,
      moodChartPeriod:
        storedPeriod === 7 || storedPeriod === 30
          ? storedPeriod
          : DEFAULT_SETTINGS.moodChartPeriod,
      lastSyncAt: this.storage.getString(SETTINGS_KEYS.lastSyncAt),
    };
  }

  setTheme(theme: ThemePreference): void {
    this.storage.set(SETTINGS_KEYS.theme, theme);
  }

  setOnboardingCompleted(completed: boolean): void {
    this.storage.set(SETTINGS_KEYS.onboardingCompleted, completed);
  }

  setMoodChartPeriod(period: MoodChartPeriod): void {
    this.storage.set(SETTINGS_KEYS.moodChartPeriod, period);
  }

  setLastSyncAt(timestamp?: string): void {
    if (timestamp === undefined) {
      this.storage.remove(SETTINGS_KEYS.lastSyncAt);
      return;
    }
    this.storage.set(SETTINGS_KEYS.lastSyncAt, timestamp);
  }

  reset(): void {
    this.storage.clearAll();
  }
}

function isThemePreference(value?: string): value is ThemePreference {
  return value === "system" || value === "light" || value === "dark";
}
