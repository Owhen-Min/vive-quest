/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  // NativeWind v4는 'media' 방식으로 시스템 다크모드를 감지합니다.
  // global.css의 @media (prefers-color-scheme: dark)와 연동됩니다.
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        // CSS 변수를 참조합니다.
        // NativeWind v4의 react-native-css-interop가 런타임에 변수를 처리하므로
        // 컴포넌트에서 bg-background, text-main 등만 사용하면
        // 시스템 다크모드에 따라 global.css의 변수 값이 자동으로 전환됩니다.
        background: "var(--color-background)",
        level1: "var(--color-level1)",
        level2: "var(--color-level2)",
        level3: "var(--color-level3)",
        main: "var(--color-main)",
        "sub-main": "var(--color-sub-main)",
      },
    },
  },
  plugins: [],
}
