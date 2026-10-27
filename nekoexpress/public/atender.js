const formulario = document.querySelector("#atenderForm");
const resultado = document.querySelector("#resultadoAtender");
const boton = document.querySelector("#botonAtender");

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  resultado.textContent = "";
  resultado.className = "";

  if (!formulario.reportValidity()) return;

  const correo = document.querySelector("#correoAtender").value.trim();
  const clave = document.querySelector("#claveAdmin").value;

  boton.disabled = true;
  boton.textContent = "Procesando…";

  try {
    const respuesta = await fetch("/api/atender", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Clave-Admin": clave,
      },
      body: JSON.stringify({ correo }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      resultado.className = "error";
      resultado.textContent =
        datos.mensaje || "No se pudo actualizar la inscripción.";
      return;
    }

    resultado.className = "success";
    resultado.textContent =
      `¡Inscripción actualizada! Antes: ${datos.estadoAnterior}. ` +
      `Ahora: ${datos.estadoActual}.`;

    document.querySelector("#claveAdmin").value = "";
  } catch {
    resultado.className = "error";
    resultado.textContent =
      "No se pudo confirmar el resultado. Revisa el estado en Supabase antes de volver a intentarlo.";
  } finally {
    boton.disabled = false;
    boton.textContent = "Marcar como atendida";
  }
});
