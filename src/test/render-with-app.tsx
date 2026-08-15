import { AppProvider } from "@/context/AppContext";
import {
  render,
  type RenderOptions,
} from "@testing-library/react-native";
import type { ReactElement } from "react";

export function renderWithApp(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(ui, {
    wrapper: AppProvider,
    ...options,
  });
}
