import type { ComponentType } from 'react';
import type { SvgProps } from 'react-native-svg';

import AdventureIcon from '@/assets/svgs/tabIcons/adventure.svg';
import HomeIcon from '@/assets/svgs/tabIcons/home.svg';
import MyInfoIcon from '@/assets/svgs/tabIcons/myinfo.svg';
import QuestIcon from '@/assets/svgs/tabIcons/quest.svg';
import ShopIcon from '@/assets/svgs/tabIcons/shop.svg';

export type TabName = 'index' | 'quest' | 'adventure' | 'shop' | 'myinfo';

export const TAB_ORDER: TabName[] = ['index', 'quest', 'adventure', 'shop', 'myinfo'];

export const TAB_HREFS = {
  index: '/',
  quest: '/quest',
  adventure: '/adventure',
  shop: '/shop',
  myinfo: '/myinfo',
} as const satisfies Record<TabName, string>;

export const TAB_LABELS: Record<TabName, string> = {
  index: '홈',
  quest: '퀘스트',
  adventure: '모험',
  shop: '상점',
  myinfo: '내정보',
};

const TAB_ICONS: Record<TabName, ComponentType<SvgProps>> = {
  index: HomeIcon,
  quest: QuestIcon,
  adventure: AdventureIcon,
  shop: ShopIcon,
  myinfo: MyInfoIcon,
};

export interface TabIconProps extends SvgProps {
  name: TabName;
  size?: number;
}

/** Renders the SVG icon for a given bottom-bar tab, tinted via `color`. */
export function TabIcon({ name, size = 22, ...props }: TabIconProps) {
  const Icon = TAB_ICONS[name];
  return <Icon width={size} height={size} {...props} />;
}
