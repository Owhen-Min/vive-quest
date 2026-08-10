import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AnimatedSplashOverlay } from "@/components/ui/animated-icon";
import AppTabs from "@/components/layout/app-tabs";
import { AppProvider } from "@/context/AppContext";
import { TopBarProvider } from "@/context/TopBarContext";
import "../global.css";

SplashScreen.preventAutoHideAsync();

// Note: expo-router's `ExpoRoot` already wraps the whole app in a
// `SafeAreaProvider`, so we don't need another one here.
export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <TopBarProvider>
          <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <AnimatedSplashOverlay />
            <AppTabs />
          </ThemeProvider>
        </TopBarProvider>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
