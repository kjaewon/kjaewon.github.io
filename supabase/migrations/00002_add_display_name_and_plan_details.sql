-- 00001을 이미 적용한 경우에만 실행 (user_settings·retirement_plans 컬럼 추가)

alter table public.user_settings
  add column if not exists display_name text;

alter table public.retirement_plans
  add column if not exists description text,
  add column if not exists start_date date,
  add column if not exists end_date date;
