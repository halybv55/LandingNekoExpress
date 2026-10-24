const vm = require("node:vm"),
  fs = require("node:fs"),
  assert = require("node:assert/strict");
const code = fs.readFileSync(__dirname + "/public/app.js", "utf8");
async function run({
  configured = true,
  status = 201,
  networkError = false,
  need = true,
  valid = true,
  bot = false,
} = {}) {
  let listener,
    calls = 0,
    resets = 0;
  const els = {};
  for (const id of [
    "message",
    "send",
    "connection",
    "nombre",
    "correo",
    "perfil",
    "organizacion",
    "interes",
    "comentario",
    "adulto",
    "consentimiento",
    "website",
  ])
    els[id] = { value: "", checked: true, disabled: false };
  Object.assign(els.nombre, { value: " Ana " });
  els.correo.value = "TEST@example.com";
  els.perfil.value = "Estudiante";
  els.interes.value = "Neko Pass";
  els.website.value = bot ? "spam" : "";
  const form = {
    reportValidity: () => valid,
    addEventListener: (name, fn) => (listener = fn),
    querySelectorAll: () => (need ? [{ value: "Coleccionar gatitos" }] : []),
    reset: () => resets++,
  };
  const document = {
    querySelector: (s) => (s === "#betaForm" ? form : els[s.slice(1)]),
    querySelectorAll: () => [],
  };
  const sandbox = {
    window: {
      NEKO_CONFIG: configured
        ? {
            supabaseUrl: "https://example.supabase.co",
            supabasePublicKey: "sb_publishable_test",
          }
        : {},
    },
    document,
    AbortController,
    setTimeout,
    clearTimeout,
    fetch: async (url, opts) => {
      calls++;
      const data = JSON.parse(opts.body);
      assert.equal(data.nombre, "Ana");
      assert.equal(data.correo, "test@example.com");
      assert.equal(opts.headers.Prefer, "return=minimal");
      assert.ok(!("tenantId" in data));
      if (networkError) throw Error("Offline");
      return { status };
    },
  };
  vm.runInNewContext(code, sandbox);
  await listener({ preventDefault() {} });
  return { calls, resets, message: els.message, send: els.send };
}
(async () => {
  let r = await run();
  assert.equal(r.calls, 1);
  assert.equal(r.resets, 1);
  assert.equal(r.message.className, "success");
  assert.equal(r.send.disabled, false);
  for (const opt of [
    { status: 400 },
    { status: 409 },
    { status: 500 },
    { status: 200 },
    { networkError: true },
  ]) {
    r = await run(opt);
    assert.equal(r.message.className, "error");
    assert.equal(r.resets, 0);
    assert.equal(r.send.disabled, false);
  }
  for (const opt of [
    { configured: false },
    { need: false },
    { valid: false },
    { bot: true },
  ]) {
    r = await run(opt);
    assert.equal(r.calls, 0);
    assert.equal(r.resets, 0);
  }
  console.log(
    "10 escenarios correctos: confirmación, errores, sin configuración y validación. Fetch simulado; no prueba Supabase real.",
  );
})();
