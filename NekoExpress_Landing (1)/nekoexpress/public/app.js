const config = window.NEKO_CONFIG || {};
const form = document.querySelector('#betaForm');
const message = document.querySelector('#message');
const send = document.querySelector('#send');
const configured = /^https:\/\/[a-z0-9.-]+\.supabase\.co\/?$/i.test(config.supabaseUrl || '') && /^(eyJ|sb_publishable_)/.test(config.supabasePublicKey || '');
document.querySelector('#connection').textContent = configured ? 'Inscripciones abiertas. Completa el formulario para solicitar acceso.' : 'Vista previa: las inscripciones se habilitarán cuando el responsable configure Supabase.';
for (const el of document.querySelectorAll('.contact')) el.textContent = `Responsable: ${config.responsable || 'pendiente de configurar'}. Contacto: ${config.contacto || 'pendiente de configurar antes de publicar'}.`;
for (const button of document.querySelectorAll('[data-dialog]')) button.addEventListener('click', () => document.getElementById(button.dataset.dialog).showModal());
for (const button of document.querySelectorAll('.close')) button.addEventListener('click', () => button.closest('dialog').close());
form.addEventListener('submit', async (event) => {
 event.preventDefault(); message.className=''; message.textContent='';
 if (send.disabled || !form.reportValidity()) return;
 const necesidades = [...form.querySelectorAll('[name=necesidad]:checked')].map(el => el.value);
 const nombre = document.querySelector('#nombre').value.trim();
 if (nombre.length < 2 || !necesidades.length) { message.className='error'; message.textContent='Escribe un nombre válido y selecciona al menos una necesidad.'; return; }
 if (!configured) { message.className='error'; message.textContent='El formulario aún no está conectado. No se guardaron tus datos.'; return; }
 if (document.querySelector('#website').value) { message.className='error'; message.textContent='No se pudo validar la solicitud.'; return; }
 const payload = { nombre, correo:document.querySelector('#correo').value.trim().toLowerCase(), perfil:{tipo:document.querySelector('#perfil').value,organizacion:document.querySelector('#organizacion').value.trim()}, necesidades, intereses:[document.querySelector('#interes').value], comentario:document.querySelector('#comentario').value.trim(), consentimiento:document.querySelector('#consentimiento').checked, mayor_edad:document.querySelector('#adulto').checked, aviso_version:'2026-10-24' };
 send.disabled=true; send.textContent='Guardando…';
 const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 12000);
 try {
  const response=await fetch(config.supabaseUrl.replace(/\/$/,'')+'/rest/v1/inscritos_beta',{method:'POST',headers:{apikey:config.supabasePublicKey,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(payload),signal:controller.signal});
  if (![201,204].includes(response.status)) throw new Error('Registro rechazado');
  form.reset(); message.className='success'; message.textContent='¡Solicitud guardada! El responsable coordinará el acceso por correo. Aún no se creó una cuenta de juego.';
 } catch(error) {message.className='error';message.textContent=error.name==='AbortError'?'No pudimos confirmar el registro a tiempo. Contacta al responsable antes de repetirlo.':'No se pudo guardar. Si ya te registraste, contacta al responsable; de lo contrario revisa tu conexión e inténtalo nuevamente.';}
 finally {clearTimeout(timer);send.disabled=false;send.textContent='Solicitar acceso a la beta';}
});

// Guardar la preferencia elegida sin registrar ni comprar automáticamente.
for (const link of document.querySelectorAll('[data-interest]')) {
 link.addEventListener('click', () => {
  document.querySelector('#interes').value = link.dataset.interest;
 });
}
