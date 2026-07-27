# VibeQuest (기분 모험) 👋

**일상의 작은 행동을 퀘스트처럼 기록하고, 스스로를 성장시키는 경험을 설계하는 웰니스(Wellness) 앱입니다.**

하루를 톺아봄으로써 본인을 객관적으로 돌아보고, 자신의 정보를 얻어가는 과정을 중시하는 웰니스 프로젝트이며, 그 과정에 **게이미피케이션(Gamification)**을 도입하여 사용자의 주도적인 참여를 돕습니다.

### 🌟 핵심 플레이 루프 (Core Loop)

1. **기록하기**: 내 감정, 상태, 그리고 수면 시간을 주기적으로 기록하고 시각화합니다.
2. **수행하기**: 매일 만들어가야 하는 일상의 루틴(일일 퀘스트)을 등록 및 달성하여 재화를 획득합니다.
3. **성장하기**: 획득한 재화로 나만의 가상 방과 캐릭터 외형을 꾸미고 수집하며 스스로가 성장하는 재미를 느낍니다.

---

## 🛠️ 기술 스택 및 환경

- **Framework**: Expo SDK 57 (React Native 0.86.0)
- **Styling**: NativeWind v4 (Tailwind CSS v3 기반 스타일링 + 다크 모드 연동)
- **State Management**: React Context API (`AppContext.tsx`)
- **Language**: TypeScript

---

## 🌿 브랜치 규칙 (Branch Strategy)

본 프로젝트는 다음과 같은 Git 브랜치 전략을 준수하여 협업합니다.

- **`master`** : 프로덕션 출시용 브랜치. 가장 안정적인 배포 빌드만 병합됩니다.
- **`dev`** : 개발 통합 브랜치. 기능 개발이 완료된 브랜치들이 1차로 병합되는 곳입니다.
- **`feat_...` or `feat-...`** : 새로운 기능 개발을 수행하는 브랜치 (예: `feat_report_smoking_area`)
- **`style-...`** : 디자인 수정 및 퍼블리싱 스타일 작업을 위한 브랜치 (예: `style-setting_basic_color`)
- **`docs_...`** : 문서 작성 및 수정 작업을 위한 브랜치 (예: `docs_readme_update`)
- **`fix_...`** : 버그 및 이슈 수정을 위한 브랜치

---

## 📝 커밋 규칙 (Commit Conventions)

커밋 메시지는 작업 유형을 명확히 식별할 수 있도록 아래와 같은 접두사(Type Prefix) 형식을 따릅니다.

```
[TYPE] 커밋 내용 설명 (한글 또는 영문 작성)
```

### Type 목록

| 타입             | 설명                                                   | 예시                                              |
| :--------------- | :----------------------------------------------------- | :------------------------------------------------ |
| **`[FEAT]`**     | 새로운 기능 추가                                       | `[FEAT] 주소로 위치검색 기능 추가`                |
| **`[FIX]`**      | 버그 및 에러 수정                                      | `[FIX] React 19 컴파일러 의존성 경고 수정`        |
| **`[STYLE]`**    | 코드의 로직 변경 없이 스타일/포맷팅, UI CSS 변경       | `[STYLE] 다크모드 고려하여 기본 색상 설정`        |
| **`[DOCS]`**     | 문서 작성/수정 (README.md 등)                          | `[DOCS] README 프로젝트 소개 및 규칙 추가`        |
| **`[REFACTOR]`** | 기능 변경 없이 코드 리팩토링                           | `[REFACTOR] 지오로케이션 로직 커스텀 훅으로 분리` |
| **`[CHORE]`**    | 빌드 프로세스, 패키지 매니저 설정, 단순 설정 파일 수정 | `[CHORE] package.json 라이브러리 추가`            |
| **`[MERGE]`**    | 브랜치 머지                                            | `[MERGE] develop to master`                       |

---

## 🎨 NativeWind 스타일링 및 다크모드 가이드

프로젝트 전반에 걸쳐 테마 변경에 능동적으로 대처할 수 있도록 다음과 같은 테마 클래스가 정의되어 있습니다. 스타일링 시 적극 활용해 보세요.

- `bg-background` / `text-main` 등: 앱의 기본 배경 및 주 텍스트 색상
- `bg-level1` / `bg-level2` / `bg-level3`: 카드, 입력창, 컨테이너 등의 계층 구조 스타일링을 위한 3단계 색상
- `bg-main` / `text-main`: 앱 고유의 시그니처 숲/다크그린 포인트 색상 (다크모드에서는 밝은 에메랄드/그린으로 자동 전환)
- `bg-sub-main` / `text-sub-main`: 서조 포인트 색상

