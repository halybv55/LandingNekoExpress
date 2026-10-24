-- Ejecutar UNA VEZ en SQL Editor de un proyecto nuevo de Supabase.
-- FN0 académica: perfil compuesto JSON y listas multivaluadas. No normalizar aún.
create table public.inscritos_beta (
 id uuid primary key default gen_random_uuid(),
 nombre text not null check (char_length(trim(nombre)) between 2 and 80),
 correo text not null check (char_length(correo) <= 160 and correo ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'),
 perfil jsonb not null check (jsonb_typeof(perfil)='object' and perfil ? 'tipo' and perfil->>'tipo' in ('Estudiante','Jugador casual','Otro') and char_length(coalesce(perfil->>'organizacion',''))<=100),
 necesidades text[] not null check (cardinality(necesidades) between 1 and 3 and necesidades <@ array['Descansar unos minutos','Coleccionar gatitos','Superar mi puntuación']::text[]),
 intereses text[] not null check (cardinality(intereses)=1 and intereses <@ array['Beta gratuita','Neko Pass','Ambos']::text[]),
 comentario text not null default '' check(char_length(comentario)<=600),
 consentimiento boolean not null check(consentimiento),
 mayor_edad boolean not null check(mayor_edad),
 aviso_version text not null check(aviso_version='2026-10-24'),
 creado_en timestamptz not null default now()
);
create unique index inscritos_beta_correo_unico on public.inscritos_beta(lower(correo));
alter table public.inscritos_beta enable row level security;
revoke all on table public.inscritos_beta from anon, authenticated;
grant insert (nombre,correo,perfil,necesidades,intereses,comentario,consentimiento,mayor_edad,aviso_version) on public.inscritos_beta to anon;
create policy beta_solo_insertar on public.inscritos_beta for insert to anon
 with check (consentimiento = true and mayor_edad = true);
-- SIN políticas SELECT/UPDATE/DELETE ni grants para esos comandos.
-- Ver registros SOLO desde el Dashboard como propietario; no desde el frontend.
-- Antispam avanzado/CAPTCHA y límites por IP quedan pendientes para producción.
