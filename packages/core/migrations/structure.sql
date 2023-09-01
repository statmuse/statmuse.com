--
-- PostgreSQL database dump
--

-- Dumped from database version 10.17
-- Dumped by pg_dump version 10.17

-- Started on 2023-09-01 01:25:50 PDT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA public;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_stat_statements IS 'track execution statistics of all SQL statements executed';


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: ad_domain; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.ad_domain AS ENUM (
    'sports',
    'finance'
);


--
-- Name: allow_deny; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.allow_deny AS ENUM (
    'allow',
    'deny'
);


--
-- Name: ask_answer; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.ask_answer AS ENUM (
    'answer',
    'error',
    'prompt',
    'player_bio',
    'team_franchise_bio',
    'team_season_bio',
    'unknown'
);


--
-- Name: client_device; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.client_device AS ENUM (
    'mobile',
    'desktop'
);


--
-- Name: cookie_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.cookie_status AS ENUM (
    'deny',
    'allow',
    'dismiss'
);


--
-- Name: crawl_mode; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.crawl_mode AS ENUM (
    'discover',
    'refresh'
);


--
-- Name: crawl_page_url_domain; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.crawl_page_url_domain AS ENUM (
    'mlb',
    'nba',
    'nfl',
    'nhl'
);


--
-- Name: crawl_page_url_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.crawl_page_url_type AS ENUM (
    'none',
    'ask',
    'game',
    'musing',
    'player',
    'question',
    'team'
);


--
-- Name: device_name; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.device_name AS ENUM (
    'alexa',
    'ios'
);


--
-- Name: example_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.example_type AS ENUM (
    'beyond-the-box-score',
    'bio',
    'conversational-dialogue',
    'noteworthy',
    'onboarding',
    'recap',
    'schedule',
    'sitemap',
    'score',
    'standing',
    'stat'
);


--
-- Name: finance_ask_answer; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.finance_ask_answer AS ENUM (
    'answer',
    'asset',
    'error',
    'unknown'
);


--
-- Name: game_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.game_status AS ENUM (
    'Canceled',
    'Completed',
    'Delayed',
    'Halftime',
    'InProgress',
    'Postponed',
    'Processing',
    'Scheduled',
    'Suspended'
);


--
-- Name: layout_types; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.layout_types AS ENUM (
    'bottom',
    'square',
    'fullscreen'
);


--
-- Name: link_linkable; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.link_linkable AS ENUM (
    'ask',
    'image',
    'musing',
    'question',
    'story',
    'url',
    'finance_ask'
);


--
-- Name: message_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.message_type AS ENUM (
    'answer',
    'error',
    'info',
    'musing',
    'prompt',
    'query'
);


--
-- Name: musing_content_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.musing_content_type AS ENUM (
    'original',
    'daily-stats',
    'latest-stats',
    'templated',
    'user-generated'
);


--
-- Name: musing_related_actor_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.musing_related_actor_type AS ENUM (
    'league',
    'player',
    'team'
);


--
-- Name: reactable; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.reactable AS ENUM (
    'musing',
    'story'
);


--
-- Name: reaction; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.reaction AS ENUM (
    'like'
);


--
-- Name: template_run_frequency; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.template_run_frequency AS ENUM (
    'minutely',
    'hourly',
    'daily',
    'weekly',
    'monthly',
    'quarterly',
    'biannually',
    'annually',
    'post_game',
    'during_game'
);


--
-- Name: timezone_name; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.timezone_name AS ENUM (
    'Africa/Abidjan',
    'Africa/Accra',
    'Africa/Addis_Ababa',
    'Africa/Algiers',
    'Africa/Asmara',
    'Africa/Asmera',
    'Africa/Bamako',
    'Africa/Bangui',
    'Africa/Banjul',
    'Africa/Bissau',
    'Africa/Blantyre',
    'Africa/Brazzaville',
    'Africa/Bujumbura',
    'Africa/Cairo',
    'Africa/Casablanca',
    'Africa/Ceuta',
    'Africa/Conakry',
    'Africa/Dakar',
    'Africa/Dar_es_Salaam',
    'Africa/Djibouti',
    'Africa/Douala',
    'Africa/El_Aaiun',
    'Africa/Freetown',
    'Africa/Gaborone',
    'Africa/Harare',
    'Africa/Johannesburg',
    'Africa/Juba',
    'Africa/Kampala',
    'Africa/Khartoum',
    'Africa/Kigali',
    'Africa/Kinshasa',
    'Africa/Lagos',
    'Africa/Libreville',
    'Africa/Lome',
    'Africa/Luanda',
    'Africa/Lubumbashi',
    'Africa/Lusaka',
    'Africa/Malabo',
    'Africa/Maputo',
    'Africa/Maseru',
    'Africa/Mbabane',
    'Africa/Mogadishu',
    'Africa/Monrovia',
    'Africa/Nairobi',
    'Africa/Ndjamena',
    'Africa/Niamey',
    'Africa/Nouakchott',
    'Africa/Ouagadougou',
    'Africa/Porto-Novo',
    'Africa/Sao_Tome',
    'Africa/Timbuktu',
    'Africa/Tripoli',
    'Africa/Tunis',
    'Africa/Windhoek',
    'America/Adak',
    'America/Anchorage',
    'America/Anguilla',
    'America/Antigua',
    'America/Araguaina',
    'America/Argentina/Buenos_Aires',
    'America/Argentina/Catamarca',
    'America/Argentina/ComodRivadavia',
    'America/Argentina/Cordoba',
    'America/Argentina/Jujuy',
    'America/Argentina/La_Rioja',
    'America/Argentina/Mendoza',
    'America/Argentina/Rio_Gallegos',
    'America/Argentina/Salta',
    'America/Argentina/San_Juan',
    'America/Argentina/San_Luis',
    'America/Argentina/Tucuman',
    'America/Argentina/Ushuaia',
    'America/Aruba',
    'America/Asuncion',
    'America/Atikokan',
    'America/Atka',
    'America/Bahia',
    'America/Bahia_Banderas',
    'America/Barbados',
    'America/Belem',
    'America/Belize',
    'America/Blanc-Sablon',
    'America/Boa_Vista',
    'America/Bogota',
    'America/Boise',
    'America/Buenos_Aires',
    'America/Cambridge_Bay',
    'America/Campo_Grande',
    'America/Cancun',
    'America/Caracas',
    'America/Catamarca',
    'America/Cayenne',
    'America/Cayman',
    'America/Chicago',
    'America/Chihuahua',
    'America/Coral_Harbour',
    'America/Cordoba',
    'America/Costa_Rica',
    'America/Creston',
    'America/Cuiaba',
    'America/Curacao',
    'America/Danmarkshavn',
    'America/Dawson',
    'America/Dawson_Creek',
    'America/Denver',
    'America/Detroit',
    'America/Dominica',
    'America/Edmonton',
    'America/Eirunepe',
    'America/El_Salvador',
    'America/Ensenada',
    'America/Fort_Nelson',
    'America/Fort_Wayne',
    'America/Fortaleza',
    'America/Glace_Bay',
    'America/Godthab',
    'America/Goose_Bay',
    'America/Grand_Turk',
    'America/Grenada',
    'America/Guadeloupe',
    'America/Guatemala',
    'America/Guayaquil',
    'America/Guyana',
    'America/Halifax',
    'America/Havana',
    'America/Hermosillo',
    'America/Indiana/Indianapolis',
    'America/Indiana/Knox',
    'America/Indiana/Marengo',
    'America/Indiana/Petersburg',
    'America/Indiana/Tell_City',
    'America/Indiana/Vevay',
    'America/Indiana/Vincennes',
    'America/Indiana/Winamac',
    'America/Indianapolis',
    'America/Inuvik',
    'America/Iqaluit',
    'America/Jamaica',
    'America/Jujuy',
    'America/Juneau',
    'America/Kentucky/Louisville',
    'America/Kentucky/Monticello',
    'America/Knox_IN',
    'America/Kralendijk',
    'America/La_Paz',
    'America/Lima',
    'America/Los_Angeles',
    'America/Louisville',
    'America/Lower_Princes',
    'America/Maceio',
    'America/Managua',
    'America/Manaus',
    'America/Marigot',
    'America/Martinique',
    'America/Matamoros',
    'America/Mazatlan',
    'America/Mendoza',
    'America/Menominee',
    'America/Merida',
    'America/Metlakatla',
    'America/Mexico_City',
    'America/Miquelon',
    'America/Moncton',
    'America/Monterrey',
    'America/Montevideo',
    'America/Montreal',
    'America/Montserrat',
    'America/Nassau',
    'America/New_York',
    'America/Nipigon',
    'America/Nome',
    'America/Noronha',
    'America/North_Dakota/Beulah',
    'America/North_Dakota/Center',
    'America/North_Dakota/New_Salem',
    'America/Ojinaga',
    'America/Panama',
    'America/Pangnirtung',
    'America/Paramaribo',
    'America/Phoenix',
    'America/Port-au-Prince',
    'America/Port_of_Spain',
    'America/Porto_Acre',
    'America/Porto_Velho',
    'America/Puerto_Rico',
    'America/Punta_Arenas',
    'America/Rainy_River',
    'America/Rankin_Inlet',
    'America/Recife',
    'America/Regina',
    'America/Resolute',
    'America/Rio_Branco',
    'America/Rosario',
    'America/Santa_Isabel',
    'America/Santarem',
    'America/Santiago',
    'America/Santo_Domingo',
    'America/Sao_Paulo',
    'America/Scoresbysund',
    'America/Shiprock',
    'America/Sitka',
    'America/St_Barthelemy',
    'America/St_Johns',
    'America/St_Kitts',
    'America/St_Lucia',
    'America/St_Thomas',
    'America/St_Vincent',
    'America/Swift_Current',
    'America/Tegucigalpa',
    'America/Thule',
    'America/Thunder_Bay',
    'America/Tijuana',
    'America/Toronto',
    'America/Tortola',
    'America/Vancouver',
    'America/Virgin',
    'America/Whitehorse',
    'America/Winnipeg',
    'America/Yakutat',
    'America/Yellowknife',
    'Antarctica/Casey',
    'Antarctica/Davis',
    'Antarctica/DumontDUrville',
    'Antarctica/Macquarie',
    'Antarctica/Mawson',
    'Antarctica/McMurdo',
    'Antarctica/Palmer',
    'Antarctica/Rothera',
    'Antarctica/South_Pole',
    'Antarctica/Syowa',
    'Antarctica/Troll',
    'Antarctica/Vostok',
    'Arctic/Longyearbyen',
    'Asia/Aden',
    'Asia/Almaty',
    'Asia/Amman',
    'Asia/Anadyr',
    'Asia/Aqtau',
    'Asia/Aqtobe',
    'Asia/Ashgabat',
    'Asia/Ashkhabad',
    'Asia/Atyrau',
    'Asia/Baghdad',
    'Asia/Bahrain',
    'Asia/Baku',
    'Asia/Bangkok',
    'Asia/Barnaul',
    'Asia/Beirut',
    'Asia/Bishkek',
    'Asia/Brunei',
    'Asia/Calcutta',
    'Asia/Chita',
    'Asia/Choibalsan',
    'Asia/Chongqing',
    'Asia/Chungking',
    'Asia/Colombo',
    'Asia/Dacca',
    'Asia/Damascus',
    'Asia/Dhaka',
    'Asia/Dili',
    'Asia/Dubai',
    'Asia/Dushanbe',
    'Asia/Famagusta',
    'Asia/Gaza',
    'Asia/Harbin',
    'Asia/Hebron',
    'Asia/Ho_Chi_Minh',
    'Asia/Hong_Kong',
    'Asia/Hovd',
    'Asia/Irkutsk',
    'Asia/Istanbul',
    'Asia/Jakarta',
    'Asia/Jayapura',
    'Asia/Jerusalem',
    'Asia/Kabul',
    'Asia/Kamchatka',
    'Asia/Karachi',
    'Asia/Kashgar',
    'Asia/Kathmandu',
    'Asia/Katmandu',
    'Asia/Khandyga',
    'Asia/Kolkata',
    'Asia/Krasnoyarsk',
    'Asia/Kuala_Lumpur',
    'Asia/Kuching',
    'Asia/Kuwait',
    'Asia/Macao',
    'Asia/Macau',
    'Asia/Magadan',
    'Asia/Makassar',
    'Asia/Manila',
    'Asia/Muscat',
    'Asia/Nicosia',
    'Asia/Novokuznetsk',
    'Asia/Novosibirsk',
    'Asia/Omsk',
    'Asia/Oral',
    'Asia/Phnom_Penh',
    'Asia/Pontianak',
    'Asia/Pyongyang',
    'Asia/Qatar',
    'Asia/Qyzylorda',
    'Asia/Rangoon',
    'Asia/Riyadh',
    'Asia/Saigon',
    'Asia/Sakhalin',
    'Asia/Samarkand',
    'Asia/Seoul',
    'Asia/Shanghai',
    'Asia/Singapore',
    'Asia/Srednekolymsk',
    'Asia/Taipei',
    'Asia/Tashkent',
    'Asia/Tbilisi',
    'Asia/Tehran',
    'Asia/Tel_Aviv',
    'Asia/Thimbu',
    'Asia/Thimphu',
    'Asia/Tokyo',
    'Asia/Tomsk',
    'Asia/Ujung_Pandang',
    'Asia/Ulaanbaatar',
    'Asia/Ulan_Bator',
    'Asia/Urumqi',
    'Asia/Ust-Nera',
    'Asia/Vientiane',
    'Asia/Vladivostok',
    'Asia/Yakutsk',
    'Asia/Yangon',
    'Asia/Yekaterinburg',
    'Asia/Yerevan',
    'Atlantic/Azores',
    'Atlantic/Bermuda',
    'Atlantic/Canary',
    'Atlantic/Cape_Verde',
    'Atlantic/Faeroe',
    'Atlantic/Faroe',
    'Atlantic/Jan_Mayen',
    'Atlantic/Madeira',
    'Atlantic/Reykjavik',
    'Atlantic/South_Georgia',
    'Atlantic/St_Helena',
    'Atlantic/Stanley',
    'Australia/ACT',
    'Australia/Adelaide',
    'Australia/Brisbane',
    'Australia/Broken_Hill',
    'Australia/Canberra',
    'Australia/Currie',
    'Australia/Darwin',
    'Australia/Eucla',
    'Australia/Hobart',
    'Australia/LHI',
    'Australia/Lindeman',
    'Australia/Lord_Howe',
    'Australia/Melbourne',
    'Australia/NSW',
    'Australia/North',
    'Australia/Perth',
    'Australia/Queensland',
    'Australia/South',
    'Australia/Sydney',
    'Australia/Tasmania',
    'Australia/Victoria',
    'Australia/West',
    'Australia/Yancowinna',
    'Brazil/Acre',
    'Brazil/DeNoronha',
    'Brazil/East',
    'Brazil/West',
    'CET',
    'CST6CDT',
    'Canada/Atlantic',
    'Canada/Central',
    'Canada/Eastern',
    'Canada/Mountain',
    'Canada/Newfoundland',
    'Canada/Pacific',
    'Canada/Saskatchewan',
    'Canada/Yukon',
    'Chile/Continental',
    'Chile/EasterIsland',
    'Cuba',
    'EET',
    'EST',
    'EST5EDT',
    'Egypt',
    'Eire',
    'Etc/GMT',
    'Etc/GMT+0',
    'Etc/GMT+1',
    'Etc/GMT+10',
    'Etc/GMT+11',
    'Etc/GMT+12',
    'Etc/GMT+2',
    'Etc/GMT+3',
    'Etc/GMT+4',
    'Etc/GMT+5',
    'Etc/GMT+6',
    'Etc/GMT+7',
    'Etc/GMT+8',
    'Etc/GMT+9',
    'Etc/GMT-0',
    'Etc/GMT-1',
    'Etc/GMT-10',
    'Etc/GMT-11',
    'Etc/GMT-12',
    'Etc/GMT-13',
    'Etc/GMT-14',
    'Etc/GMT-2',
    'Etc/GMT-3',
    'Etc/GMT-4',
    'Etc/GMT-5',
    'Etc/GMT-6',
    'Etc/GMT-7',
    'Etc/GMT-8',
    'Etc/GMT-9',
    'Etc/GMT0',
    'Etc/Greenwich',
    'Etc/UCT',
    'Etc/UTC',
    'Etc/Universal',
    'Etc/Zulu',
    'Europe/Amsterdam',
    'Europe/Andorra',
    'Europe/Astrakhan',
    'Europe/Athens',
    'Europe/Belfast',
    'Europe/Belgrade',
    'Europe/Berlin',
    'Europe/Bratislava',
    'Europe/Brussels',
    'Europe/Bucharest',
    'Europe/Budapest',
    'Europe/Busingen',
    'Europe/Chisinau',
    'Europe/Copenhagen',
    'Europe/Dublin',
    'Europe/Gibraltar',
    'Europe/Guernsey',
    'Europe/Helsinki',
    'Europe/Isle_of_Man',
    'Europe/Istanbul',
    'Europe/Jersey',
    'Europe/Kaliningrad',
    'Europe/Kiev',
    'Europe/Kirov',
    'Europe/Lisbon',
    'Europe/Ljubljana',
    'Europe/London',
    'Europe/Luxembourg',
    'Europe/Madrid',
    'Europe/Malta',
    'Europe/Mariehamn',
    'Europe/Minsk',
    'Europe/Monaco',
    'Europe/Moscow',
    'Europe/Nicosia',
    'Europe/Oslo',
    'Europe/Paris',
    'Europe/Podgorica',
    'Europe/Prague',
    'Europe/Riga',
    'Europe/Rome',
    'Europe/Samara',
    'Europe/San_Marino',
    'Europe/Sarajevo',
    'Europe/Saratov',
    'Europe/Simferopol',
    'Europe/Skopje',
    'Europe/Sofia',
    'Europe/Stockholm',
    'Europe/Tallinn',
    'Europe/Tirane',
    'Europe/Tiraspol',
    'Europe/Ulyanovsk',
    'Europe/Uzhgorod',
    'Europe/Vaduz',
    'Europe/Vatican',
    'Europe/Vienna',
    'Europe/Vilnius',
    'Europe/Volgograd',
    'Europe/Warsaw',
    'Europe/Zagreb',
    'Europe/Zaporozhye',
    'Europe/Zurich',
    'GB',
    'GB-Eire',
    'GMT',
    'GMT+0',
    'GMT-0',
    'GMT0',
    'Greenwich',
    'HST',
    'Hongkong',
    'Iceland',
    'Indian/Antananarivo',
    'Indian/Chagos',
    'Indian/Christmas',
    'Indian/Cocos',
    'Indian/Comoro',
    'Indian/Kerguelen',
    'Indian/Mahe',
    'Indian/Maldives',
    'Indian/Mauritius',
    'Indian/Mayotte',
    'Indian/Reunion',
    'Iran',
    'Israel',
    'Jamaica',
    'Japan',
    'Kwajalein',
    'Libya',
    'MET',
    'MST',
    'MST7MDT',
    'Mexico/BajaNorte',
    'Mexico/BajaSur',
    'Mexico/General',
    'NZ',
    'NZ-CHAT',
    'Navajo',
    'PRC',
    'PST8PDT',
    'Pacific/Apia',
    'Pacific/Auckland',
    'Pacific/Bougainville',
    'Pacific/Chatham',
    'Pacific/Chuuk',
    'Pacific/Easter',
    'Pacific/Efate',
    'Pacific/Enderbury',
    'Pacific/Fakaofo',
    'Pacific/Fiji',
    'Pacific/Funafuti',
    'Pacific/Galapagos',
    'Pacific/Gambier',
    'Pacific/Guadalcanal',
    'Pacific/Guam',
    'Pacific/Honolulu',
    'Pacific/Johnston',
    'Pacific/Kiritimati',
    'Pacific/Kosrae',
    'Pacific/Kwajalein',
    'Pacific/Majuro',
    'Pacific/Marquesas',
    'Pacific/Midway',
    'Pacific/Nauru',
    'Pacific/Niue',
    'Pacific/Norfolk',
    'Pacific/Noumea',
    'Pacific/Pago_Pago',
    'Pacific/Palau',
    'Pacific/Pitcairn',
    'Pacific/Pohnpei',
    'Pacific/Ponape',
    'Pacific/Port_Moresby',
    'Pacific/Rarotonga',
    'Pacific/Saipan',
    'Pacific/Samoa',
    'Pacific/Tahiti',
    'Pacific/Tarawa',
    'Pacific/Tongatapu',
    'Pacific/Truk',
    'Pacific/Wake',
    'Pacific/Wallis',
    'Pacific/Yap',
    'Poland',
    'Portugal',
    'ROC',
    'ROK',
    'Singapore',
    'Turkey',
    'UCT',
    'US/Alaska',
    'US/Aleutian',
    'US/Arizona',
    'US/Central',
    'US/East-Indiana',
    'US/Eastern',
    'US/Hawaii',
    'US/Indiana-Starke',
    'US/Michigan',
    'US/Mountain',
    'US/Pacific',
    'US/Samoa',
    'UTC',
    'Universal',
    'W-SU',
    'WET',
    'Zulu'
);