모든 색상은 시스템의 라이트/다크모드 환경에 맞춰 `src/global.css`에 정의된 CSS Variables를 통해 자동으로 매핑됩니다.

---

## 📂 디렉토리 구조

```
vibe-quest/
├── assets/                        # 이미지, SVG 아이콘 등 정적 리소스
└── src/
    ├── app/                       # 파일 기반 라우팅 (얇은 re-export만)
    │   ├── _layout.tsx            # 루트 레이아웃 (AppContext + ThemeProvider)
    │   ├── index.tsx              # → features/home/home-screen
    │   ├── quest.tsx              # → features/quest/quest-screen
    │   ├── adventure.tsx          # → features/adventure/adventure-screen
    │   ├── shop.tsx               # → features/shop/shop-screen
    │   └── myinfo.tsx             # → features/myinfo/myinfo-screen
    │
    ├── components/
    │   ├── ui/                    # 공통 UI (도메인 무관)
    │   │   ├── themed-text.tsx
    │   │   ├── themed-view.tsx
    │   │   ├── animated-icon.tsx / .web.tsx
    │   │   └── external-link.tsx
    │   ├── layout/                # 앱 전역 셸 (모든 탭에서 공유)
    │   │   ├── app-tabs.tsx / .web.tsx
    │   │   ├── top-bar.tsx
    │   │   └── tab-icon.tsx
    │   └── skia/                  # Skia 플랫폼 분기 인프라
    │       ├── skia-loader.tsx
    │       └── skia-loader.web.tsx
    │
    ├── features/                  # 페이지(도메인)별 모듈
    │   ├── home/
    │   │   ├── home-screen.tsx
    │   │   ├── components/
    │   │   │   ├── vibe-log-list.tsx       # 7일 기분 차트
    │   │   │   └── mood-record-modal.tsx   # 기분 기록 모달
    │   │   └── constants.ts               # EMOTIONS
    │   ├── quest/
    │   │   ├── quest-screen.tsx
    │   │   ├── components/
    │   │   │   ├── quest-tabs.tsx          # 일일/목록/프리셋 탭 전환
    │   │   │   ├── daily-quest-list.tsx    # 일일 퀘스트 목록
    │   │   │   └── preset-manager.tsx      # 프리셋 관리
    │   │   └── constants.ts               # CATEGORIES
    │   ├── myinfo/
    │   │   ├── myinfo-screen.tsx
    │   │   ├── components/
    │   │   │   ├── profile-card.tsx        # 프로필 카드 (닉네임, 레벨)
    │   │   │   ├── avatar-swatch-row.tsx   # 아바타 레이어 선택 UI
    │   │   │   └── flower-grid.tsx         # 꽃 도감 그리드
    │   │   ├── avatar/                    # Skia 레이어 합성 아바타
    │   │   │   ├── avatar-canvas.tsx
    │   │   │   ├── avatar-loader.tsx
    │   │   │   └── avatar-catalog.ts
    │   │   └── room/                      # Skia 아이소메트릭 방
    │   │       ├── isometric-room.tsx
    │   │       └── isometric-room-loader.tsx
    │   ├── shop/
    │   │   └── shop-screen.tsx
    │   └── adventure/
    │       └── adventure-screen.tsx
    │
    ├── context/
    │   ├── AppContext.tsx          # 전역 상태 (기분 로그, 퀘스트, 재화, 인벤토리)
    │   └── TopBarContext.tsx       # 상단바 옵션 (탭별 재화 노출 제어)
    ├── hooks/
    │   ├── use-color-scheme.ts / .web.ts
    │   └── use-theme.ts
    ├── constants/
    │   └── theme.ts               # 색상, 폰트, 간격 토큰
    ├── declarations.d.ts          # CSS 모듈 등 타입 선언
    └── global.css                 # Tailwind 지시어 및 라이트/다크 테마 변수
```

> **구조 원칙**
>
> - `app/` 라우트는 화면 로직을 갖지 않습니다. `features/`의 screen을 1줄 re-export만 합니다.
> - 도메인별 컴포넌트는 `features/<domain>/components/`에, 앱 전역 공통 컴포넌트는 `components/ui|layout|skia/`에 배치합니다.
> - Skia 의존 컴포넌트는 반드시 `*-loader.tsx`를 통해 마운트합니다 (네이티브/웹 플랫폼 분기 처리).

