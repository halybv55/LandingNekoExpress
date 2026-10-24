-- SOLO si ya creaste la tabla con la versión anterior.
-- Conserva los registros y las opciones antiguas. No volver a ejecutar 01.
begin;
alter table public.inscritos_beta drop constraint inscritos_beta_intereses_check;
alter table public.inscritos_beta add constraint inscritos_beta_intereses_check
 check (cardinality(intereses)=1 and intereses <@ array['Beta gratuita','Sin anuncios','Pase de temporada','Neko Club','Aún no decido','Neko Pass','Ambos']::text[]);
commit;
