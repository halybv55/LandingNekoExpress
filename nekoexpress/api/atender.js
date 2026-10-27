const crypto = require("node:crypto");

function claveCorrecta(recibida, esperada) {
  if (!recibida || !esperada) return false;

  const recibidaHash = crypto
    .createHash("sha256")
    .update(recibida)
    .digest();

  const esperadaHash = crypto
    .createHash("sha256")
    .update(esperada)
    .digest();

  return crypto.timingSafeEqual(recibidaHash, esperadaHash);
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "PUT") {
    res.setHeader("Allow", "PUT");
    return res.status(405).json({
      mensaje: "Este endpoint solo acepta solicitudes PUT.",
    });
  }

  const claveRecibida = req.headers["x-clave-admin"];

  if (!claveCorrecta(claveRecibida, process.env.CLAVE_ADMIN)) {
    return res.status(401).json({
      mensaje: "No tienes autorización para atender inscripciones.",
    });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    return res.status(500).json({
      mensaje: "El servidor todavía no está configurado correctamente.",
    });
  }

  const correo =
    typeof req.body?.correo === "string"
      ? req.body.correo.trim()
      : "";

  const correoValido =
    correo.length <= 160 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

  if (!correoValido) {
    return res.status(400).json({
      mensaje: "Ingresa un correo electrónico válido.",
    });
  }

  try {
    const respuesta = await fetch(
      `${supabaseUrl.replace(/\/$/, "")}/rest/v1/rpc/atender_inscripcion`,
      {
        method: "POST",
        
        headers: {
  apikey: supabaseSecretKey,
  "Content-Type": "application/json",
},
        body: JSON.stringify({
          correo_buscado: correo,
        }),
      }
    );

    if (!respuesta.ok) {
      return res.status(502).json({
        mensaje: "No se pudo actualizar la inscripción en Supabase.",
      });
    }

    const resultado = await respuesta.json();

    switch (resultado.resultado) {
      case "actualizada":
        return res.status(200).json(resultado);

      case "correo_invalido":
        return res.status(400).json(resultado);

      case "no_encontrada":
        return res.status(404).json(resultado);

      case "duplicada":
      case "estado_no_permitido":
        return res.status(409).json(resultado);

      default:
        return res.status(500).json({
          mensaje: "Se recibió una respuesta inesperada.",
        });
    }
  } catch {
    return res.status(502).json({
      mensaje: "No fue posible conectar con Supabase.",
    });
  }
};
