import type { VibeLog } from "@/context/AppContext";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import { useDerivedValue } from "react-native-reanimated";
import { AnimatedText, LineChart } from "react-native-wagmi-charts";

export interface MoodDataPoint {
  timestamp: number;
  value: number; // 0 ~ 10 점수 (변환값)
  rawScore: number; // -5 ~ 5 실제 점수
  label: string;
  emotions: string[];
  sleepHours: number;
}

// 콤보 차트(라인 + 막대) 레이아웃 상수
const CHART_HEIGHT = 200;
const SLEEP_BAR_MAX_HEIGHT = 64;
const SLEEP_BAR_WIDTH = 14;
const SLEEP_BAR_COLOR = "#6b8fc9";
const MOOD_LINE_COLOR = "#4a7c59";
const MOOD_DOT_COLOR = "#2b4c3f";

// 7일간의 샘플 기분/수면 데이터
const sampleWeeklyData: MoodDataPoint[] = [
  {
    timestamp: new Date(2026, 6, 21).getTime(),
    value: 3,
    rawScore: -2,
    label: "6일 전",
    emotions: ["슬픔"],
    sleepHours: 5.5,
  },
  {
    timestamp: new Date(2026, 6, 22).getTime(),
    value: 6.5,
    rawScore: 1.5,
    label: "5일 전",
    emotions: ["보통"],
    sleepHours: 7.0,
  },
  {
    timestamp: new Date(2026, 6, 23).getTime(),
    value: 5.2,
    rawScore: 0.2,
    label: "4일 전",
    emotions: ["기쁨"],
    sleepHours: 6.0,
  },
  {
    timestamp: new Date(2026, 6, 24).getTime(),
    value: 7.3,
    rawScore: 2.3,
    label: "3일 전",
    emotions: ["설렘"],
    sleepHours: 8.0,
  },
  {
    timestamp: new Date(2026, 6, 25).getTime(),
    value: 9.0,
    rawScore: 4.0,
    label: "2일 전",
    emotions: ["설렘", "기쁨"],
    sleepHours: 8.5,
  },
  {
    timestamp: new Date(2026, 6, 26).getTime(),
    value: 6.5,
    rawScore: 1.5,
    label: "어제",
    emotions: ["보통"],
    sleepHours: 6.5,
  },
  {
    timestamp: new Date(2026, 6, 27).getTime(),
    value: 4.2,
    rawScore: -0.8,
    label: "오늘",
    emotions: ["피곤"],
    sleepHours: 5.0,
  },
];

function getMoodDescription(score: number): string {
  if (score >= 4) return "매우 좋음 😆";
  if (score >= 1.5) return "좋음 🙂";
  if (score >= -0.5) return "보통 😐";
  if (score >= -3) return "나쁨 😕";
  return "매우 나쁨 😡";
}

// 터치 중인(또는 마지막) 지점의 수면 시간을 라인 차트와 같은 인덱스로 동기화해서 보여주는 텍스트
function ComboSleepIndicator({
  chartData,
  style,
}: {
  chartData: MoodDataPoint[];
  style?: TextStyle;
}) {
  const { currentIndex } = LineChart.useChart();
  const lastIndex = chartData.length - 1;

  const text = useDerivedValue(() => {
    const idx =
      typeof currentIndex.value === "undefined" || currentIndex.value === -1
        ? lastIndex
        : Math.min(currentIndex.value, lastIndex);
    const point = chartData[idx];
    if (!point) return "";
    return `😴 ${point.sleepHours.toFixed(1)}시간 수면`;
  }, [currentIndex, chartData, lastIndex]);

  return <AnimatedText text={text} style={style} />;
}

interface MoodTrendChartProps {
  vibeLogs?: VibeLog[];
  title?: string;
}

