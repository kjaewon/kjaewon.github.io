# Supabase 스키마

## 테이블 요약

| 테이블 | 설명 | 앱 타입 매핑 |
|--------|------|----------------|
| `user_settings` | 사용자당 1행. 사용자 이름·은퇴 예정일·생년월일 | `UserSettings` |
| `retirement_plans` | 은퇴 준비 계획 목록 | `RetirementPlan[]` |

**user_settings 컬럼**

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `display_name` | text | 사용자 이름 (표시용) |
| `retirement_date` | date | 은퇴 예정일 |
| `birth_date` | date | 생년월일 (선택) |

**retirement_plans 컬럼**

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `title` | text | 계획 제목 |
| `description` | text | 세부 내용 |
| `start_date` | date | 계획 시작일 |
| `end_date` | date | 종료 예정일 |
| `completed` | boolean | 완료 여부 |
| `completed_at` | timestamptz | 실제 완료일 |

**앱 필드 매핑 (DB snake_case → 앱 camelCase)**

- `user_settings`: `display_name` → `displayName`, `retirement_date` → `retirementDate`, `birth_date` → `birthDate`
- `retirement_plans`: `description` → `description`, `start_date` → `startDate`, `end_date` → `endDate`, `completed_at` → `completedAt`

## 적용 방법

1. **Supabase 대시보드**: 프로젝트 선택 → SQL Editor → `migrations/00001_initial_schema.sql` 내용 붙여넣기 → Run.
2. **Supabase CLI**: `supabase link` 후 `supabase db push`.

## 전제

- Supabase Auth 사용. `auth.users`에 사용자 생성 후 `user_id`로 데이터 구분.
- RLS로 로그인한 사용자는 본인 행만 조회·수정·삭제 가능.
- 가입 시 트리거로 `user_settings` 한 행이 자동 생성됨.
