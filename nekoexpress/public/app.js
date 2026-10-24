const config = window.NEKO_CONFIG || {};

const form = document.querySelector("#betaForm");
const message = document.querySelector("#message");
const send = document.querySelector("#send");
const interes = document.querySelector("#interes");

const configured =
  /^https:\/\/[a-z0-9.-]+\.supabase\.co\/?$/i.test(
    config.supabaseUrl || ""
  ) &&
  /^(eyJ|sb_publishable_)/.test(config.supabasePublicKey || "");

document.querySelector("#connection").textContent = configured
  ? "Inscripciones abiertas. Completa el formulario para solicitar acceso."
  : "Las inscripciones se habilitarán cuando el responsable configure Supabase.";

for (const element of document.querySelectorAll(".contact")) {
  element.textContent =
    `Responsable: ${config.responsable || "pendiente de configurar"}. ` +
    `Contacto: ${config.contacto || "pendiente de configurar"}.`;
}

// Abrir y cerrar los avisos.
for (const button of document.querySelectorAll("[data-dialog]")) {
  button.addEventListener("click", () => {
    const dialog = document.getElementById(button.dataset.dialog);

    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  });
}

for (const button of document.querySelectorAll(".close")) {
  button.addEventListener("click", () => {
    button.closest("dialog").close();
  });
}

// Los botones de planes seleccionan una opción compatible
// con los valores que ya utilizaba el formulario.
for (const link of document.querySelectorAll("[data-interest]")) {
  link.addEventListener("click", () => {
    const value = link.dataset.interest;

    if ([...interes.options].some(option => option.value === value)) {
      interes.value = value;
    }
  });
}

// Registrar una solicitud de acceso.
form.addEventListener("submit", async event => {
  event.preventDefault();

  message.className = "";
  message.textContent = "";

  if (send.disabled || !form.reportValidity()) {
    return;
  }

  const nombre = document.querySelector("#nombre").value.trim();

  const necesidades = [
    ...form.querySelectorAll('[name="necesidad"]:checked')
  ].map(element => element.value);

  if (nombre.length < 2) {
    message.className = "error";
    message.textContent = "Escribe un nombre o alias de al menos 2 caracteres.";
    document.querySelector("#nombre").focus();
    return;
  }

  if (!necesidades.length) {
    message.className = "error";
    message.textContent = "Selecciona al menos una opción en «¿Qué buscas?».";
    form.querySelector('[name="necesidad"]').focus();
    return;
  }

  if (!configured) {
    message.className = "error";
    message.textContent =
      "El formulario todavía no está conectado. No se guardaron tus datos.";
    return;
  }

  if (document.querySelector("#website").value) {
    message.className = "error";
    message.textContent = "No se pudo validar la solicitud.";
    return;
  }

  const payload = {
    nombre,
    correo: document.querySelector("#correo").value.trim().toLowerCase(),

    perfil: {
      tipo: document.querySelector("#perfil").value,
      organizacion: document.querySelector("#organizacion").value.trim()
    },

    necesidades,
    intereses: [interes.value],
    comentario: document.querySelector("#comentario").value.trim(),
    consentimiento: document.querySelector("#consentimiento").checked,
    mayor_edad: document.querySelector("#adulto").checked,
    aviso_version: "2026-10-24"
  };

  send.disabled = true;
  send.textContent = "Guardando…";
  form.setAttribute("aria-busy", "true");

  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, 12000);

  try {
    const response = await fetch(
      config.supabaseUrl.replace(/\/$/, "") +
        "/rest/v1/inscritos_beta",
      {
        method: "POST",

        headers: {
          apikey: config.supabasePublicKey,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },

        body: JSON.stringify(payload),
        signal: controller.signal
      }
    );

    if (![201, 204].includes(response.status)) {
      throw new Error("Registro rechazado");
    }

    form.reset();

    message.className = "success";
    message.textContent =
      "¡Solicitud guardada! 🐾 Coordinaremos tu prueba por correo. " +
      "El registro no realiza una compra ni crea una cuenta de juego.";

  } catch (error) {
    message.className = "error";

    message.textContent = error.name === "AbortError"
      ? "No pudimos confirmar el registro a tiempo. " +
        "Contacta al responsable antes de repetirlo."
      : "No se pudo guardar la solicitud. Si ya te registraste, " +
        "contacta al responsable. De lo contrario, revisa tu conexión " +
        "e inténtalo nuevamente.";

  } finally {
    clearTimeout(timer);

    send.disabled = false;
    send.textContent = "Solicitar acceso a la beta";
    form.removeAttribute("aria-busy");
  }
});