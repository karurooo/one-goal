-- ERD contract for the leaderboard feature (owned by D, signed off with A).
-- Score floor (Q2): the engine clamps the round score at 0, so a bomb can
-- never make it negative; hence check (score >= 0).
-- Max score ceiling (P2-5) is enforced in submit_score() (S3-7), not here.

create table if not exists public.scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  nickname text not null check (
    char_length(trim(nickname)) >= 3 and char_length(trim(nickname)) <= 16
  ),
  score integer not null check (score >= 0),
  caught integer not null check (caught >= 0),
  best_combo integer not null check (best_combo >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now() -- team convention; rows are never updated
);

create index if not exists scores_score_created_at_idx
  on public.scores (score desc, created_at asc);

-- For the 25 s resubmit check in submit_score() and the user_id FK.
create index if not exists scores_user_id_created_at_idx
  on public.scores (user_id, created_at desc);

alter table public.scores enable row level security;

create policy "scores are readable by anyone"
  on public.scores for select
  to anon, authenticated
  using (true);

-- Direct writes are revoked; all inserts go through submit_score() (S3-7).
revoke insert, update, delete, truncate on public.scores from anon, authenticated;
