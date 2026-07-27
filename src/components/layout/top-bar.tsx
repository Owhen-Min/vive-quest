import { Text, View } from 'react-native';
import { usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp, type Currency } from '@/context/AppContext';
import { DEFAULT_TOP_BAR_OPTIONS, useTopBarState } from '@/context/TopBarContext';
import { TAB_LABELS, type TabName } from './tab-icon';

const CURRENCY_EMOJI: Record<keyof Currency, string> = {
  gem: '💎',
  coin: '🪙',
  starDust: '✨',
};

function pathnameToTab(pathname: string): TabName {
  const key = pathname.replace(/^\/+/, '');
  return (key in TAB_LABELS ? key : 'index') as TabName;
}

/**
 * App-wide top bar. Lives above the tab content so every screen shares the
 * same remaining-currency readout, always in sync with `AppContext`.
 * Individual screens can customize it via `useTopBarOptions`.
 */
export function TopBar() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { currency } = useApp();
  const { title, currencies = DEFAULT_TOP_BAR_OPTIONS.currencies! } = useTopBarState();

  const resolvedTitle = title ?? TAB_LABELS[pathnameToTab(pathname)];

  return (
    <View style={{ paddingTop: insets.top }} className="bg-background border-b border-level3">
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text className="text-2xl font-extrabold text-main">{resolvedTitle}</Text>

        <View className="flex-row items-center gap-2">
          {currencies.map((key) => (
            <View
              key={key}
              className="flex-row items-center rounded-full border border-level3 bg-level1 px-3 py-1.5"
            >
              <Text className="mr-1">{CURRENCY_EMOJI[key]}</Text>
              <Text className="text-sm font-semibold text-main">{currency[key]}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
