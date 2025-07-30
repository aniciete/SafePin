# Database Schema Analysis

This document provides a comprehensive analysis of the SafePin database schema.

## Tables

### `reports`

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | Primary Key, Not Null, Default: `gen_random_uuid()` | Unique identifier for each report. |
| `created_at` | `timestamp with time zone` | Not Null, Default: `now()` | Timestamp of when the report was created. |
| `user_id` | `uuid` | Foreign Key to `auth.users.id`, Nullable | The ID of the user who submitted the report, if they were logged in. |
| `incident_type` | `text` | Not Null | The type of incident being reported (e.g., "Theft", "Assault"). |
| `incident_type_other` | `text` | Nullable | If the incident type is "Other", this field contains the user-specified type. |
| `severity` | `text` | Not Null | The severity level of the incident (e.g., "low", "medium", "high"). |
| `description` | `text` | Not Null | A detailed description of the incident. |
| `location` | `point` | Not Null | The geographic coordinates of the incident. |
| `image_url` | `text` | Nullable | The URL of the image associated with the report in Supabase Storage. |
| `tracking_code` | `text` | Not Null, Unique | A unique code for tracking the status of the report. |
| `contact_info` | `text` | Nullable | The contact information of the person who submitted the report. |
| `jurisdiction` | `text` | Nullable | The jurisdiction code for the report. |
| `status` | `text` | Not Null, Default: `'pending_verification'` | The status of the report (e.g., "pending_verification", "verified", "resolved", "rejected"). |
| `is_flagged` | `boolean` | Not Null, Default: `false` | Whether the report has been flagged for review. |
| `notes` | `text` | Nullable | Internal notes about the report. |

### `users`

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | Primary Key, Not Null, Foreign Key to `auth.users.id` | Unique identifier for each user. |
| `role` | `text` | Not Null | The role of the user (e.g., "admin", "authority", "user"). |
| `jurisdiction` | `text` | Nullable | The jurisdiction of the user, if they are an authority. |

### `newsletter_subscriptions`

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | Primary Key, Not Null, Default: `gen_random_uuid()` | Unique identifier for each subscription. |
| `email` | `text` | Not Null, Unique | The email address of the subscriber. |
| `is_active` | `boolean` | Not Null, Default: `true` | Whether the subscription is currently active. |
| `subscribed_at` | `timestamp with time zone` | Not Null, Default: `now()` | Timestamp of when the subscription was created. |
| `unsubscribed_at` | `timestamp with time zone` | Nullable | Timestamp of when the subscription was cancelled. |
| `consent_given` | `boolean` | Not Null | Whether the user has given consent to receive emails. |
| `consent_timestamp` | `timestamp with time zone` | Not Null | Timestamp of when the user gave consent. |
| `privacy_policy_version` | `text` | Not Null | The version of the privacy policy that the user consented to. |
| `data_retention_acknowledged` | `boolean` | Not Null | Whether the user has acknowledged the data retention policy. |
| `npc_rights_acknowledged` | `boolean` | Not Null | Whether the user has acknowledged their rights under the National Privacy Commission. |
| `consent_source` | `text` | Not Null | The source of the user's consent (e.g., "website_footer"). |
| `data_processing_purpose` | `text` | Not Null | The purpose for which the user's data is being processed. |
| `unsubscribe_reason` | `text` | Nullable | The reason the user unsubscribed. |

### `jurisdiction_boundaries`

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `bigint` | Primary Key, Generated always as identity | Unique identifier for each jurisdiction boundary. |
| `psgc_code` | `text` | Not Null, Unique | The PSGC code for the jurisdiction. |
| `barangay_name` | `text` | Not Null | The name of the barangay. |
| `city_name` | `text` | Not Null | The name of the city. |
| `geom` | `geometry(MultiPolygon, 4326)` | Not Null | The geometry of the jurisdiction boundary. |

## Views

### `public_reports`

This view exposes a limited subset of the `reports` table to the public.

| Column | Data Type | Description |
|---|---|---|
| `tracking_code` | `text` | The unique tracking code for the report. |
| `incident_type` | `text` | The type of incident. |
| `status` | `text` | The current status of the report. |
| `created_at` | `timestamp with time zone` | The timestamp of when the report was created. |
| `incident_type_other` | `text` | The user-specified incident type, if applicable. |