export function MoodTrendChart({
  vibeLogs,
  title = "최근 기분 추이",
}: MoodTrendChartProps) {
  const [period, setPeriod] = useState<"7d" | "30d">("7d");
  const [canvasWidth, setCanvasWidth] = useState(0);

  // VibeLog 배열이 있을 경우 WagmiChart가 인식할 수 있는 형태로 변환
  const chartData: MoodDataPoint[] = React.useMemo(() => {
    if (!vibeLogs || vibeLogs.length === 0) return sampleWeeklyData;

    const baseTime = Date.now() - (vibeLogs.length - 1) * 86400000;
    return vibeLogs.map((log, index) => ({
      // wagmi-charts는 고유한 timestamp 기반 오름차순 정렬이 필요
      timestamp: baseTime + index * 86400000,
      value: Math.max(0.5, log.score + 5), // -5..5 점수를 0..10으로 변환 (최소값 0.5 높이 유지를 위해)
      rawScore: log.score,
      label: log.date,
      emotions: log.emotions,
      sleepHours: log.sleepHours,
    }));
  }, [vibeLogs]);

  // 수면 시간 막대의 y축 스케일 기준 (최소 8시간 도메인 유지)
  const maxSleepHours = React.useMemo(() => {
    if (chartData.length === 0) return 8;
    return Math.max(8, ...chartData.map((d) => d.sleepHours));
  }, [chartData]);

  // 최근 기분 평균 점수 (-5 ~ 5)
  const avgRawScore = React.useMemo(() => {
    if (chartData.length === 0) return 0;
    const sum = chartData.reduce((acc, curr) => acc + curr.rawScore, 0);
    return (sum / chartData.length).toFixed(1);
  }, [chartData]);

  // 마지막으로 체크한 날짜(가장 최근 기록) - 터치가 없을 때 기본으로 보여줄 값
  const lastDataPoint = chartData[chartData.length - 1];
  const lastRawScore = (lastDataPoint?.rawScore ?? 0).toFixed(1);
  const lastLabel = lastDataPoint?.label ?? "최근 기록";

  return (
    <View className="bg-level1 rounded-3xl p-5 border border-level3 shadow-sm">
      {/* 1. 상단 타이틀 & 탭 조절 */}
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-base font-bold text-main">📈 {title}</Text>
          {/* 범례: 기분(라인) + 수면 시간(막대) */}
          <View className="flex-row items-center gap-2.5 mt-1">
            <View className="flex-row items-center gap-1">
              <View
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: MOOD_DOT_COLOR }}
              />
              <Text className="text-[11px] text-sub-main">기분</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <View
                className="w-2 h-2 rounded-sm"
                style={{ backgroundColor: SLEEP_BAR_COLOR }}
              />
              <Text className="text-[11px] text-sub-main">수면 시간</Text>
            </View>
          </View>
        </View>

        {/* 탭 버튼 */}
        <View className="flex-row bg-level2 rounded-full p-1 border border-level3">
          <TouchableOpacity
            onPress={() => setPeriod("7d")}
            className={`px-3 py-1 rounded-full ${
              period === "7d" ? "bg-main" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                period === "7d" ? "text-white" : "text-sub-main"
              }`}
            >
              주간
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPeriod("30d")}
            className={`px-3 py-1 rounded-full ${
              period === "30d" ? "bg-main" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                period === "30d" ? "text-white" : "text-sub-main"
              }`}
            >
              월간
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Wagmi LineChart 컴포넌트 */}
      <LineChart.Provider data={chartData}>
        {/* 인터랙티브 헤더 (터치 시 실시간 값 변동) */}
        <View className="mb-3 flex-row items-baseline justify-between">
          <View>
            {/* 날짜 표시 */}
            <LineChart.DatetimeText
              style={{
                fontSize: 12,
                color: "#4a7c59",
                marginTop: 2,
              }}
              format={({ value }) => {
                "worklet";
                // 터치 중이 아닐 때는 마지막으로 체크한 날짜를 기본값으로 표시
                if (!value) return `${lastLabel} 기록`;
                const date = new Date(Number(value));
                return `${date.getMonth() + 1}월 ${date.getDate()}일 기록`;
              }}
            />

            {/* 같은 지점의 수면 시간 (기분 라인과 동기화) */}
            <ComboSleepIndicator
              chartData={chartData}
              style={{
                fontSize: 11,
                color: SLEEP_BAR_COLOR,
                marginTop: 2,
                fontWeight: "600",
              }}
            />
            <View className="flex-row items-center gap-1.5">
              <LineChart.PriceText
                style={{
                  fontSize: 26,
                  fontWeight: "bold",
                  color: "#2b4c3f",
                }}
                format={({ value }) => {
                  "worklet";
                  // 터치 중이 아닐 때는 마지막으로 체크한 날짜의 기분을 기본값으로 표시
                  if (!value)
                    return `${Number(lastRawScore) > 0 ? "+" : ""}${lastRawScore}점`;
                  // 0~10 scale -> -5~5 scale 복원
                  const restoredScore = (Number(value) - 5).toFixed(1);
                  const prefix = Number(restoredScore) > 0 ? "+" : "";
                  return `${prefix}${restoredScore}점`;
                }}
              />
            </View>
          </View>

          <View className="bg-level2 px-3 py-1.5 rounded-2xl border border-level3">
            <Text className="text-xs font-semibold text-main">
              {getMoodDescription(Number(avgRawScore))}
            </Text>
          </View>
        </View>

        {/* 3. 기분 라인 + 수면 시간 막대 콤보 차트 캔버스 */}
        <View className="bg-level2/50 rounded-2xl p-2 border border-level3/50 overflow-hidden">
          <View onLayout={(e) => setCanvasWidth(e.nativeEvent.layout.width)}>
            {canvasWidth > 0 && (
              <>
                {/* 수면 시간 막대 (배경 레이어) */}
                <View style={StyleSheet.absoluteFill} pointerEvents="none">
                  {chartData.map((point, index) => {
                    const x =
                      chartData.length > 1
                        ? (index / (chartData.length - 1)) * canvasWidth
                        : canvasWidth / 2;
                    const barHeight = Math.max(
                      4,
                      (point.sleepHours / maxSleepHours) * SLEEP_BAR_MAX_HEIGHT,
                    );
                    return (
                      <View
                        key={`sleep-bar-${point.timestamp}`}
                        style={{
                          position: "absolute",
                          left: x - SLEEP_BAR_WIDTH / 2,
                          bottom: 0,
                          width: SLEEP_BAR_WIDTH,
                          height: barHeight,
                          backgroundColor: SLEEP_BAR_COLOR,
                          opacity: 0.28,
                          borderTopLeftRadius: 5,
                          borderTopRightRadius: 5,
                        }}
                      />
                    );
                  })}
                </View>

                {/* 기분 라인 (전경 레이어) */}
                <LineChart height={CHART_HEIGHT} width={canvasWidth}>
                  {/* 하단 은은한 그린 그래디언트 */}
                  <LineChart.Path color={MOOD_LINE_COLOR} width={3}>
                    <LineChart.Gradient color={MOOD_LINE_COLOR} opacity={0.3} />

                    {/* 날짜별 데이터 포인트 동그라미 표시 */}
                    {chartData.map((point, index) => {
                      const isLast = index === chartData.length - 1;
                      return (
                        <LineChart.Dot
                          key={point.timestamp}
                          at={index}
                          color={MOOD_DOT_COLOR}
                          size={isLast ? 5 : 3.5}
                          hasOuterDot={isLast}
                          hasPulse={isLast}
                          pulseBehaviour="while-inactive"
                          outerDotProps={{ opacity: 0.15 }}
                        />
                      );
                    })}
                  </LineChart.Path>

                  {/* 터치 커서 십자선 */}
                  <LineChart.CursorCrosshair color={MOOD_DOT_COLOR}>
                    <LineChart.Tooltip
                      textStyle={{
                        color: "#ffffff",
                        fontWeight: "bold",
                        fontSize: 12,
                      }}
                    />
                  </LineChart.CursorCrosshair>
                </LineChart>
              </>
            )}
          </View>
        </View>
      </LineChart.Provider>
    </View>
  );
}
