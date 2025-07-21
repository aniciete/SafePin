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
	('00000000-0000-0000-0000-000000000000', 'd701a175-ea1d-47bf-a35b-fdff34e36f00', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"test@example.com","user_id":"aa7b62cc-af6c-47fa-b751-9f28e7a2e85c","user_phone":""}}', '2025-07-19 03:56:23.242368+00', ''),
	('00000000-0000-0000-0000-000000000000', '95bcdc52-037c-44cd-b267-b25353551b21', '{"action":"login","actor_id":"aa7b62cc-af6c-47fa-b751-9f28e7a2e85c","actor_username":"test@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-19 03:57:02.196005+00', ''),
	('00000000-0000-0000-0000-000000000000', '4831a9bb-667b-4ed9-8e18-7653c8ec6f7f', '{"action":"login","actor_id":"aa7b62cc-af6c-47fa-b751-9f28e7a2e85c","actor_username":"test@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-19 03:57:56.564249+00', ''),
	('00000000-0000-0000-0000-000000000000', '96af989f-45dd-4ba1-9ae5-219a7f2645d7', '{"action":"login","actor_id":"aa7b62cc-af6c-47fa-b751-9f28e7a2e85c","actor_username":"test@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-19 03:59:12.010139+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e589970c-f132-4949-9231-321c067d1cf2', '{"action":"login","actor_id":"aa7b62cc-af6c-47fa-b751-9f28e7a2e85c","actor_username":"test@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-19 04:19:07.802465+00', ''),
	('00000000-0000-0000-0000-000000000000', '098a0b16-2e73-41ec-a70c-7d6cb81d97af', '{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"test@example.com","user_id":"aa7b62cc-af6c-47fa-b751-9f28e7a2e85c","user_phone":""}}', '2025-07-19 04:28:55.934034+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fdd30e85-f51c-45e2-a1b8-43dabc75cd79', '{"action":"login","actor_id":"aa7b62cc-af6c-47fa-b751-9f28e7a2e85c","actor_username":"test@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-19 04:30:00.012944+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a692a9db-3de6-4c73-ad71-e8be9d383c08', '{"action":"logout","actor_id":"aa7b62cc-af6c-47fa-b751-9f28e7a2e85c","actor_username":"test@example.com","actor_via_sso":false,"log_type":"account"}', '2025-07-19 04:31:12.259841+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bf0aab14-f16a-41ad-a9bc-5f7e711ff7e9', '{"action":"login","actor_id":"aa7b62cc-af6c-47fa-b751-9f28e7a2e85c","actor_username":"test@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-19 04:32:01.466002+00', ''),
	('00000000-0000-0000-0000-000000000000', '0acf7311-13fa-4c1a-86f8-e6f9a678c2cf', '{"action":"user_signedup","actor_id":"51080ec7-8a8b-465d-b80b-815dae60047a","actor_username":"testuser@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-07-19 05:15:59.813627+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c1205bb7-261f-44a6-89c0-7a2808ba0a96', '{"action":"login","actor_id":"51080ec7-8a8b-465d-b80b-815dae60047a","actor_username":"testuser@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-19 05:15:59.820897+00', ''),
	('00000000-0000-0000-0000-000000000000', '00b04fd0-8210-4b39-a023-fcc073309646', '{"action":"user_repeated_signup","actor_id":"51080ec7-8a8b-465d-b80b-815dae60047a","actor_username":"testuser@example.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-07-19 05:17:03.96645+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c2d5bf7c-f823-49b6-b8f2-5873e6af7d64', '{"action":"login","actor_id":"51080ec7-8a8b-465d-b80b-815dae60047a","actor_username":"testuser@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-19 05:20:42.670409+00', ''),
	('00000000-0000-0000-0000-000000000000', '0f360788-5d3b-4a1d-afcd-c4d1a6301fad', '{"action":"login","actor_id":"51080ec7-8a8b-465d-b80b-815dae60047a","actor_username":"testuser@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-19 05:25:25.190866+00', ''),
	('00000000-0000-0000-0000-000000000000', '7c0dd5c4-2bbb-4d92-a176-c20c57da6c54', '{"action":"login","actor_id":"51080ec7-8a8b-465d-b80b-815dae60047a","actor_username":"testuser@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-19 05:35:25.704989+00', ''),
	('00000000-0000-0000-0000-000000000000', '84cffdc4-b8e6-47a4-a63a-6630a4ddc7af', '{"action":"login","actor_id":"51080ec7-8a8b-465d-b80b-815dae60047a","actor_username":"testuser@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-19 05:37:10.457424+00', ''),
	('00000000-0000-0000-0000-000000000000', '8a031f5e-731f-4923-8675-3bd8bccc74fb', '{"action":"login","actor_id":"51080ec7-8a8b-465d-b80b-815dae60047a","actor_username":"testuser@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-19 05:51:41.191209+00', ''),
	('00000000-0000-0000-0000-000000000000', '2f3ff81c-6362-46de-9c0e-044647e341d3', '{"action":"login","actor_id":"aa7b62cc-af6c-47fa-b751-9f28e7a2e85c","actor_username":"test@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-19 05:54:15.761805+00', ''),
	('00000000-0000-0000-0000-000000000000', '585d542c-e805-4fa0-8234-bfacb8b976fd', '{"action":"login","actor_id":"aa7b62cc-af6c-47fa-b751-9f28e7a2e85c","actor_username":"test@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-19 05:58:57.467708+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd61db5f8-3de4-4750-a756-2cb6c1e81ef4', '{"action":"login","actor_id":"aa7b62cc-af6c-47fa-b751-9f28e7a2e85c","actor_username":"test@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-19 06:01:48.558429+00', ''),
	('00000000-0000-0000-0000-000000000000', '3c064eb4-72fe-4bcd-a370-7cc4a8e920cc', '{"action":"login","actor_id":"51080ec7-8a8b-465d-b80b-815dae60047a","actor_username":"testuser@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-19 06:04:22.733051+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f5a6fcb3-d7be-493c-8168-d5e82096dfcb', '{"action":"token_refreshed","actor_id":"51080ec7-8a8b-465d-b80b-815dae60047a","actor_username":"testuser@example.com","actor_via_sso":false,"log_type":"token"}', '2025-07-19 07:02:33.535998+00', ''),
	('00000000-0000-0000-0000-000000000000', '7763d27c-187b-4cd6-9a10-2ce4d4393660', '{"action":"token_revoked","actor_id":"51080ec7-8a8b-465d-b80b-815dae60047a","actor_username":"testuser@example.com","actor_via_sso":false,"log_type":"token"}', '2025-07-19 07:02:33.538054+00', ''),
	('00000000-0000-0000-0000-000000000000', 'da5cd7ea-fc63-4243-8160-7e181c807506', '{"action":"user_signedup","actor_id":"8db7e64e-5137-4e9e-823e-3e68faf47efb","actor_username":"reconductation32@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-07-20 06:51:46.648533+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b43b17b0-a1b2-408d-acef-bb23c308c445', '{"action":"login","actor_id":"8db7e64e-5137-4e9e-823e-3e68faf47efb","actor_username":"reconductation32@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 06:51:46.658783+00', ''),
	('00000000-0000-0000-0000-000000000000', '17a69204-67a1-4bd1-bff6-60651aceaa7e', '{"action":"login","actor_id":"8db7e64e-5137-4e9e-823e-3e68faf47efb","actor_username":"reconductation32@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 06:51:52.872822+00', ''),
	('00000000-0000-0000-0000-000000000000', '1b5d4365-7432-4bc6-9149-18faf0788665', '{"action":"login","actor_id":"8db7e64e-5137-4e9e-823e-3e68faf47efb","actor_username":"reconductation32@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 06:54:00.473114+00', ''),
	('00000000-0000-0000-0000-000000000000', '207e2718-5f31-4155-9296-fc1a83f45e65', '{"action":"login","actor_id":"8db7e64e-5137-4e9e-823e-3e68faf47efb","actor_username":"reconductation32@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 06:56:10.104408+00', ''),
	('00000000-0000-0000-0000-000000000000', '86cec64c-7b4f-4ab8-8c36-3fef33d01cb1', '{"action":"user_repeated_signup","actor_id":"8db7e64e-5137-4e9e-823e-3e68faf47efb","actor_username":"reconductation32@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-07-20 07:08:44.151691+00', ''),
	('00000000-0000-0000-0000-000000000000', 'de0aaf43-236d-4988-92a4-8314669ffe79', '{"action":"login","actor_id":"8db7e64e-5137-4e9e-823e-3e68faf47efb","actor_username":"reconductation32@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 07:09:13.845557+00', ''),
	('00000000-0000-0000-0000-000000000000', '77dbb2f7-f087-4122-8391-8f29b9650968', '{"action":"login","actor_id":"8db7e64e-5137-4e9e-823e-3e68faf47efb","actor_username":"reconductation32@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 07:17:47.916594+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c7f440c8-6329-4a5d-b765-94b1b8d0d0db', '{"action":"login","actor_id":"51080ec7-8a8b-465d-b80b-815dae60047a","actor_username":"testuser@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 07:21:55.059474+00', ''),
	('00000000-0000-0000-0000-000000000000', '94043884-7fae-4cee-aafb-3f326606969e', '{"action":"logout","actor_id":"51080ec7-8a8b-465d-b80b-815dae60047a","actor_username":"testuser@example.com","actor_via_sso":false,"log_type":"account"}', '2025-07-20 07:26:21.076502+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b54fc387-8d7d-4c90-ae7c-8e16a889a3ac', '{"action":"login","actor_id":"51080ec7-8a8b-465d-b80b-815dae60047a","actor_username":"testuser@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 07:26:26.203503+00', ''),
	('00000000-0000-0000-0000-000000000000', '015586b3-9274-443c-b741-330abe620166', '{"action":"logout","actor_id":"51080ec7-8a8b-465d-b80b-815dae60047a","actor_username":"testuser@example.com","actor_via_sso":false,"log_type":"account"}', '2025-07-20 07:36:45.579802+00', ''),
	('00000000-0000-0000-0000-000000000000', '0dcf02fd-3430-4a54-9c86-10d30cf0e65c', '{"action":"login","actor_id":"51080ec7-8a8b-465d-b80b-815dae60047a","actor_username":"testuser@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 07:36:50.584293+00', ''),
	('00000000-0000-0000-0000-000000000000', 'efa61022-a1f1-4616-9149-b2aef5c624da', '{"action":"logout","actor_id":"51080ec7-8a8b-465d-b80b-815dae60047a","actor_username":"testuser@example.com","actor_via_sso":false,"log_type":"account"}', '2025-07-20 07:36:55.44763+00', ''),
	('00000000-0000-0000-0000-000000000000', '59d18a19-fa47-4e8d-a3c3-2a3e1e554c74', '{"action":"user_signedup","actor_id":"ccb28669-e3fd-4ad4-adae-c5ae3cd55359","actor_username":"authorityuser@email.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-07-20 07:37:39.336238+00', ''),
	('00000000-0000-0000-0000-000000000000', '693223ac-9916-4533-95e9-3b3db06f41c0', '{"action":"login","actor_id":"ccb28669-e3fd-4ad4-adae-c5ae3cd55359","actor_username":"authorityuser@email.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 07:37:39.341564+00', ''),
	('00000000-0000-0000-0000-000000000000', '9192b392-5e99-4642-b4c8-b05ab1debb8b', '{"action":"login","actor_id":"ccb28669-e3fd-4ad4-adae-c5ae3cd55359","actor_username":"authorityuser@email.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 07:37:49.351845+00', ''),
	('00000000-0000-0000-0000-000000000000', '1ac550e9-abfa-4ba6-9a06-9a8b32324796', '{"action":"logout","actor_id":"ccb28669-e3fd-4ad4-adae-c5ae3cd55359","actor_username":"authorityuser@email.com","actor_via_sso":false,"log_type":"account"}', '2025-07-20 07:39:31.623915+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bc16070f-3171-4511-b4a9-54a4b91678cb', '{"action":"login","actor_id":"ccb28669-e3fd-4ad4-adae-c5ae3cd55359","actor_username":"authorityuser@email.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 07:39:36.395066+00', ''),
	('00000000-0000-0000-0000-000000000000', '2cff97e3-f9bd-4e49-a3b2-04ea0e1d1edb', '{"action":"logout","actor_id":"ccb28669-e3fd-4ad4-adae-c5ae3cd55359","actor_username":"authorityuser@email.com","actor_via_sso":false,"log_type":"account"}', '2025-07-20 07:39:40.002765+00', ''),
	('00000000-0000-0000-0000-000000000000', '531ef2a1-e265-4030-8482-8b41e455ee0c', '{"action":"user_signedup","actor_id":"ab92a9c9-dc28-4ad1-8150-8126c987b6aa","actor_username":"authorityuser123@email.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-07-20 07:39:49.302985+00', ''),
	('00000000-0000-0000-0000-000000000000', '1840dfb5-e699-478d-b61f-e072e6e87e7c', '{"action":"login","actor_id":"ab92a9c9-dc28-4ad1-8150-8126c987b6aa","actor_username":"authorityuser123@email.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 07:39:49.309018+00', ''),
	('00000000-0000-0000-0000-000000000000', '91e0728c-9ac3-4938-85a2-5e567bbda949', '{"action":"login","actor_id":"ab92a9c9-dc28-4ad1-8150-8126c987b6aa","actor_username":"authorityuser123@email.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 07:39:57.156432+00', ''),
	('00000000-0000-0000-0000-000000000000', '87871559-67b9-4504-b3e6-14465fe54f72', '{"action":"login","actor_id":"ccb28669-e3fd-4ad4-adae-c5ae3cd55359","actor_username":"authorityuser@email.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 07:55:32.07731+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a1eaff52-91df-48c6-924b-67f0f1682552', '{"action":"user_repeated_signup","actor_id":"ccb28669-e3fd-4ad4-adae-c5ae3cd55359","actor_username":"authorityuser@email.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-07-20 08:00:53.568847+00', ''),
	('00000000-0000-0000-0000-000000000000', '678e018d-3674-4d63-9ea0-c2a8b0609aeb', '{"action":"user_signedup","actor_id":"e4cd1198-f8af-4244-8b55-8b610e33d3b3","actor_username":"authorityusertalaga@email.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-07-20 08:01:00.512499+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e246fab6-a345-4f5c-bd0c-e771680dfb4a', '{"action":"login","actor_id":"e4cd1198-f8af-4244-8b55-8b610e33d3b3","actor_username":"authorityusertalaga@email.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 08:01:00.516275+00', ''),
	('00000000-0000-0000-0000-000000000000', '9f9e2f92-903e-420c-952c-d95957c8f190', '{"action":"user_repeated_signup","actor_id":"e4cd1198-f8af-4244-8b55-8b610e33d3b3","actor_username":"authorityusertalaga@email.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-07-20 08:01:04.496925+00', ''),
	('00000000-0000-0000-0000-000000000000', '684fed76-9932-4590-9ad8-8625ebe1178b', '{"action":"login","actor_id":"e4cd1198-f8af-4244-8b55-8b610e33d3b3","actor_username":"authorityusertalaga@email.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 08:01:11.468399+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c00733de-71fb-48e3-b43b-38b63c4c788b', '{"action":"login","actor_id":"e4cd1198-f8af-4244-8b55-8b610e33d3b3","actor_username":"authorityusertalaga@email.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 08:01:14.594658+00', ''),
	('00000000-0000-0000-0000-000000000000', '52b3a2f4-0ec1-4a53-bf38-cccf30b2fd90', '{"action":"login","actor_id":"e4cd1198-f8af-4244-8b55-8b610e33d3b3","actor_username":"authorityusertalaga@email.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 08:01:15.085541+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c9c98c4c-d580-446f-b650-8332e7bb0e3b', '{"action":"login","actor_id":"e4cd1198-f8af-4244-8b55-8b610e33d3b3","actor_username":"authorityusertalaga@email.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 08:01:15.203389+00', ''),
	('00000000-0000-0000-0000-000000000000', '3733cd0d-fc11-4b2b-abe4-39ad0af790e5', '{"action":"login","actor_id":"e4cd1198-f8af-4244-8b55-8b610e33d3b3","actor_username":"authorityusertalaga@email.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 08:01:15.403514+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e56efed5-2dc1-48c6-b481-5906cbacca4f', '{"action":"login","actor_id":"e4cd1198-f8af-4244-8b55-8b610e33d3b3","actor_username":"authorityusertalaga@email.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 08:01:15.592191+00', ''),
	('00000000-0000-0000-0000-000000000000', '27cd2a27-5a41-499d-b1dc-56d9f86e3846', '{"action":"login","actor_id":"e4cd1198-f8af-4244-8b55-8b610e33d3b3","actor_username":"authorityusertalaga@email.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 08:01:15.705354+00', ''),
	('00000000-0000-0000-0000-000000000000', '7e511c70-e3fb-4bfe-907a-9c26fd721881', '{"action":"login","actor_id":"e4cd1198-f8af-4244-8b55-8b610e33d3b3","actor_username":"authorityusertalaga@email.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 08:01:15.778352+00', ''),
	('00000000-0000-0000-0000-000000000000', '4b80f2e7-a9cb-41f1-bca8-429336cf96ba', '{"action":"login","actor_id":"e4cd1198-f8af-4244-8b55-8b610e33d3b3","actor_username":"authorityusertalaga@email.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 08:01:18.336744+00', ''),
	('00000000-0000-0000-0000-000000000000', '3a6ae737-0829-4073-86d8-229d99552604', '{"action":"login","actor_id":"e4cd1198-f8af-4244-8b55-8b610e33d3b3","actor_username":"authorityusertalaga@email.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 08:01:18.785902+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bd6bae82-fbaf-45ac-b2ec-3be066990176', '{"action":"login","actor_id":"e4cd1198-f8af-4244-8b55-8b610e33d3b3","actor_username":"authorityusertalaga@email.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 08:01:18.942646+00', ''),
	('00000000-0000-0000-0000-000000000000', '08838324-a33b-43c6-8676-2c424ea2efa4', '{"action":"login","actor_id":"e4cd1198-f8af-4244-8b55-8b610e33d3b3","actor_username":"authorityusertalaga@email.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 08:01:19.116339+00', ''),
	('00000000-0000-0000-0000-000000000000', '16a729e2-ca02-4928-a1de-34436e1be619', '{"action":"login","actor_id":"e4cd1198-f8af-4244-8b55-8b610e33d3b3","actor_username":"authorityusertalaga@email.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 08:01:19.587086+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dbf41f4b-cbe7-4a4f-a632-fd992af2691c', '{"action":"login","actor_id":"e4cd1198-f8af-4244-8b55-8b610e33d3b3","actor_username":"authorityusertalaga@email.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 08:01:19.682928+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b5f3078e-a124-4862-a5ea-c54c73f9a20a', '{"action":"login","actor_id":"e4cd1198-f8af-4244-8b55-8b610e33d3b3","actor_username":"authorityusertalaga@email.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 08:01:21.327563+00', ''),
	('00000000-0000-0000-0000-000000000000', '9e878712-3cf1-4b70-a249-75d0feaa1851', '{"action":"login","actor_id":"e4cd1198-f8af-4244-8b55-8b610e33d3b3","actor_username":"authorityusertalaga@email.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 08:01:21.651178+00', ''),
	('00000000-0000-0000-0000-000000000000', '8670559a-d0db-4525-abcc-a65ac7d909a0', '{"action":"login","actor_id":"e4cd1198-f8af-4244-8b55-8b610e33d3b3","actor_username":"authorityusertalaga@email.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 08:01:21.724825+00', ''),
	('00000000-0000-0000-0000-000000000000', '407cc5c8-0bed-44b2-bad9-cf0189377fda', '{"action":"token_refreshed","actor_id":"e4cd1198-f8af-4244-8b55-8b610e33d3b3","actor_username":"authorityusertalaga@email.com","actor_via_sso":false,"log_type":"token"}', '2025-07-20 09:43:42.760583+00', ''),
	('00000000-0000-0000-0000-000000000000', '3517ade9-2278-4913-9cfb-e8875510f18e', '{"action":"token_revoked","actor_id":"e4cd1198-f8af-4244-8b55-8b610e33d3b3","actor_username":"authorityusertalaga@email.com","actor_via_sso":false,"log_type":"token"}', '2025-07-20 09:43:42.763995+00', ''),
	('00000000-0000-0000-0000-000000000000', '57e20956-41e1-4bfe-8999-e2ce0744e89d', '{"action":"token_refreshed","actor_id":"e4cd1198-f8af-4244-8b55-8b610e33d3b3","actor_username":"authorityusertalaga@email.com","actor_via_sso":false,"log_type":"token"}', '2025-07-20 09:43:42.993966+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f6a2d392-8d21-4596-8d6f-490a81a55430', '{"action":"token_refreshed","actor_id":"8db7e64e-5137-4e9e-823e-3e68faf47efb","actor_username":"reconductation32@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-07-20 12:13:31.38101+00', ''),
	('00000000-0000-0000-0000-000000000000', '0d1ccd1a-8d6b-4986-86e8-c14ed5322635', '{"action":"token_revoked","actor_id":"8db7e64e-5137-4e9e-823e-3e68faf47efb","actor_username":"reconductation32@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-07-20 12:13:31.383372+00', ''),
	('00000000-0000-0000-0000-000000000000', '57cf21b3-bbfd-440d-a1b9-14e2fb3cb606', '{"action":"token_refreshed","actor_id":"e4cd1198-f8af-4244-8b55-8b610e33d3b3","actor_username":"authorityusertalaga@email.com","actor_via_sso":false,"log_type":"token"}', '2025-07-20 12:53:06.025943+00', ''),
	('00000000-0000-0000-0000-000000000000', '453c665a-a2a7-49d7-87e0-d115d032f543', '{"action":"token_revoked","actor_id":"e4cd1198-f8af-4244-8b55-8b610e33d3b3","actor_username":"authorityusertalaga@email.com","actor_via_sso":false,"log_type":"token"}', '2025-07-20 12:53:06.027953+00', ''),
	('00000000-0000-0000-0000-000000000000', '31ff6c23-092d-461d-8fa1-0dbc5d6138fb', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"adminuser@admin.com","user_id":"16c37316-2dea-4501-8b1c-d0d5c538bce9","user_phone":""}}', '2025-07-20 14:04:09.646044+00', ''),
	('00000000-0000-0000-0000-000000000000', '80c3562e-d570-4e1a-b764-79a963bfc068', '{"action":"logout","actor_id":"16c37316-2dea-4501-8b1c-d0d5c538bce9","actor_username":"adminuser@admin.com","actor_via_sso":false,"log_type":"account"}', '2025-07-20 16:20:18.732444+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f37b2c69-b90a-4606-b32e-46c961d6053a', '{"action":"user_signedup","actor_id":"8852e0b5-9360-40b8-8d44-3165f9ba0d74","actor_username":"adminusersafepin@admin.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-07-20 14:10:56.336085+00', ''),
	('00000000-0000-0000-0000-000000000000', '8802d7f8-05f3-42d6-a84e-a44669a09a1b', '{"action":"login","actor_id":"8852e0b5-9360-40b8-8d44-3165f9ba0d74","actor_username":"adminusersafepin@admin.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 14:10:56.341375+00', ''),
	('00000000-0000-0000-0000-000000000000', '9f2b2d86-5eeb-4da4-913d-10d5770aa4fe', '{"action":"login","actor_id":"ccb28669-e3fd-4ad4-adae-c5ae3cd55359","actor_username":"authorityuser@email.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 14:11:32.614127+00', ''),
	('00000000-0000-0000-0000-000000000000', 'df94913f-f701-4c59-b062-4026742c4e9e', '{"action":"login","actor_id":"8852e0b5-9360-40b8-8d44-3165f9ba0d74","actor_username":"adminusersafepin@admin.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 14:12:40.192432+00', ''),
	('00000000-0000-0000-0000-000000000000', '7134f2cc-b05f-4ffb-aab0-db26e9608650', '{"action":"login","actor_id":"8852e0b5-9360-40b8-8d44-3165f9ba0d74","actor_username":"adminusersafepin@admin.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 14:14:00.741145+00', ''),
	('00000000-0000-0000-0000-000000000000', '47cdb05a-65c0-4b6c-97c9-06e7f9f9f59a', '{"action":"token_refreshed","actor_id":"8db7e64e-5137-4e9e-823e-3e68faf47efb","actor_username":"reconductation32@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-07-20 14:30:03.078401+00', ''),
	('00000000-0000-0000-0000-000000000000', '1cd587d0-b98c-4791-a70b-d0d27482ac60', '{"action":"token_revoked","actor_id":"8db7e64e-5137-4e9e-823e-3e68faf47efb","actor_username":"reconductation32@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-07-20 14:30:03.080504+00', ''),
	('00000000-0000-0000-0000-000000000000', '40dcdb2f-03e7-4dae-a288-8794574297bb', '{"action":"logout","actor_id":"8db7e64e-5137-4e9e-823e-3e68faf47efb","actor_username":"reconductation32@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-07-20 14:30:07.147775+00', ''),
	('00000000-0000-0000-0000-000000000000', '628d18ce-7350-4fdf-8f06-2de72fdaa3b8', '{"action":"login","actor_id":"8852e0b5-9360-40b8-8d44-3165f9ba0d74","actor_username":"adminusersafepin@admin.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 14:30:32.746738+00', ''),
	('00000000-0000-0000-0000-000000000000', '2e1c1863-27ff-4b91-a541-9b50883ccfdb', '{"action":"logout","actor_id":"8852e0b5-9360-40b8-8d44-3165f9ba0d74","actor_username":"adminusersafepin@admin.com","actor_via_sso":false,"log_type":"account"}', '2025-07-20 14:31:55.779664+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bedd9409-46c7-48c4-a066-0fc61195c76d', '{"action":"login","actor_id":"8852e0b5-9360-40b8-8d44-3165f9ba0d74","actor_username":"adminusersafepin@admin.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 14:32:02.002175+00', ''),
	('00000000-0000-0000-0000-000000000000', '648a7ca8-ee51-45c7-ae18-c14619068ed8', '{"action":"login","actor_id":"8852e0b5-9360-40b8-8d44-3165f9ba0d74","actor_username":"adminusersafepin@admin.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 14:32:25.753379+00', ''),
	('00000000-0000-0000-0000-000000000000', '9795c191-5fbc-42db-9439-9e38f3073d37', '{"action":"logout","actor_id":"8852e0b5-9360-40b8-8d44-3165f9ba0d74","actor_username":"adminusersafepin@admin.com","actor_via_sso":false,"log_type":"account"}', '2025-07-20 14:37:15.492234+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a3227e72-7e1b-4d17-ab83-198eb94bbf27', '{"action":"login","actor_id":"8852e0b5-9360-40b8-8d44-3165f9ba0d74","actor_username":"adminusersafepin@admin.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 14:37:26.668123+00', ''),
	('00000000-0000-0000-0000-000000000000', '67572748-8d5d-4c11-8eaa-0a497f4e7568', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"bh0sxccharlesxxx@gmail.com","user_id":"e92febf6-d986-4bbd-aafa-3de91f78ed64","user_phone":""}}', '2025-07-20 14:45:19.067486+00', ''),
	('00000000-0000-0000-0000-000000000000', '6bccb345-f341-43c6-8106-da3cf80123a8', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"bh0sxccharlesxxx@gmail.com","user_id":"e92febf6-d986-4bbd-aafa-3de91f78ed64","user_phone":""}}', '2025-07-20 14:45:19.496908+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ca89a7b1-77f1-46e3-a969-31ba0af82ccd', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"bh0sxccharlesxxx@gmail.com","user_id":"15f461c0-44fc-4472-9726-6a2832e8a4c1","user_phone":""}}', '2025-07-20 14:48:26.771561+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd78351e6-1e8d-4d8a-9ba1-6b909089a5cf', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"giganigga123@gmail.com","user_id":"e9b1a87a-f7ac-42b6-98bf-7476a627257e","user_phone":""}}', '2025-07-20 14:53:05.455568+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f0ffd982-0ffc-4315-9167-fffa671942b6', '{"action":"token_refreshed","actor_id":"ab92a9c9-dc28-4ad1-8150-8126c987b6aa","actor_username":"authorityuser123@email.com","actor_via_sso":false,"log_type":"token"}', '2025-07-20 15:05:36.123955+00', ''),
	('00000000-0000-0000-0000-000000000000', '57a386a0-3ba3-4c71-9a26-57cfdd28c205', '{"action":"token_revoked","actor_id":"ab92a9c9-dc28-4ad1-8150-8126c987b6aa","actor_username":"authorityuser123@email.com","actor_via_sso":false,"log_type":"token"}', '2025-07-20 15:05:36.126204+00', ''),
	('00000000-0000-0000-0000-000000000000', '25b81c1b-3630-4345-afb0-087aa3491531', '{"action":"logout","actor_id":"ab92a9c9-dc28-4ad1-8150-8126c987b6aa","actor_username":"authorityuser123@email.com","actor_via_sso":false,"log_type":"account"}', '2025-07-20 15:05:40.018273+00', ''),
	('00000000-0000-0000-0000-000000000000', '8f757bcd-a665-4072-8ca7-15c00b2edddf', '{"action":"login","actor_id":"8852e0b5-9360-40b8-8d44-3165f9ba0d74","actor_username":"adminusersafepin@admin.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 15:05:59.025435+00', ''),
	('00000000-0000-0000-0000-000000000000', '91a893a6-1fb5-4d83-8a24-b3563dea771a', '{"action":"login","actor_id":"8852e0b5-9360-40b8-8d44-3165f9ba0d74","actor_username":"adminusersafepin@admin.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 15:11:39.838225+00', ''),
	('00000000-0000-0000-0000-000000000000', '39b2fc4a-20d4-482f-8fe5-f11189edc840', '{"action":"token_refreshed","actor_id":"ccb28669-e3fd-4ad4-adae-c5ae3cd55359","actor_username":"authorityuser@email.com","actor_via_sso":false,"log_type":"token"}', '2025-07-20 15:20:42.029033+00', ''),
	('00000000-0000-0000-0000-000000000000', '3f2416f7-0cda-4a35-a47f-b4e59893501e', '{"action":"token_revoked","actor_id":"ccb28669-e3fd-4ad4-adae-c5ae3cd55359","actor_username":"authorityuser@email.com","actor_via_sso":false,"log_type":"token"}', '2025-07-20 15:20:42.032335+00', ''),
	('00000000-0000-0000-0000-000000000000', '9f1b1781-27f2-41e9-b4e3-8b09ca1d4493', '{"action":"logout","actor_id":"ccb28669-e3fd-4ad4-adae-c5ae3cd55359","actor_username":"authorityuser@email.com","actor_via_sso":false,"log_type":"account"}', '2025-07-20 15:20:45.638003+00', ''),
	('00000000-0000-0000-0000-000000000000', '52bdfd39-0d0d-44cd-a54f-fa6c56e018c2', '{"action":"login","actor_id":"8852e0b5-9360-40b8-8d44-3165f9ba0d74","actor_username":"adminusersafepin@admin.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 15:21:02.045966+00', ''),
	('00000000-0000-0000-0000-000000000000', '8e6bc828-fc4f-469e-9703-6c347f0b889d', '{"action":"login","actor_id":"16c37316-2dea-4501-8b1c-d0d5c538bce9","actor_username":"adminuser@admin.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 16:17:29.900715+00', ''),
	('00000000-0000-0000-0000-000000000000', '0639e06c-a213-4377-a606-f62f81d01345', '{"action":"logout","actor_id":"16c37316-2dea-4501-8b1c-d0d5c538bce9","actor_username":"adminuser@admin.com","actor_via_sso":false,"log_type":"account"}', '2025-07-20 16:17:42.401186+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bdba044c-43a8-4906-84cb-03c8c152597d', '{"action":"login","actor_id":"16c37316-2dea-4501-8b1c-d0d5c538bce9","actor_username":"adminuser@admin.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 16:18:00.337562+00', ''),
	('00000000-0000-0000-0000-000000000000', '1e22640e-3b2b-4804-92c6-c370619c8741', '{"action":"login","actor_id":"16c37316-2dea-4501-8b1c-d0d5c538bce9","actor_username":"adminuser@admin.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 16:20:39.391825+00', ''),
	('00000000-0000-0000-0000-000000000000', '47a9bd6c-c2a6-49f8-b40b-10d8540be925', '{"action":"login","actor_id":"16c37316-2dea-4501-8b1c-d0d5c538bce9","actor_username":"adminuser@admin.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 16:25:16.341485+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c8b3a43c-bb03-4c97-b1fd-c76f02a08bfe', '{"action":"token_refreshed","actor_id":"8852e0b5-9360-40b8-8d44-3165f9ba0d74","actor_username":"adminusersafepin@admin.com","actor_via_sso":false,"log_type":"token"}', '2025-07-20 16:25:59.241119+00', ''),
	('00000000-0000-0000-0000-000000000000', '7b61bc22-3192-4c22-b533-e4010796fb34', '{"action":"token_revoked","actor_id":"8852e0b5-9360-40b8-8d44-3165f9ba0d74","actor_username":"adminusersafepin@admin.com","actor_via_sso":false,"log_type":"token"}', '2025-07-20 16:25:59.241643+00', ''),
	('00000000-0000-0000-0000-000000000000', '4746a0f8-2919-4fec-af06-73266b246ef1', '{"action":"login","actor_id":"16c37316-2dea-4501-8b1c-d0d5c538bce9","actor_username":"adminuser@admin.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 16:26:34.511262+00', ''),
	('00000000-0000-0000-0000-000000000000', 'da4363e2-7203-4cf8-aef6-a792304a8c34', '{"action":"login","actor_id":"16c37316-2dea-4501-8b1c-d0d5c538bce9","actor_username":"adminuser@admin.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 16:28:35.920738+00', ''),
	('00000000-0000-0000-0000-000000000000', '74744f06-d330-4c5c-a123-36badd7abbf2', '{"action":"login","actor_id":"16c37316-2dea-4501-8b1c-d0d5c538bce9","actor_username":"adminuser@admin.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 16:35:28.975821+00', ''),
	('00000000-0000-0000-0000-000000000000', '83063126-3ee7-4282-899c-bd93ed4d9a93', '{"action":"login","actor_id":"16c37316-2dea-4501-8b1c-d0d5c538bce9","actor_username":"adminuser@admin.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 16:41:46.611246+00', ''),
	('00000000-0000-0000-0000-000000000000', '930b177a-6a94-4042-839a-37eba11972b7', '{"action":"logout","actor_id":"16c37316-2dea-4501-8b1c-d0d5c538bce9","actor_username":"adminuser@admin.com","actor_via_sso":false,"log_type":"account"}', '2025-07-20 16:46:16.858141+00', ''),
	('00000000-0000-0000-0000-000000000000', '042c1857-af79-4198-8b2b-35bf6b9fdf94', '{"action":"token_refreshed","actor_id":"8852e0b5-9360-40b8-8d44-3165f9ba0d74","actor_username":"adminusersafepin@admin.com","actor_via_sso":false,"log_type":"token"}', '2025-07-20 23:39:31.091867+00', ''),
	('00000000-0000-0000-0000-000000000000', '83a17de7-f10a-4079-8d5c-8869533dd2bf', '{"action":"token_revoked","actor_id":"8852e0b5-9360-40b8-8d44-3165f9ba0d74","actor_username":"adminusersafepin@admin.com","actor_via_sso":false,"log_type":"token"}', '2025-07-20 23:39:31.098204+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ada42197-91cd-4a2c-8040-c9a6e4ab727c', '{"action":"logout","actor_id":"8852e0b5-9360-40b8-8d44-3165f9ba0d74","actor_username":"adminusersafepin@admin.com","actor_via_sso":false,"log_type":"account"}', '2025-07-20 23:39:38.9911+00', ''),
	('00000000-0000-0000-0000-000000000000', '51596794-04a1-4475-ba6e-f653969ce029', '{"action":"login","actor_id":"16c37316-2dea-4501-8b1c-d0d5c538bce9","actor_username":"adminuser@admin.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-07-20 23:40:11.649759+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dfc9e7e6-a89a-4ee9-a93f-d6a70ff9180c', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"testuseradmin@example.com","user_id":"0d32ae86-7086-4e0e-803a-298761ef9efc","user_phone":""}}', '2025-07-20 23:44:02.466698+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '16c37316-2dea-4501-8b1c-d0d5c538bce9', 'authenticated', 'authenticated', 'adminuser@admin.com', '$2a$10$FWsmR6eY2XTrT.k8lXwMiO0BK8auJajH4nnHS/h/UZgJLysl6SrHW', '2025-07-20 14:04:09.64806+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-07-20 23:40:11.651675+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-07-20 14:04:09.639334+00', '2025-07-20 23:40:11.655872+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('16c37316-2dea-4501-8b1c-d0d5c538bce9', '16c37316-2dea-4501-8b1c-d0d5c538bce9', '{"sub": "16c37316-2dea-4501-8b1c-d0d5c538bce9", "email": "adminuser@admin.com", "email_verified": false, "phone_verified": false}', 'email', '2025-07-20 14:04:09.644387+00', '2025-07-20 14:04:09.644445+00', '2025-07-20 14:04:09.644445+00', '0de3e153-852e-40b7-9004-e5c57b62596d');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('7282f01b-0d3a-468d-a30a-dde0a2d9676b', '16c37316-2dea-4501-8b1c-d0d5c538bce9', '2025-07-20 23:40:11.65179+00', '2025-07-20 23:40:11.65179+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '112.203.195.156', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('7282f01b-0d3a-468d-a30a-dde0a2d9676b', '2025-07-20 23:40:11.656169+00', '2025-07-20 23:40:11.656169+00', 'password', '8867ee09-e73c-41ee-b092-1bf4de3c3230');


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
	('00000000-0000-0000-0000-000000000000', 78, 'rxpqcd5eahm3', '16c37316-2dea-4501-8b1c-d0d5c538bce9', false, '2025-07-20 23:40:11.654553+00', '2025-07-20 23:40:11.654553+00', NULL, '7282f01b-0d3a-468d-a30a-dde0a2d9676b');


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
-- Data for Name: incidents; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: rate_limits; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("id", "email", "role", "created_at", "onboarding_completed") VALUES
	('16c37316-2dea-4501-8b1c-d0d5c538bce9', 'adminuser@admin.com', 'admin', '2025-07-20 16:40:44.550665+00', false);


--
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('reports', 'reports', NULL, '2025-07-18 14:30:57.759558+00', '2025-07-18 14:30:57.759558+00', true, false, NULL, NULL, NULL);


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") VALUES
	('cb7d92f5-7550-41de-953b-03035e09ceae', 'reports', 'reports/.emptyFolderPlaceholder', NULL, '2025-07-21 00:09:51.978733+00', '2025-07-21 00:09:51.978733+00', '2025-07-21 00:09:51.978733+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2025-07-21T00:09:52.000Z", "contentLength": 0, "httpStatusCode": 200}', '0282be67-4626-4c26-8fbf-1a5befa328e9', NULL, '{}');


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 78, true);


--
-- Name: incidents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."incidents_id_seq"', 3, true);


--
-- Name: rate_limits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."rate_limits_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
