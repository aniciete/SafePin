CREATE OR REPLACE FUNCTION public.get_daily_report_counts(
    days_limit INT
)
RETURNS TABLE(day DATE, count BIGINT)
LANGUAGE sql
AS $$
  -- 1. Generate a series of the last N days (including today)
  WITH date_series AS (
    SELECT generate_series(
      (NOW() - (days_limit - 1) * INTERVAL '1 day')::DATE,
      NOW()::DATE,
      '1 day'::INTERVAL
    )::DATE AS day
  )
  -- 2. Left join the report counts onto the date series
  SELECT
    ds.day,
    COALESCE(rc.count, 0) AS count
  FROM
    date_series ds
  LEFT JOIN (
    SELECT
      created_at::DATE AS day,
      COUNT(*) AS count
    FROM
      public.reports
    WHERE
      created_at >= (NOW() - (days_limit - 1) * INTERVAL '1 day')::DATE
    GROUP BY
      created_at::DATE
  ) rc ON ds.day = rc.day
  ORDER BY
    ds.day ASC;
$$;