# 테스트 및 로컬 데이터 사용 가이드

이 문서는 VibeQuest에 추가된 테스트 기반과 MMKV·SQLite 로컬 데이터 계층을 설명합니다. 현재 구현 범위, 사용법, 주의사항과 다음 연결 작업을 한곳에서 확인하기 위한 문서입니다.

## 1. 현재 구현 범위

### 테스트 기반

- Jest와 Expo용 `jest-expo` preset
- React Native Testing Library
- `AppProvider`를 포함하는 공통 렌더 함수
- 홈 화면 렌더링과 기분 기록 모달 진입 smoke test
- 퀘스트 화면 렌더링과 완료 처리 smoke test
- MMKV용 Jest 메모리 mock

### 로컬 데이터 기반

- MMKV: 작고 자주 읽는 앱 설정
- Expo SQLite: 누적되는 감정·수면 기록
- SQLite schema version과 migration
- 감정 기록 저장·삭제
- 날짜 범위 및 최근 N일 조회
- Android, iOS Development Build 환경
- Web SQLite 실행에 필요한 WASM과 COEP/COOP 설정

> `AppContext`의 `vibeLogs`/`addVibeLog`는 이제 `moodRepository`(SQLite)와 연결되어 있습니다. 자세한 내용은 8절을 참고하세요.

## 2. 주요 디렉터리

```text
jest.config.js
jest.setup.js
src/
├── test/
│   └── render-with-app.tsx
└── storage/
    ├── database/
    │   ├── index.ts
    │   ├── migrations.ts
    │   └── __tests__/migrations-test.ts
    ├── mood/
    │   ├── index.ts
    │   ├── local-date.ts
    │   ├── mood-repository.ts
    │   └── __tests__/mood-repository-test.ts
    └── settings/
        ├── index.ts
        ├── settings-repository.ts
        └── __tests__/settings-repository-test.ts
```

## 3. 테스트 실행

```bash
# 전체 테스트를 한 번 실행
npm test

# 변경을 감시하며 반복 실행
npm run test:watch

# coverage 생성
npm run test:coverage

# TypeScript 검사
npm run typecheck

# ESLint 검사
npm run lint
```

현재 추가된 테스트는 5개 suite, 총 13개이며 다음을 검증합니다.

- 홈과 퀘스트 핵심 UI가 렌더링되는가
- 기분 기록 모달과 퀘스트 완료 상호작용이 동작하는가
- MMKV 설정의 기본값·저장·잘못된 값 복구가 동작하는가
- SQLite 최초 migration과 버전 검사가 동작하는가
- 최근 7일 범위와 감정 태그 조합이 올바른가

`jest.setup.js`의 MMKV는 테스트 전용 메모리 구현입니다. 실제 파일 저장, NitroModule 연결, 앱 재실행 후 유지 여부는 Development Build에서 별도로 확인해야 합니다.

## 4. MMKV 설정 저장소

MMKV instance ID는 `vibe-quest.settings`입니다. 현재 저장 가능한 값은 다음과 같습니다.

| 설정 | 타입 | 기본값 |
| --- | --- | --- |
| 테마 | `system`, `light`, `dark` | `system` |
| 온보딩 완료 | `boolean` | `false` |
| 감정 차트 기간 | `7`, `30` | `7` |
| 마지막 동기화 시각 | ISO 문자열 또는 없음 | 없음 |

### 읽기

```ts
import { settingsRepository } from "@/storage";

const settings = settingsRepository.getAll();

console.log(settings.theme);
console.log(settings.moodChartPeriod);
```

MMKV는 동기식 API이므로 `await`가 필요하지 않습니다.

### 변경

```ts
import { settingsRepository } from "@/storage";

settingsRepository.setTheme("dark");
settingsRepository.setOnboardingCompleted(true);
settingsRepository.setMoodChartPeriod(30);
settingsRepository.setLastSyncAt(new Date().toISOString());
```

### 초기화

```ts
settingsRepository.reset();
```

`reset()`은 `vibe-quest.settings` instance의 모든 설정을 삭제합니다. 감정 기록이 저장된 SQLite에는 영향을 주지 않습니다.

### MMKV에 저장하지 않을 데이터

- 누적되는 감정·수면·퀘스트 완료 이력
- 날짜 범위 조회와 통계가 필요한 데이터
- 인증 토큰이나 암호화 키처럼 보호가 필요한 값

인증 정보는 추후 `expo-secure-store` 같은 보안 저장소를 사용해야 합니다.

## 5. SQLite 감정 저장소

데이터베이스 파일명은 `vibe-quest.db`입니다. 처음 접근할 때 데이터베이스를 열고 필요한 migration을 자동 실행합니다.

### 테이블

#### `mood_entries`

- 기록 ID
- 사용자 로컬 날짜 (`YYYY-MM-DD`)
- 실제 기록 시각(ISO 문자열)
- 기분 점수(-5~5)
- 수면 시간(분)
- 선택적 메모
- 생성·수정 시각

#### `mood_entry_emotions`

- 감정 기록 ID
- 감정 이름

감정을 별도 테이블로 분리했기 때문에 추후 특정 감정의 빈도나 기간별 분포를 조회할 수 있습니다. 감정 기록을 삭제하면 연결된 감정도 foreign key cascade로 삭제됩니다.

### 감정 기록 저장