--
-- Name: trend_query_run_frequency; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.trend_query_run_frequency AS ENUM (
    'daily',
    'weekly',
    'monthly',
    'quarterly',
    'biannually',
    'annually',
    'postgame'
);


--
-- Name: user_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_role AS ENUM (
    'member',
    'admin',
    'admin_editor'
);


--
-- Name: visitor_origin_name; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.visitor_origin_name AS ENUM (
    'alexa',
    'atheneum',
    'microsoftbot.cortana',
    'microsoftbot.emulator',
    'facebook',
    'google',
    'microsoftbot.skype',
    'slack',
    'tachikoma',
    'tachikoma.tv',
    'web',
    'microsoftbot.webchat',
    'web.bot',
    'web.googlebot',
    'web.statbot',
    'alexa.statmuse',
    'alexa.statmuse.bot',
    'alexa.matthewberry',
    'alexa.matthewberry.bot',
    'sportschat'
);


--
-- Name: crawl_page_should_refresh(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.crawl_page_should_refresh(url text, html text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  this_year integer := date_part('year', now());
  -- build a regex string like '(2018|2019)'
  re_two_year text := '(' ||
    array_to_string(array[
      this_year - 1,
      this_year
    ], '|') ||
  ')';
  -- build a regex string like '(2018|2019|2020)'
  re_three_year text := '(' ||
    array_to_string(array[
      this_year - 1,
      this_year,
      this_year + 1
    ], '|') ||
  ')';
begin
  if (
    (
      -- no paginated questions index urls
      url !~* '/questions\?.*(sid|page)='
    ) and
    (
      -- no game urls
      get_crawl_page_url_type(url) != 'game'
    ) and
    (
      -- no urls with seasonYear unless in range or active player
      url !~* 'seasonYear=' or
      url ~* ('seasonYear=' || re_three_year) or
      (
        url ~* 'splits?.*seasonYear=0' and (
        html is null or html ~* (
          'href="[^"]*/teams?/' || re_two_year || '-[^/]+/' || re_two_year
        ))
      )
    ) and
    (
      -- no team urls unless franchise or slug in year range
      get_crawl_page_url_type(url) != 'team' or
      url ~* 'franchise' or
      url ~* (
        '/teams?/' || re_three_year || '-[^/]+/' || re_three_year
      )
    ) and
    (
      -- player pages only based on html content
      get_crawl_page_url_type(url) != 'player' or
      html is null or (
        -- career-stats pages
        html ~* (
          'seasonYear=' || re_two_year
        ) or
        -- game-log pages
        html ~* (
          'href="[^"]*/games?/\d{1,2}-\d{1,2}-' || re_two_year || '-'
        ) or
        -- splits pages
        html ~* (
          'href="[^"]*/teams?/' || re_two_year || '-[^/]+/' || re_two_year
        )
      )
    )
  ) then
    return true;
  else
    return false;
  end if;
end;
$$;


--
-- Name: fib(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fib(fib_num integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
declare
  counter integer := 1;
  f1 integer := 0;
  f2 integer := 1;
begin
  -- raise error if fib_num is > 45
  if (fib_num > 45) then
    raise 'fib index out of range: %', fib_num
    using errcode = 'numeric_value_out_of_range';
  end if;

  if (fib_num < 0) then
    return 0;
  end if;

  while counter <= fib_num loop
    counter := counter + 1;
    select f2, f1 + f2 into f1, f2;
  end loop;

  -- 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, etc.
  return f1;
end;
$$;


--
-- Name: get_crawl_page_url_domain(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_crawl_page_url_domain(url text) RETURNS public.crawl_page_url_domain
    LANGUAGE plpgsql IMMUTABLE
    AS $_$
declare
  base text := '(?i)^https?://.*statmuse.com(?::\d{4}|)';
begin
  return (
    select lower(coalesce(
      -- /nba
      -- /nba/foo
      -- /nba?foo
      substring(url, (base || '/(mlb|nba|nfl|nhl)(?:$|/|\?)')),
      -- /ask?foo&d=nba
      -- /ask?d=nba&foo
      substring(url, (base || '/ask\?.*d=(mlb|nba|nfl|nhl)(?:$|&)'))
    ))
  );
end;
$_$;


--
-- Name: get_crawl_page_url_type(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_crawl_page_url_type(url text) RETURNS public.crawl_page_url_type
    LANGUAGE plpgsql IMMUTABLE
    AS $_$
declare
  base text := '^https?://.*statmuse.com(?::\d{4}|)';
begin
  if (
    -- /ask
    -- /ask/foo
    -- /ask?foo
    -- /nba/ask
    -- /nba/ask/foo
    -- /nba/ask?foo
    url ~* (base || '(/mlb|/nba|/nfl|/nhl|)/ask($|/|\?)')
  ) then
    return 'ask';
  elsif (
    -- /nba/game(s)
    -- /nba/game(s)/foo
    -- /nba/game(s)?foo
    url ~* (base || '/(mlb|nba|nfl|nhl)/games?($|/|\?)')
  ) then
    return 'game';
  elsif (
    -- /musings
    -- /musings/foo
    -- /musings?foo
    url ~* (base || '/musings($|/|\?)')
  ) then
    return 'musing';
  elsif (
    -- /nba/player(s)
    -- /nba/player(s)/foo
    -- /nba/player(s)?foo
    url ~* (base || '/(mlb|nba|nfl|nhl)/players?($|/|\?)')
  ) then
    return 'player';
  elsif (
    -- /questions
    -- /questions/foo
    -- /questions?foo
    -- /nba/questions
    -- /nba/questions/foo
    -- /nba/questions?foo
    url ~* (base || '(/mlb|/nba|/nfl|/nhl|)/questions($|/|\?)')
  ) then
    return 'question';
  elsif (
    -- /nba/team(s)
    -- /nba/team(s)/foo
    -- /nba/team(s)?foo
    url ~* (base || '/(mlb|nba|nfl|nhl)/teams?($|/|\?)')
  ) then
    return 'team';
  else
    return 'none';
  end if;
end;
$_$;


--
-- Name: inc_user_finance_approval_email_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.inc_user_finance_approval_email_count() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  if (TG_OP = 'INSERT') then
    if (
      NEW.finance_approved_at is not null and
      NEW.finance_approval_email_last_sent_at is not null
    ) then
      NEW.finance_approval_email_count = 1;
    end if;
  elsif (TG_OP = 'UPDATE') then
    if (
      NEW.finance_approved_at is not null and
      NEW.finance_approval_email_last_sent_at is not null and (
        OLD.finance_approval_email_last_sent_at is null or
        NEW.finance_approval_email_last_sent_at >
        OLD.finance_approval_email_last_sent_at
      )
    ) then
      NEW.finance_approval_email_count = OLD.finance_approval_email_count + 1;
    end if;
  end if;
  return NEW;
end;
$$;


--
-- Name: is_hex_code(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_hex_code(hex text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $_$
begin
  -- check if string is valid hex code, e.g. '#fff000'
  return ($1 ~* '#[a-z0-9]{6}');
end;
$_$;


--
-- Name: is_ip_address(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_ip_address(ip text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $_$
begin
  return ($1 = host(inet($1)));
exception
  when invalid_text_representation then
    return false;
end;
$_$;


--
-- Name: is_string_int(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_string_int(string_int text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $_$
begin
  -- check if string is equivalent to integer cast of itself
  return ($1::integer::text = $1);
exception
  when invalid_text_representation then
    return false;
end;
$_$;


--
-- Name: musing_seen_penalty(integer, timestamp without time zone, double precision, double precision); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.musing_seen_penalty(musing_seen_count integer DEFAULT 0, musing_last_seen_at timestamp without time zone DEFAULT NULL::timestamp without time zone, high_seen_penalty double precision DEFAULT 25.0, seen_count_multiplier double precision DEFAULT 1.25) RETURNS double precision
    LANGUAGE plpgsql IMMUTABLE
    AS $_$
declare
  interval_since_last_seen_bucket integer;
  seen_penalty double precision;
begin
  if (
    musing_seen_count = 0 or
    musing_seen_count is null or
    musing_last_seen_at is null
  ) then
    return 0;
  else
    select width_bucket(age(now(), musing_last_seen_at), array[
      interval '30 minutes',  -- 1
      interval '1 hour',      -- 2
      interval '1.5 hours',   -- 3
      interval '2 hours',     -- 4
      interval '2.5 hours',   -- 5
      interval '3 hours',     -- 6
      interval '3.5 hours',   -- 7
      interval '4 hours',     -- 8
      interval '4.5 hours',   -- 9
      interval '5 hours'      -- 10
    ]) + 1 into interval_since_last_seen_bucket;
    select (
      -- 25.0, 6.25, 2.7, 1.5, 1.0, 0.6, 0.5, 0.4, 0.3, 0.25
      ($3 / (interval_since_last_seen_bucket * interval_since_last_seen_bucket)) +
      (musing_seen_count * $4)
    ) into seen_penalty;

    return seen_penalty;
  end if;
end
$_$;


--
-- Name: musings_by_visitor_relevance(uuid, double precision, double precision, double precision, double precision, double precision, double precision, double precision); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.musings_by_visitor_relevance(visitor_id uuid, unrelated_weight double precision DEFAULT '-750.0'::numeric, editorial_boost double precision DEFAULT 1.25, high_seen_penalty double precision DEFAULT 25.0, seen_count_multiplier double precision DEFAULT 1.25, team_direct_points double precision DEFAULT 3.0, league_direct_points double precision DEFAULT 2.0, league_indirect_points double precision DEFAULT 1.25) RETURNS TABLE(id uuid, audio_answer_url public.citext, audio_answer_with_intro_url public.citext, audio_intro_url public.citext, author_id uuid, background_rgba jsonb, content_type public.musing_content_type, expired_early_at timestamp without time zone, expires_at timestamp without time zone, foreground_rgba jsonb, friendly_id public.citext, image_url public.citext, inserted_at timestamp without time zone, instagram_url public.citext, is_editorial boolean, is_pushable boolean, layout_type public.layout_types, league_id uuid, publish_at timestamp without time zone, question_id uuid, reaction_count integer, relevance_score_boost double precision, template_does_run_for_all_teams boolean, template_game_id uuid, template_id uuid, template_team_id uuid, text_markdown text, text_plain text, updated_at timestamp without time zone, video_should_replay boolean, video_url public.citext, visitor_id uuid, web_destination_url text, relevance_score double precision)
    LANGUAGE sql
    AS $_$
select
  m.id,
  m.audio_answer_url,
  m.audio_answer_with_intro_url,
  m.audio_intro_url,
  m.author_id,
  m.background_rgba,
  m.content_type,
  m.expired_early_at,
  m.expires_at,
  m.foreground_rgba,
  m.friendly_id,
  m.image_url,
  m.inserted_at,
  m.instagram_url,
  m.is_editorial,
  m.is_pushable,
  m.layout_type,
  m.league_id,
  m.publish_at,
  m.question_id,
  m.reaction_count,
  m.relevance_score_boost,
  m.template_does_run_for_all_teams,
  m.template_game_id,
  m.template_id,
  m.template_team_id,
  m.text_markdown,
  m.text_plain,
  m.updated_at,
  m.video_should_replay,
  m.video_url,
  m.visitor_id,
  m.web_destination_url,
  max(
    (case
      -- drop zero relevance to unrelated_weight
      when vmw.relevance_weight = 0 then $2
      else case
        -- maybe add editorial_boost
        when is_editorial = true then vmw.relevance_weight + $3
        else                          vmw.relevance_weight
      end
    end) -
    -- subtract seen_penalty
    musing_seen_penalty(
      musing_seen_count     := vsm.seen_count,
      musing_last_seen_at   := vsm.updated_at,
      high_seen_penalty     := $4,
      seen_count_multiplier := $5
    ) +
    -- add final relevance_score_boost
    m.relevance_score_boost
  ) as relevance_score
from musings as m
join visitor_musings_relevance_weights(
  visitor_id             := $1,
  team_direct_points     := $6,
  league_direct_points   := $7,
  league_indirect_points := $8
) as vmw
on vmw.musing_id = m.id
left join visitors_seen_musings as vsm
on
  vsm.musing_id = m.id and
  vsm.visitor_id = $1
where
  m.expires_at is not null
  and m.expires_at >= now()
  and m.publish_at is not null
  and now() >= m.publish_at
  and m.expired_early_at is null
  and m.question_id is not null
  and (
    m.content_type = 'original'
    or m.content_type = 'latest-stats'
    or m.content_type = 'templated'
  )
group by
  m.id,
  vmw.noise
order by
  relevance_score desc,
  vmw.noise desc;
$_$;


--
-- Name: notify_app_settings_changed(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_app_settings_changed() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  perform pg_notify(
    'app_settings_changed',
    json_build_object(
      'table', TG_TABLE_NAME,
      'operation', TG_OP,
      'record', row_to_json(NEW)
    )::text
  );

  return new;
end;
$$;


--
-- Name: preserve_ask_pins(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.preserve_ask_pins() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  if (NEW.is_in_index_pin is not null) then
    NEW.is_in_index = NEW.is_in_index_pin;
  end if;

  if (NEW.is_in_suggests_pin is not null) then
    NEW.is_in_suggests = NEW.is_in_suggests_pin;
  end if;

  return NEW;
end;
$$;


--
-- Name: set_game_has_just_completed(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_game_has_just_completed() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ begin
  if (NEW.status = 'Completed' and OLD.status <> 'Completed') THEN
    NEW.has_just_completed = true;
  else
    NEW.has_just_completed = false;
  end if;
  return NEW;
end;
$$;


--
-- Name: set_status_transition(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_status_transition() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ begin
  if (TG_OP = 'INSERT') then
    NEW.status_transition = array[NEW.status];
  elsif (TG_OP = 'UPDATE') then
    NEW.status_transition = array[OLD.status, NEW.status];
  end if;
  return NEW;
end;
$$;


--
-- Name: update_crawl_page(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_crawl_page() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  if (TG_OP = 'INSERT') then
    if (NEW.did_just_crawl is true) then
      NEW.crawl_count = 1;
      NEW.expires_at = NEW.inserted_at + interval '1 day';
      NEW.last_changed_at = NEW.inserted_at;
      NEW.last_crawled_at = NEW.inserted_at;
      NEW.crawl_history_crawled_at = array[NEW.last_crawled_at];
      NEW.crawl_history_fetch_ms = array[NEW.last_crawl_fetch_ms];
      NEW.crawl_history_similarity = array[null];
      NEW.crawl_history_status = array[NEW.last_crawl_status];
    else
      -- set to null since these are only valid for a crawl
      NEW.last_crawl_error = null;
      NEW.last_crawl_fetch_ms = null;
      NEW.last_crawl_html = null;
      NEW.last_crawl_mode = null;
      NEW.last_crawl_status = null;
    end if;
  elsif (TG_OP = 'UPDATE') then
    if (NEW.did_just_crawl is true) then
      NEW.crawl_count = OLD.crawl_count + 1;
      NEW.last_crawled_at = NEW.updated_at;
      NEW.last_crawl_similarity = similarity(
        OLD.last_crawl_html,
        NEW.last_crawl_html
      );
      if (NEW.last_crawl_similarity = 1.0) then
        NEW.html_unchanged_count = OLD.html_unchanged_count + 1;
        NEW.expires_at = NEW.updated_at + (
          -- 2, 3, 5, 8, 13, 21, 34, 55, 89, 144 or max 233 days from now.
          fib(least(NEW.html_unchanged_count + 2, 13)) || ' day'
        )::interval;
        NEW.last_changed_at = OLD.last_changed_at;
      else
        NEW.expires_at = NEW.updated_at + interval '1 day';
        NEW.html_unchanged_count = 0;
        NEW.last_changed_at = NEW.updated_at;
      end if;
      NEW.crawl_history_crawled_at = (array_prepend(
        NEW.last_crawled_at,
        OLD.crawl_history_crawled_at
      ))[1:5];
      NEW.crawl_history_fetch_ms = (array_prepend(
        NEW.last_crawl_fetch_ms,
        OLD.crawl_history_fetch_ms
      ))[1:5];
      NEW.crawl_history_similarity = (array_prepend(
        NEW.last_crawl_similarity,
        OLD.crawl_history_similarity
      ))[1:5];
      NEW.crawl_history_status = (array_prepend(
        NEW.last_crawl_status,
        OLD.crawl_history_status
      ))[1:5];
    else
      -- set to old values to avoid nullifying last crawl results
      NEW.last_crawl_error = OLD.last_crawl_error;
      NEW.last_crawl_fetch_ms = OLD.last_crawl_fetch_ms;
      NEW.last_crawl_html = OLD.last_crawl_html;
      NEW.last_crawl_mode = OLD.last_crawl_mode;
      NEW.last_crawl_status = OLD.last_crawl_status;
    end if;
  end if;
  NEW.should_refresh = crawl_page_should_refresh(NEW.url, NEW.last_crawl_html);
  NEW.url_domain = get_crawl_page_url_domain(NEW.url);
  NEW.url_type = get_crawl_page_url_type(NEW.url);
  -- don't store html when should_refresh is false or question and ask urls
  if (
    NEW.should_refresh is false or
    NEW.url_type in ('ask', 'question')
  ) then
    NEW.last_crawl_html = null;
  end if;
  return NEW;
end;
$$;


--
-- Name: update_game_musing_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_game_musing_count() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ begin
  if (TG_OP = 'DELETE') then
    update games
    set musing_count = musing_count - 1
    where id = OLD.template_game_id
    and musing_count > 0;
    return OLD;
  elsif (TG_OP = 'INSERT') then
    update games
    set musing_count = musing_count + 1
    where id = NEW.template_game_id;
    return NEW;
  end if;
end;
$$;


--
-- Name: update_reaction_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_reaction_count() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ begin
  if (TG_OP = 'DELETE') then
    if (OLD.reactable_type = 'musing') then
      update musings
      set reaction_count = reaction_count - 1
      where id = OLD.musing_id
      and reaction_count > 0;
    elsif (OLD.reactable_type = 'story') then
      update stories
      set reaction_count = reaction_count - 1
      where id = OLD.story_id
      and reaction_count > 0;
    end if;
    return OLD;
  elsif (TG_OP = 'INSERT') then
    if (NEW.reactable_type = 'musing') then
      update musings
      set reaction_count = reaction_count + 1
      where id = NEW.musing_id;
    elsif (NEW.reactable_type = 'story') then
      update stories
      set reaction_count = reaction_count + 1
      where id = NEW.story_id;
    end if;
    return NEW;
  end if;
end;
$$;


--
-- Name: update_story_line_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_story_line_count() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ BEGIN
  IF (TG_OP = 'DELETE') THEN
    UPDATE stories
    SET line_count = line_count - 1
    WHERE id = OLD.story_id
    AND line_count > 0;
    RETURN OLD;
  ELSIF (TG_OP = 'INSERT') THEN
    UPDATE stories
    SET line_count = line_count + 1
    WHERE id = NEW.story_id;
    RETURN NEW;
  END IF;
END;
$$;


--
-- Name: update_template_musing_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_template_musing_count() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ BEGIN
  IF (TG_OP = 'DELETE') THEN
    UPDATE templates
    SET musing_count = musing_count - 1
    WHERE id = OLD.template_id
    AND musing_count > 0;
    RETURN OLD;
  ELSIF (TG_OP = 'INSERT') THEN
    UPDATE templates
    SET musing_count = musing_count + 1
    WHERE id = NEW.template_id;
    RETURN NEW;
  END IF;
END;
$$;


--
-- Name: update_user_follow_counts(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_user_follow_counts() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ BEGIN
  IF (TG_OP = 'DELETE') THEN
    UPDATE users
    SET follower_count = follower_count - 1
    WHERE id = OLD.followed_id
    AND follower_count > 0;

    UPDATE users
    SET following_count = following_count - 1
    WHERE id = OLD.follower_id
    AND following_count > 0;

    RETURN OLD;
  ELSIF (TG_OP = 'INSERT') THEN
    UPDATE users
    SET follower_count = follower_count + 1
    WHERE id = NEW.followed_id;

    UPDATE users
    SET following_count = following_count + 1
    WHERE id = NEW.follower_id;

    RETURN NEW;
  END IF;
END;
$$;


--
-- Name: update_user_question_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_user_question_count() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ BEGIN
  IF (TG_OP = 'DELETE') THEN
    UPDATE users
    SET question_count = question_count - 1
    WHERE id = OLD.user_id
    AND question_count > 0;
    RETURN OLD;
  ELSIF (TG_OP = 'INSERT') THEN
    UPDATE users
    SET question_count = question_count + 1
    WHERE id = NEW.user_id;
    RETURN NEW;
  END IF;
END;
$$;


--
-- Name: update_visitor(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_visitor() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ begin
  if (TG_OP = 'INSERT') then
    NEW.last_request_ids = array_remove(
      array[NEW.last_request_id],
      null
    );
  elsif (TG_OP = 'UPDATE') then
    NEW.last_request_ids = array_remove(
      (array_prepend(
        NEW.last_request_id,
        OLD.last_request_ids
      ))[1:5],
      null
    );
  end if;
  return NEW;
end;
$$;


--
-- Name: uppercase_team_abbrev(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.uppercase_team_abbrev() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  NEW.abbrev = upper(NEW.abbrev);
  return NEW;
end;
$$;


--
-- Name: upsert_asks_users(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.upsert_asks_users() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  if (NEW.last_user_id is not null) then
    insert into asks_users (
      ask_id,
      user_id,
      last_asked_at,
      inserted_at,
      updated_at
    ) values (
      NEW.id,
      NEW.last_user_id,
      now(),
      now(),
      now()
    )
    on conflict (ask_id, user_id)
    do update set
      last_asked_at = EXCLUDED.last_asked_at,
      ask_count = asks_users.ask_count + 1,
      updated_at = now();
  end if;

  return NEW;
end;
$$;


--
-- Name: upsert_finance_asks_users(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.upsert_finance_asks_users() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  if (NEW.last_user_id is not null) then
    insert into finance_asks_users (
      finance_ask_id,
      user_id,
      last_asked_at,
      inserted_at,
      updated_at
    ) values (
      NEW.id,
      NEW.last_user_id,
      now(),
      now(),
      now()
    )
    on conflict (finance_ask_id, user_id)
    do update set
      last_asked_at = EXCLUDED.last_asked_at,
      ask_count = finance_asks_users.ask_count + 1,
      updated_at = now();
  end if;

  return NEW;
end;
$$;


--
-- Name: visitor_musings_relevance_weights(uuid, double precision, double precision, double precision); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.visitor_musings_relevance_weights(visitor_id uuid, team_direct_points double precision DEFAULT 3.0, league_direct_points double precision DEFAULT 2.0, league_indirect_points double precision DEFAULT 1.25) RETURNS TABLE(musing_id uuid, relevance_weight double precision, noise double precision)
    LANGUAGE sql
    AS $_$
select
  distinct on (m.id)
  m.id as musing_id,
  sum(
    case
      when vfa.type = 'team_direct' then $2
      when vfa.type = 'league_direct' then case
        when m.template_does_run_for_all_teams = true then 0
        else $3
      end
      when vfa.type = 'league_indirect' then case
        when m.template_does_run_for_all_teams then 0
        else $4
      end
      else 0
    end
  )::double precision as relevance_weight,
  random() as noise
from musings as m
join musings_related_actors as mra
on mra.musing_id = m.id
left join visitors_favorite_actors as vfa
on
  vfa.gamera_actor_id = mra.gamera_actor_id
  and vfa.visitor_id = $1
where
  m.expires_at is not null
  and m.expires_at >= now()
  and m.publish_at is not null
  and now() >= m.publish_at
  and m.expired_early_at is null
  and m.question_id is not null
  and (
    m.content_type = 'original'
    or m.content_type = 'latest-stats'
    or m.content_type = 'templated'
  )
group by m.id;
$_$;


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: ad_geo_countries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ad_geo_countries (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    country_code public.citext NOT NULL,
    country_name public.citext,
    has_real_money_gambling boolean NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    CONSTRAINT country_code_length CHECK ((length((country_code)::text) = 2))
);


--
-- Name: ad_geo_states; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ad_geo_states (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    state_code public.citext,
    state_name public.citext NOT NULL,
    has_real_money_gambling boolean NOT NULL,
    ad_geo_country_id uuid NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: ad_geo_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ad_geo_tags (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name public.citext NOT NULL,
    html public.citext,
    size_width integer,
    size_height integer NOT NULL,
    ad_geo_country_id uuid,
    ad_geo_state_id uuid,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    is_enabled boolean DEFAULT true NOT NULL,
    client_device public.client_device,
    domain public.ad_domain,
    target_placements character varying(255)[],
    match_points_boost double precision DEFAULT 0.0 NOT NULL
);


--
-- Name: ad_geo_tags_countries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ad_geo_tags_countries (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    filter public.allow_deny DEFAULT 'allow'::public.allow_deny NOT NULL,
    ad_geo_tag_id uuid NOT NULL,
    ad_geo_country_id uuid NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: ad_geo_tags_states; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ad_geo_tags_states (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    ad_geo_tag_id uuid NOT NULL,
    ad_geo_state_id uuid NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    filter public.allow_deny DEFAULT 'allow'::public.allow_deny NOT NULL
);


--
-- Name: ad_geo_urls; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ad_geo_urls (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    path public.citext NOT NULL,
    ad_geo_tag_id uuid NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: app_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.app_settings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    kv jsonb NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    CONSTRAINT app_settings_key_is_valid CHECK (((kv ? 'key'::text) AND ((kv ->> 'key'::text) IS NOT NULL) AND ((kv ->> 'key'::text) ~ '^[a-z]+'::text))),
    CONSTRAINT app_settings_value_is_valid CHECK (((kv ? 'value'::text) AND ((kv -> 'value'::text) IS NOT NULL)))
);


--
-- Name: CONSTRAINT app_settings_key_is_valid ON app_settings; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON CONSTRAINT app_settings_key_is_valid ON public.app_settings IS 'key is non-null string';


--
-- Name: CONSTRAINT app_settings_value_is_valid ON app_settings; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON CONSTRAINT app_settings_value_is_valid ON public.app_settings IS 'value is non-null';


--
-- Name: ask_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ask_events (
    id uuid NOT NULL,
    query_raw text NOT NULL,
    conversation_token text,
    ask_id uuid NOT NULL,
    user_id uuid,
    visitor_id uuid,
    question_id uuid,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: ask_suggests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ask_suggests (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    domain public.citext NOT NULL,
    query public.citext NOT NULL,
    count integer DEFAULT 1 NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: ask_updates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ask_updates (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    ask_sid integer NOT NULL,
    next_update_allowed_at timestamp without time zone,
    update_count integer DEFAULT 1 NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: asks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.asks (
    id uuid NOT NULL,
    sid integer,
    query public.citext NOT NULL,
    answer jsonb,
    answer_type public.ask_answer,
    is_legacy_answer boolean NOT NULL,
    count_total integer DEFAULT 1 NOT NULL,
    prompt jsonb,
    error jsonb,
    player_bio jsonb,
    team_franchise_bio jsonb,
    team_season_bio jsonb,
    context_id uuid NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    is_fantasy_query boolean NOT NULL,
    is_game_odds_query boolean,
    last_visitor_id uuid,
    is_in_index boolean NOT NULL,
    last_user_id uuid,
    answer_html text,
    count_web_search integer DEFAULT 0,
    count_web_view integer DEFAULT 0,
    hex_background character varying(7),
    hex_foreground character varying(7),
    image_url text,
    is_in_index_pin boolean,
    is_in_suggests boolean NOT NULL,
    is_in_suggests_pin boolean,
    last_web_search_at timestamp without time zone,
    resource_path text,
    resource_query text,
    answer_text text
);


--
-- Name: COLUMN asks.count_web_search; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.asks.count_web_search IS 'added 2020-08';


--
-- Name: COLUMN asks.count_web_view; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.asks.count_web_view IS 'added 2020-08';


--
-- Name: asks_sid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.asks_sid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: asks_sid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.asks_sid_seq OWNED BY public.asks.sid;


--
-- Name: asks_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.asks_users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    ask_id uuid NOT NULL,
    user_id uuid NOT NULL,
    ask_count integer DEFAULT 1 NOT NULL,
    last_asked_at timestamp without time zone NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: contacts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contacts (
    id uuid NOT NULL,
    phone public.citext,
    welcome_sms_response jsonb,
    welcome_sms_response_has_error boolean,
    welcome_sms_sent_at timestamp without time zone,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    CONSTRAINT check_phone_length CHECK (((phone IS NULL) OR ((length(public.regexp_replace(phone, '\D'::public.citext, ''::text, 'g'::text)) >= 4) AND (length(public.regexp_replace(phone, '\D'::public.citext, ''::text, 'g'::text)) <= 20))))
);


--
-- Name: contexts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contexts (
    id uuid NOT NULL,
    name public.citext NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: crawl_pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.crawl_pages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    did_just_crawl boolean NOT NULL,
    url text NOT NULL,
    last_crawl_html text,
    last_crawl_error text,
    last_crawl_fetch_ms integer,
    last_crawl_status integer,
    crawl_count integer DEFAULT 0 NOT NULL,
    crawl_history_crawled_at timestamp without time zone[] DEFAULT ARRAY[]::timestamp without time zone[] NOT NULL,
    crawl_history_fetch_ms integer[] DEFAULT ARRAY[]::integer[] NOT NULL,
    crawl_history_similarity double precision[] DEFAULT ARRAY[]::double precision[] NOT NULL,
    crawl_history_status integer[] DEFAULT ARRAY[]::integer[] NOT NULL,
    last_crawl_similarity double precision,
    last_crawled_at timestamp without time zone,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    last_changed_at timestamp without time zone,
    expires_at timestamp without time zone,
    html_unchanged_count integer DEFAULT 0 NOT NULL,
    should_refresh boolean DEFAULT true NOT NULL,
    last_crawl_mode public.crawl_mode,
    url_domain public.crawl_page_url_domain,
    url_type public.crawl_page_url_type,
    last_seen_at_url text,
    CONSTRAINT crawl_pages_absolute_last_seen_at_url CHECK (((last_seen_at_url IS NULL) OR (last_seen_at_url ~ '^https?://.*'::text))),
    CONSTRAINT crawl_pages_absolute_url CHECK ((url ~ '^https?://.*'::text))
);


--
-- Name: devices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.devices (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    device_token text NOT NULL,
    visitor_id uuid NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    device_name public.device_name NOT NULL
);


--
-- Name: examples; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.examples (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    conversation_token text,
    is_published boolean NOT NULL,
    "position" integer DEFAULT 0 NOT NULL,
    text public.citext NOT NULL,
    type public.example_type NOT NULL,
    author_id uuid,
    league_id uuid NOT NULL,
    previous_question_id uuid,
    question_id uuid,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    template_id uuid
);


--
-- Name: finance_ask_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.finance_ask_events (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    query_raw text NOT NULL,
    finance_ask_id uuid NOT NULL,
    user_id uuid,
    visitor_id uuid,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: finance_asks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.finance_asks (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    sid integer,
    answer jsonb,
    answer_text text,
    answer_type public.finance_ask_answer,
    count_total integer DEFAULT 1 NOT NULL,
    count_web_search integer DEFAULT 0 NOT NULL,
    count_web_view integer DEFAULT 0 NOT NULL,
    is_in_index_pin boolean,
    is_in_index boolean,
    is_in_suggests_pin boolean,
    is_in_suggests boolean,
    last_web_search_at timestamp without time zone,
    query public.citext NOT NULL,
    last_user_id uuid,
    last_visitor_id uuid,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    asset jsonb
);


--
-- Name: finance_asks_sid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.finance_asks_sid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: finance_asks_sid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.finance_asks_sid_seq OWNED BY public.finance_asks.sid;


--
-- Name: finance_asks_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.finance_asks_users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    finance_ask_id uuid NOT NULL,
    user_id uuid NOT NULL,
    ask_count integer DEFAULT 1 NOT NULL,
    last_asked_at timestamp without time zone NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: follows; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.follows (
    id uuid NOT NULL,
    follower_id uuid NOT NULL,
    followed_id uuid NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: games; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.games (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    sportradar_game_id text NOT NULL,
    musing_count integer DEFAULT 0 NOT NULL,
    starts_at timestamp without time zone NOT NULL,
    status public.game_status NOT NULL,
    status_transition public.game_status[] DEFAULT ARRAY[]::public.game_status[] NOT NULL,
    home_team_id uuid NOT NULL,
    away_team_id uuid NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    has_just_completed boolean DEFAULT false NOT NULL,
    CONSTRAINT status_transition CHECK ((cardinality(status_transition) <= 2))
);


--
-- Name: identities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.identities (
    id uuid NOT NULL,
    provider character varying(255) NOT NULL,
    access_token character varying(255) NOT NULL,
    token_type character varying(255),
    expires_at timestamp without time zone,
    scope character varying(255),
    uid character varying(255) NOT NULL,
    email public.citext,
    username character varying(255),
    name character varying(255) NOT NULL,
    avatar_url text,
    avatar_width integer,
    avatar_height integer,
    user_id uuid NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    access_token_secret character varying(255),
    CONSTRAINT provider_allowed CHECK (((provider)::text = ANY ((ARRAY['facebook'::character varying, 'google'::character varying, 'twitter'::character varying])::text[])))
);


--
-- Name: images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.images (
    id uuid NOT NULL,
    url character varying(255),
    title character varying(255),
    user_id uuid NOT NULL,
    context_id uuid,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: ip_geos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ip_geos (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    ip text NOT NULL,
    city_name public.citext,
    country_code public.citext,
    state_code public.citext,
    state_name public.citext,
    timezone_name public.timezone_name,
    request_count integer DEFAULT 1 NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    country_name public.citext,
    CONSTRAINT ip_is_valid CHECK (public.is_ip_address(ip))
);


--
-- Name: leagues; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.leagues (
    id uuid NOT NULL,
    gamera_actor_id text NOT NULL,
    begin_year integer,
    end_year integer,
    name public.citext NOT NULL,
    image_url text NOT NULL,
    example_musing_id uuid,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    CONSTRAINT leagues_begin_year_range CHECK (((begin_year IS NULL) OR ((begin_year >= 1800) AND (begin_year <= 2999)))),
    CONSTRAINT leagues_end_year_range CHECK (((begin_year IS NULL) OR ((begin_year >= 1800) AND (begin_year <= 2999))))
);


--
-- Name: links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.links (
    id uuid NOT NULL,
    short_code character varying(255) NOT NULL,
    story_id uuid,
    linkable_type public.link_linkable NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    image_id uuid,
    question_id uuid,
    musing_id uuid,
    ask_id uuid,
    url text,
    finance_ask_id uuid,
    CONSTRAINT linkable_type_fkey CHECK ((((linkable_type = 'ask'::public.link_linkable) AND (ask_id IS NOT NULL)) OR ((linkable_type = 'finance_ask'::public.link_linkable) AND (finance_ask_id IS NOT NULL)) OR ((linkable_type = 'image'::public.link_linkable) AND (image_id IS NOT NULL)) OR ((linkable_type = 'musing'::public.link_linkable) AND (musing_id IS NOT NULL)) OR ((linkable_type = 'question'::public.link_linkable) AND (question_id IS NOT NULL)) OR ((linkable_type = 'story'::public.link_linkable) AND (story_id IS NOT NULL)) OR ((linkable_type = 'url'::public.link_linkable) AND (url ~ '^https?://.*'::text))))
);


--
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages (
    id uuid NOT NULL,
    text text NOT NULL,
    type public.message_type NOT NULL,
    user_id uuid,
    question_id uuid,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    musing_id uuid,
    visitor_id uuid,
    CONSTRAINT type_musing_id_fkey CHECK ((((type = 'musing'::public.message_type) AND (musing_id IS NOT NULL)) OR (musing_id IS NULL))),
    CONSTRAINT type_question_id_fkey CHECK (((((type = 'query'::public.message_type) OR (type = 'info'::public.message_type)) AND (question_id IS NULL)) OR (((type = 'answer'::public.message_type) OR (type = 'prompt'::public.message_type)) AND (question_id IS NOT NULL)) OR ((type = 'error'::public.message_type) OR (type = 'musing'::public.message_type))))
);


--
-- Name: musings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.musings (
    id uuid NOT NULL,
    layout_type public.layout_types NOT NULL,
    text_markdown text NOT NULL,
    image_url public.citext,
    video_url public.citext,
    audio_answer_url public.citext,
    video_should_replay boolean DEFAULT false NOT NULL,
    foreground_rgba jsonb,
    background_rgba jsonb,
    author_id uuid,
    question_id uuid,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    is_editorial boolean DEFAULT false NOT NULL,
    visitor_id uuid,
    expires_at timestamp without time zone,
    template_id uuid,
    expired_early_at timestamp without time zone,
    relevance_score_boost double precision DEFAULT 0.0 NOT NULL,
    template_does_run_for_all_teams boolean DEFAULT false NOT NULL,
    audio_intro_url public.citext,
    reaction_count integer DEFAULT 0 NOT NULL,
    template_game_id uuid,
    template_team_id uuid,
    is_pushable boolean DEFAULT false NOT NULL,
    friendly_id public.citext,
    audio_answer_with_intro_url public.citext,
    content_type public.musing_content_type NOT NULL,
    league_id uuid,
    publish_at timestamp without time zone NOT NULL,
    text_plain text,
    instagram_url public.citext,
    web_destination_url text,
    happened_on date,
    CONSTRAINT audio_intro_requires_audio CHECK (((audio_intro_url IS NULL) OR (audio_answer_url IS NOT NULL))),
    CONSTRAINT can_editorialize CHECK (((is_editorial = false) OR (author_id IS NOT NULL))),
    CONSTRAINT daily_stats_require_happened_on CHECK (((content_type <> 'daily-stats'::public.musing_content_type) OR (happened_on IS NOT NULL))),
    CONSTRAINT editorials_require_expiration CHECK (((is_editorial = false) OR (expires_at IS NOT NULL))),
    CONSTRAINT friendly_id_spec CHECK (((friendly_id IS NULL) OR ((friendly_id OPERATOR(public.~) '^[a-z0-9\-]+-[a-z0-9]{8}$'::public.citext) AND ((length((friendly_id)::text) >= (12 + 9)) AND (length((friendly_id)::text) <= (72 + 9)))))),
    CONSTRAINT is_editorial_has_league_id CHECK (((is_editorial IS FALSE) OR (league_id IS NOT NULL))),
    CONSTRAINT primary_media_url CHECK (((image_url IS NOT NULL) OR (video_url IS NOT NULL))),
    CONSTRAINT templated_require_expiration CHECK (((template_id IS NULL) OR (expires_at IS NOT NULL))),
    CONSTRAINT validate_background_rgba CHECK (((background_rgba IS NULL) OR (((background_rgba ->> 'r'::text) IS NOT NULL) AND (((background_rgba ->> 'r'::text))::integer >= 0) AND (((background_rgba ->> 'r'::text))::integer <= 255) AND ((background_rgba ->> 'g'::text) IS NOT NULL) AND (((background_rgba ->> 'g'::text))::integer >= 0) AND (((background_rgba ->> 'g'::text))::integer <= 255) AND ((background_rgba ->> 'b'::text) IS NOT NULL) AND (((background_rgba ->> 'b'::text))::integer >= 0) AND (((background_rgba ->> 'b'::text))::integer <= 255) AND ((background_rgba ->> 'a'::text) IS NOT NULL) AND (((background_rgba ->> 'a'::text))::numeric >= 0.0) AND (((background_rgba ->> 'a'::text))::numeric <= 1.0)))),
    CONSTRAINT validate_bg_and_fg_rgb CHECK ((((background_rgba ->> 'r'::text) <> (foreground_rgba ->> 'r'::text)) OR ((background_rgba ->> 'g'::text) <> (foreground_rgba ->> 'g'::text)) OR ((background_rgba ->> 'b'::text) <> (foreground_rgba ->> 'b'::text)))),
    CONSTRAINT validate_foreground_rgba CHECK (((foreground_rgba IS NULL) OR (((foreground_rgba ->> 'r'::text) IS NOT NULL) AND (((foreground_rgba ->> 'r'::text))::integer >= 0) AND (((foreground_rgba ->> 'r'::text))::integer <= 255) AND ((foreground_rgba ->> 'g'::text) IS NOT NULL) AND (((foreground_rgba ->> 'g'::text))::integer >= 0) AND (((foreground_rgba ->> 'g'::text))::integer <= 255) AND ((foreground_rgba ->> 'b'::text) IS NOT NULL) AND (((foreground_rgba ->> 'b'::text))::integer >= 0) AND (((foreground_rgba ->> 'b'::text))::integer <= 255) AND ((foreground_rgba ->> 'a'::text) IS NOT NULL) AND (((foreground_rgba ->> 'a'::text))::numeric >= 0.0) AND (((foreground_rgba ->> 'a'::text))::numeric <= 1.0)))),
    CONSTRAINT video_is_replayable CHECK ((((video_url IS NULL) AND (NOT video_should_replay)) OR (video_url IS NOT NULL)))
);


--
-- Name: musings_related_actors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.musings_related_actors (
    id uuid NOT NULL,
    gamera_actor_id text NOT NULL,
    year integer,
    musing_id uuid NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    type public.musing_related_actor_type,
    CONSTRAINT musings_related_actors_year_range CHECK (((year IS NULL) OR ((year >= 1800) AND (year <= 2999))))
);


--
-- Name: notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notes (
    id uuid NOT NULL,
    title character varying(255),
    text text NOT NULL,
    user_id uuid NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: players; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.players (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    background_color_hex character varying(7),
    bust_image_url text,
    first_name text NOT NULL,
    foreground_color_hex character varying(7),
    last_name text NOT NULL,
    resource_id text NOT NULL,
    resource_path text NOT NULL,
    used_name text NOT NULL,
    league_id uuid NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.questions (
    id uuid NOT NULL,
    caption text,
    config jsonb,
    text text NOT NULL,
    answer jsonb,
    is_successful boolean DEFAULT false NOT NULL,
    data_last_updated_at timestamp without time zone,
    duration integer,
    error text,
    handler text,
    preprocessed text,
    tokenized text,
    context_id uuid NOT NULL,
    user_id uuid,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    error_message text,
    text_clarification_for text,
    visitor_id uuid,
    sid integer NOT NULL,
    friendly_id public.citext,
    ask_url text,
    input_conversation_token text,
    CONSTRAINT friendly_id_spec CHECK (((friendly_id IS NULL) OR ((friendly_id OPERATOR(public.~) '^[a-z0-9\-]+-[a-z0-9]{8}$'::public.citext) AND ((length((friendly_id)::text) >= (12 + 9)) AND (length((friendly_id)::text) <= (72 + 9))))))
);


--
-- Name: questions_sid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.questions_sid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: questions_sid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.questions_sid_seq OWNED BY public.questions.sid;


--
-- Name: reactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reactions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    story_id uuid,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    reaction_type public.reaction NOT NULL,
    reactable_type public.reactable NOT NULL,
    visitor_id uuid,
    musing_id uuid,
    CONSTRAINT one_reactor CHECK (((user_id IS NOT NULL) OR (visitor_id IS NOT NULL))),
    CONSTRAINT reactable_type_fkey CHECK ((((reactable_type = 'musing'::public.reactable) AND (musing_id IS NOT NULL) AND (story_id IS NULL)) OR ((reactable_type = 'story'::public.reactable) AND (musing_id IS NULL) AND (story_id IS NOT NULL))))
);


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id uuid NOT NULL,
    auth_token character varying(255) NOT NULL,
    revoked_at timestamp without time zone,
    user_id uuid NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    csrf_token character varying(255) NOT NULL
);


--
-- Name: slack_workspaces; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.slack_workspaces (
    id uuid NOT NULL,
    team_id character varying(255),
    team_name text,
    access_token character varying(255),
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    bot_user_id character varying(255),
    scope character varying(255)
);


--
-- Name: stories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stories (
    id uuid NOT NULL,
    title character varying(255),
    user_id uuid NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    reaction_count integer DEFAULT 0 NOT NULL,
    tags character varying(255)[] DEFAULT ARRAY[]::character varying[] NOT NULL,
    line_count integer DEFAULT 0 NOT NULL
);


--
-- Name: story_lines; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.story_lines (
    id uuid NOT NULL,
    story_id uuid NOT NULL,
    "position" integer NOT NULL,
    story_lineable_type character varying(255) NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    note_id uuid,
    image_id uuid,
    question_id uuid,
    CONSTRAINT story_lineable_type_allowed CHECK (((story_lineable_type)::text = ANY ((ARRAY['image'::character varying, 'note'::character varying, 'question'::character varying])::text[]))),
    CONSTRAINT story_lineable_type_fkey CHECK (((((story_lineable_type)::text = 'image'::text) AND (image_id IS NOT NULL) AND (note_id IS NULL) AND (question_id IS NULL)) OR (((story_lineable_type)::text = 'note'::text) AND (image_id IS NULL) AND (note_id IS NOT NULL) AND (question_id IS NULL)) OR (((story_lineable_type)::text = 'question'::text) AND (image_id IS NULL) AND (note_id IS NULL) AND (question_id IS NOT NULL))))
);


--
-- Name: teams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.teams (
    id uuid NOT NULL,
    gamera_actor_id text,
    begin_year integer NOT NULL,
    end_year integer NOT NULL,
    name public.citext NOT NULL,
    image_url text,
    league_id uuid NOT NULL,
    example_musing_id uuid,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    nickname public.citext,
    gamera_team_id text NOT NULL,
    abbrev public.citext,
    is_active boolean DEFAULT true NOT NULL
);


--
-- Name: template_reports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.template_reports (
    id uuid NOT NULL,
    run_digest jsonb,
    template_id uuid NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    run_started_at timestamp without time zone,
    run_completed_at timestamp without time zone
);


--
-- Name: templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.templates (
    id uuid NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    query public.citext NOT NULL,
    run_count integer DEFAULT 0 NOT NULL,
    run_last_at timestamp without time zone,
    run_frequency public.template_run_frequency NOT NULL,
    league_id uuid NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    musing_count integer DEFAULT 0 NOT NULL,
    relevance_score_boost double precision DEFAULT 0.0 NOT NULL,
    does_run_for_all_teams boolean DEFAULT false NOT NULL,
    CONSTRAINT does_run_for_all_teams_false CHECK (((does_run_for_all_teams = true) OR (query OPERATOR(public.!~) '.*\$\{TEAM_NAME\}.*'::public.citext))),
    CONSTRAINT does_run_for_all_teams_true CHECK (((does_run_for_all_teams = false) OR (query OPERATOR(public.~) '.*\$\{TEAM_NAME\}.*'::public.citext))),
    CONSTRAINT run_frequency_game_query CHECK (((run_frequency <> ALL (ARRAY['post_game'::public.template_run_frequency, 'during_game'::public.template_run_frequency])) OR (query OPERATOR(public.~) '.*\$\{TEAM_NAME\}.*'::public.citext)))
);


--
-- Name: trend_queries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trend_queries (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    description public.citext NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    run_count integer DEFAULT 0 NOT NULL,
    run_frequency public.trend_query_run_frequency NOT NULL,
    run_last_at timestamp without time zone,
    sql public.citext NOT NULL,
    league_id uuid NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: trends; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trends (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    result jsonb NOT NULL,
    trend_query_id uuid NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    username public.citext NOT NULL,
    email public.citext,
    password_hash character varying(255),
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    avatar_url character varying(255),
    email_confirm_token character varying(255) NOT NULL,
    email_confirmed_at timestamp without time zone,
    follower_count integer DEFAULT 0 NOT NULL,
    following_count integer DEFAULT 0 NOT NULL,
    has_completed_signup boolean DEFAULT true NOT NULL,
    email_confirm_sent_at timestamp without time zone,
    sign_in_token character varying(255),
    sign_in_token_created_at timestamp without time zone,
    email_welcome_sent_at timestamp without time zone,
    preferences jsonb,
    question_count integer DEFAULT 0 NOT NULL,
    display_name public.citext,
    phone_number public.citext,
    role public.user_role DEFAULT 'member'::public.user_role NOT NULL,
    tos_accepted_at timestamp without time zone DEFAULT timezone('utc'::text, now()),
    timezone_name public.timezone_name DEFAULT 'America/Los_Angeles'::public.timezone_name NOT NULL,
    feature_flags jsonb,
    referral_code public.citext,
    referrer_id uuid,
    finance_approved_at timestamp without time zone,
    finance_joined_at timestamp without time zone,
    finance_approval_email_count integer DEFAULT 0,
    finance_approval_email_last_sent_at timestamp without time zone,
    stripe_customer_id character varying(255),
    stripe_subscription_status character varying(255),
    CONSTRAINT require_valid_email CHECK (((email IS NULL) OR (email OPERATOR(public.~*) '^[^ ]+@[^ ]+$'::public.citext))),
    CONSTRAINT reserve_usernames CHECK ((username OPERATOR(public.<>) ALL (ARRAY['admin'::public.citext, 'metal'::public.citext, 'self'::public.citext]))),
    CONSTRAINT user_admin_feature_flags CHECK (((feature_flags IS NULL) OR (role = ANY (ARRAY['admin'::public.user_role, 'admin_editor'::public.user_role]))))
);


--
-- Name: users_visitors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_visitors (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    visitor_id uuid NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: visitors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.visitors (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    origin_id text NOT NULL,
    origin_name public.visitor_origin_name NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    timezone_name public.timezone_name DEFAULT 'America/Los_Angeles'::public.timezone_name NOT NULL,
    origin_version public.citext,
    conversation_token text,
    is_bot boolean DEFAULT false NOT NULL,
    user_agent text,
    last_request_path text,
    last_request_id text,
    last_request_ids text[],
    bot_name text,
    request_count integer DEFAULT 1,
    last_referrer_id uuid,
    cookie_status public.cookie_status,
    last_request_ip text,
    last_request jsonb,
    CONSTRAINT last_request_ip_is_valid CHECK (public.is_ip_address(last_request_ip)),
    CONSTRAINT tachikoma_origin_version_length CHECK (((origin_name <> ALL (ARRAY['tachikoma'::public.visitor_origin_name, 'tachikoma.tv'::public.visitor_origin_name])) OR ((origin_version IS NULL) OR (origin_version OPERATOR(public.~) '\d+\.\d+\.\d+'::public.citext))))
);


--
-- Name: COLUMN visitors.request_count; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.visitors.request_count IS 'added 2020-08';


--
-- Name: visitors_favorite_leagues; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.visitors_favorite_leagues (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    visitor_id uuid NOT NULL,
    league_id uuid NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: visitors_favorite_teams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.visitors_favorite_teams (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    visitor_id uuid NOT NULL,
    team_id uuid NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: visitors_favorite_indirect_leagues; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.visitors_favorite_indirect_leagues AS
 SELECT DISTINCT vft.visitor_id,
    t.league_id
   FROM ((public.teams t
     JOIN public.visitors_favorite_teams vft ON ((vft.team_id = t.id)))
     JOIN public.leagues l ON ((l.id = t.league_id)))
  WHERE (NOT (t.league_id IN ( SELECT vfl.league_id
           FROM public.visitors_favorite_leagues vfl
          WHERE (vfl.visitor_id = vft.visitor_id))));


--
-- Name: visitors_favorite_actors; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.visitors_favorite_actors AS
 SELECT 'team_direct'::text AS type,
    t.name,
    t.gamera_actor_id,
    vft.visitor_id
   FROM (public.teams t
     JOIN public.visitors_favorite_teams vft ON ((vft.team_id = t.id)))
UNION
 SELECT 'league_direct'::text AS type,
    l.name,
    l.gamera_actor_id,
    vfl.visitor_id
   FROM (public.leagues l
     JOIN public.visitors_favorite_leagues vfl ON ((vfl.league_id = l.id)))
UNION
 SELECT 'league_indirect'::text AS type,
    li.name,
    li.gamera_actor_id,
    vfil.visitor_id
   FROM (public.leagues li
     JOIN public.visitors_favorite_indirect_leagues vfil ON ((vfil.league_id = li.id)))
  GROUP BY li.name, li.gamera_actor_id, vfil.visitor_id;


--
-- Name: visitors_pushed_musings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.visitors_pushed_musings (
    id uuid NOT NULL,
    visitor_id uuid NOT NULL,
    musing_id uuid NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: visitors_seen_musings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.visitors_seen_musings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    visitor_id uuid NOT NULL,
    musing_id uuid NOT NULL,
    seen_count integer DEFAULT 1 NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: asks sid; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asks ALTER COLUMN sid SET DEFAULT nextval('public.asks_sid_seq'::regclass);


--
-- Name: finance_asks sid; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_asks ALTER COLUMN sid SET DEFAULT nextval('public.finance_asks_sid_seq'::regclass);


--
-- Name: questions sid; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions ALTER COLUMN sid SET DEFAULT nextval('public.questions_sid_seq'::regclass);


--
-- Name: ad_geo_countries ad_geo_countries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ad_geo_countries
    ADD CONSTRAINT ad_geo_countries_pkey PRIMARY KEY (id);


--
-- Name: ad_geo_states ad_geo_states_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ad_geo_states
    ADD CONSTRAINT ad_geo_states_pkey PRIMARY KEY (id);


--
-- Name: ad_geo_tags_countries ad_geo_tags_countries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ad_geo_tags_countries
    ADD CONSTRAINT ad_geo_tags_countries_pkey PRIMARY KEY (id);


--
-- Name: ad_geo_tags ad_geo_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ad_geo_tags
    ADD CONSTRAINT ad_geo_tags_pkey PRIMARY KEY (id);


--
-- Name: ad_geo_tags_states ad_geo_tags_states_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ad_geo_tags_states
    ADD CONSTRAINT ad_geo_tags_states_pkey PRIMARY KEY (id);


--
-- Name: ad_geo_urls ad_geo_urls_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ad_geo_urls
    ADD CONSTRAINT ad_geo_urls_pkey PRIMARY KEY (id);


--
-- Name: app_settings app_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_settings
    ADD CONSTRAINT app_settings_pkey PRIMARY KEY (id);


--
-- Name: ask_events ask_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ask_events
    ADD CONSTRAINT ask_events_pkey PRIMARY KEY (id);


--
-- Name: ask_suggests ask_suggests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ask_suggests
    ADD CONSTRAINT ask_suggests_pkey PRIMARY KEY (id);


--
-- Name: ask_updates ask_updates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ask_updates
    ADD CONSTRAINT ask_updates_pkey PRIMARY KEY (id);


--
-- Name: asks asks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asks
    ADD CONSTRAINT asks_pkey PRIMARY KEY (id);


--
-- Name: asks_users asks_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asks_users
    ADD CONSTRAINT asks_users_pkey PRIMARY KEY (id);


--
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- Name: contexts contexts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contexts
    ADD CONSTRAINT contexts_pkey PRIMARY KEY (id);


--
-- Name: crawl_pages crawl_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.crawl_pages
    ADD CONSTRAINT crawl_pages_pkey PRIMARY KEY (id);


--
-- Name: devices devices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_pkey PRIMARY KEY (id);


--
-- Name: examples examples_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.examples
    ADD CONSTRAINT examples_pkey PRIMARY KEY (id);


--
-- Name: finance_ask_events finance_ask_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_ask_events
    ADD CONSTRAINT finance_ask_events_pkey PRIMARY KEY (id);


--
-- Name: finance_asks finance_asks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_asks
    ADD CONSTRAINT finance_asks_pkey PRIMARY KEY (id);


--
-- Name: finance_asks_users finance_asks_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_asks_users
    ADD CONSTRAINT finance_asks_users_pkey PRIMARY KEY (id);


--
-- Name: follows follows_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_pkey PRIMARY KEY (id);


--
-- Name: games games_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: images images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- Name: ip_geos ip_geos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ip_geos
    ADD CONSTRAINT ip_geos_pkey PRIMARY KEY (id);


--
-- Name: leagues leagues_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leagues
    ADD CONSTRAINT leagues_pkey PRIMARY KEY (id);


--
-- Name: links links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.links
    ADD CONSTRAINT links_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: musings musings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.musings
    ADD CONSTRAINT musings_pkey PRIMARY KEY (id);


--
-- Name: musings_related_actors musings_related_actors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.musings_related_actors
    ADD CONSTRAINT musings_related_actors_pkey PRIMARY KEY (id);


--
-- Name: notes notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);


--
-- Name: players players_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_pkey PRIMARY KEY (id);


--
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- Name: reactions reactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reactions
    ADD CONSTRAINT reactions_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: slack_workspaces slack_workspaces_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.slack_workspaces
    ADD CONSTRAINT slack_workspaces_pkey PRIMARY KEY (id);


--
-- Name: stories stories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT stories_pkey PRIMARY KEY (id);


--
-- Name: story_lines story_lines_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.story_lines
    ADD CONSTRAINT story_lines_pkey PRIMARY KEY (id);


--
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
-- Name: template_reports template_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.template_reports
    ADD CONSTRAINT template_reports_pkey PRIMARY KEY (id);


--
-- Name: templates templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.templates
    ADD CONSTRAINT templates_pkey PRIMARY KEY (id);


--
-- Name: trend_queries trend_queries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trend_queries
    ADD CONSTRAINT trend_queries_pkey PRIMARY KEY (id);


--
-- Name: trends trends_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trends
    ADD CONSTRAINT trends_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_visitors users_visitors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_visitors
    ADD CONSTRAINT users_visitors_pkey PRIMARY KEY (id);


--
-- Name: players validate_background_color_hex; Type: CHECK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE public.players
    ADD CONSTRAINT validate_background_color_hex CHECK (((background_color_hex IS NULL) OR public.is_hex_code((background_color_hex)::text))) NOT VALID;


--
-- Name: players validate_foreground_color_hex; Type: CHECK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE public.players
    ADD CONSTRAINT validate_foreground_color_hex CHECK (((foreground_color_hex IS NULL) OR public.is_hex_code((foreground_color_hex)::text))) NOT VALID;


--
-- Name: asks validate_hex_codes; Type: CHECK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE public.asks
    ADD CONSTRAINT validate_hex_codes CHECK ((((hex_background IS NULL) OR ((hex_background)::text ~* '#[a-z0-9]{6}'::text)) AND ((hex_foreground IS NULL) OR ((hex_foreground)::text ~* '#[a-z0-9]{6}'::text)))) NOT VALID;


--
-- Name: players validate_resource_id; Type: CHECK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE public.players
    ADD CONSTRAINT validate_resource_id CHECK (((resource_id IS NULL) OR public.is_string_int(resource_id))) NOT VALID;


--
-- Name: visitors_favorite_leagues visitors_favorite_leagues_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitors_favorite_leagues
    ADD CONSTRAINT visitors_favorite_leagues_pkey PRIMARY KEY (id);


--
-- Name: visitors_favorite_teams visitors_favorite_teams_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitors_favorite_teams
    ADD CONSTRAINT visitors_favorite_teams_pkey PRIMARY KEY (id);


--
-- Name: visitors visitors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitors
    ADD CONSTRAINT visitors_pkey PRIMARY KEY (id);


--
-- Name: visitors_pushed_musings visitors_pushed_musings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitors_pushed_musings
    ADD CONSTRAINT visitors_pushed_musings_pkey PRIMARY KEY (id);


--
-- Name: visitors_seen_musings visitors_seen_musings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitors_seen_musings
    ADD CONSTRAINT visitors_seen_musings_pkey PRIMARY KEY (id);


--
-- Name: ad_geo_countries_country_code_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ad_geo_countries_country_code_index ON public.ad_geo_countries USING btree (country_code);


--
-- Name: ad_geo_states_state_code_ad_geo_country_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ad_geo_states_state_code_ad_geo_country_id_index ON public.ad_geo_states USING btree (state_code, ad_geo_country_id);


--
-- Name: ad_geo_states_state_code_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ad_geo_states_state_code_index ON public.ad_geo_states USING btree (state_code);


--
-- Name: ad_geo_states_state_name_ad_geo_country_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ad_geo_states_state_name_ad_geo_country_id_index ON public.ad_geo_states USING btree (state_name, ad_geo_country_id);


--
-- Name: ad_geo_states_state_name_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ad_geo_states_state_name_index ON public.ad_geo_states USING btree (state_name);


--
-- Name: ad_geo_tags_countries_ad_geo_tag_id_ad_geo_country_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ad_geo_tags_countries_ad_geo_tag_id_ad_geo_country_id_index ON public.ad_geo_tags_countries USING btree (ad_geo_tag_id, ad_geo_country_id);


--
-- Name: ad_geo_tags_html_null; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ad_geo_tags_html_null ON public.ad_geo_tags USING btree (html) WHERE (html IS NULL);


--
-- Name: ad_geo_tags_name_ad_geo_country_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ad_geo_tags_name_ad_geo_country_id_index ON public.ad_geo_tags USING btree (name, ad_geo_country_id);


--
-- Name: ad_geo_tags_states_ad_geo_tag_id_ad_geo_state_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ad_geo_tags_states_ad_geo_tag_id_ad_geo_state_id_index ON public.ad_geo_tags_states USING btree (ad_geo_tag_id, ad_geo_state_id);


--
-- Name: ad_geo_urls_ad_geo_tag_id_path_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ad_geo_urls_ad_geo_tag_id_path_index ON public.ad_geo_urls USING btree (ad_geo_tag_id, path);


--
-- Name: app_settings_key_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX app_settings_key_index ON public.app_settings USING btree (lower((kv ->> 'key'::text)));


--
-- Name: ask_events_ask_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ask_events_ask_id_index ON public.ask_events USING btree (ask_id);


--
-- Name: ask_events_question_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ask_events_question_id_index ON public.ask_events USING btree (question_id);


--
-- Name: ask_events_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ask_events_user_id_index ON public.ask_events USING btree (user_id) WHERE (user_id IS NOT NULL);


--
-- Name: ask_events_visitor_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ask_events_visitor_id_index ON public.ask_events USING btree (visitor_id) WHERE (visitor_id IS NOT NULL);


--
-- Name: ask_suggests_domain_query_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ask_suggests_domain_query_index ON public.ask_suggests USING btree (domain, query);


--
-- Name: ask_updates_ask_sid_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ask_updates_ask_sid_index ON public.ask_updates USING btree (ask_sid);


--
-- Name: asks_context_id_query_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX asks_context_id_query_index ON public.asks USING btree (context_id, query);


--
-- Name: asks_in_index_context_last_web_search_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX asks_in_index_context_last_web_search_index ON public.asks USING btree (context_id, last_web_search_at) WHERE (is_in_index = true);


--
-- Name: asks_in_index_context_updated_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX asks_in_index_context_updated_index ON public.asks USING btree (context_id, updated_at) WHERE (is_in_index = true);


--
-- Name: asks_in_index_last_web_search_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX asks_in_index_last_web_search_index ON public.asks USING btree (last_web_search_at) WHERE (is_in_index = true);


--
-- Name: asks_in_index_updated_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX asks_in_index_updated_index ON public.asks USING btree (updated_at) WHERE (is_in_index = true);


--
-- Name: asks_in_suggests_context_last_web_search_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX asks_in_suggests_context_last_web_search_index ON public.asks USING btree (context_id, last_web_search_at) WHERE (is_in_suggests = true);


--
-- Name: asks_in_suggests_last_web_search_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX asks_in_suggests_last_web_search_index ON public.asks USING btree (last_web_search_at) WHERE (is_in_suggests = true);


--
-- Name: asks_last_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX asks_last_user_id_index ON public.asks USING btree (last_user_id) WHERE (last_user_id IS NOT NULL);


--
-- Name: asks_last_web_search_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX asks_last_web_search_at_index ON public.asks USING btree (last_web_search_at);


--
-- Name: asks_sid_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX asks_sid_index ON public.asks USING btree (sid);


--
-- Name: asks_users_ask_id_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX asks_users_ask_id_user_id_index ON public.asks_users USING btree (ask_id, user_id);


--
-- Name: contexts_name_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX contexts_name_index ON public.contexts USING btree (name);


--
-- Name: crawl_pages_crawl_count_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX crawl_pages_crawl_count_index ON public.crawl_pages USING btree (crawl_count);


--
-- Name: crawl_pages_expires_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX crawl_pages_expires_at_index ON public.crawl_pages USING btree (expires_at);


--
-- Name: crawl_pages_last_changed_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX crawl_pages_last_changed_at_index ON public.crawl_pages USING btree (last_changed_at);


--
-- Name: crawl_pages_last_crawled_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX crawl_pages_last_crawled_at_index ON public.crawl_pages USING btree (last_crawled_at);


--
-- Name: crawl_pages_should_refresh_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX crawl_pages_should_refresh_index ON public.crawl_pages USING btree (should_refresh);


--
-- Name: crawl_pages_sitemap_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX crawl_pages_sitemap_index ON public.crawl_pages USING btree (url_domain, url_type, inserted_at) WHERE ((last_crawl_status >= 200) AND (last_crawl_status <= 299));


--
-- Name: crawl_pages_url_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX crawl_pages_url_index ON public.crawl_pages USING btree (url);


--
-- Name: crawl_pages_url_trgm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX crawl_pages_url_trgm ON public.crawl_pages USING gin (url public.gin_trgm_ops);


--
-- Name: crawl_pages_url_updated_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX crawl_pages_url_updated_at_index ON public.crawl_pages USING btree (url, updated_at DESC);


--
-- Name: devices_visitor_id_device_name_device_token_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX devices_visitor_id_device_name_device_token_index ON public.devices USING btree (visitor_id, device_name, device_token);


--
-- Name: devices_visitor_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX devices_visitor_id_index ON public.devices USING btree (visitor_id);


--
-- Name: examples_is_published_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX examples_is_published_index ON public.examples USING btree (is_published);


--
-- Name: examples_league_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX examples_league_id_index ON public.examples USING btree (league_id);


--
-- Name: examples_league_id_type_text_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX examples_league_id_type_text_index ON public.examples USING btree (league_id, type, text);


--
-- Name: examples_type_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX examples_type_index ON public.examples USING btree (type);


--
-- Name: finance_ask_events_finance_ask_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX finance_ask_events_finance_ask_id_index ON public.finance_ask_events USING btree (finance_ask_id);


--
-- Name: finance_ask_events_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX finance_ask_events_user_id_index ON public.finance_ask_events USING btree (user_id) WHERE (user_id IS NOT NULL);


--
-- Name: finance_ask_events_visitor_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX finance_ask_events_visitor_id_index ON public.finance_ask_events USING btree (visitor_id) WHERE (visitor_id IS NOT NULL);


--
-- Name: finance_asks_in_index_last_web_search_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX finance_asks_in_index_last_web_search_index ON public.finance_asks USING btree (last_web_search_at) WHERE (is_in_index = true);


--
-- Name: finance_asks_in_index_updated_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX finance_asks_in_index_updated_at_index ON public.finance_asks USING btree (updated_at) WHERE (is_in_index = true);


--
-- Name: finance_asks_in_suggests_last_web_search_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX finance_asks_in_suggests_last_web_search_index ON public.finance_asks USING btree (last_web_search_at) WHERE (is_in_suggests = true);


--
-- Name: finance_asks_last_web_search_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX finance_asks_last_web_search_at_index ON public.finance_asks USING btree (last_web_search_at);


--
-- Name: finance_asks_query_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX finance_asks_query_index ON public.finance_asks USING btree (query);


--
-- Name: finance_asks_sid_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX finance_asks_sid_index ON public.finance_asks USING btree (sid);


--
-- Name: finance_asks_users_finance_ask_id_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX finance_asks_users_finance_ask_id_user_id_index ON public.finance_asks_users USING btree (finance_ask_id, user_id);


--
-- Name: follows_follower_id_followed_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX follows_follower_id_followed_id_index ON public.follows USING btree (follower_id, followed_id);


--
-- Name: games_away_team_id_status_starts_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX games_away_team_id_status_starts_at_index ON public.games USING btree (away_team_id, status, starts_at);


--
-- Name: games_gamera_game_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX games_gamera_game_id_index ON public.games USING btree (sportradar_game_id);


--
-- Name: games_home_team_id_status_starts_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX games_home_team_id_status_starts_at_index ON public.games USING btree (home_team_id, status, starts_at);


--
-- Name: identities_uid_provider_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX identities_uid_provider_index ON public.identities USING btree (uid, provider);


--
-- Name: identities_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX identities_user_id_index ON public.identities USING btree (user_id);


--
-- Name: identities_user_id_provider_email_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX identities_user_id_provider_email_index ON public.identities USING btree (user_id, provider, email);


--
-- Name: ip_geos_ip_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ip_geos_ip_index ON public.ip_geos USING btree (ip);


--
-- Name: leagues_gamera_actor_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX leagues_gamera_actor_id_index ON public.leagues USING btree (gamera_actor_id);


--
-- Name: leagues_gamera_actor_id_year_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX leagues_gamera_actor_id_year_index ON public.leagues USING btree (gamera_actor_id, COALESCE(begin_year, 0), COALESCE(end_year, 0));


--
-- Name: links_ask_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX links_ask_id_index ON public.links USING btree (ask_id);


--
-- Name: links_finance_ask_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX links_finance_ask_id_index ON public.links USING btree (finance_ask_id);


--
-- Name: links_image_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX links_image_id_index ON public.links USING btree (image_id);


--
-- Name: links_linkable_type_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX links_linkable_type_index ON public.links USING btree (linkable_type);


--
-- Name: links_musing_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX links_musing_id_index ON public.links USING btree (musing_id);


--
-- Name: links_question_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX links_question_id_index ON public.links USING btree (question_id);


--
-- Name: links_short_code_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX links_short_code_index ON public.links USING btree (short_code);


--
-- Name: links_story_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX links_story_id_index ON public.links USING btree (story_id);


--
-- Name: messages_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX messages_user_id_index ON public.messages USING btree (user_id);


--
-- Name: messages_visitor_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX messages_visitor_id_index ON public.messages USING btree (visitor_id);


--
-- Name: musings_author_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX musings_author_id_index ON public.musings USING btree (author_id) WHERE (author_id IS NOT NULL);


--
-- Name: musings_content_type_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX musings_content_type_index ON public.musings USING btree (content_type);


--
-- Name: musings_expired_early_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX musings_expired_early_at_index ON public.musings USING btree (expired_early_at);


--
-- Name: musings_expires_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX musings_expires_at_index ON public.musings USING btree (expires_at);


--
-- Name: musings_expires_at_publish_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX musings_expires_at_publish_at_index ON public.musings USING btree (expires_at, publish_at);


--
-- Name: musings_friendly_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX musings_friendly_id_index ON public.musings USING btree (friendly_id);


--
-- Name: musings_happened_on_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX musings_happened_on_index ON public.musings USING btree (happened_on);


--
-- Name: musings_inserted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX musings_inserted_at ON public.musings USING btree (inserted_at);


--
-- Name: musings_ios_content_types_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX musings_ios_content_types_index ON public.musings USING btree (content_type) WHERE ((content_type = 'original'::public.musing_content_type) OR (content_type = 'latest-stats'::public.musing_content_type) OR (content_type = 'templated'::public.musing_content_type));


--
-- Name: musings_is_editorial; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX musings_is_editorial ON public.musings USING btree (is_editorial);


--
-- Name: musings_is_pushable_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX musings_is_pushable_index ON public.musings USING btree (is_pushable);


--
-- Name: musings_league_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX musings_league_id_index ON public.musings USING btree (league_id);


--
-- Name: musings_publish_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX musings_publish_at ON public.musings USING btree (publish_at);


--
-- Name: musings_publish_at_year_month_day; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX musings_publish_at_year_month_day ON public.musings USING btree (date_part('year'::text, publish_at), date_part('month'::text, publish_at), date_part('day'::text, publish_at));


--
-- Name: musings_related_actors_gamera_actor_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX musings_related_actors_gamera_actor_id_index ON public.musings_related_actors USING btree (gamera_actor_id);


--
-- Name: musings_related_actors_gamera_actor_id_year_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX musings_related_actors_gamera_actor_id_year_index ON public.musings_related_actors USING btree (musing_id, gamera_actor_id, COALESCE(year, 0));


--
-- Name: musings_related_actors_musing_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX musings_related_actors_musing_id_index ON public.musings_related_actors USING btree (musing_id);


--
-- Name: musings_template_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX musings_template_id_index ON public.musings USING btree (template_id);


--
-- Name: musings_template_id_template_game_id_template_team_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX musings_template_id_template_game_id_template_team_id_index ON public.musings USING btree (template_id, template_game_id, template_team_id);


--
-- Name: musings_template_team_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX musings_template_team_id_index ON public.musings USING btree (template_team_id);


--
-- Name: musings_visitor_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX musings_visitor_id_index ON public.musings USING btree (visitor_id);


--
-- Name: phone_digits_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX phone_digits_index ON public.contacts USING btree (public.regexp_replace(phone, '\D'::public.citext, ''::text, 'g'::text));


--
-- Name: players_league_id_resource_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX players_league_id_resource_id_index ON public.players USING btree (league_id, resource_id);


--
-- Name: questions_context_id_sid; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX questions_context_id_sid ON public.questions USING btree (context_id, sid) WHERE is_successful;


--
-- Name: questions_friendly_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX questions_friendly_id_index ON public.questions USING btree (friendly_id);


--
-- Name: questions_inserted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX questions_inserted_at ON public.questions USING btree (inserted_at);


--
-- Name: questions_sid_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX questions_sid_index ON public.questions USING btree (sid);


--
-- Name: questions_user_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX questions_user_index ON public.questions USING btree (user_id, is_successful, inserted_at DESC);


--
-- Name: reactions_user_id_musing_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX reactions_user_id_musing_id_index ON public.reactions USING btree (user_id, musing_id);


--
-- Name: reactions_user_id_story_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX reactions_user_id_story_id_index ON public.reactions USING btree (user_id, story_id);


--
-- Name: reactions_visitor_id_musing_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX reactions_visitor_id_musing_id_index ON public.reactions USING btree (visitor_id, musing_id);


--
-- Name: reactions_visitor_id_story_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX reactions_visitor_id_story_id_index ON public.reactions USING btree (visitor_id, story_id);


--
-- Name: sessions_auth_token_csrf_token_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sessions_auth_token_csrf_token_index ON public.sessions USING btree (auth_token, csrf_token);


--
-- Name: sessions_auth_token_csrf_token_revoked_at_null_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sessions_auth_token_csrf_token_revoked_at_null_index ON public.sessions USING btree (auth_token, csrf_token, revoked_at) WHERE (revoked_at IS NULL);


--
-- Name: sessions_auth_token_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX sessions_auth_token_index ON public.sessions USING btree (auth_token);


--
-- Name: sessions_csrf_token_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX sessions_csrf_token_index ON public.sessions USING btree (csrf_token);


--
-- Name: sessions_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sessions_user_id_index ON public.sessions USING btree (user_id);


--
-- Name: slack_workspaces_team_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX slack_workspaces_team_id_index ON public.slack_workspaces USING btree (team_id);


--
-- Name: stories_inserted_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX stories_inserted_at_index ON public.stories USING btree (inserted_at DESC);


--
-- Name: stories_tags; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX stories_tags ON public.stories USING btree (tags);


--
-- Name: stories_user_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX stories_user_index ON public.stories USING btree (user_id, inserted_at DESC);


--
-- Name: story_lines_story_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX story_lines_story_id_index ON public.story_lines USING btree (story_id);


--
-- Name: teams_league_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX teams_league_id_index ON public.teams USING btree (league_id);


--
-- Name: teams_league_id_year_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX teams_league_id_year_index ON public.teams USING btree (league_id, gamera_team_id, COALESCE(begin_year, 0));


--
-- Name: template_reports_template_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX template_reports_template_id_index ON public.template_reports USING btree (template_id);


--
-- Name: templates_does_run_for_all_teams_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX templates_does_run_for_all_teams_index ON public.templates USING btree (does_run_for_all_teams);


--
-- Name: templates_is_active_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX templates_is_active_index ON public.templates USING btree (is_active);


--
-- Name: templates_query_gin_trgm_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX templates_query_gin_trgm_index ON public.templates USING gin (query public.gin_trgm_ops);


--
-- Name: templates_query_league_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX templates_query_league_id_index ON public.templates USING btree (query, league_id);


--
-- Name: templates_run_frequency_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX templates_run_frequency_index ON public.templates USING btree (run_frequency);


--
-- Name: trend_queries_is_active_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX trend_queries_is_active_index ON public.trend_queries USING btree (is_active);


--
-- Name: trend_queries_league_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX trend_queries_league_id_index ON public.trend_queries USING btree (league_id);


--
-- Name: trend_queries_run_frequency_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX trend_queries_run_frequency_index ON public.trend_queries USING btree (run_frequency);


--
-- Name: users_email_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_index ON public.users USING btree (email);


--
-- Name: users_id_email_confirm_token_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_id_email_confirm_token_index ON public.users USING btree (id, email_confirm_token);


--
-- Name: users_referrer_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_referrer_id_index ON public.users USING btree (referrer_id) WHERE (referrer_id IS NOT NULL);


--
-- Name: users_role_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_role_index ON public.users USING btree (role);


--
-- Name: users_stripe_customer_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_stripe_customer_id_index ON public.users USING btree (stripe_customer_id);


--
-- Name: users_username_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_username_index ON public.users USING btree (username);


--
-- Name: users_visitors_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_visitors_user_id_index ON public.users_visitors USING btree (user_id);


--
-- Name: users_visitors_user_id_visitor_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_visitors_user_id_visitor_id_index ON public.users_visitors USING btree (user_id, visitor_id);


--
-- Name: visitors_favorite_leagues_league_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX visitors_favorite_leagues_league_id_index ON public.visitors_favorite_leagues USING btree (league_id);


--
-- Name: visitors_favorite_leagues_visitor_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX visitors_favorite_leagues_visitor_id_index ON public.visitors_favorite_leagues USING btree (visitor_id);


--
-- Name: visitors_favorite_leagues_visitor_id_league_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX visitors_favorite_leagues_visitor_id_league_id_index ON public.visitors_favorite_leagues USING btree (visitor_id, league_id);


--
-- Name: visitors_favorite_teams_team_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX visitors_favorite_teams_team_id_index ON public.visitors_favorite_teams USING btree (team_id);


--
-- Name: visitors_favorite_teams_visitor_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX visitors_favorite_teams_visitor_id_index ON public.visitors_favorite_teams USING btree (visitor_id);


--
-- Name: visitors_favorite_teams_visitor_id_team_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX visitors_favorite_teams_visitor_id_team_id_index ON public.visitors_favorite_teams USING btree (visitor_id, team_id);


--
-- Name: visitors_is_bot_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX visitors_is_bot_index ON public.visitors USING btree (is_bot);


--
-- Name: visitors_last_referrer_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX visitors_last_referrer_id_index ON public.visitors USING btree (last_referrer_id) WHERE (last_referrer_id IS NOT NULL);


--
-- Name: visitors_origin_id_origin_name_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX visitors_origin_id_origin_name_index ON public.visitors USING btree (origin_id, origin_name);


--
-- Name: visitors_origin_name_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX visitors_origin_name_index ON public.visitors USING btree (origin_name);


--
-- Name: visitors_pushed_musings_musing_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX visitors_pushed_musings_musing_id_index ON public.visitors_pushed_musings USING btree (musing_id);


--
-- Name: visitors_pushed_musings_visitor_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX visitors_pushed_musings_visitor_id_index ON public.visitors_pushed_musings USING btree (visitor_id);


--
-- Name: visitors_seen_musings_musing_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX visitors_seen_musings_musing_id_index ON public.visitors_seen_musings USING btree (musing_id);


--
-- Name: visitors_seen_musings_visitor_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX visitors_seen_musings_visitor_id_index ON public.visitors_seen_musings USING btree (visitor_id);


--
-- Name: visitors_seen_musings_visitor_id_musing_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX visitors_seen_musings_visitor_id_musing_id_index ON public.visitors_seen_musings USING btree (visitor_id, musing_id);


--
-- Name: visitors_updated_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX visitors_updated_at_index ON public.visitors USING btree (updated_at);


--
-- Name: visitors_user_agent_trgm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX visitors_user_agent_trgm ON public.visitors USING gin (user_agent public.gin_trgm_ops);


--
-- Name: app_settings app_settings_changed; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER app_settings_changed AFTER INSERT OR UPDATE ON public.app_settings FOR EACH ROW EXECUTE PROCEDURE public.notify_app_settings_changed();


--
-- Name: users inc_user_finance_approval_email_count; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER inc_user_finance_approval_email_count BEFORE INSERT OR UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE public.inc_user_finance_approval_email_count();


--
-- Name: asks preserve_ask_pins; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER preserve_ask_pins BEFORE INSERT OR UPDATE ON public.asks FOR EACH ROW EXECUTE PROCEDURE public.preserve_ask_pins();


--
-- Name: finance_asks preserve_ask_pins; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER preserve_ask_pins BEFORE INSERT OR UPDATE ON public.finance_asks FOR EACH ROW EXECUTE PROCEDURE public.preserve_ask_pins();


--
-- Name: games set_game_has_just_completed; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_game_has_just_completed BEFORE UPDATE ON public.games FOR EACH ROW EXECUTE PROCEDURE public.set_game_has_just_completed();


--
-- Name: games set_status_transition; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_status_transition BEFORE INSERT OR UPDATE ON public.games FOR EACH ROW EXECUTE PROCEDURE public.set_status_transition();


--
-- Name: crawl_pages update_crawl_page; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_crawl_page BEFORE INSERT OR UPDATE ON public.crawl_pages FOR EACH ROW EXECUTE PROCEDURE public.update_crawl_page();


--
-- Name: musings update_game_musing_count; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_game_musing_count AFTER INSERT OR DELETE ON public.musings FOR EACH ROW EXECUTE PROCEDURE public.update_game_musing_count();


--
-- Name: reactions update_reaction_count; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_reaction_count AFTER INSERT OR DELETE ON public.reactions FOR EACH ROW EXECUTE PROCEDURE public.update_reaction_count();


--
-- Name: story_lines update_story_line_count; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_story_line_count AFTER INSERT OR DELETE ON public.story_lines FOR EACH ROW EXECUTE PROCEDURE public.update_story_line_count();


--
-- Name: musings update_template_musing_count; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_template_musing_count AFTER INSERT OR DELETE ON public.musings FOR EACH ROW EXECUTE PROCEDURE public.update_template_musing_count();


--
-- Name: follows update_user_follow_counts; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_follow_counts AFTER INSERT OR DELETE ON public.follows FOR EACH ROW EXECUTE PROCEDURE public.update_user_follow_counts();


--
-- Name: questions update_user_question_count; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_question_count AFTER INSERT OR DELETE ON public.questions FOR EACH ROW EXECUTE PROCEDURE public.update_user_question_count();


--
-- Name: visitors update_visitor; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_visitor BEFORE INSERT OR UPDATE ON public.visitors FOR EACH ROW EXECUTE PROCEDURE public.update_visitor();


--
-- Name: teams uppercase_team_abbrev; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER uppercase_team_abbrev BEFORE INSERT OR UPDATE ON public.teams FOR EACH ROW EXECUTE PROCEDURE public.uppercase_team_abbrev();


--
-- Name: asks upsert_asks_users; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER upsert_asks_users AFTER INSERT OR UPDATE ON public.asks FOR EACH ROW EXECUTE PROCEDURE public.upsert_asks_users();


--
-- Name: finance_asks upsert_finance_asks_users; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER upsert_finance_asks_users AFTER INSERT OR UPDATE ON public.finance_asks FOR EACH ROW EXECUTE PROCEDURE public.upsert_finance_asks_users();


--
-- Name: ad_geo_states ad_geo_states_ad_geo_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ad_geo_states
    ADD CONSTRAINT ad_geo_states_ad_geo_country_id_fkey FOREIGN KEY (ad_geo_country_id) REFERENCES public.ad_geo_countries(id);


--
-- Name: ad_geo_tags ad_geo_tags_ad_geo_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ad_geo_tags
    ADD CONSTRAINT ad_geo_tags_ad_geo_country_id_fkey FOREIGN KEY (ad_geo_country_id) REFERENCES public.ad_geo_countries(id);


--
-- Name: ad_geo_tags ad_geo_tags_ad_geo_state_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ad_geo_tags
    ADD CONSTRAINT ad_geo_tags_ad_geo_state_id_fkey FOREIGN KEY (ad_geo_state_id) REFERENCES public.ad_geo_states(id);


--
-- Name: ad_geo_tags_countries ad_geo_tags_countries_ad_geo_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ad_geo_tags_countries
    ADD CONSTRAINT ad_geo_tags_countries_ad_geo_country_id_fkey FOREIGN KEY (ad_geo_country_id) REFERENCES public.ad_geo_countries(id) ON DELETE CASCADE;


--
-- Name: ad_geo_tags_countries ad_geo_tags_countries_ad_geo_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ad_geo_tags_countries
    ADD CONSTRAINT ad_geo_tags_countries_ad_geo_tag_id_fkey FOREIGN KEY (ad_geo_tag_id) REFERENCES public.ad_geo_tags(id) ON DELETE CASCADE;


--
-- Name: ad_geo_tags_states ad_geo_tags_states_ad_geo_state_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ad_geo_tags_states
    ADD CONSTRAINT ad_geo_tags_states_ad_geo_state_id_fkey FOREIGN KEY (ad_geo_state_id) REFERENCES public.ad_geo_states(id) ON DELETE CASCADE;


--
-- Name: ad_geo_tags_states ad_geo_tags_states_ad_geo_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ad_geo_tags_states
    ADD CONSTRAINT ad_geo_tags_states_ad_geo_tag_id_fkey FOREIGN KEY (ad_geo_tag_id) REFERENCES public.ad_geo_tags(id) ON DELETE CASCADE;


--
-- Name: ad_geo_urls ad_geo_urls_ad_geo_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ad_geo_urls
    ADD CONSTRAINT ad_geo_urls_ad_geo_tag_id_fkey FOREIGN KEY (ad_geo_tag_id) REFERENCES public.ad_geo_tags(id) ON DELETE CASCADE;


--
-- Name: ask_events ask_events_ask_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ask_events
    ADD CONSTRAINT ask_events_ask_id_fkey FOREIGN KEY (ask_id) REFERENCES public.asks(id);


--
-- Name: ask_events ask_events_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ask_events
    ADD CONSTRAINT ask_events_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id);


--
-- Name: ask_events ask_events_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ask_events
    ADD CONSTRAINT ask_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: ask_events ask_events_visitor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ask_events
    ADD CONSTRAINT ask_events_visitor_id_fkey FOREIGN KEY (visitor_id) REFERENCES public.visitors(id);


--
-- Name: asks asks_context_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asks
    ADD CONSTRAINT asks_context_id_fkey FOREIGN KEY (context_id) REFERENCES public.contexts(id);


--
-- Name: asks asks_last_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asks
    ADD CONSTRAINT asks_last_user_id_fkey FOREIGN KEY (last_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: asks asks_last_visitor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asks
    ADD CONSTRAINT asks_last_visitor_id_fkey FOREIGN KEY (last_visitor_id) REFERENCES public.visitors(id) ON DELETE SET NULL;


--
-- Name: asks_users asks_users_ask_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asks_users
    ADD CONSTRAINT asks_users_ask_id_fkey FOREIGN KEY (ask_id) REFERENCES public.asks(id);


--
-- Name: asks_users asks_users_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asks_users
    ADD CONSTRAINT asks_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: devices devices_visitor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_visitor_id_fkey FOREIGN KEY (visitor_id) REFERENCES public.visitors(id) ON DELETE CASCADE;


--
-- Name: examples examples_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.examples
    ADD CONSTRAINT examples_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: examples examples_league_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.examples
    ADD CONSTRAINT examples_league_id_fkey FOREIGN KEY (league_id) REFERENCES public.leagues(id) ON DELETE SET NULL;


--
-- Name: examples examples_previous_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.examples
    ADD CONSTRAINT examples_previous_question_id_fkey FOREIGN KEY (previous_question_id) REFERENCES public.questions(id) ON DELETE SET NULL;


--
-- Name: examples examples_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.examples
    ADD CONSTRAINT examples_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE SET NULL;


--
-- Name: examples examples_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.examples
    ADD CONSTRAINT examples_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.templates(id);


--
-- Name: finance_ask_events finance_ask_events_finance_ask_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_ask_events
    ADD CONSTRAINT finance_ask_events_finance_ask_id_fkey FOREIGN KEY (finance_ask_id) REFERENCES public.finance_asks(id);


--
-- Name: finance_ask_events finance_ask_events_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_ask_events
    ADD CONSTRAINT finance_ask_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: finance_ask_events finance_ask_events_visitor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_ask_events
    ADD CONSTRAINT finance_ask_events_visitor_id_fkey FOREIGN KEY (visitor_id) REFERENCES public.visitors(id);


--
-- Name: finance_asks finance_asks_last_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_asks
    ADD CONSTRAINT finance_asks_last_user_id_fkey FOREIGN KEY (last_user_id) REFERENCES public.users(id);


--
-- Name: finance_asks finance_asks_last_visitor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_asks
    ADD CONSTRAINT finance_asks_last_visitor_id_fkey FOREIGN KEY (last_visitor_id) REFERENCES public.visitors(id);


--
-- Name: finance_asks_users finance_asks_users_finance_ask_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_asks_users
    ADD CONSTRAINT finance_asks_users_finance_ask_id_fkey FOREIGN KEY (finance_ask_id) REFERENCES public.finance_asks(id);


--
-- Name: finance_asks_users finance_asks_users_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_asks_users
    ADD CONSTRAINT finance_asks_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: follows follows_followed_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_followed_id_fkey FOREIGN KEY (followed_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: follows follows_follower_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: games games_away_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_away_team_id_fkey FOREIGN KEY (away_team_id) REFERENCES public.teams(id) ON DELETE CASCADE;


--
-- Name: games games_home_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_home_team_id_fkey FOREIGN KEY (home_team_id) REFERENCES public.teams(id) ON DELETE CASCADE;


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: images images_context_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_context_id_fkey FOREIGN KEY (context_id) REFERENCES public.contexts(id);


--
-- Name: images images_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: leagues leagues_example_musing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leagues
    ADD CONSTRAINT leagues_example_musing_id_fkey FOREIGN KEY (example_musing_id) REFERENCES public.musings(id) ON DELETE SET NULL;


--
-- Name: links links_ask_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.links
    ADD CONSTRAINT links_ask_id_fkey FOREIGN KEY (ask_id) REFERENCES public.asks(id) ON DELETE CASCADE;


--
-- Name: links links_finance_ask_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.links
    ADD CONSTRAINT links_finance_ask_id_fkey FOREIGN KEY (finance_ask_id) REFERENCES public.finance_asks(id) ON DELETE CASCADE;


--
-- Name: links links_image_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.links
    ADD CONSTRAINT links_image_id_fkey FOREIGN KEY (image_id) REFERENCES public.images(id) ON DELETE CASCADE;


--
-- Name: links links_musing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.links
    ADD CONSTRAINT links_musing_id_fkey FOREIGN KEY (musing_id) REFERENCES public.musings(id) ON DELETE CASCADE;


--
-- Name: links links_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.links
    ADD CONSTRAINT links_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;


--
-- Name: links links_story_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.links
    ADD CONSTRAINT links_story_id_fkey FOREIGN KEY (story_id) REFERENCES public.stories(id) ON DELETE CASCADE;


--
-- Name: messages messages_musing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_musing_id_fkey FOREIGN KEY (musing_id) REFERENCES public.musings(id) ON DELETE SET NULL;


--
-- Name: messages messages_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;


--
-- Name: messages messages_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: messages messages_visitor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_visitor_id_fkey FOREIGN KEY (visitor_id) REFERENCES public.visitors(id) ON DELETE SET NULL;


--
-- Name: musings musings_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.musings
    ADD CONSTRAINT musings_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- Name: musings musings_league_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.musings
    ADD CONSTRAINT musings_league_id_fkey FOREIGN KEY (league_id) REFERENCES public.leagues(id) ON DELETE CASCADE;


--
-- Name: musings musings_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.musings
    ADD CONSTRAINT musings_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE SET NULL;


--
-- Name: musings_related_actors musings_related_actors_musing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.musings_related_actors
    ADD CONSTRAINT musings_related_actors_musing_id_fkey FOREIGN KEY (musing_id) REFERENCES public.musings(id) ON DELETE CASCADE;


--
-- Name: musings musings_template_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.musings
    ADD CONSTRAINT musings_template_game_id_fkey FOREIGN KEY (template_game_id) REFERENCES public.games(id);


--
-- Name: musings musings_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.musings
    ADD CONSTRAINT musings_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.templates(id) ON DELETE SET NULL;


--
-- Name: musings musings_template_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.musings
    ADD CONSTRAINT musings_template_team_id_fkey FOREIGN KEY (template_team_id) REFERENCES public.teams(id);


--
-- Name: musings musings_visitor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.musings
    ADD CONSTRAINT musings_visitor_id_fkey FOREIGN KEY (visitor_id) REFERENCES public.visitors(id) ON DELETE SET NULL;


--
-- Name: notes notes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: players players_league_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_league_id_fkey FOREIGN KEY (league_id) REFERENCES public.leagues(id);


--
-- Name: questions questions_context_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_context_id_fkey FOREIGN KEY (context_id) REFERENCES public.contexts(id);


--
-- Name: questions questions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: questions questions_visitor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_visitor_id_fkey FOREIGN KEY (visitor_id) REFERENCES public.visitors(id) ON DELETE SET NULL;


--
-- Name: reactions reactions_musing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reactions
    ADD CONSTRAINT reactions_musing_id_fkey FOREIGN KEY (musing_id) REFERENCES public.musings(id) ON DELETE CASCADE;


--
-- Name: reactions reactions_story_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reactions
    ADD CONSTRAINT reactions_story_id_fkey FOREIGN KEY (story_id) REFERENCES public.stories(id) ON DELETE CASCADE;


--
-- Name: reactions reactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reactions
    ADD CONSTRAINT reactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reactions reactions_visitor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reactions
    ADD CONSTRAINT reactions_visitor_id_fkey FOREIGN KEY (visitor_id) REFERENCES public.visitors(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: stories stories_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT stories_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: story_lines story_lines_image_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.story_lines
    ADD CONSTRAINT story_lines_image_id_fkey FOREIGN KEY (image_id) REFERENCES public.images(id) ON DELETE CASCADE;


--
-- Name: story_lines story_lines_note_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.story_lines
    ADD CONSTRAINT story_lines_note_id_fkey FOREIGN KEY (note_id) REFERENCES public.notes(id);


--
-- Name: story_lines story_lines_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.story_lines
    ADD CONSTRAINT story_lines_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;


--
-- Name: story_lines story_lines_story_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.story_lines
    ADD CONSTRAINT story_lines_story_id_fkey FOREIGN KEY (story_id) REFERENCES public.stories(id) ON DELETE CASCADE;


--
-- Name: teams teams_example_musing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_example_musing_id_fkey FOREIGN KEY (example_musing_id) REFERENCES public.musings(id) ON DELETE SET NULL;


--
-- Name: teams teams_league_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_league_id_fkey FOREIGN KEY (league_id) REFERENCES public.leagues(id);


--
-- Name: template_reports template_reports_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.template_reports
    ADD CONSTRAINT template_reports_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.templates(id) ON DELETE CASCADE;


--
-- Name: templates templates_league_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.templates
    ADD CONSTRAINT templates_league_id_fkey FOREIGN KEY (league_id) REFERENCES public.leagues(id);


--
-- Name: trend_queries trend_queries_league_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trend_queries
    ADD CONSTRAINT trend_queries_league_id_fkey FOREIGN KEY (league_id) REFERENCES public.leagues(id) ON DELETE SET NULL;


--
-- Name: trends trends_trend_query_pkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trends
    ADD CONSTRAINT trends_trend_query_pkey FOREIGN KEY (trend_query_id) REFERENCES public.trend_queries(id) ON DELETE SET NULL;


--
-- Name: users users_referrer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_referrer_id_fkey FOREIGN KEY (referrer_id) REFERENCES public.users(id);


--
-- Name: users_visitors users_visitors_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_visitors
    ADD CONSTRAINT users_visitors_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users_visitors users_visitors_visitor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_visitors
    ADD CONSTRAINT users_visitors_visitor_id_fkey FOREIGN KEY (visitor_id) REFERENCES public.visitors(id) ON DELETE CASCADE;


--
-- Name: visitors_favorite_leagues visitors_favorite_leagues_league_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitors_favorite_leagues
    ADD CONSTRAINT visitors_favorite_leagues_league_id_fkey FOREIGN KEY (league_id) REFERENCES public.leagues(id) ON DELETE CASCADE;


--
-- Name: visitors_favorite_leagues visitors_favorite_leagues_visitor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitors_favorite_leagues
    ADD CONSTRAINT visitors_favorite_leagues_visitor_id_fkey FOREIGN KEY (visitor_id) REFERENCES public.visitors(id) ON DELETE CASCADE;


--
-- Name: visitors_favorite_teams visitors_favorite_teams_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitors_favorite_teams
    ADD CONSTRAINT visitors_favorite_teams_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;


--
-- Name: visitors_favorite_teams visitors_favorite_teams_visitor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitors_favorite_teams
    ADD CONSTRAINT visitors_favorite_teams_visitor_id_fkey FOREIGN KEY (visitor_id) REFERENCES public.visitors(id) ON DELETE CASCADE;


--
-- Name: visitors visitors_last_referrer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitors
    ADD CONSTRAINT visitors_last_referrer_id_fkey FOREIGN KEY (last_referrer_id) REFERENCES public.users(id);


--
-- Name: visitors_pushed_musings visitors_pushed_musings_musing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitors_pushed_musings
    ADD CONSTRAINT visitors_pushed_musings_musing_id_fkey FOREIGN KEY (musing_id) REFERENCES public.musings(id) ON DELETE CASCADE;


--
-- Name: visitors_pushed_musings visitors_pushed_musings_visitor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitors_pushed_musings
    ADD CONSTRAINT visitors_pushed_musings_visitor_id_fkey FOREIGN KEY (visitor_id) REFERENCES public.visitors(id) ON DELETE CASCADE;


--
-- Name: visitors_seen_musings visitors_seen_musings_musing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitors_seen_musings
    ADD CONSTRAINT visitors_seen_musings_musing_id_fkey FOREIGN KEY (musing_id) REFERENCES public.musings(id) ON DELETE CASCADE;


--
-- Name: visitors_seen_musings visitors_seen_musings_visitor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitors_seen_musings
    ADD CONSTRAINT visitors_seen_musings_visitor_id_fkey FOREIGN KEY (visitor_id) REFERENCES public.visitors(id) ON DELETE CASCADE;


-- Completed on 2023-09-01 01:25:50 PDT

--
-- PostgreSQL database dump complete
--

