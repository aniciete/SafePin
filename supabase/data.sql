SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '871e4531-37ce-4db1-9259-60a48dff34f6', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"adminuser@admin.com","user_id":"3bb9628e-c98e-4a95-9ecf-73039514bb7c","user_phone":""}}', '2025-07-27 04:13:54.78816+00', ''),
	('00000000-0000-0000-0000-000000000000', '86da133e-02cb-4e9b-bc79-1d771d1feb91', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"wackwackgh.mandaluyong@authority.com","user_id":"7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1","user_phone":""}}', '2025-07-27 04:14:19.425873+00', ''),
	('00000000-0000-0000-0000-000000000000', '6fdd3ef8-09ae-4071-8e15-1a960bcb0181', '{"action":"login","actor_id":"3bb9628e-c98e-4a95-9ecf-73039514bb7c","actor_username":"adminuser@admin.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-27 04:46:36.297137+00', ''),
	('00000000-0000-0000-0000-000000000000', 'af5a7b32-369d-42aa-bb6e-ba55429704e5', '{"action":"token_refreshed","actor_id":"3bb9628e-c98e-4a95-9ecf-73039514bb7c","actor_username":"adminuser@admin.com","actor_via_sso":false,"log_type":"token"}', '2025-07-27 04:46:36.902424+00', ''),
	('00000000-0000-0000-0000-000000000000', '019b5051-10d8-4dc8-9bb2-3d97d5fbdcbd', '{"action":"token_revoked","actor_id":"3bb9628e-c98e-4a95-9ecf-73039514bb7c","actor_username":"adminuser@admin.com","actor_via_sso":false,"log_type":"token"}', '2025-07-27 04:46:36.902994+00', ''),
	('00000000-0000-0000-0000-000000000000', '23104b31-7d1c-49b0-bc39-20bd10b42bf3', '{"action":"logout","actor_id":"3bb9628e-c98e-4a95-9ecf-73039514bb7c","actor_username":"adminuser@admin.com","actor_via_sso":false,"log_type":"account"}', '2025-07-27 04:49:29.546465+00', ''),
	('00000000-0000-0000-0000-000000000000', 'acd2f155-8dc5-4b9a-8206-c6060f9157f9', '{"action":"login","actor_id":"7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1","actor_username":"wackwackgh.mandaluyong@authority.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-27 04:49:49.838035+00', ''),
	('00000000-0000-0000-0000-000000000000', '4c3085da-6b7b-4e2a-9347-4fba2e557c4d', '{"action":"token_refreshed","actor_id":"7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1","actor_username":"wackwackgh.mandaluyong@authority.com","actor_via_sso":false,"log_type":"token"}', '2025-07-27 04:49:50.382047+00', ''),
	('00000000-0000-0000-0000-000000000000', 'db137b0e-48af-4dbc-9fd3-2b53535417a8', '{"action":"token_revoked","actor_id":"7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1","actor_username":"wackwackgh.mandaluyong@authority.com","actor_via_sso":false,"log_type":"token"}', '2025-07-27 04:49:50.382616+00', ''),
	('00000000-0000-0000-0000-000000000000', '7975cfcb-7331-406d-b023-e17e53fa230d', '{"action":"logout","actor_id":"7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1","actor_username":"wackwackgh.mandaluyong@authority.com","actor_via_sso":false,"log_type":"account"}', '2025-07-27 04:52:59.357937+00', ''),
	('00000000-0000-0000-0000-000000000000', '531bdb68-e03c-4882-a333-dfb22b6a5dc9', '{"action":"login","actor_id":"3bb9628e-c98e-4a95-9ecf-73039514bb7c","actor_username":"adminuser@admin.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-27 04:53:04.754053+00', ''),
	('00000000-0000-0000-0000-000000000000', '5c307d0a-2c30-409e-99f6-c3b4c7fea2b1', '{"action":"token_refreshed","actor_id":"3bb9628e-c98e-4a95-9ecf-73039514bb7c","actor_username":"adminuser@admin.com","actor_via_sso":false,"log_type":"token"}', '2025-07-27 04:53:05.256536+00', ''),
	('00000000-0000-0000-0000-000000000000', '95ea34a2-a921-4279-9ac5-dc1ad706c171', '{"action":"token_revoked","actor_id":"3bb9628e-c98e-4a95-9ecf-73039514bb7c","actor_username":"adminuser@admin.com","actor_via_sso":false,"log_type":"token"}', '2025-07-27 04:53:05.257135+00', ''),
	('00000000-0000-0000-0000-000000000000', '6b1d4471-085f-4c3e-a0a2-bbaac23ef769', '{"action":"logout","actor_id":"3bb9628e-c98e-4a95-9ecf-73039514bb7c","actor_username":"adminuser@admin.com","actor_via_sso":false,"log_type":"account"}', '2025-07-27 04:54:06.928774+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fa9dc8e0-4eba-4c49-87b1-f2ef9d4f4d1e', '{"action":"login","actor_id":"7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1","actor_username":"wackwackgh.mandaluyong@authority.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-27 04:54:20.081995+00', ''),
	('00000000-0000-0000-0000-000000000000', '9d73bde9-b2cd-4e06-adaa-c8516844ff4e', '{"action":"token_refreshed","actor_id":"7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1","actor_username":"wackwackgh.mandaluyong@authority.com","actor_via_sso":false,"log_type":"token"}', '2025-07-27 04:54:20.54252+00', ''),
	('00000000-0000-0000-0000-000000000000', '185ad3a2-dc4f-4100-bbb5-e02ea8b2bc6d', '{"action":"token_revoked","actor_id":"7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1","actor_username":"wackwackgh.mandaluyong@authority.com","actor_via_sso":false,"log_type":"token"}', '2025-07-27 04:54:20.543894+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dd8b7b1b-6163-460d-bbd6-4d45cca49c79', '{"action":"login","actor_id":"7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1","actor_username":"wackwackgh.mandaluyong@authority.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-27 05:11:06.41164+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f5f053ac-ffe8-48cf-a322-21a5851c3a90', '{"action":"token_refreshed","actor_id":"7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1","actor_username":"wackwackgh.mandaluyong@authority.com","actor_via_sso":false,"log_type":"token"}', '2025-07-27 05:11:07.069328+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b699fcc4-fe43-4e68-83fd-69cb50b1bafc', '{"action":"token_revoked","actor_id":"7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1","actor_username":"wackwackgh.mandaluyong@authority.com","actor_via_sso":false,"log_type":"token"}', '2025-07-27 05:11:07.069886+00', ''),
	('00000000-0000-0000-0000-000000000000', '8c0abfd8-2000-405f-8e87-a2df37711cff', '{"action":"logout","actor_id":"7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1","actor_username":"wackwackgh.mandaluyong@authority.com","actor_via_sso":false,"log_type":"account"}', '2025-07-27 05:15:48.788754+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dc530cad-42e5-42bf-a8d5-1e0e0a8fb594', '{"action":"login","actor_id":"3bb9628e-c98e-4a95-9ecf-73039514bb7c","actor_username":"adminuser@admin.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-27 05:15:53.93198+00', ''),
	('00000000-0000-0000-0000-000000000000', '32251c8a-2ca5-4c0b-b9f1-208cbe313944', '{"action":"token_refreshed","actor_id":"3bb9628e-c98e-4a95-9ecf-73039514bb7c","actor_username":"adminuser@admin.com","actor_via_sso":false,"log_type":"token"}', '2025-07-27 05:15:54.481979+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b1d1bc24-1f1c-493a-89fc-a7d9d700032c', '{"action":"token_revoked","actor_id":"3bb9628e-c98e-4a95-9ecf-73039514bb7c","actor_username":"adminuser@admin.com","actor_via_sso":false,"log_type":"token"}', '2025-07-27 05:15:54.48255+00', ''),
	('00000000-0000-0000-0000-000000000000', '1ff4757e-76a9-460b-aa76-16453681ea28', '{"action":"logout","actor_id":"3bb9628e-c98e-4a95-9ecf-73039514bb7c","actor_username":"adminuser@admin.com","actor_via_sso":false,"log_type":"account"}', '2025-07-27 05:16:35.422469+00', ''),
	('00000000-0000-0000-0000-000000000000', '299b6cca-fffc-403b-bca3-e2656c82cefc', '{"action":"login","actor_id":"7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1","actor_username":"wackwackgh.mandaluyong@authority.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-27 05:16:41.78377+00', ''),
	('00000000-0000-0000-0000-000000000000', '359fa990-0982-4064-9b75-fd3eeb82eff0', '{"action":"token_refreshed","actor_id":"7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1","actor_username":"wackwackgh.mandaluyong@authority.com","actor_via_sso":false,"log_type":"token"}', '2025-07-27 05:16:42.047363+00', ''),
	('00000000-0000-0000-0000-000000000000', '75514c34-a2bd-4541-9499-ed3b19e96865', '{"action":"token_revoked","actor_id":"7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1","actor_username":"wackwackgh.mandaluyong@authority.com","actor_via_sso":false,"log_type":"token"}', '2025-07-27 05:16:42.049105+00', ''),
	('00000000-0000-0000-0000-000000000000', '0ca2120a-7d26-4f63-bb28-92b5e07f4034', '{"action":"logout","actor_id":"7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1","actor_username":"wackwackgh.mandaluyong@authority.com","actor_via_sso":false,"log_type":"account"}', '2025-07-27 05:19:24.64908+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fa66d88d-4653-4d87-82e9-a74beb93a21b', '{"action":"login","actor_id":"3bb9628e-c98e-4a95-9ecf-73039514bb7c","actor_username":"adminuser@admin.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-27 05:19:29.551584+00', ''),
	('00000000-0000-0000-0000-000000000000', 'deb1b625-47f1-463f-8f68-3330cca98d13', '{"action":"token_refreshed","actor_id":"3bb9628e-c98e-4a95-9ecf-73039514bb7c","actor_username":"adminuser@admin.com","actor_via_sso":false,"log_type":"token"}', '2025-07-27 05:19:29.994079+00', ''),
	('00000000-0000-0000-0000-000000000000', '8fc14632-874b-405e-be92-f0c87a2ba6f3', '{"action":"token_revoked","actor_id":"3bb9628e-c98e-4a95-9ecf-73039514bb7c","actor_username":"adminuser@admin.com","actor_via_sso":false,"log_type":"token"}', '2025-07-27 05:19:29.995076+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a3a35b66-19d5-4461-9271-e49cac17c251', '{"action":"logout","actor_id":"3bb9628e-c98e-4a95-9ecf-73039514bb7c","actor_username":"adminuser@admin.com","actor_via_sso":false,"log_type":"account"}', '2025-07-27 05:23:20.19336+00', ''),
	('00000000-0000-0000-0000-000000000000', '1127d184-40bf-46cb-b215-2955c1587f8f', '{"action":"login","actor_id":"7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1","actor_username":"wackwackgh.mandaluyong@authority.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-27 06:32:46.978152+00', ''),
	('00000000-0000-0000-0000-000000000000', '49f7310f-19cf-4699-9000-4bc034cc593c', '{"action":"token_refreshed","actor_id":"7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1","actor_username":"wackwackgh.mandaluyong@authority.com","actor_via_sso":false,"log_type":"token"}', '2025-07-27 06:32:47.604959+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ffa65374-b675-45d8-811c-4f87049511b5', '{"action":"token_revoked","actor_id":"7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1","actor_username":"wackwackgh.mandaluyong@authority.com","actor_via_sso":false,"log_type":"token"}', '2025-07-27 06:32:47.605664+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fc808aa5-32d7-4b35-9dc7-9dfe02f80cfa', '{"action":"user_updated_password","actor_id":"7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1","actor_username":"wackwackgh.mandaluyong@authority.com","actor_via_sso":false,"log_type":"user"}', '2025-07-27 06:36:25.50222+00', ''),
	('00000000-0000-0000-0000-000000000000', '26d68ff4-8b98-4fdf-a6b6-55c0596ceacd', '{"action":"user_modified","actor_id":"7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1","actor_username":"wackwackgh.mandaluyong@authority.com","actor_via_sso":false,"log_type":"user"}', '2025-07-27 06:36:25.503155+00', ''),
	('00000000-0000-0000-0000-000000000000', '665763cd-0656-461a-a789-43232766029f', '{"action":"logout","actor_id":"7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1","actor_username":"wackwackgh.mandaluyong@authority.com","actor_via_sso":false,"log_type":"account"}', '2025-07-27 06:36:28.859978+00', ''),
	('00000000-0000-0000-0000-000000000000', '2cb8e026-709e-4ed6-bde0-d4cbc64d3143', '{"action":"login","actor_id":"7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1","actor_username":"wackwackgh.mandaluyong@authority.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-27 06:36:53.646759+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd2f04e25-0e98-49b9-9898-863c454c46c1', '{"action":"token_refreshed","actor_id":"7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1","actor_username":"wackwackgh.mandaluyong@authority.com","actor_via_sso":false,"log_type":"token"}', '2025-07-27 06:36:54.115047+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd68c4aa7-8a57-42e7-8f6e-bd6f7ed9c845', '{"action":"token_revoked","actor_id":"7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1","actor_username":"wackwackgh.mandaluyong@authority.com","actor_via_sso":false,"log_type":"token"}', '2025-07-27 06:36:54.117464+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '3bb9628e-c98e-4a95-9ecf-73039514bb7c', 'authenticated', 'authenticated', 'adminuser@admin.com', '$2a$10$qvlSKffdksM9s/29y8zR4uVqChW8VsbBlGxyUsUVFfntV7Gk8kg5.', '2025-07-27 04:13:54.798533+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-07-27 05:19:29.552826+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-07-27 04:13:54.757322+00', '2025-07-27 05:19:30.000359+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1', 'authenticated', 'authenticated', 'wackwackgh.mandaluyong@authority.com', '$2a$10$Wb/93J0gLZpZ8RcUKS6oD.jdglUOfgG79GfCLmm2BSNZHKXVHCSV2', '2025-07-27 04:14:19.427508+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-07-27 06:36:53.647407+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-07-27 04:14:19.420813+00', '2025-07-27 06:36:54.121201+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('3bb9628e-c98e-4a95-9ecf-73039514bb7c', '3bb9628e-c98e-4a95-9ecf-73039514bb7c', '{"sub": "3bb9628e-c98e-4a95-9ecf-73039514bb7c", "email": "adminuser@admin.com", "email_verified": false, "phone_verified": false}', 'email', '2025-07-27 04:13:54.78471+00', '2025-07-27 04:13:54.7859+00', '2025-07-27 04:13:54.7859+00', 'c160d011-a17e-4d18-8814-075a1d90b43e'),
	('7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1', '7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1', '{"sub": "7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1", "email": "wackwackgh.mandaluyong@authority.com", "email_verified": false, "phone_verified": false}', 'email', '2025-07-27 04:14:19.424988+00', '2025-07-27 04:14:19.425057+00', '2025-07-27 04:14:19.425057+00', 'd33e9c2f-d4a3-4be2-adc6-d96877177c98');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('d520de7e-7a22-450e-b990-a17d292c981a', '7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1', '2025-07-27 06:36:53.64748+00', '2025-07-27 06:36:54.122829+00', NULL, 'aal1', NULL, '2025-07-27 06:36:54.122766', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '104.28.194.103', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('d520de7e-7a22-450e-b990-a17d292c981a', '2025-07-27 06:36:53.651349+00', '2025-07-27 06:36:53.651349+00', 'password', '6644d053-aba2-4767-8ead-6c5f69d6925e');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 19, 'atpceokwpcvf', '7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1', true, '2025-07-27 06:36:53.648348+00', '2025-07-27 06:36:54.119148+00', NULL, 'd520de7e-7a22-450e-b990-a17d292c981a'),
	('00000000-0000-0000-0000-000000000000', 20, '2iyiyln5hfsf', '7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1', false, '2025-07-27 06:36:54.120323+00', '2025-07-27 06:36:54.120323+00', 'atpceokwpcvf', 'd520de7e-7a22-450e-b990-a17d292c981a');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("id", "email", "role", "jurisdiction", "created_at", "onboarding_completed") VALUES
	('3bb9628e-c98e-4a95-9ecf-73039514bb7c', 'adminuser@admin.com', 'admin', NULL, '2025-07-27 04:13:54.754329+00', false),
	('7d2d1182-3c3f-469d-9e6d-cd4fe9b7f1e1', 'wackwackgh.mandaluyong@authority.com', 'authority', '1380500027', '2025-07-27 04:14:19.420472+00', false);


--
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."reports" ("id", "user_id", "anonymous_user_id", "location", "incident_type", "severity", "description", "image_path", "status", "created_at", "updated_at", "verified_by", "verified_at", "tracking_code", "jurisdiction", "is_flagged", "contact_info", "notes", "incident_type_other") VALUES
	('375b149a-9201-403c-a5d0-c36f14d6f7c3', NULL, NULL, '{"lat": 14.5829, "lng": 121.0540}', 'Theft', 'Medium', 'Bicycle stolen near Wack-Wack Golf Club entrance.', NULL, 'pending_verification', '2025-07-27 05:11:32.417307+00', NULL, NULL, NULL, NULL, '1380500027', false, NULL, NULL, NULL),
	('85f93528-4b31-4957-8791-40b0e0aa7323', NULL, NULL, '{"lat": 14.5845, "lng": 121.0533}', 'Vandalism', 'Low', 'Graffiti on the park bench near the main road.', NULL, 'verified', '2025-07-27 05:11:32.417307+00', NULL, NULL, NULL, NULL, '1380500027', false, NULL, NULL, NULL),
	('8ad19afe-4411-4b69-95d7-db562d5d168f', NULL, NULL, '{"lat": 14.5811, "lng": 121.0555}', 'Suspicious Activity', 'Medium', 'An individual was seen looking into parked cars in the residential area.', NULL, 'resolved', '2025-07-27 05:11:32.417307+00', NULL, NULL, NULL, NULL, '1380500027', false, NULL, NULL, NULL);


--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('reports', 'reports', NULL, '2025-07-27 04:36:51.041934+00', '2025-07-27 04:36:51.041934+00', false, false, NULL, NULL, NULL);


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 20, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;
