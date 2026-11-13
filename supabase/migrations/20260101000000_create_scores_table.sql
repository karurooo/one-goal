-- ERD contract for the leaderboard feature (owned by D, signed off with A).
-- Max possible score ceiling must be re-derived once A locks CONFIG in
-- Sprint 3-4 (see docs/Scatter & Catch Team Plan.md, "D's SQL ceiling needs
-- A's final scoring"). Placeholder formula below assumes: pointsPerCatch *
-- max_catches + fastCritter bonuses + combo cap - bomb penalties.

create table if not exists scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id),
  nickname text not null check (
    char_length(trim(nickname)) >= 3 and char_length(trim(nickname)) <= 16
  ),
  score integer not null check (score >= 0),
  caught integer not null check (caught >= 0),
  best_combo integer not null check (best_combo >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists scores_score_created_at_idx
  on scores (score desc, created_at asc);

alter table scores enable row level security;

create policy "scores are readable by anyone"
  on scores for select
  using (true);

-- Direct writes are revoked; all inserts go through submit_score() (Sprint 3).
revoke insert, update, delete on scores from anon, authenticated;
