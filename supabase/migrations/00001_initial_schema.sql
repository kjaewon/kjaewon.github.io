-- 은퇴 카운트다운 웹앱 — Supabase 초기 스키마
-- 실행: Supabase 대시보드 SQL Editor 또는 `supabase db push`

-- -----------------------------------------------
-- 1. user_settings (사용자당 1행)
-- -----------------------------------------------
create table if not exists public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text,
  retirement_date date,
  birth_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

-- -----------------------------------------------
-- 2. retirement_plans (은퇴 준비 계획)
-- -----------------------------------------------
create table if not exists public.retirement_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  start_date date,
  end_date date,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_retirement_plans_user_id on public.retirement_plans(user_id);
create index if not exists idx_retirement_plans_created_at on public.retirement_plans(created_at desc);

-- -----------------------------------------------
-- 3. updated_at 자동 갱신
-- -----------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger user_settings_updated_at
  before update on public.user_settings
  for each row execute function public.set_updated_at();

create trigger retirement_plans_updated_at
  before update on public.retirement_plans
  for each row execute function public.set_updated_at();

-- -----------------------------------------------
-- 4. RLS (Row Level Security)
-- -----------------------------------------------
alter table public.user_settings enable row level security;
alter table public.retirement_plans enable row level security;

-- user_settings: 본인만 읽기/쓰기
create policy "user_settings_select_own"
  on public.user_settings for select
  using (auth.uid() = user_id);

create policy "user_settings_insert_own"
  on public.user_settings for insert
  with check (auth.uid() = user_id);

create policy "user_settings_update_own"
  on public.user_settings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "user_settings_delete_own"
  on public.user_settings for delete
  using (auth.uid() = user_id);

-- retirement_plans: 본인만 읽기/쓰기
create policy "retirement_plans_select_own"
  on public.retirement_plans for select
  using (auth.uid() = user_id);

create policy "retirement_plans_insert_own"
  on public.retirement_plans for insert
  with check (auth.uid() = user_id);

create policy "retirement_plans_update_own"
  on public.retirement_plans for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "retirement_plans_delete_own"
  on public.retirement_plans for delete
  using (auth.uid() = user_id);

-- -----------------------------------------------
-- 5. (선택) 가입 시 user_settings 1행 자동 생성
-- -----------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_settings (user_id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