---

## 📱 하단 탭별 서비스 기능 & 사용자 경험 (UX)

### 1. 🏠 홈 탭 (기분 & 감정 기록)

- **감정 흐름 & 통계**: 일주일간의 내 기분 추이와 수면시간 흐름을 한눈에 시각화하여 스스로를 객관적으로 돌아봅니다.
- **캐릭터의 기록 권유**: 내가 직접 꾸민 캐릭터가 대화창으로 오늘 상태 저장을 다정하게 권하며, 기분 점수와 감정 스탬프를 기록하도록 돕습니다.

### 2. 📜 퀘스트 탭 (루틴 관리 & 실행)

- **루틴 목표 확인**: 스스로 만들고자 하는 생활 습관이나 목표(일일 퀘스트) 목록을 한눈에 확인합니다.
- **실행 및 달성 기록**: 루틴대로 하루 일들을 처리했는지 실시간으로 체크하고 달성 재화를 얻습니다. 자주 쓰는 습관은 프리셋으로 묶어 손쉽게 관리합니다.

### 3. 🗺️ 탐험 탭 (활동 & 로케이션)

- **걸음 수 & 만보기**: 실제로 움직이면서 얼마나 걸었는지 실시간으로 체크하고 만보기 게이지 달성 재화를 획득합니다.
- **장소 방문 & 활동 기록**: 특정 장소 방문이나 미션을 수행하며 나의 활동 기록을 남기고 보상을 챙깁니다.

### 4. 🛍️ 상점 탭 (방 & 캐릭터 꾸미기)

- **활동 보상 환원**: 기록과 퀘스트, 탐험 활동을 통해 얻은 재화(보석, 코인, 별가루)를 사용하는 공간입니다.
- **아이소메트릭 방 & 캐릭터 수집**: 취향에 맞는 방 가구, 벽지부터 캐릭터 의상과 액세서리를 구입하고 취향에 맞게 꾸밉니다.

### 5. 👤 마이페이지 탭 (나의 성장 & 기록 도감)

- **나의 캐릭터 구경**: 내가 정성스레 가꾼 캐릭터와 칭호, 레벨, 경험치 성장을 한눈에 관찰합니다.
- **활동 요약 & 꽃 도감**: 총 걸은 거리, 방문한 장소 수, 그리고 탐험을 통해 피워낸 꽃 컬렉션을 둘러보며 나 자신의 성장 과정을 확인합니다.

---

## 🏗️ 백엔드 연동 및 치팅(Cheating) 방지 아키텍처

본 프로젝트는 **네트워크 통신 최소화(오프라인 우선)**와 **데이터 변조(치팅) 방지**를 동시에 달성하기 위해 **Local-First + Server-Authority** 하이브리드 패턴을 지향합니다.

### 1. 로컬 데이터 (Expo SQLite)

- **대상**: 일일 기분 및 수면 시간 기록, 퀘스트/루틴 생성 및 체크리스트.
- **특징**: 개인 정보 보호 및 사용자의 즉각적인 반응성을 위해 단말기 내부 DB(Expo SQLite)에 저장하여 오프라인 환경에서도 신속하게 반응합니다.

### 2. 서버 검증 데이터 (Server-Authority)

- **대상**: 재화(보석, 코인, 별가루) 잔액, 상점 구매 트랜잭션, 캐릭터/방 장착 인벤토리.
- **치팅(Cheating) 방지 핵심 수칙**:
  - **서버 측 재화 제어**: 클라이언트가 재화 값을 직접 수정하지 못하며, 퀘스트 완료 시 서버로 청구 요청(`POST /api/rewards/claim`)을 보내 서버가 일일 보상 캡/시간 간격을 검증 후 직접 갱신합니다.
  - **원자적 구매 트랜잭션**: 상점 구매 요청(`POST /api/shop/buy`) 시 서버에서 잔액 확인 및 차감을 처리하고 인벤토리에 등록합니다.
  - **캐싱 활용**: 앱 실행 시 서버에서 재화와 인벤토리 목록만 불러와 클라이언트 상태(`AppContext`)에 캐싱하여 사용함으로써 외부 통신량을 최소화합니다.

---

## 🚀 시작하기

### 1. 패키지 설치

프로젝트 폴더 내에서 필요한 라이브러리를 설치합니다.

```bash
npm install
```

### 2. 프로젝트 구동

Metro 번들러를 켜고 에뮬레이터나 브라우저를 통해 실행합니다.

```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```
