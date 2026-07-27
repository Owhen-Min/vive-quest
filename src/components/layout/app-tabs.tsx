import { Tabs, TabList, TabTrigger, TabSlot, type TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, View, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ui/themed-text';
import { TabIcon, TAB_HREFS, TAB_LABELS, TAB_ORDER, type TabName } from './tab-icon';
import { TopBar } from './top-bar';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TopBar />

      <TabSlot style={{ flex: 1 }} />

      <TabList asChild>
        <BottomBar>
          {TAB_ORDER.map((name) => (
            <TabTrigger key={name} name={name} href={TAB_HREFS[name]} asChild>
              <TabButton name={name} />
            </TabTrigger>
          ))}
        </BottomBar>
      </TabList>
    </Tabs>
  );
}

function BottomBar(props: React.ComponentProps<typeof View>) {
  const insets = useSafeAreaInsets();

  return (
    <View
      {...props}
      className="flex-row bg-background border-t border-level3"
      style={[props.style, { paddingBottom: insets.bottom }]}
    />
  );
}

function TabButton({ name, isFocused, ...props }: TabTriggerSlotProps & { name: TabName }) {
  const scheme = useColorScheme();
  const colors = Colors[!scheme || scheme === 'unspecified' ? 'light' : scheme];
  const tintColor = isFocused ? colors.main : colors.textSecondary;

  return (
    <Pressable
      {...props}
      className="flex-1 items-center justify-center gap-1 py-2"
      style={({ pressed }) => pressed && { opacity: 0.7 }}
    >
      <TabIcon name={name} color={tintColor} size={22} />
      <ThemedText type="small" style={{ fontSize: 11, lineHeight: 14 }} themeColor={isFocused ? 'text' : 'textSecondary'}>
        {TAB_LABELS[name]}
      </ThemedText>
    </Pressable>
  );
}
