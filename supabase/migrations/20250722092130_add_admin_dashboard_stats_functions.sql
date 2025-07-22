CREATE OR REPLACE FUNCTION get_user_stats()
RETURNS TABLE(role user_role, count bigint) AS $$
BEGIN
    RETURN QUERY
    SELECT
        up.role,
        count(up.id)
    FROM
        user_profiles up
    GROUP BY
        up.role;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_report_stats()
RETURNS TABLE(status report_status, count bigint) AS $$
BEGIN
    RETURN QUERY
    SELECT
        r.status,
        count(r.id)
    FROM
        reports r
    GROUP BY
        r.status;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_top_jurisdictions_by_pending_reports(limit_count integer)
RETURNS TABLE(jurisdiction text, pending_reports_count bigint) AS $$
BEGIN
    RETURN QUERY
    SELECT
        r.jurisdiction,
        count(r.id) as pending_reports_count
    FROM
        reports r
    WHERE
        r.status = 'pending'
    GROUP BY
        r.jurisdiction
    ORDER BY
        pending_reports_count DESC
    LIMIT
        limit_count;
END;
$$ LANGUAGE plpgsql;