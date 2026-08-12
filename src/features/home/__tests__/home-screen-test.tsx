import { fireEvent, screen } from "@testing-library/react-native";

import { renderWithApp } from "@/test/render-with-app";
import HomeScreen from "../home-screen";

jest.mock("@/components/ui/mood-trend-chart", () => {
  const React = jest.requireActual("react");
  const { Text } = jest.requireActual("react-native");

  return {
    MoodTrendChart: () => React.createElement(Text, null, "기분 추이 차트"),
  };
});

jest.mock("../components/mood-record-modal", () => {
  const React = jest.requireActual("react");
  const { Text } = jest.requireActual("react-native");

  return {
    MoodRecordModal: ({ visible }: { visible: boolean }) =>
      visible ? React.createElement(Text, null, "기분 기록 모달") : null,
  };
});

describe("<HomeScreen />", () => {
  test("핵심 홈 UI를 렌더링한다", async () => {
    await renderWithApp(<HomeScreen />);

    expect(screen.getByText("VIBE")).toBeOnTheScreen();
    expect(screen.getByText("오늘의 기분은 어때?")).toBeOnTheScreen();
    expect(screen.getByText("기록하기 📝")).toBeOnTheScreen();
    expect(screen.getByText("기분 추이 차트")).toBeOnTheScreen();
  });

  test("기록하기 버튼으로 기분 기록 모달을 연다", async () => {
    await renderWithApp(<HomeScreen />);

    expect(screen.queryByText("기분 기록 모달")).not.toBeOnTheScreen();

    fireEvent.press(screen.getByText("기록하기 📝"));

    expect(screen.getByText("기분 기록 모달")).toBeOnTheScreen();
  });
});
