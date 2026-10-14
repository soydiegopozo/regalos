/* Regalos · contraseña sencilla ("de adorno").
   No es seguridad real: el contenido sigue en el código de la página. Sirve para que
   quien llegue a la URL sin registrarse vea una pantalla de contraseña.

   Uso en una página:
     <meta name="clave" content="HASH_SHA256_DE_LA_CONTRASEÑA">
     <script src="/acceso.js"></script>   (en el <head>, antes de los estilos)

   Link que abre solo (para la redirección de Systeme y el correo):
     https://regalos.diegopozo.com/mi-regalo/gracias/#clave=LaContraseña
   Para sacar el hash de una contraseña: /_plantilla/generar-clave/ */
(function () {
  var meta = document.querySelector('meta[name="clave"]');
  if (!meta || !meta.content) return;
  var expected = meta.content.trim().toLowerCase();
  var storeKey = "regalo-ok:" + location.pathname;
  var root = document.documentElement;

  function remembered() {
    try { return localStorage.getItem(storeKey) === expected; } catch (e) { return false; }
  }
  function remember() {
    try { localStorage.setItem(storeKey, expected); } catch (e) {}
  }
  async function sha256(text) {
    var data = new TextEncoder().encode(text.trim());
    var buf = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
  }
  function unlock() {
    root.classList.remove("bloqueado");
    var g = document.getElementById("candado");
    if (g) g.remove();
  }

  if (remembered()) return;
  root.classList.add("bloqueado");

  // Hide everything except the gate until unlocked.
  var style = document.createElement("style");
  style.textContent =
    "html.bloqueado body > *:not(#candado){display:none !important}" +
    "#candado{min-height:100vh;display:grid;place-items:center;padding:24px 16px}" +
    "#candado .box{width:100%;max-width:400px;background:var(--surface,#1b1610);border:1px solid var(--line,#332b1f);border-radius:16px;padding:26px;box-shadow:var(--shadow,none)}" +
    "#candado .eyebrow{font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--accent-text,#8fd65c);margin:0 0 10px}" +
    "#candado h1{font-family:var(--font-display,system-ui);font-weight:800;font-size:26px;letter-spacing:-.02em;line-height:1.1;margin:0 0 8px;color:var(--fg,#f2efe6)}" +
    "#candado p{color:var(--fg-soft,#aaa392);font-size:14px;line-height:1.5;margin:0 0 18px}" +
    "#candado input{width:100%;font:inherit;font-size:15px;padding:12px 13px;border-radius:10px;border:1px solid var(--line,#332b1f);background:var(--surface-2,#231d15);color:var(--fg,#f2efe6);outline:none;margin-bottom:10px}" +
    "#candado input:focus{border-color:var(--accent,#5fb027);box-shadow:0 0 0 3px var(--accent-soft,rgba(95,176,39,.15))}" +
    "#candado button{width:100%;font:inherit;font-size:15px;font-weight:700;padding:13px;border:0;border-radius:11px;background:var(--accent,#5fb027);color:var(--accent-ink,#0e1606);cursor:pointer}" +
    "#candado .err{color:var(--warn,#e7a54d);font-size:13px;margin:10px 0 0;min-height:1em}" +
    "#candado .alt{font-size:13px;margin:16px 0 0}";
  document.head.appendChild(style);

  async function tryPassword(pw) {
    if (!pw) return false;
    try {
      if ((await sha256(pw)) === expected) { remember(); unlock(); return true; }
    } catch (e) {}
    return false;
  }

  function buildGate() {
    var gate = document.createElement("div");
    gate.id = "candado";
    gate.innerHTML =
      '<form class="box" novalidate>' +
        '<p class="eyebrow">Soy Diego Pozo · Regalos</p>' +
        '<h1>Este regalo es para quienes se registraron</h1>' +
        '<p>Escribe la contraseña que te llegó por correo. Si todavía no te registras, hazlo y te la mando al instante.</p>' +
        '<input type="password" autocomplete="off" placeholder="Contraseña" aria-label="Contraseña" required>' +
        '<button type="submit">Entrar a mi regalo</button>' +
        '<p class="err" role="alert"></p>' +
        '<p class="alt"><a href="../">Registrarme para recibirlo</a></p>' +
      "</form>";
    document.body.prepend(gate);
    var form = gate.querySelector("form");
    var input = gate.querySelector("input");
    var err = gate.querySelector(".err");
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      err.textContent = "";
      if (!(await tryPassword(input.value))) {
        err.textContent = "Esa no es la contraseña. Revisa el correo que te llegó.";
        input.select();
      }
    });
    input.focus();
  }

  // Magic link: #clave=… unlocks without typing, then cleans the URL.
  var m = location.hash.match(/clave=([^&]+)/);
  var fromLink = m ? decodeURIComponent(m[1]) : "";

  document.addEventListener("DOMContentLoaded", async function () {
    if (fromLink) {
      history.replaceState(null, "", location.pathname + location.search);
      if (await tryPassword(fromLink)) return;
    }
    buildGate();
  });
})();