```ts
import { moodRepository, toLocalDateKey } from "@/storage";

const now = new Date();

await moodRepository.save({
  id: "mood-2026-08-12",
  localDate: toLocalDateKey(now),
  recordedAt: now.toISOString(),
  score: 3,
  sleepMinutes: 450,
  emotions: ["기쁨", "차분"],
  note: "산책 후 기분이 좋아졌다.",
});
```

ID는 호출하는 도메인 계층에서 생성해야 합니다. 동일한 ID로 다시 저장하면 기존 기록을 갱신하고 감정 목록을 교체합니다.

### 최근 7일 조회

```ts
const recentEntries = await moodRepository.findRecentDays(7);
```

기준 날짜를 지정하면 테스트나 과거 시점 조회에도 사용할 수 있습니다.

```ts
const entries = await moodRepository.findRecentDays(
  7,
  new Date("2026-08-12T12:00:00"),
);
```

`findRecentDays(7)`은 오늘을 포함해 7개의 로컬 달력 날짜를 조회합니다.

### 임의 기간 조회

```ts
const augustEntries = await moodRepository.findByDateRange(
  "2026-08-01",
  "2026-08-31",
);
```

문자열은 반드시 `YYYY-MM-DD` 형식이어야 하며 시작일은 종료일보다 늦을 수 없습니다.

### 삭제

```ts
await moodRepository.delete("mood-2026-08-12");
```

## 6. Migration 추가 방법

현재 database version은 1입니다. schema를 변경할 때는 기존 migration을 수정하지 않고 다음 버전 항목을 추가해야 합니다.

```ts
{
  version: 2,
  statements: `
    ALTER TABLE mood_entries ADD COLUMN energy_level INTEGER;
  `,
}
```

그다음 `DATABASE_VERSION`을 같은 버전으로 올립니다. 이미 배포된 migration을 직접 변경하면 기존 사용자 DB와 신규 설치 DB의 schema가 달라질 수 있습니다.

migration 변경 시 최소한 다음 테스트가 필요합니다.

- version 0에서 최신 version까지 생성
- 현재 version에서는 재실행하지 않음
- 앱이 지원하는 것보다 높은 version 거부
- 기존 데이터 보존

## 7. 실행 환경

MMKV 4는 NitroModule을 사용하는 네이티브 모듈이므로 Expo Go에서는 동작하지 않습니다.

```bash
# Android Development Build 생성 및 실행
npm run android:dev

# iOS Development Build 생성 및 실행
npm run ios:dev

# 빌드된 Development Client에 Metro 연결
npm run start:dev-client
```

MMKV는 Web에서 `localStorage`를 사용하며 사용할 수 없는 환경에서는 메모리 저장소로 대체되므로 새로고침 시 값이 사라질 수 있습니다.

Expo SQLite의 Web 지원은 SDK 57 기준 alpha입니다. Metro의 WASM 설정은 이미 존재하며 EAS Hosting용 COEP/COOP header도 `app.json`에 설정되어 있습니다. 다른 호스팅을 사용하면 서버에서도 같은 header를 설정해야 합니다.

## 8. 다음 연결 작업

1. ~~`AppContext`의 초기 mock 데이터를 repository에서 불러오도록 변경~~ (완료: `AppProvider` 마운트 시 `moodRepository.findRecentDays(30)` 호출)
2. ~~`addVibeLog()`를 `moodRepository.save()`에 연결~~ (완료: 날짜 기반 고정 ID `mood-YYYY-MM-DD`로 upsert)
3. 기존 `sleepHours`를 SQLite의 `sleepMinutes`로 통일 — 저장소 경계(`AppContext`)에서는 변환이 끝났지만, `VibeLog`/화면 컴포넌트는 여전히 `sleepHours`(시간 단위)를 사용 중. 화면까지 분 단위로 통일할지는 별도 결정 필요
4. ~~`"오늘"`, `"어제"` 문자열 대신 `localDate`를 저장하고 UI에서만 상대 날짜로 변환~~ (완료: SQLite에는 `localDate`만 저장하고, `AppContext`가 조회 시점에 `getRelativeDateLabel()`로 상대 날짜 라벨을 계산)
5. 홈 차트의 7일/30일 선택값을 MMKV 설정과 연결
6. 앱 시작·저장 실패 상태와 사용자 피드백 처리 — 현재는 홈 화면 저장 실패 시 alert만 노출하고, 최초 로딩 실패는 콘솔 로그만 남김
7. Development Build에서 앱 재실행 후 데이터 유지 여부 확인

> Jest 환경에서는 `expo-sqlite`의 `NativeDatabase`가 동작하지 않아, `jest.setup.js`에 메모리 기반 mock을 추가해 `AppContext`를 사용하는 컴포넌트 테스트가 실제 네이티브 모듈 없이도 동작하도록 했습니다. `moodRepository`/`migrateDatabase`의 자체 단위 테스트는 각각 db와 provider를 직접 주입하므로 이 mock의 영향을 받지 않습니다.

## 9. 현재 알려진 별도 문제

Expo Doctor는 기존 Expo SDK 57 패키지 중 6개의 patch version 차이를 보고합니다.

- `@expo/ui`
- `expo`
- `expo-constants`
- `expo-router`
- `expo-splash-screen`
- `expo-symbols`

로컬 데이터 변경과 직접 관련이 없어 이 작업에서는 자동 업그레이드하지 않았습니다. 패키지 갱신은 별도 브랜치에서 changelog와 네이티브 빌드를 함께 검증하는 것이 안전합니다.
