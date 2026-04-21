-- Extensions
create extension if not exists pgcrypto;
create extension if not exists citext;
create extension if not exists postgis;
create extension if not exists pg_trgm;
create extension if not exists btree_gist;
create extension if not exists moddatetime schema extensions;
create extension if not exists pg_jsonschema;

-- Helper: auto-update updated_at on every write
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- Domain enums
create type public.user_role as enum ('owner','manager','worker','vet','agronomist','accountant','customer');
create type public.sex as enum ('male','female','unknown');
create type public.animal_lifecycle as enum ('calf','heifer','lactating','dry','pregnant','breeding_bull','retired','sold','deceased');
create type public.animal_health_state as enum ('healthy','in_heat','sick','quarantined','recovering','weaning');
create type public.flock_purpose as enum ('layer','broiler','breeding','meat_goat','dairy_goat','meat_sheep','wool_sheep','dual_purpose');
create type public.device_status as enum ('online','offline','warn','maintenance','retired');
create type public.task_status as enum ('backlog','today','in_progress','done','cancelled');
create type public.task_priority as enum ('low','medium','high','urgent');
create type public.subsidy_status as enum ('eligible','draft','ready','submitted','approved','rejected','disbursed','expired');
create type public.order_status as enum ('new','confirmed','packing','routed','out_for_delivery','delivered','cancelled','refunded');
create type public.subscription_status as enum ('active','paused','cancelled','ended');
create type public.cert_status as enum ('valid','expiring_soon','expired','pending','revoked');
create type public.event_source as enum ('manual','sensor','rule','ml','external','vet','api','import');
create type public.health_event_type as enum ('observation','symptom','diagnosis','treatment','vaccination','deworming','surgery','recovery','quarantine','death');
create type public.breeding_event_type as enum ('heat_observed','heat_predicted','service','natural_mating','pregnancy_check','abortion','parturition','weaning');
create type public.production_type as enum ('milk','egg','weight','meat','honey','manure','fleece','vegetable','grain','fruit');
create type public.welfare_signal as enum ('panting','crowding','vocalization','lameness','body_condition','huddling','pecking','mounting','predator','normal');
create type public.plot_stage as enum ('fallow','prep','sown','germination','vegetative','tillering','flowering','fruiting','ripening','harvest','post_harvest');
create type public.transaction_type as enum ('income','expense','transfer','adjustment');
create type public.payment_status as enum ('pending','processing','paid','failed','refunded');
create type public.quarantine_reason as enum ('antibiotic_withdrawal','disease','suspected','voluntary');
create type public.inventory_category as enum ('feed','seed','medicine','vaccine','fertilizer','bio_input','packaging','equipment','harvested_produce','processed_goods','other');
create type public.cost_center_type as enum ('dairy','small_ruminants','poultry','crops','storefront','infra','admin','compost','other');
create type public.unit_system as enum ('metric','imperial','count','currency');
