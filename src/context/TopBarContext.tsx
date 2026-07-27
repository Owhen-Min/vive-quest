import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import type { Currency } from './AppContext';

export interface TopBarOptions {
  /** Overrides the auto-detected title (defaults to the active tab's label). */
  title?: string;
  /** Which currency badges to render. */
  currencies?: (keyof Currency)[];
}

interface TopBarContextValue {
  options: TopBarOptions;
  setOptions: (options: TopBarOptions) => void;
}

export const DEFAULT_TOP_BAR_OPTIONS: TopBarOptions = { currencies: ['gem', 'coin'] };

const TopBarContext = createContext<TopBarContextValue | undefined>(undefined);

export function TopBarProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState<TopBarOptions>(DEFAULT_TOP_BAR_OPTIONS);
  const value = useMemo(() => ({ options, setOptions }), [options]);

  return <TopBarContext.Provider value={value}>{children}</TopBarContext.Provider>;
}

function useTopBarContext() {
  const ctx = useContext(TopBarContext);
  if (!ctx) {
    throw new Error('useTopBarContext must be used within a TopBarProvider');
  }
  return ctx;
}

/** Read-only snapshot of the current top bar configuration. Used by `TopBar` itself. */
export function useTopBarState() {
  return useTopBarContext().options;
}

/**
 * Lets any screen talk to the shared top bar while it's focused, e.g. to
 * surface an extra currency or override the title. Resets to the default
 * options on unmount so other screens aren't affected.
 */
export function useTopBarOptions(options: TopBarOptions) {
  const { setOptions } = useTopBarContext();
  const currenciesKey = options.currencies?.join(',') ?? DEFAULT_TOP_BAR_OPTIONS.currencies!.join(',');

  useEffect(() => {
    setOptions({
      title: options.title,
      currencies: options.currencies ?? DEFAULT_TOP_BAR_OPTIONS.currencies,
    });
    return () => setOptions(DEFAULT_TOP_BAR_OPTIONS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.title, currenciesKey]);
}
