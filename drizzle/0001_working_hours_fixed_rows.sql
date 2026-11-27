-- Hand-written. working_hours holds exactly one row per ISO day (1 = Monday … 7 = Sunday).
-- The rows are created here (closed) and can only be updated: the count is fixed at 7, and with the
-- unique + BETWEEN 1 AND 7 constraints that means every day exactly once. drizzle-kit does not track
-- triggers; `db:push` would skip this file, so databases are only ever built with `db:migrate`.
INSERT INTO "working_hours" ("day_of_week") SELECT generate_series(1, 7);--> statement-breakpoint
CREATE FUNCTION "working_hours_fixed_rows"() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'working_hours has exactly 7 rows; update them instead of %', TG_OP
    USING ERRCODE = 'check_violation';
END;
$$;--> statement-breakpoint
CREATE TRIGGER "working_hours_no_insert_delete" BEFORE INSERT OR DELETE ON "working_hours"
  FOR EACH ROW EXECUTE FUNCTION "working_hours_fixed_rows"();--> statement-breakpoint
CREATE TRIGGER "working_hours_no_truncate" BEFORE TRUNCATE ON "working_hours"
  FOR EACH STATEMENT EXECUTE FUNCTION "working_hours_fixed_rows"();
