# Neko Express — Landing beta

## Qué contiene
Landing estática adaptable a celular/computadora. No necesita npm install ni framework.
El registro guarda en Supabase mediante REST. No conecta el juego, el Gateway ni .NET.
No cobra, asigna tenants ni suscribe automáticamente. No contiene claves privadas.

## 1. Supabase
1. Crea tu proyecto en https://supabase.com/dashboard.
2. Ejecuta `supabase/01_inscritos_beta.sql` en SQL Editor UNA VEZ.
3. En Settings > API obtén Project URL y clave pública publishable (o anon legacy).
4. Edita `public/config.js`: supabaseUrl, supabasePublicKey, responsable y contacto.
   La clave pública es visible por diseño. NUNCA uses service_role ni secret key.
5. Revisa y adapta el aviso de privacidad y su plazo de eliminación antes de publicar.

## 2. Probar en Windows
Abre terminal en esta carpeta: `py -m http.server 5500 --directory public`
Visita http://localhost:5500. También puedes usar Live Server de VS Code.
Envía datos de prueba tuyos; revisa Table Editor > inscritos_beta.
El éxito solo aparece si el servidor confirma 201 o 204.
Sin configuración muestra un aviso y no simula registros.

## 3. Subir a Vercel
Descomprime el ZIP primero. Vercel no importa este ZIP como proyecto directamente.
Opción A: sube el contenido de ESTA carpeta a un repositorio GitHub, importa ese
repositorio en Vercel y conserva vercel.json. Framework: Other. Output: public.
Opción B: instala Node.js LTS, abre terminal aquí y ejecuta `npx vercel --prod`.
Inicia sesión y crea un proyecto. No necesita build command ni dependencias.
Configura config.js ANTES de desplegar. Confirma la URL pública en otro dispositivo.
El iframe no es necesario: comparte directamente la URL pública de la landing.

## 4. Evidencias que debes obtener
- URL real en Vercel y captura en celular y escritorio.
- Formulario inválido rechazado y correo válido guardado en Supabase.
- Fecha del registro, sin mostrar correos ajenos en capturas.
- GET /rest/v1/inscritos_beta?select=* con SOLO apikey pública: debe ser rechazado.
- PATCH y DELETE con esa misma clave: deben ser rechazados.
- Segundo registro con mismo correo: error, sin duplicación.
- Corte de conexión: mensaje de error; no mostrar éxito.
- Prueba con 5 personas y feedback real: completar el informe.
No registres aquí contraseñas ni tenantId; entrega el tenant en privado desde tu proceso .NET.

## 5. Límites
RLS impide leer la tabla desde la clave pública. No evita por sí sola spam ni abuso.
Para producción añade validación robusta de correo, CAPTCHA/Edge Function, rate limiting,
autenticación y autorización por tenant. X-Tenant por sí sola no prueba identidad.
La landing no incluye analítica ni cookies publicitarias. Conservación de 90 días manual.

## Pruebas locales incluidas
`node --check public/app.js` comprueba sintaxis.
Las pruebas de conexión real requieren TU proyecto Supabase y despliegue Vercel.

## Actualización comercial
La landing distingue compra permanente sin anuncios, pase por temporada y Neko Club.
Precios por definir. No procesa compras ni ofrece los modos adicionales como terminados.
Si aún NO creaste Supabase, ejecuta solo 01_inscritos_beta.sql.
Si YA ejecutaste la versión anterior de 01, ejecuta SOLO 02_actualizar_intereses.sql.
02 conserva los inscritos anteriores y habilita las nuevas preferencias del formulario.
La elección de una tarjeta preselecciona el interés; no compra ni suscribe.
El PDF y Word anteriores conservan la propuesta inicial y requieren actualizarse
si se usan para presentar este nuevo esquema comercial.
