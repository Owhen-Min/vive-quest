import { createMMKV } from "react-native-mmkv";

import { SettingsRepository } from "./settings-repository";

export const settingsStorage = createMMKV({
  id: "vibe-quest.settings",
});

export const settingsRepository = new SettingsRepository(settingsStorage);

export * from "./settings-repository";
