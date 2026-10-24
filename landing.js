// ════════════════════════════════════════════════════════════
//  CONFIGURACIÓN — Personaliza tus datos de cobro y contacto
// ════════════════════════════════════════════════════════════
const CONFIG = {
  // Datos para transferencias locales (Ecuador u otro país)
  banco:     "Banco Pichincha | Cta Ahorros #1234567890 | Nombre: Tu Nombre | CI: 1700000000",

  // Billetera cripto USDT TRC20
  crypto:    "USDT TRC20: Txxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",

  // Número de WhatsApp con código de país (ej: +593991234567)
  whatsapp:  "+593978868363",

  // Correo de contacto/soporte
  email:     "mlandsoftware@gmail.com",

  // Precio referencial
  precio:    "$59 USD",
};

// ════════════════════════════════════════════════════════════
//  INICIALIZACIÓN SEGURA DE DATOS AL CARGAR LA PÁGINA
// ════════════════════════════════════════════════════════════
function initPaymentValues() {
  const setEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  const setData = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.dataset.copy = val;
  };

  setEl("bancoVal", CONFIG.banco);
  setEl("cryptoVal", CONFIG.crypto);

  setData("optBanco", CONFIG.banco);
  setData("optCrypto", CONFIG.crypto);
}

// ════════════════════════════════════════════════════════════
//  ESTADO DEL CLIENTE
// ════════════════════════════════════════════════════════════
let cliente = { nombre: "", email: "", pais: "" };

// ════════════════════════════════════════════════════════════
//  FORMULARIO DE COMPRA (TRANSFERENCIA / USDT) → ABRIR MODAL
// ════════════════════════════════════════════════════════════
const buyForm = document.getElementById("buyForm");
if (buyForm) {
  buyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = (document.getElementById("fNombre")?.value || "").trim();
    const email  = (document.getElementById("fEmail")?.value || "").trim().toLowerCase();
    const pais   = (document.getElementById("fPais")?.value || "").trim();
    const fMsg   = document.getElementById("fMsg");

    if (!nombre || !email || !pais) {
      if (fMsg) fMsg.textContent = "Por favor completa tu nombre, correo y país.";
      return;
    }
    if (fMsg) fMsg.textContent = "";

    cliente = { nombre, email, pais };

    const mNombre = document.getElementById("mNombre");
    if (mNombre) mNombre.textContent = nombre;

    // Generar enlaces de WhatsApp y Correo con el mensaje prellenado
    actualizarEnlacesContacto(nombre, email, pais);

    abrirModal();
  });
}

function actualizarEnlacesContacto(nombre, email, pais) {
  // WhatsApp
  const numLimpio = CONFIG.whatsapp.replace(/\D/g, "");
  const btnWA = document.getElementById("btnWhatsapp");
  if (btnWA) {
    const msgWA = encodeURIComponent(
      `¡Hola! Deseo adquirir la Guía Maestra de Importación China LATAM 2026 (${CONFIG.precio}).\n\n` +
      `• Nombre: ${nombre}\n` +
      `• Correo: ${email}\n` +
      `• País: ${pais}\n\n` +
      `Por favor indícame los pasos para confirmar mi pago.`
    );
    btnWA.href = `https://wa.me/${numLimpio}?text=${msgWA}`;
  }

  // Correo
  const btnEmail = document.getElementById("btnEmail");
  if (btnEmail) {
    const asunto = encodeURIComponent(`Compra: Guía Maestra Importación China LATAM 2026 (${nombre})`);
    const cuerpo = encodeURIComponent(
      `Hola,\n\nDeseo adquirir la Guía Maestra de Importación China LATAM 2026 (${CONFIG.precio}).\n\n` +
      `• Nombre: ${nombre}\n` +
      `• Correo: ${email}\n` +
      `• País: ${pais}\n\n` +
      `Adjunto comprobante o quedo a la espera de confirmación.\n\nSaludos cordiales.`
    );
    btnEmail.href = `mailto:${CONFIG.email}?subject=${asunto}&body=${cuerpo}`;
  }
}

