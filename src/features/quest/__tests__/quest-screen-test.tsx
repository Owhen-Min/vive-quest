import {
  fireEvent,
  screen,
  waitFor,
} from "@testing-library/react-native";

import { renderWithApp } from "@/test/render-with-app";
import QuestScreen from "../quest-screen";

describe("<QuestScreen />", () => {
  test("핵심 일일 퀘스트 UI를 렌더링한다", async () => {
    await renderWithApp(<QuestScreen />);

    expect(screen.getByText("Quest")).toBeOnTheScreen();
    expect(screen.getByText("퀘스트(2) / 완료(1)")).toBeOnTheScreen();
    expect(screen.getByText("걷기 (581 / 1000보)")).toBeOnTheScreen();
  });

  test("완료 버튼을 누르면 활성 퀘스트에서 제거한다", async () => {
    await renderWithApp(<QuestScreen />);

    fireEvent.press(screen.getAllByText("⬜")[0]);

    await waitFor(() => {
      expect(screen.queryByText("걷기 (581 / 1000보)")).not.toBeOnTheScreen();
      expect(screen.getByText("퀘스트(1) / 완료(2)")).toBeOnTheScreen();
    });
  });
});