## Remote Procedure Calls (RPCs)

### `get_jurisdiction_for_location`

This function takes a location (latitude and longitude) and returns the PSGC code of the jurisdiction that contains it.

### `get_jurisdiction_centroid`

This function takes a jurisdiction code and returns the centroid of the jurisdiction's geometry.

### `get_report_stats`

This function returns a count of reports for each status.

### `get_user_stats`

This function returns a count of users for each role.

### `get_top_jurisdictions_by_report_count`

This function returns a list of the top jurisdictions by report count.

### `get_report_trends_by_type`

This function returns the data needed for the "Incident Trends by Type" chart.

### `get_common_incidents`

This function returns the data needed for the "Most Common Incidents" chart.

### `get_severity_distribution`

This function returns the data needed for the "Severity Distribution" chart.

### `get_status_distribution`

This function returns the data needed for the "Report Status" chart.

### `get_incident_hotspots`

This function returns the data needed for the "Incident Hotspots by Time of Day" chart.

### `get_hierarchical_breakdown`

This function returns the data needed for the "Hierarchical Breakdown" chart.

## Row Level Security (RLS) Policies

### `reports` Table

*   **Allow public read access:**
    *   **Policy:** `CREATE POLICY "Allow public read access" ON public.reports FOR SELECT USING (true);`
*   **Allow anonymous write access:**
    *   **Policy:** `CREATE POLICY "Allow anonymous write access" ON public.reports FOR INSERT WITH CHECK (true);`
*   **Allow authority read access:**
    *   **Policy:** `CREATE POLICY "Allow authority read access" ON public.reports FOR SELECT USING (auth.jwt()->>'role' = 'authority' AND jurisdiction = auth.jwt()->>'jurisdiction');`
*   **Allow authority updates:**
    *   **Policy:** `CREATE POLICY "Allow authority updates" ON public.reports FOR UPDATE USING (auth.jwt()->>'role' = 'authority' AND jurisdiction = auth.jwt()->>'jurisdiction') WITH CHECK (auth.jwt()->>'role' = 'authority' AND jurisdiction = auth.jwt()->>'jurisdiction');`
*   **Allow admin updates:**
    *   **Policy:** `CREATE POLICY "Allow admin updates" ON public.reports FOR UPDATE USING (auth.jwt()->>'role' = 'admin');`
*   **Restrict deletes:**
    *   **Policy:** `CREATE POLICY "Allow admin deletes" ON public.reports FOR DELETE USING (auth.jwt()->>'role' = 'admin');`

### `users` Table

*   **Allow individual read access:**
    *   **Policy:** `CREATE POLICY "Allow individual read access" ON public.users FOR SELECT USING (auth.uid() = id);`
*   **Allow individual update access:**
    *   **Policy:** `CREATE POLICY "Allow individual update access" ON public.users FOR UPDATE USING (auth.uid() = id);`
*   **Restrict inserts:**
    *   **Policy:** `CREATE POLICY "Allow admin inserts" ON public.users FOR INSERT WITH CHECK (auth.jwt()->>'role' = 'admin');`
*   **Restrict deletes:**
    *   **Policy:** `CREATE POLICY "Allow admin deletes" ON public.users FOR DELETE USING (auth.jwt()->>'role' = 'admin');`

### `newsletter_subscriptions` Table

*   **Allow public read access:**
    *   **Policy:** `CREATE POLICY "Allow public read access" ON public.newsletter_subscriptions FOR SELECT USING (true);`
*   **Allow anonymous write access:**
    *   **Policy:** `CREATE POLICY "Allow anonymous write access" ON public.newsletter_subscriptions FOR INSERT WITH CHECK (true);`
*   **Allow anonymous updates:**
    *   **Policy:** `CREATE POLICY "Allow anonymous updates" ON public.newsletter_subscriptions FOR UPDATE USING (true);`

### `jurisdiction_boundaries` Table

*   **Allow public read access:**
    *   **Policy:** `CREATE POLICY "Allow public read access" ON public.jurisdiction_boundaries FOR SELECT USING (true);`
