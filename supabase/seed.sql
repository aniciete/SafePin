-- Sample of 3 mock reports
INSERT INTO public.reports (
  id, incident_type, severity, status, description, location, image_path, contact_info, is_flagged, created_at
) VALUES
(
  gen_random_uuid(), 'Suspicious Activity', 'medium', 'pending_verification',
  'A group of individuals has been loitering near the ATM on Katipunan Avenue for the past two nights. They appear to be watching people who withdraw money.',
  '{"lat": 14.6382, "lng": 121.0759}', -- Katipunan Ave, QC
  'reports/placeholder.jpg', NULL, false, NOW() - INTERVAL '1 day'
),
(
  gen_random_uuid(), 'Theft', 'high', 'verified',
  'My motorcycle (Honda Click 125, Plate ABC 1234) was stolen from the parking area of SM North EDSA, Block 2.',
  '{"lat": 14.6565, "lng": 121.0315}', -- SM North EDSA
  NULL, 'juan.delacruz@email.com', false, NOW() - INTERVAL '3 days'
),
(
  gen_random_uuid(), 'Vandalism', 'low', 'resolved',
  'Graffiti was painted on the wall of the barangay hall overnight.',
  '{"lat": 14.5547, "lng": 121.0244}', -- Salcedo Village, Makati
  'reports/placeholder.jpg', NULL, true, NOW() - INTERVAL '10 days'
);