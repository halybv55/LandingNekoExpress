# Tecnologías y paquetes

## Incluido en este ZIP
- HTML5: estructura y validación nativa del formulario.
- CSS3: diseño responsive sin Bootstrap, Tailwind ni fuentes externas.
- JavaScript ES2020+: validación, estados y fetch a Supabase REST.
- Supabase/PostgreSQL: una tabla FN0 y Row Level Security (SQL incluido).
- Vercel: hosting estático; vercel.json incluido.
No hay paquetes npm obligatorios ni archivos node_modules. No necesitas React ni Next.js.

## Herramientas opcionales
- VS Code o Visual Studio 2022 para editar los archivos.
- Python 3 para servidor local, o extensión Live Server.
- Node.js LTS SOLO si usas Vercel CLI: https://nodejs.org/
- Vercel CLI: https://vercel.com/docs/cli
- Supabase: https://supabase.com/docs/guides/api

## Tu backend existente, separado de esta landing
- Visual Studio 2022 y .NET 8 (ASP.NET Core Web API).
- PostgreSQL y proveedor Npgsql.EntityFrameworkCore.PostgreSQL 8.x compatible con EF8.
- Microsoft.EntityFrameworkCore.Design y Tools 8.x.
- Swashbuckle.AspNetCore para OpenAPI y Scalar.AspNetCore para documentación.
- Yarp.ReverseProxy para Gateway.
Estos paquetes se instalan en NuGet dentro de los proyectos .NET correspondientes.
Este ZIP NO reemplaza tu solución .NET ni contiene su código.
No cambies las versiones de tu solución si ya funcionan. Mantén EF en la rama 8.x.

## Instaladores
Los instaladores oficiales no se empaquetan. Este archivo identifica lo que se utiliza;
la landing funciona sin SDK de .NET y sin instalar PostgreSQL en el equipo visitante.