// ════════════════════════════════════════════════════════════
//  CONTROL DEL MODAL (ABRIR / CERRAR)
// ════════════════════════════════════════════════════════════
function abrirModal() {
  const modal = document.getElementById("modal");
  if (modal) {
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

function cerrarModal() {
  const modal = document.getElementById("modal");
  if (modal) {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }
}

const modalCerrar = document.getElementById("modalCerrar");
if (modalCerrar) modalCerrar.addEventListener("click", cerrarModal);

const modalBg = document.getElementById("modal");
if (modalBg) {
  modalBg.addEventListener("click", (e) => {
    if (e.target === modalBg) cerrarModal();
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") cerrarModal();
});

// ════════════════════════════════════════════════════════════
//  SISTEMA INTELIGENTE DE COPIADO AL PORTAPAPELES
//  (Funciona al hacer clic en el botón O en cualquier parte de la tarjeta)
// ════════════════════════════════════════════════════════════
document.querySelectorAll(".pay-opt").forEach(opt => {
  const btn = opt.querySelector(".btn-copy");
  
  // Manejador centralizado de copiado
  const ejecutarCopia = (e) => {
    // Si es enlace y el usuario da clic al texto para abrirlo, permitirlo
    if (e.target.tagName === "A") return;

    const texto = opt.dataset.copy || "";
    if (!texto) return;

    copiarTexto(texto, btn, opt);
  };

  opt.addEventListener("click", ejecutarCopia);
});

function copiarTexto(texto, btn, opt) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(texto)
      .then(() => animarCopiaExitosa(btn, opt))
      .catch(() => fallbackCopia(texto, btn, opt));
  } else {
    fallbackCopia(texto, btn, opt);
  }
}

function animarCopiaExitosa(btn, opt) {
  if (btn) {
    btn.textContent = "¡Copiado!";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.textContent = "Copiar";
      btn.classList.remove("copied");
    }, 2000);
  }
  if (opt) {
    opt.style.borderColor = "#0D9488";
    setTimeout(() => {
      opt.style.borderColor = "";
    }, 800);
  }
}

function fallbackCopia(texto, btn, opt) {
  const ta = document.createElement("textarea");
  ta.value = texto;
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  ta.style.top = "-9999px";
  ta.setAttribute("readonly", "");
  document.body.appendChild(ta);
  ta.select();
  ta.setSelectionRange(0, 99999); // Compatible con iOS Safari

  try {
    const ok = document.execCommand("copy");
    if (ok) animarCopiaExitosa(btn, opt);
  } catch (_) {
    // Silencioso
  } finally {
    document.body.removeChild(ta);
  }
}

// ════════════════════════════════════════════════════════════
//  BOTÓN "YA PAGUÉ, QUIERO MI ACCESO" (ENVÍO COMPROBANTE)
// ════════════════════════════════════════════════════════════
const btnEnviar = document.getElementById("btnEnviar");
if (btnEnviar) {
  btnEnviar.addEventListener("click", () => {
    const comprobante = (document.getElementById("mComprobante")?.value || "").trim();
    const mMsg = document.getElementById("mMsg");

    if (!cliente.nombre) {
      if (mMsg) {
        mMsg.className = "err";
        mMsg.textContent = "Por favor completa primero tus datos en el formulario.";
      }
      return;
    }

    const numLimpio = CONFIG.whatsapp.replace(/\D/g, "");
    const msgWA = encodeURIComponent(
      `¡Hola! Acabo de realizar mi pago por la Guía Maestra de Importación China LATAM 2026 (${CONFIG.precio}).\n\n` +
      `• Nombre: ${cliente.nombre}\n` +
      `• Correo: ${cliente.email}\n` +
      `• País: ${cliente.pais}\n\n` +
      (comprobante ? `• Detalle / Comprobante:\n${comprobante}\n\n` : "") +
      `Por favor verifícalo para recibir el enlace de descarga.`
    );
    const waURL = `https://wa.me/${numLimpio}?text=${msgWA}`;

    btnEnviar.disabled = true;
    btnEnviar.textContent = "Abriendo WhatsApp...";

    if (mMsg) {
      mMsg.className = "";
      mMsg.textContent = "✅ Abriendo WhatsApp para enviar comprobante. En menos de 1 hora hábil recibirás tu acceso.";
    }

    setTimeout(() => {
      window.open(waURL, "_blank", "noopener,noreferrer");
      btnEnviar.disabled = false;
      btnEnviar.textContent = "Ya pagué, quiero mi acceso →";
    }, 600);
  });
}

// ════════════════════════════════════════════════════════════
//  DESPLAZAMIENTO SUAVE (SMOOTH SCROLL)
// ════════════════════════════════════════════════════════════
document.querySelectorAll('a[href="#comprar"]').forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.getElementById("comprar");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Inicializar al cargar
document.addEventListener("DOMContentLoaded", initPaymentValues);
// Y ejecutar inmediatamente por si ya cargó
initPaymentValues();
