

-- Disable RLS temporarily
ALTER TABLE public.reports DISABLE ROW LEVEL SECURITY;

DELETE FROM public.reports;

INSERT INTO public.reports (
  id, incident_type, severity, status, description, location, image_path, contact_info, is_flagged, created_at
) VALUES
  (gen_random_uuid(), 'Suspicious Activity', 'medium', 'pending_verification',
   'A suspicious van has been seen parked every night outside an apartment complex in Barangay San Antonio, Makati.',
   '{"lat": 14.5531, "lng": 121.0363}', NULL, NULL, false, NOW() - INTERVAL '2 days'),

  (gen_random_uuid(), 'Theft', 'high', 'verified',
   'Motorcycle stolen from outside the North Avenue MRT Station, Quezon City.',
   '{"lat": 14.6549, "lng": 121.0315}', 'reports/placeholder.jpg', '09171234567', false, NOW() - INTERVAL '5 days'),

  (gen_random_uuid(), 'Vandalism', 'low', 'resolved',
   'Graffiti found on the walls of Barangay Poblacion basketball court.',
   '{"lat": 14.5562, "lng": 121.0308}', 'reports/placeholder.jpg', NULL, true, NOW() - INTERVAL '12 days'),

  (gen_random_uuid(), 'Road Accident', 'medium', 'pending_verification',
   'Two cars collided near the intersection of Timog Avenue and Tomas Morato in Quezon City.',
   '{"lat": 14.6368, "lng": 121.0344}', NULL, NULL, false, NOW() - INTERVAL '3 days'),

  (gen_random_uuid(), 'Fire', 'critical', 'verified',
   'Fire broke out in a residential area near Kalayaan Avenue, Makati. Several homes were affected.',
   '{"lat": 14.5508, "lng": 121.0432}', 'reports/placeholder.jpg', 'test@example.com', false, NOW() - INTERVAL '14 days'),

  (gen_random_uuid(), 'Theft', 'medium', 'pending_verification',
   'Bag snatched from a commuter along EDSA-Munoz pedestrian lane.',
   '{"lat": 14.6635, "lng": 121.0219}', NULL, NULL, false, NOW() - INTERVAL '1 day'),

  (gen_random_uuid(), 'Burglary', 'high', 'pending_verification',
   'Break-in reported at a small electronics shop in Kamuning, Quezon City.',
   '{"lat": 14.6309, "lng": 121.0417}', 'reports/placeholder.jpg', NULL, false, NOW() - INTERVAL '9 days'),

  (gen_random_uuid(), 'Environmental Hazard', 'medium', 'pending_verification',
   'Oil spill seen along J.P. Rizal Street near Makati City Hall.',
   '{"lat": 14.5661, "lng": 121.0340}', NULL, NULL, false, NOW() - INTERVAL '8 days'),

  (gen_random_uuid(), 'Harassment', 'medium', 'verified',
   'Catcalling and verbal harassment reported along Aurora Boulevard, Cubao.',
   '{"lat": 14.6196, "lng": 121.0567}', NULL, NULL, false, NOW() - INTERVAL '7 days'),

  (gen_random_uuid(), 'Medical Emergency', 'high', 'resolved',
   'Senior citizen collapsed near Guadalupe Bridge. Emergency services responded quickly.',
   '{"lat": 14.5624, "lng": 121.0415}', NULL, 'eldercare@email.com', false, NOW() - INTERVAL '10 days'),

  (gen_random_uuid(), 'Robbery', 'critical', 'pending_verification',
   'Armed robbery occurred at a convenience store near Commonwealth Avenue, QC.',
   '{"lat": 14.6836, "lng": 121.0579}', 'reports/placeholder.jpg', 'witness@email.com', true, NOW() - INTERVAL '4 days'),

  (gen_random_uuid(), 'Assault', 'high', 'verified',
   'Physical altercation outside a bar in Tomas Morato area.',
   '{"lat": 14.6342, "lng": 121.0360}', NULL, NULL, false, NOW() - INTERVAL '6 days'),

  (gen_random_uuid(), 'Suspicious Activity', 'low', 'pending_verification',
   'Person seen frequently peeking into cars at a parking lot in Mandaluyong City.',
   '{"lat": 14.5803, "lng": 121.0355}', NULL, NULL, false, NOW() - INTERVAL '2 days'),

  (gen_random_uuid(), 'Theft', 'medium', 'resolved',
   'Phone stolen inside a busy jeepney along Quezon Avenue.',
   '{"lat": 14.6364, "lng": 121.0306}', 'reports/placeholder.jpg', NULL, false, NOW() - INTERVAL '13 days'),

  (gen_random_uuid(), 'Vandalism', 'low', 'pending_verification',
   'Public restroom in a park was damaged and spray painted overnight.',
   '{"lat": 14.6543, "lng": 121.0445}', NULL, NULL, false, NOW() - INTERVAL '3 days'),

  (gen_random_uuid(), 'Medical Emergency', 'medium', 'pending_verification',
   'Child injured while playing at a construction site in Sta. Mesa.',
   '{"lat": 14.5949, "lng": 121.0153}', 'reports/placeholder.jpg', NULL, false, NOW() - INTERVAL '11 days'),

  (gen_random_uuid(), 'Burglary', 'high', 'resolved',
   'Apartment break-in reported in Barangay South Triangle. Jewelry and electronics taken.',
   '{"lat": 14.6413, "lng": 121.0437}', NULL, '09185553321', false, NOW() - INTERVAL '6 days'),

  (gen_random_uuid(), 'Road Accident', 'low', 'pending_verification',
   'Minor accident involving a tricycle and a sedan in Makati Ave.',
   '{"lat": 14.5620, "lng": 121.0287}', NULL, NULL, false, NOW() - INTERVAL '4 days'),

  (gen_random_uuid(), 'Harassment', 'medium', 'pending_verification',
   'Unwanted advances made towards joggers at Ayala Triangle Gardens.',
   '{"lat": 14.5563, "lng": 121.0228}', NULL, NULL, false, NOW() - INTERVAL '5 days'),

  (gen_random_uuid(), 'Environmental Hazard', 'medium', 'verified',
   'Flooding reported near España Blvd during afternoon rain.',
   '{"lat": 14.6042, "lng": 120.9947}', 'reports/placeholder.jpg', NULL, false, NOW() - INTERVAL '7 days'),

  (gen_random_uuid(), 'Fire', 'high', 'resolved',
   'A kitchen fire broke out in a residential unit along Kamias Road. Firefighters responded within minutes.',
   '{"lat": 14.6360, "lng": 121.0612}', 'reports/placeholder.jpg', 'firewatch@sample.com', false, NOW() - INTERVAL '15 days'),

  (gen_random_uuid(), 'Suspicious Activity', 'low', 'pending_verification',
   'Unmarked vehicle seen circling a school area several times during dismissal.',
   '{"lat": 14.6452, "lng": 121.0513}', NULL, NULL, false, NOW() - INTERVAL '2 days'),

  (gen_random_uuid(), 'Assault', 'critical', 'verified',
   'A man was attacked with a blunt object near Ortigas Extension. Victim rushed to the hospital.',
   '{"lat": 14.5791, "lng": 121.0932}', 'reports/placeholder.jpg', '09178889900', true, NOW() - INTERVAL '4 days'),

  (gen_random_uuid(), 'Burglary', 'medium', 'pending_verification',
   'A store along E. Rodriguez was broken into overnight. Cash drawer was emptied.',
   '{"lat": 14.6154, "lng": 121.0183}', NULL, NULL, false, NOW() - INTERVAL '6 days'),

  (gen_random_uuid(), 'Theft', 'low', 'resolved',
   'A bicycle parked at the back of a church was taken during service.',
   '{"lat": 14.5765, "lng": 121.0312}', 'reports/placeholder.jpg', NULL, false, NOW() - INTERVAL '8 days'),

  (gen_random_uuid(), 'Medical Emergency', 'critical', 'verified',
   'Multiple people collapsed due to heat stroke during a marathon near Quezon Memorial Circle.',
   '{"lat": 14.6535, "lng": 121.0491}', 'reports/placeholder.jpg', 'runhealth@safe.com', false, NOW() - INTERVAL '9 days'),

  (gen_random_uuid(), 'Robbery', 'medium', 'pending_verification',
   'Delivery rider was held at knifepoint in Barangay Bagumbayan and phone was taken.',
   '{"lat": 14.5479, "lng": 121.0685}', NULL, NULL, true, NOW() - INTERVAL '10 days'),

  (gen_random_uuid(), 'Environmental Hazard', 'medium', 'pending_verification',
   'Large pothole reported along Chino Roces Avenue, causing traffic disruption.',
   '{"lat": 14.5467, "lng": 121.0154}', NULL, NULL, false, NOW() - INTERVAL '3 days'),

  (gen_random_uuid(), 'Vandalism', 'low', 'pending_verification',
   'Trash bins in a public park were overturned and spray-painted.',
   '{"lat": 14.5708, "lng": 121.0219}', 'reports/placeholder.jpg', NULL, false, NOW() - INTERVAL '11 days'),

  (gen_random_uuid(), 'Harassment', 'medium', 'resolved',
   'Commuters reported repeated harassment by a jeepney driver near Shaw Boulevard.',
   '{"lat": 14.5825, "lng": 121.0483}', NULL, 'complaint@transport.ph', false, NOW() - INTERVAL '5 days'),

  (gen_random_uuid(), 'Robbery', 'critical', 'pending_verification',
   'Two armed suspects robbed a small grocery store near Tondo Church and fled on a motorcycle.',
   '{"lat": 14.6093, "lng": 120.9674}', 'reports/placeholder.jpg', 'witness@tondo.net', true, NOW() - INTERVAL '3 days'),

  (gen_random_uuid(), 'Assault', 'high', 'verified',
   'Physical assault reported near Recto Avenue underpass. Victim had injuries to the face and ribs.',
   '{"lat": 14.6021, "lng": 120.9835}', NULL, NULL, false, NOW() - INTERVAL '6 days'),

  (gen_random_uuid(), 'Theft', 'medium', 'pending_verification',
   'Phone snatching incident near Blumentritt Station reported during peak hours.',
   '{"lat": 14.6218, "lng": 120.9879}', 'reports/placeholder.jpg', NULL, false, NOW() - INTERVAL '2 days'),

  (gen_random_uuid(), 'Suspicious Activity', 'medium', 'pending_verification',
   'Group of men frequently loitering near Libertad Market entrance at night.',
   '{"lat": 14.5443, "lng": 121.0015}', NULL, NULL, false, NOW() - INTERVAL '1 day'),

  (gen_random_uuid(), 'Burglary', 'high', 'resolved',
   'Break-in at a sari-sari store in Barangay 128, Caloocan. Cash and supplies were taken.',
   '{"lat": 14.6608, "lng": 120.9725}', 'reports/placeholder.jpg', 'owner@barangay128.com', false, NOW() - INTERVAL '7 days'),

  (gen_random_uuid(), 'Assault', 'high', 'pending_verification',
   'Street altercation escalated into a fight near Baclaran Church. One person was hospitalized.',
   '{"lat": 14.5236, "lng": 120.9963}', NULL, NULL, false, NOW() - INTERVAL '5 days'),

  (gen_random_uuid(), 'Harassment', 'medium', 'pending_verification',
   'Reports of daily verbal harassment in Quiapo Market area targeting female vendors.',
   '{"lat": 14.5985, "lng": 120.9842}', 'reports/placeholder.jpg', NULL, false, NOW() - INTERVAL '4 days'),

  (gen_random_uuid(), 'Robbery', 'critical', 'verified',
   'Armed robbery involving delivery van near C3 Road in Navotas. Two suspects arrested.',
   '{"lat": 14.6587, "lng": 120.9363}', NULL, 'security@logistics.ph', true, NOW() - INTERVAL '10 days'),

  (gen_random_uuid(), 'Theft', 'medium', 'pending_verification',
   'Pickpocketing incident near Divisoria Mall entrance. Wallet stolen during heavy foot traffic.',
   '{"lat": 14.5993, "lng": 120.9664}', NULL, NULL, false, NOW() - INTERVAL '2 days'),

  (gen_random_uuid(), 'Vandalism', 'low', 'resolved',
   'Several parked tricycles spray-painted overnight near Balintawak LRT Station.',
   '{"lat": 14.6571, "lng": 121.0067}', 'reports/placeholder.jpg', NULL, false, NOW() - INTERVAL '9 days');

-- Re-enable RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
