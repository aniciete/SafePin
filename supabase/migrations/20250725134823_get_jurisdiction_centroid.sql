-- This function takes a jurisdiction's PSGC code and returns its geographic center.
-- It uses the PostGIS function ST_Centroid to calculate the center point
-- of the jurisdiction's boundary polygon.
CREATE OR REPLACE FUNCTION public.get_jurisdiction_centroid(
    jurisdiction_code TEXT
)
RETURNS json
LANGUAGE sql
AS $$
  SELECT
    json_build_object(
      'lat', ST_Y(ST_Centroid(geom)),
      'lng', ST_X(ST_Centroid(geom))
    )
  FROM
    public.jurisdiction_boundaries
  WHERE
    psgc_code = jurisdiction_code
  LIMIT 1;
$$;