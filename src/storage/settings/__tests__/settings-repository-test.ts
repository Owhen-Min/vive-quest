import {
  settingsRepository,
  settingsStorage,
} from "@/storage/settings";

describe("settingsRepository", () => {
  beforeEach(() => {
    settingsRepository.reset();
  });

  test("저장값이 없으면 안전한 기본 설정을 반환한다", () => {
    expect(settingsRepository.getAll()).toEqual({
      theme: "system",
      onboardingCompleted: false,
      moodChartPeriod: 7,
      lastSyncAt: undefined,
    });
  });

  test("설정값을 MMKV에 저장하고 다시 읽는다", () => {
    settingsRepository.setTheme("dark");
    settingsRepository.setOnboardingCompleted(true);
    settingsRepository.setMoodChartPeriod(30);
    settingsRepository.setLastSyncAt("2026-08-12T12:00:00.000Z");

    expect(settingsRepository.getAll()).toEqual({
      theme: "dark",
      onboardingCompleted: true,
      moodChartPeriod: 30,
      lastSyncAt: "2026-08-12T12:00:00.000Z",
    });
  });

  test("알 수 없는 저장값은 기본값으로 복구한다", () => {
    settingsStorage.set("theme", "sepia");
    settingsStorage.set("mood-chart-period", 365);

    expect(settingsRepository.getAll()).toMatchObject({
      theme: "system",
      moodChartPeriod: 7,
    });
  });
});
