import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";

const SCORES = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
const ITEM_WIDTH = 52;
const PICKER_HEIGHT = 72;

interface ScoreScrollPickerProps {
  value: number;
  onChange: (score: number) => void;
}

function ScoreTick({
  score,
  index,
  scrollX,
}: {
  score: number;
  index: number;
  scrollX: SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const center = scrollX.value / ITEM_WIDTH;
    const distance = Math.abs(center - index);
    const scale = interpolate(
      distance,
      [0, 1, 2, 3],
      [1.4, 1, 0.85, 0.75],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      distance,
      [0, 1, 2, 3],
      [1, 0.6, 0.4, 0.25],
      Extrapolation.CLAMP,
    );
    return { transform: [{ scale }], opacity };
  });

  return (
    <View
      style={{ width: ITEM_WIDTH, height: PICKER_HEIGHT }}
      className="items-center justify-center"
    >
      <Animated.Text
        style={[
          { fontSize: 24, fontWeight: "800" as const, color: "#2b4c3f" },
          animatedStyle,
        ]}
      >
        {score > 0 ? `+${score}` : score}
      </Animated.Text>
    </View>
  );
}

/**
 * 세로 버튼을 일일히 누르는 대신, 자를 스크롤하듯 좌우로 밀어서
 * 오늘의 기분 점수(-5 ~ 5)를 고르는 스크롤 픽커.
 */
export function ScoreScrollPicker({ value, onChange }: ScoreScrollPickerProps) {
  const scrollX = useSharedValue(
    Math.max(0, SCORES.indexOf(value)) * ITEM_WIDTH,
  );
  const scrollRef = useRef<Animated.ScrollView>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const sidePadding =
    containerWidth > 0 ? containerWidth / 2 - ITEM_WIDTH / 2 : 0;

  // 컨테이너 크기를 알게 되거나, 외부에서 value가 바뀌면(예: 저장 후 초기화)
  // 해당 점수 위치로 스크롤을 맞춰준다.
  useEffect(() => {
    if (containerWidth === 0) return;
    const index = Math.max(0, SCORES.indexOf(value));
    scrollRef.current?.scrollTo({ x: index * ITEM_WIDTH, animated: false });
  }, [containerWidth, value]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  // 스크롤 중 실시간으로 갱신되는 큰 숫자 라벨 (커밋 전 미리보기)
  const liveLabel = useDerivedValue(() => {
    const idx = Math.min(
      Math.max(Math.round(scrollX.value / ITEM_WIDTH), 0),
      SCORES.length - 1,
    );
    const score = SCORES[idx];
    return `${score > 0 ? "+" : ""}${score}점`;
  }, [scrollX]);

  const commitScoreAt = (offsetX: number) => {
    const idx = Math.min(
      Math.max(Math.round(offsetX / ITEM_WIDTH), 0),
      SCORES.length - 1,
    );
    onChange(SCORES[idx]);
  };

  return (
    <View
      style={{ height: PICKER_HEIGHT }}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {containerWidth > 0 && (
        <>
          {/* 중앙 선택 인디케이터 */}
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              left: "50%",
              marginLeft: -(ITEM_WIDTH / 2 + 4),
              top: 4,
              bottom: 4,
              width: ITEM_WIDTH + 8,
            }}
            className="bg-main/10 rounded-2xl border border-main/30"
          />

          <Animated.ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={ITEM_WIDTH}
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: sidePadding }}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            onMomentumScrollEnd={(e) =>
              commitScoreAt(e.nativeEvent.contentOffset.x)
            }
            onScrollEndDrag={(e) =>
              commitScoreAt(e.nativeEvent.contentOffset.x)
            }
          >
            {SCORES.map((score, index) => (
              <ScoreTick
                key={score}
                score={score}
                index={index}
                scrollX={scrollX}
              />
            ))}
          </Animated.ScrollView>
        </>
      )}
    </View>
  );
}
