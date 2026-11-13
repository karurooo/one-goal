-- S3-7: the only write path into public.scores.
-- Limits mirror src/features/game/constants/config.ts; keep them in sync:
--   MAX_SCORE        = 10800 (P2-5)
--   max catches      = roundSeconds * maxTapsPerSecond = 30 * 8 = 240
--   max points/catch = fastCritter.bonusPoints + combo.capPoints = 25 + 25 = 50
-- Nickname rule mirrors nicknameSchema (trimmed, 3-16 chars).

create or replace function public.submit_score(
  nickname text,
  score integer,
  caught integer,
  best_combo integer
)
returns public.scores
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  clean_nickname text := trim(submit_score.nickname);
  new_row public.scores;
begin
  if uid is null then
    raise exception 'not signed in' using errcode = '28000';
  end if;

  if clean_nickname is null or char_length(clean_nickname) not between 3 and 16 then
    raise exception 'nickname must be 3-16 characters' using errcode = '22023';
  end if;

  if submit_score.score is null or submit_score.caught is null or submit_score.best_combo is null
    or submit_score.score not between 0 and 10800
    or submit_score.caught not between 0 and 240
    or submit_score.best_combo not between 0 and submit_score.caught
    or submit_score.score > submit_score.caught * 50
  then
    raise exception 'impossible score' using errcode = '22023';
  end if;

  -- Serialize per user so two parallel calls can't both pass the 25 s check.
  perform pg_advisory_xact_lock(hashtextextended(uid::text, 0));

  if exists (
    select 1 from public.scores s
    where s.user_id = uid and s.created_at > now() - interval '25 seconds'
  ) then
    raise exception 'please wait before submitting again' using errcode = 'P0001', hint = 'rate_limited';
  end if;

  insert into public.scores (user_id, nickname, score, caught, best_combo)
  values (uid, clean_nickname, submit_score.score, submit_score.caught, submit_score.best_combo)
  returning * into new_row;

  return new_row;
end;
$$;

revoke execute on function public.submit_score(text, integer, integer, integer) from public, anon;
grant execute on function public.submit_score(text, integer, integer, integer) to authenticated;
