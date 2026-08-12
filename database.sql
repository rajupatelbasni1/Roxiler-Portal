--
-- PostgreSQL database dump
--

\restrict P8aQOVC1UEWGLDtckmBsx5P6GZetfrAoeYhSFhijSnxxTncyaHTDK6pg4Zq99Yj

-- Dumped from database version 18.2
-- Dumped by pg_dump version 18.4 (Homebrew)

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
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'SYSTEM_ADMIN',
    'NORMAL_USER',
    'STORE_OWNER'
);


ALTER TYPE public.user_role OWNER TO postgres;

--
-- Name: log_table_changes(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_table_changes() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_logs (table_name, action_type, record_id, old_data)
        VALUES (TG_TABLE_NAME, 'DELETE', OLD.id, row_to_json(OLD)::jsonb);
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_logs (table_name, action_type, record_id, old_data, new_data)
        VALUES (TG_TABLE_NAME, 'UPDATE', NEW.id, row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb);
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_logs (table_name, action_type, record_id, new_data)
        VALUES (TG_TABLE_NAME, 'INSERT', NEW.id, row_to_json(NEW)::jsonb);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$;


ALTER FUNCTION public.log_table_changes() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    log_id integer NOT NULL,
    table_name character varying(100) NOT NULL,
    action_type character varying(10) NOT NULL,
    record_id integer NOT NULL,
    old_data jsonb,
    new_data jsonb,
    changed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT audit_logs_action_type_check CHECK (((action_type)::text = ANY ((ARRAY['INSERT'::character varying, 'UPDATE'::character varying, 'DELETE'::character varying])::text[])))
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: audit_logs_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audit_logs_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_logs_log_id_seq OWNER TO postgres;

--
-- Name: audit_logs_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audit_logs_log_id_seq OWNED BY public.audit_logs.log_id;


--
-- Name: ratings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ratings (
    id integer NOT NULL,
    user_id integer NOT NULL,
    store_id integer NOT NULL,
    rating integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ratings_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.ratings OWNER TO postgres;

--
-- Name: ratings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ratings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ratings_id_seq OWNER TO postgres;

--
-- Name: ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ratings_id_seq OWNED BY public.ratings.id;


--
-- Name: stores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stores (
    id integer NOT NULL,
    owner_id integer,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    address character varying(400) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.stores OWNER TO postgres;

--
-- Name: stores_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stores_id_seq OWNER TO postgres;

--
-- Name: stores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stores_id_seq OWNED BY public.stores.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(60) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    address character varying(400),
    role public.user_role NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_name_check CHECK ((char_length((name)::text) >= 20))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: audit_logs log_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN log_id SET DEFAULT nextval('public.audit_logs_log_id_seq'::regclass);


--
-- Name: ratings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings ALTER COLUMN id SET DEFAULT nextval('public.ratings_id_seq'::regclass);


--
-- Name: stores id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stores ALTER COLUMN id SET DEFAULT nextval('public.stores_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (log_id, table_name, action_type, record_id, old_data, new_data, changed_at) FROM stdin;
1	users	INSERT	1	\N	{"id": 1, "name": "FullStack Test User Account", "role": "NORMAL_USER", "email": "testuser1@example.com", "address": "123 Tech Park, IT City", "created_at": "2026-08-12T15:01:59.773412", "updated_at": "2026-08-12T15:01:59.773412", "password_hash": "$2b$10$kvRdDxENpeD2gUcoSCs4P.lK6tpddQPs/olu7W/7DieGYbKHDjbmS"}	2026-08-12 15:01:59.773412
2	users	INSERT	2	\N	{"id": 2, "name": "Raju Patel Basni Jutha", "role": "SYSTEM_ADMIN", "email": "rajupatelbasni@gmail.com", "address": "Jodhpur, Rajasthan", "created_at": "2026-08-12T15:51:22.448011", "updated_at": "2026-08-12T15:51:22.448011", "password_hash": "$2b$10$n8VFEXvn3Aj6QfZA9Xmegul4UJLJD6hvXnKdVjMAzg/RMGeuNZzTG"}	2026-08-12 15:51:22.448011
3	stores	INSERT	2	\N	{"id": 2, "name": "Raju Patel Store", "email": "rajupatelbasnijutha@gmail.com", "address": "Pune, India", "owner_id": null, "created_at": "2026-08-12T16:01:44.051247", "updated_at": "2026-08-12T16:01:44.051247"}	2026-08-12 16:01:44.051247
4	users	INSERT	3	\N	{"id": 3, "name": "Raju Patel Ki Kirane Ki Dukan ", "role": "STORE_OWNER", "email": "rajupatel@gmail.com", "address": "Pune, Maharashtra, India", "created_at": "2026-08-12T16:04:11.393039", "updated_at": "2026-08-12T16:04:11.393039", "password_hash": "$2b$10$8WqvIggQkWXMBrRTuPXRMeSck6P72imwRQhzUAUmmvuV1xH7t/Hri"}	2026-08-12 16:04:11.393039
5	users	INSERT	4	\N	{"id": 4, "name": "Raju Patel Ke Kirana Store Ka Reguler Customer", "role": "NORMAL_USER", "email": "raju@gmail.com", "address": "Hinjewadi, Pune, India", "created_at": "2026-08-12T16:08:03.382516", "updated_at": "2026-08-12T16:08:03.382516", "password_hash": "$2b$10$/X4IpqFuvVphEetESAAyouRqTRW0vmL.RsO7xjosoDaO1H2GgNdIe"}	2026-08-12 16:08:03.382516
6	ratings	INSERT	1	\N	{"id": 1, "rating": 5, "user_id": 4, "store_id": 2, "created_at": "2026-08-12T16:08:56.0619", "updated_at": "2026-08-12T16:08:56.0619"}	2026-08-12 16:08:56.0619
7	ratings	UPDATE	1	{"id": 1, "rating": 5, "user_id": 4, "store_id": 2, "created_at": "2026-08-12T16:08:56.0619", "updated_at": "2026-08-12T16:08:56.0619"}	{"id": 1, "rating": 4, "user_id": 4, "store_id": 2, "created_at": "2026-08-12T16:08:56.0619", "updated_at": "2026-08-12T16:09:03.425793"}	2026-08-12 16:09:03.425793
8	ratings	UPDATE	1	{"id": 1, "rating": 4, "user_id": 4, "store_id": 2, "created_at": "2026-08-12T16:08:56.0619", "updated_at": "2026-08-12T16:09:03.425793"}	{"id": 1, "rating": 5, "user_id": 4, "store_id": 2, "created_at": "2026-08-12T16:08:56.0619", "updated_at": "2026-08-12T16:09:06.677857"}	2026-08-12 16:09:06.677857
9	ratings	UPDATE	1	{"id": 1, "rating": 5, "user_id": 4, "store_id": 2, "created_at": "2026-08-12T16:08:56.0619", "updated_at": "2026-08-12T16:09:06.677857"}	{"id": 1, "rating": 1, "user_id": 4, "store_id": 2, "created_at": "2026-08-12T16:08:56.0619", "updated_at": "2026-08-12T16:09:11.24316"}	2026-08-12 16:09:11.24316
10	ratings	UPDATE	1	{"id": 1, "rating": 1, "user_id": 4, "store_id": 2, "created_at": "2026-08-12T16:08:56.0619", "updated_at": "2026-08-12T16:09:11.24316"}	{"id": 1, "rating": 5, "user_id": 4, "store_id": 2, "created_at": "2026-08-12T16:08:56.0619", "updated_at": "2026-08-12T16:09:18.959234"}	2026-08-12 16:09:18.959234
11	ratings	UPDATE	1	{"id": 1, "rating": 5, "user_id": 4, "store_id": 2, "created_at": "2026-08-12T16:08:56.0619", "updated_at": "2026-08-12T16:09:18.959234"}	{"id": 1, "rating": 5, "user_id": 4, "store_id": 2, "created_at": "2026-08-12T16:08:56.0619", "updated_at": "2026-08-12T16:09:19.792909"}	2026-08-12 16:09:19.792909
12	stores	INSERT	3	\N	{"id": 3, "name": "Raju Patel Ki Kirane Wali Dukan", "email": "rajupatelbasni@gmail.com", "address": "Pune, Hinjewadi", "owner_id": null, "created_at": "2026-08-12T16:16:40.985568", "updated_at": "2026-08-12T16:16:40.985568"}	2026-08-12 16:16:40.985568
13	stores	UPDATE	3	{"id": 3, "name": "Raju Patel Ki Kirane Wali Dukan", "email": "rajupatelbasni@gmail.com", "address": "Pune, Hinjewadi", "owner_id": null, "created_at": "2026-08-12T16:16:40.985568", "updated_at": "2026-08-12T16:16:40.985568"}	{"id": 3, "name": "Raju Patel Ki Kirane Wali Dukan", "email": "rajupatel@gmail.com", "address": "Pune, Hinjewadi", "owner_id": null, "created_at": "2026-08-12T16:16:40.985568", "updated_at": "2026-08-12T16:16:40.985568"}	2026-08-12 16:19:30.714092
14	stores	UPDATE	3	{"id": 3, "name": "Raju Patel Ki Kirane Wali Dukan", "email": "rajupatel@gmail.com", "address": "Pune, Hinjewadi", "owner_id": null, "created_at": "2026-08-12T16:16:40.985568", "updated_at": "2026-08-12T16:16:40.985568"}	{"id": 3, "name": "Raju Patel Ki Kirane Wali Dukan", "email": "rajupatel@gmail.com", "address": "Pune, Hinjewadi", "owner_id": null, "created_at": "2026-08-12T16:16:40.985568", "updated_at": "2026-08-12T16:16:40.985568"}	2026-08-12 16:20:06.251135
15	stores	UPDATE	3	{"id": 3, "name": "Raju Patel Ki Kirane Wali Dukan", "email": "rajupatel@gmail.com", "address": "Pune, Hinjewadi", "owner_id": null, "created_at": "2026-08-12T16:16:40.985568", "updated_at": "2026-08-12T16:16:40.985568"}	{"id": 3, "name": "Raju Patel Ki Kirane Wali Dukan", "email": "rajupatel@gmail.com", "address": "Pune, Hinjewadi", "owner_id": null, "created_at": "2026-08-12T16:16:40.985568", "updated_at": "2026-08-12T16:16:40.985568"}	2026-08-12 16:21:15.620849
16	stores	UPDATE	3	{"id": 3, "name": "Raju Patel Ki Kirane Wali Dukan", "email": "rajupatel@gmail.com", "address": "Pune, Hinjewadi", "owner_id": null, "created_at": "2026-08-12T16:16:40.985568", "updated_at": "2026-08-12T16:16:40.985568"}	{"id": 3, "name": "Raju Patel Ki Kirane Wali Dukan", "email": "rajupatel@gmail.com", "address": "Pune, Hinjewadi", "owner_id": 3, "created_at": "2026-08-12T16:16:40.985568", "updated_at": "2026-08-12T16:16:40.985568"}	2026-08-12 16:23:46.051131
17	ratings	INSERT	7	\N	{"id": 7, "rating": 5, "user_id": 4, "store_id": 3, "created_at": "2026-08-12T16:25:36.533552", "updated_at": "2026-08-12T16:25:36.533552"}	2026-08-12 16:25:36.533552
18	ratings	UPDATE	1	{"id": 1, "rating": 5, "user_id": 4, "store_id": 2, "created_at": "2026-08-12T16:08:56.0619", "updated_at": "2026-08-12T16:09:19.792909"}	{"id": 1, "rating": 4, "user_id": 4, "store_id": 2, "created_at": "2026-08-12T16:08:56.0619", "updated_at": "2026-08-12T16:25:39.613209"}	2026-08-12 16:25:39.613209
19	ratings	UPDATE	7	{"id": 7, "rating": 5, "user_id": 4, "store_id": 3, "created_at": "2026-08-12T16:25:36.533552", "updated_at": "2026-08-12T16:25:36.533552"}	{"id": 7, "rating": 5, "user_id": 4, "store_id": 3, "created_at": "2026-08-12T16:25:36.533552", "updated_at": "2026-08-12T16:25:43.815127"}	2026-08-12 16:25:43.815127
20	users	INSERT	5	\N	{"id": 5, "name": "Manish hshshshshshshshshs", "role": "NORMAL_USER", "email": "manish@gmail.com", "address": "Jodhpur, india", "created_at": "2026-08-12T17:07:31.000561", "updated_at": "2026-08-12T17:07:31.000561", "password_hash": "$2b$10$UUZdpF4ISbrKL4BUx5hF.unsEIFDZBhtAtniXbhtfYaCDGHeuY4em"}	2026-08-12 17:07:31.000561
21	stores	INSERT	4	\N	{"id": 4, "name": "Manish Ki dukan ", "email": "manish@gmail.com", "address": "Jodhpur , india", "owner_id": null, "created_at": "2026-08-12T17:08:07.538387", "updated_at": "2026-08-12T17:08:07.538387"}	2026-08-12 17:08:07.538387
22	ratings	INSERT	10	\N	{"id": 10, "rating": 3, "user_id": 5, "store_id": 4, "created_at": "2026-08-12T17:08:48.802166", "updated_at": "2026-08-12T17:08:48.802166"}	2026-08-12 17:08:48.802166
23	ratings	INSERT	11	\N	{"id": 11, "rating": 2, "user_id": 5, "store_id": 2, "created_at": "2026-08-12T17:09:05.398617", "updated_at": "2026-08-12T17:09:05.398617"}	2026-08-12 17:09:05.398617
24	ratings	INSERT	12	\N	{"id": 12, "rating": 3, "user_id": 5, "store_id": 3, "created_at": "2026-08-12T17:09:12.43493", "updated_at": "2026-08-12T17:09:12.43493"}	2026-08-12 17:09:12.43493
25	users	UPDATE	4	{"id": 4, "name": "Raju Patel Ke Kirana Store Ka Reguler Customer", "role": "NORMAL_USER", "email": "raju@gmail.com", "address": "Hinjewadi, Pune, India", "created_at": "2026-08-12T16:08:03.382516", "updated_at": "2026-08-12T16:08:03.382516", "password_hash": "$2b$10$/X4IpqFuvVphEetESAAyouRqTRW0vmL.RsO7xjosoDaO1H2GgNdIe"}	{"id": 4, "name": "Raju Patel Ke Kirana Store Ka Reguler Customer", "role": "NORMAL_USER", "email": "raju@gmail.com", "address": "Hinjewadi, Pune, India", "created_at": "2026-08-12T16:08:03.382516", "updated_at": "2026-08-12T16:08:03.382516", "password_hash": "$2b$10$NSlQQyzWdhtvocponEgYl.h1Wj78qdCCaUxYO4cgnlYwZj8urHXl6"}	2026-08-12 17:22:53.166247
26	users	UPDATE	4	{"id": 4, "name": "Raju Patel Ke Kirana Store Ka Reguler Customer", "role": "NORMAL_USER", "email": "raju@gmail.com", "address": "Hinjewadi, Pune, India", "created_at": "2026-08-12T16:08:03.382516", "updated_at": "2026-08-12T16:08:03.382516", "password_hash": "$2b$10$NSlQQyzWdhtvocponEgYl.h1Wj78qdCCaUxYO4cgnlYwZj8urHXl6"}	{"id": 4, "name": "Raju Patel Ke Kirana Store Ka Reguler Customer", "role": "NORMAL_USER", "email": "raju@gmail.com", "address": "Hinjewadi, Pune, India", "created_at": "2026-08-12T16:08:03.382516", "updated_at": "2026-08-12T16:08:03.382516", "password_hash": "$2b$10$oeOpUWqYxYDMhfN44xZbneDZM7Hv7Duvf.wiN7VurmhIhEx49nVz2"}	2026-08-12 17:23:11.264112
27	users	UPDATE	4	{"id": 4, "name": "Raju Patel Ke Kirana Store Ka Reguler Customer", "role": "NORMAL_USER", "email": "raju@gmail.com", "address": "Hinjewadi, Pune, India", "created_at": "2026-08-12T16:08:03.382516", "updated_at": "2026-08-12T16:08:03.382516", "password_hash": "$2b$10$oeOpUWqYxYDMhfN44xZbneDZM7Hv7Duvf.wiN7VurmhIhEx49nVz2"}	{"id": 4, "name": "Raju Patel Ke Kirana Store Ka Reguler Customer", "role": "NORMAL_USER", "email": "raju@gmail.com", "address": "Hinjewadi, Pune, India", "created_at": "2026-08-12T16:08:03.382516", "updated_at": "2026-08-12T16:08:03.382516", "password_hash": "$2b$10$x5NHx8RPTOWE36Y41IPPKOR3CIYYpZO1IJNbtmKUVRb8di8sck67."}	2026-08-12 17:23:25.484557
28	ratings	INSERT	13	\N	{"id": 13, "rating": 2, "user_id": 4, "store_id": 4, "created_at": "2026-08-12T17:23:47.30654", "updated_at": "2026-08-12T17:23:47.30654"}	2026-08-12 17:23:47.30654
\.


--
-- Data for Name: ratings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ratings (id, user_id, store_id, rating, created_at, updated_at) FROM stdin;
1	4	2	4	2026-08-12 16:08:56.0619	2026-08-12 16:25:39.613209
7	4	3	5	2026-08-12 16:25:36.533552	2026-08-12 16:25:43.815127
10	5	4	3	2026-08-12 17:08:48.802166	2026-08-12 17:08:48.802166
11	5	2	2	2026-08-12 17:09:05.398617	2026-08-12 17:09:05.398617
12	5	3	3	2026-08-12 17:09:12.43493	2026-08-12 17:09:12.43493
13	4	4	2	2026-08-12 17:23:47.30654	2026-08-12 17:23:47.30654
\.


--
-- Data for Name: stores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stores (id, owner_id, name, email, address, created_at, updated_at) FROM stdin;
2	\N	Raju Patel Store	rajupatelbasnijutha@gmail.com	Pune, India	2026-08-12 16:01:44.051247	2026-08-12 16:01:44.051247
3	3	Raju Patel Ki Kirane Wali Dukan	rajupatel@gmail.com	Pune, Hinjewadi	2026-08-12 16:16:40.985568	2026-08-12 16:16:40.985568
4	\N	Manish Ki dukan 	manish@gmail.com	Jodhpur , india	2026-08-12 17:08:07.538387	2026-08-12 17:08:07.538387
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password_hash, address, role, created_at, updated_at) FROM stdin;
1	FullStack Test User Account	testuser1@example.com	$2b$10$kvRdDxENpeD2gUcoSCs4P.lK6tpddQPs/olu7W/7DieGYbKHDjbmS	123 Tech Park, IT City	NORMAL_USER	2026-08-12 15:01:59.773412	2026-08-12 15:01:59.773412
2	Raju Patel Basni Jutha	rajupatelbasni@gmail.com	$2b$10$n8VFEXvn3Aj6QfZA9Xmegul4UJLJD6hvXnKdVjMAzg/RMGeuNZzTG	Jodhpur, Rajasthan	SYSTEM_ADMIN	2026-08-12 15:51:22.448011	2026-08-12 15:51:22.448011
3	Raju Patel Ki Kirane Ki Dukan 	rajupatel@gmail.com	$2b$10$8WqvIggQkWXMBrRTuPXRMeSck6P72imwRQhzUAUmmvuV1xH7t/Hri	Pune, Maharashtra, India	STORE_OWNER	2026-08-12 16:04:11.393039	2026-08-12 16:04:11.393039
5	Manish hshshshshshshshshs	manish@gmail.com	$2b$10$UUZdpF4ISbrKL4BUx5hF.unsEIFDZBhtAtniXbhtfYaCDGHeuY4em	Jodhpur, india	NORMAL_USER	2026-08-12 17:07:31.000561	2026-08-12 17:07:31.000561
4	Raju Patel Ke Kirana Store Ka Reguler Customer	raju@gmail.com	$2b$10$x5NHx8RPTOWE36Y41IPPKOR3CIYYpZO1IJNbtmKUVRb8di8sck67.	Hinjewadi, Pune, India	NORMAL_USER	2026-08-12 16:08:03.382516	2026-08-12 16:08:03.382516
\.


--
-- Name: audit_logs_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_logs_log_id_seq', 28, true);


--
-- Name: ratings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ratings_id_seq', 13, true);


--
-- Name: stores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stores_id_seq', 4, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 7, true);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (log_id);


--
-- Name: ratings ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_pkey PRIMARY KEY (id);


--
-- Name: ratings ratings_user_id_store_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_user_id_store_id_key UNIQUE (user_id, store_id);


--
-- Name: stores stores_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_email_key UNIQUE (email);


--
-- Name: stores stores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ratings ratings_audit_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER ratings_audit_trigger AFTER INSERT OR DELETE OR UPDATE ON public.ratings FOR EACH ROW EXECUTE FUNCTION public.log_table_changes();


--
-- Name: stores stores_audit_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER stores_audit_trigger AFTER INSERT OR DELETE OR UPDATE ON public.stores FOR EACH ROW EXECUTE FUNCTION public.log_table_changes();


--
-- Name: users users_audit_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER users_audit_trigger AFTER INSERT OR DELETE OR UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.log_table_changes();


--
-- Name: ratings ratings_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE;


--
-- Name: ratings ratings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: stores stores_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict P8aQOVC1UEWGLDtckmBsx5P6GZetfrAoeYhSFhijSnxxTncyaHTDK6pg4Zq99Yj

