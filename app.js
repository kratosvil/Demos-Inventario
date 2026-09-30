"use strict";

/* =========================================================================
   iStore — Demo interactivo (sin backend)
   =========================================================================
   Version demo con datos mockeados en memoria. No requiere servidor —
   funciona como archivo estatico en GitHub Pages o cualquier hosting.
   ========================================================================= */

// ---------------------------------------------------------------- Mock API --

const DEMO_USUARIOS = [
  { id: 1, nombre: "admin", rol: "admin", activo: true, debe_cambiar_password: false, creado_por_nombre: null },
  { id: 2, nombre: "encargado", rol: "encargado", activo: true, debe_cambiar_password: false, creado_por_nombre: "admin" },
];

const DEMO_PRODUCTOS = [
  { id: 1, nombre: "MacBook Air M3", categoria: "Laptops", stock_unidades: 12, costo_por_unidad: 3440000, costo_por_caja: 3440000, precio_venta_unidad: 4299000, unidad_compra: "unidad", factor_conversion: 1, margen_pct: 25, activo: true },
  { id: 2, nombre: "MacBook Pro 14\" M3 Pro", categoria: "Laptops", stock_unidades: 6, costo_por_unidad: 5999000, costo_por_caja: 5999000, precio_venta_unidad: 7499000, unidad_compra: "unidad", factor_conversion: 1, margen_pct: 25, activo: true },
  { id: 3, nombre: "iPad Air M2", categoria: "Tablets", stock_unidades: 15, costo_por_unidad: 2159000, costo_por_caja: 2159000, precio_venta_unidad: 2699000, unidad_compra: "unidad", factor_conversion: 1, margen_pct: 25, activo: true },
  { id: 4, nombre: "iPad Pro 13\" M4", categoria: "Tablets", stock_unidades: 8, costo_por_unidad: 4159000, costo_por_caja: 4159000, precio_venta_unidad: 5199000, unidad_compra: "unidad", factor_conversion: 1, margen_pct: 25, activo: true },
  { id: 5, nombre: "Apple Watch Series 10", categoria: "Wearables", stock_unidades: 20, costo_por_unidad: 1439000, costo_por_caja: 1439000, precio_venta_unidad: 1799000, unidad_compra: "unidad", factor_conversion: 1, margen_pct: 25, activo: true },
  { id: 6, nombre: "AirPods Pro 2", categoria: "Audio", stock_unidades: 25, costo_por_unidad: 919000, costo_por_caja: 919000, precio_venta_unidad: 1149000, unidad_compra: "unidad", factor_conversion: 1, margen_pct: 25, activo: true },
  { id: 7, nombre: "iPhone 16 Pro 256GB", categoria: "iPhone", stock_unidades: 10, costo_por_unidad: 4399000, costo_por_caja: 4399000, precio_venta_unidad: 5499000, unidad_compra: "unidad", factor_conversion: 1, margen_pct: 25, activo: true },
  { id: 8, nombre: "Magic Keyboard", categoria: "Accesorios", stock_unidades: 18, costo_por_unidad: 479000, costo_por_caja: 479000, precio_venta_unidad: 599000, unidad_compra: "unidad", factor_conversion: 1, margen_pct: 25, activo: true },
];

const DEMO_CLIENTES = [
  { id: 1, nombre: "Empresa TechCorp", es_inversionista: false, pct_descuento: 0, activo: true, estado: "abierta", saldo_pendiente: 6497000, total_a_cobrar: 6497000, descuento_estimado: 0, consumos_pendientes: [{ producto_nombre: "AirPods Pro 2", cantidad: 2, subtotal: 2298000 }, { producto_nombre: "MacBook Air M3", cantidad: 1, subtotal: 4199000 }], creado_por_nombre: "encargado" },
  { id: 2, nombre: "Laura Martinez (VIP)", es_inversionista: true, pct_descuento: 10, activo: true, estado: "abierta", saldo_pendiente: 7298000, total_a_cobrar: 6568200, descuento_estimado: 729800, consumos_pendientes: [{ producto_nombre: "iPad Pro 13\" M4", cantidad: 1, subtotal: 5199000 }, { producto_nombre: "Apple Watch Series 10", cantidad: 1, subtotal: 1799000 }, { producto_nombre: "Magic Keyboard", cantidad: 1, subtotal: 599000 }], creado_por_nombre: "admin" },
  { id: 3, nombre: "Oficina 3er Piso", es_inversionista: false, pct_descuento: 0, activo: true, estado: "saldada", saldo_pendiente: 0, total_a_cobrar: 0, descuento_estimado: 0, consumos_pendientes: [], creado_por_nombre: "admin" },
];

const DEMO_VENTAS_REPORTE = {
  por_metodo_pago: [
    { metodo_pago: "tarjeta", cantidad_transacciones: 18, total: 45600000 },
    { metodo_pago: "nequi", cantidad_transacciones: 10, total: 12500000 },
    { metodo_pago: "efectivo", cantidad_transacciones: 5, total: 8900000 },
  ],
  por_usuario: [
    { usuario_nombre: "admin", cantidad_transacciones: 20, total: 42000000 },
    { usuario_nombre: "encargado", cantidad_transacciones: 13, total: 25000000 },
  ],
  total_general: 67000000,
};

const DEMO_MOVIMIENTOS = [
  { tipo: "entrada", cantidad_unidades: 24, referencia: "Factura #1042", fecha: new Date(Date.now() - 86400000 * 2).toISOString() },
  { tipo: "entrada", cantidad_unidades: 24, referencia: "Factura #1038", fecha: new Date(Date.now() - 86400000 * 7).toISOString() },
];

let nextProductoId = 9;
let nextClienteId = 4;
let nextUsuarioId = 3;

// Deep clone helper
function cloneData(d) { return JSON.parse(JSON.stringify(d)); }

// Mock API router
async function mockApi(path, { method = "GET", body } = {}) {
  // Simulate small delay for realism
  await new Promise(r => setTimeout(r, 80));

  // Auth
  if (path === "/auth/login" || path.startsWith("/auth/login")) {
    return { access_token: "demo-token-xyz" };
  }
  if (path === "/auth/me") {
    return cloneData(state.usuario || DEMO_USUARIOS[0]);
  }
  if (path === "/auth/cambiar-password") {
    toast("(Demo) Contrasena cambiada correctamente");
    if (state.usuario) state.usuario.debe_cambiar_password = false;
    return {};
  }

  // Productos
  if (path === "/productos" && method === "GET") {
    return cloneData(DEMO_PRODUCTOS.filter(p => p.activo));
  }
  if (path === "/productos/precios" || path.startsWith("/productos/precios")) {
    return cloneData(DEMO_PRODUCTOS);
  }
  if (path === "/productos" && method === "POST") {
    const p = { id: nextProductoId++, ...body, stock_unidades: body.stock_unidades || 0, margen_pct: body.precio_venta_unidad && body.costo_por_caja && body.factor_conversion ? Math.round(((body.precio_venta_unidad / (body.costo_por_caja / body.factor_conversion)) - 1) * 100) : 0, costo_por_unidad: body.costo_por_caja && body.factor_conversion ? Math.round(body.costo_por_caja / body.factor_conversion) : 0, activo: true };
    DEMO_PRODUCTOS.push(p);
    return cloneData(p);
  }
  const prodMatch = path.match(/^\/productos\/(\d+)$/);
  if (prodMatch && method === "PATCH") {
    const p = DEMO_PRODUCTOS.find(x => x.id === Number(prodMatch[1]));
    if (p) Object.assign(p, body);
    return cloneData(p);
  }
  if (prodMatch && method === "DELETE") {
    const p = DEMO_PRODUCTOS.find(x => x.id === Number(prodMatch[1]));
    if (p) p.activo = false;
    return {};
  }
  const prodRestaurar = path.match(/^\/productos\/(\d+)\/restaurar$/);
  if (prodRestaurar && method === "POST") {
    const p = DEMO_PRODUCTOS.find(x => x.id === Number(prodRestaurar[1]));
    if (p) p.activo = true;
    return {};
  }
  const prodEntradas = path.match(/^\/productos\/(\d+)\/entradas$/);
  if (prodEntradas && method === "POST") {
    const p = DEMO_PRODUCTOS.find(x => x.id === Number(prodEntradas[1]));
    if (p) p.stock_unidades += body.cantidad_unidades;
    return {};
  }
  const prodDev = path.match(/^\/productos\/(\d+)\/devoluciones$/);
  if (prodDev && method === "POST") {
    const p = DEMO_PRODUCTOS.find(x => x.id === Number(prodDev[1]));
    if (p) p.stock_unidades = Math.max(0, p.stock_unidades - body.cantidad_unidades);
    return {};
  }
  const prodMov = path.match(/^\/productos\/(\d+)\/movimientos$/);
  if (prodMov) {
    return cloneData(DEMO_MOVIMIENTOS);
  }

  // Ventas
  if (path === "/ventas" && method === "POST") {
    let total = 0;
    for (const item of body.items) {
      const p = DEMO_PRODUCTOS.find(x => x.id === item.producto_id);
      if (p) {
        p.stock_unidades = Math.max(0, p.stock_unidades - item.cantidad);
        total += p.precio_venta_unidad * item.cantidad;
      }
    }
    return { total };
  }

  // Clientes
  if (path === "/clientes" && method === "GET" || path.startsWith("/clientes?")) {
    return cloneData(DEMO_CLIENTES);
  }
  if (path === "/clientes" && method === "POST") {
    const c = { id: nextClienteId++, ...body, activo: true, estado: "saldada", saldo_pendiente: 0, total_a_cobrar: 0, descuento_estimado: 0, consumos_pendientes: [], creado_por_nombre: state.usuario?.nombre || "admin" };
    DEMO_CLIENTES.push(c);
    return cloneData(c);
  }
  const clienteMatch = path.match(/^\/clientes\/(\d+)$/);
  if (clienteMatch && method === "GET") {
    const c = DEMO_CLIENTES.find(x => x.id === Number(clienteMatch[1]));
    return cloneData(c);
  }
  if (clienteMatch && method === "PATCH") {
    const c = DEMO_CLIENTES.find(x => x.id === Number(clienteMatch[1]));
    if (c) Object.assign(c, body);
    return cloneData(c);
  }
  if (clienteMatch && method === "DELETE") {
    const c = DEMO_CLIENTES.find(x => x.id === Number(clienteMatch[1]));
    if (c) c.activo = false;
    return {};
  }
  const clienteRestaurar = path.match(/^\/clientes\/(\d+)\/restaurar$/);
  if (clienteRestaurar && method === "POST") {
    const c = DEMO_CLIENTES.find(x => x.id === Number(clienteRestaurar[1]));
    if (c) c.activo = true;
    return {};
  }
  const clienteConsumos = path.match(/^\/clientes\/(\d+)\/consumos$/);
  if (clienteConsumos && method === "POST") {
    const c = DEMO_CLIENTES.find(x => x.id === Number(clienteConsumos[1]));
    if (c) {
      for (const item of body.items) {
        const p = DEMO_PRODUCTOS.find(x => x.id === item.producto_id);
        if (p) {
          const existing = c.consumos_pendientes.find(cp => cp.producto_nombre === p.nombre);
          if (existing) {
            existing.cantidad += item.cantidad;
            existing.subtotal += p.precio_venta_unidad * item.cantidad;
          } else {
            c.consumos_pendientes.push({ producto_nombre: p.nombre, cantidad: item.cantidad, subtotal: p.precio_venta_unidad * item.cantidad });
          }
          c.saldo_pendiente += p.precio_venta_unidad * item.cantidad;
          c.total_a_cobrar = c.es_inversionista ? Math.round(c.saldo_pendiente * (1 - c.pct_descuento / 100)) : c.saldo_pendiente;
          c.descuento_estimado = c.saldo_pendiente - c.total_a_cobrar;
          c.estado = "abierta";
          p.stock_unidades = Math.max(0, p.stock_unidades - item.cantidad);
        }
      }
    }
    return {};
  }
  const clienteLiquidar = path.match(/^\/clientes\/(\d+)\/liquidar$/);
  if (clienteLiquidar && method === "POST") {
    const c = DEMO_CLIENTES.find(x => x.id === Number(clienteLiquidar[1]));
    if (c) {
      const totalPagado = c.total_a_cobrar;
      const descuento = c.descuento_estimado;
      c.consumos_pendientes = [];
      c.saldo_pendiente = 0;
      c.total_a_cobrar = 0;
      c.descuento_estimado = 0;
      c.estado = "saldada";
      return { total_pagado: totalPagado, descuento_aplicado: descuento };
    }
    return { total_pagado: 0, descuento_aplicado: 0 };
  }

  // Reportes
  if (path.startsWith("/reportes/ventas")) {
    return cloneData(DEMO_VENTAS_REPORTE);
  }
  if (path === "/reportes/deuda-pendiente") {
    const deudores = DEMO_CLIENTES.filter(c => c.activo && c.saldo_pendiente > 0);
    return { clientes: cloneData(deudores), total_deuda_pendiente: deudores.reduce((s, c) => s + c.total_a_cobrar, 0) };
  }

  // Usuarios
  if (path === "/usuarios" || path.startsWith("/usuarios?")) {
    return cloneData(DEMO_USUARIOS);
  }
  if (path === "/usuarios" && method === "POST") {
    const u = { id: nextUsuarioId++, nombre: body.nombre, rol: body.rol, activo: true, debe_cambiar_password: true, creado_por_nombre: state.usuario?.nombre || "admin" };
    DEMO_USUARIOS.push(u);
    return cloneData(u);
  }
  const usrMatch = path.match(/^\/usuarios\/(\d+)$/);
  if (usrMatch && method === "PATCH") {
    const u = DEMO_USUARIOS.find(x => x.id === Number(usrMatch[1]));
    if (u) Object.assign(u, body);
    return cloneData(u);
  }
  if (usrMatch && method === "DELETE") {
    const u = DEMO_USUARIOS.find(x => x.id === Number(usrMatch[1]));
    if (u) u.activo = false;
    return {};
  }
  const usrReset = path.match(/^\/usuarios\/(\d+)\/resetear-password$/);
  if (usrReset) {
    const u = DEMO_USUARIOS.find(x => x.id === Number(usrReset[1]));
    return { nombre: u?.nombre || "usuario", password_nueva: "demo-pass-" + Math.random().toString(36).slice(2, 8) };
  }

  return {};
}

// ---------------------------------------------------------------- State ----

const state = {
  token: null,
  usuario: null,
  productos: [],
  carrito: new Map(),
  metodoPagoVenta: null,
};

// ---------------------------------------------------------------- API ----

class ApiError extends Error {}

async function api(path, opts = {}) {
  return mockApi(path, opts);
}

// -------------------------------------------------------------- Utils ----

function fmtCOP(n) {
  return "$" + Math.round(n).toLocaleString("es-CO");
}

function fmtFecha(iso) {
  const d = new Date(iso + (iso.endsWith("Z") ? "" : "Z"));
  return d.toLocaleString("es-CO", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null) continue;
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const c of [].concat(children)) {
    if (c == null) continue;
    node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  }
  return node;
}

let toastTimer;
function toast(msg, isError = false) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = isError ? "error" : "";
  requestAnimationFrame(() => t.classList.add("visible"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("visible"), 3200);
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("visible"));
  document.getElementById(id).classList.add("visible");
  document.getElementById("app").classList.remove("visible");
}

// -------------------------------------------------------------- Modal ----

const modalBackdrop = document.getElementById("modal-backdrop");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");

function openModal(title, bodyNode) {
  modalTitle.textContent = title;
  modalBody.innerHTML = "";
  modalBody.appendChild(bodyNode);
  modalBackdrop.classList.add("visible");
}
function closeModal() {
  modalBackdrop.classList.remove("visible");
  modalBody.innerHTML = "";
}
document.getElementById("modal-close").addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", (e) => {
  if (e.target === modalBackdrop) closeModal();
});

// -------------------------------------------------------------- Auth -----

async function login(usuario, password) {
  // Demo: cualquier combinacion entra — se elige rol segun usuario
  const demoUser = DEMO_USUARIOS.find(u => u.nombre === usuario) || DEMO_USUARIOS[0];
  state.token = "demo-token";
  state.usuario = cloneData(demoUser);
  await afterLogin();
}

async function afterLogin() {
  if (state.usuario.debe_cambiar_password) {
    showScreen("password-screen");
  } else {
    await enterApp();
  }
}

function logout() {
  state.token = null;
  state.usuario = null;
  showScreen("login-screen");
}

// --------------------------------------------------------------- App -----

const TABS = [
  { id: "venta", label: "Venta rapida", roles: ["admin", "encargado"], onEnter: loadVentaView },
  { id: "cuentas", label: "Cuentas", roles: ["admin", "encargado"], onEnter: loadCuentasView },
  { id: "productos", label: "Productos", roles: ["admin"], onEnter: loadProductosView },
  { id: "reportes", label: "Reportes", roles: ["admin"], onEnter: loadReportesView },
  { id: "usuarios", label: "Usuarios", roles: ["admin"], onEnter: loadUsuariosView },
  { id: "manual", label: "Manual", roles: ["admin", "encargado"] },
];

async function enterApp() {
  document.getElementById("app").classList.add("visible");
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("visible"));

  document.getElementById("user-nombre").textContent = state.usuario.nombre;
  const rolBadge = document.getElementById("user-rol");
  rolBadge.textContent = state.usuario.rol;
  rolBadge.className = `role-badge ${state.usuario.rol}`;

  const isAdmin = state.usuario.rol === "admin";
  document.querySelectorAll("[data-admin-only]").forEach((n) => (n.style.display = isAdmin ? "" : "none"));

  renderTabs();
  switchView(TABS.find((t) => t.roles.includes(state.usuario.rol)).id);
}

function renderTabs() {
  const nav = document.getElementById("tabs");
  nav.innerHTML = "";
  for (const tab of TABS) {
    if (!tab.roles.includes(state.usuario.rol)) continue;
    nav.appendChild(
      el("button", { "data-tab": tab.id, onclick: () => switchView(tab.id) }, tab.label)
    );
  }
}

function switchView(viewId) {
  document.querySelectorAll(".view").forEach((v) => v.classList.toggle("active", v.dataset.view === viewId));
  document.querySelectorAll("#tabs button").forEach((b) => b.classList.toggle("active", b.dataset.tab === viewId));
  const tab = TABS.find((t) => t.id === viewId);
  if (tab && tab.onEnter) tab.onEnter().catch((e) => toast(e.message, true));
}

// ---------------------------------------------------------- Venta rapida --

async function loadVentaView() {
  state.productos = await api("/productos");
  renderProductGrid();
  renderCarrito();
}

function renderProductGrid() {
  const cont = document.getElementById("venta-productos");
  cont.innerHTML = "";
  if (state.productos.length === 0) {
    cont.appendChild(el("p", { class: "empty-state" }, "No hay productos cargados todavia."));
    return;
  }
  for (const p of state.productos) {
    const sinStock = p.stock_unidades <= 0;
    cont.appendChild(
      el(
        "button",
        {
          class: `product-tile${sinStock ? " out" : ""}`,
          onclick: () => addAlCarrito(p),
          disabled: sinStock ? "disabled" : null,
        },
        [
          el("div", { class: "name" }, p.nombre),
          el("div", { class: "price" }, fmtCOP(p.precio_venta_unidad)),
          el("div", { class: "stock" }, sinStock ? "sin stock" : `${p.stock_unidades} disponibles`),
        ]
      )
    );
  }
}

function addAlCarrito(producto) {
  const actual = state.carrito.get(producto.id);
  const cantidadActual = actual ? actual.cantidad : 0;
  if (cantidadActual + 1 > producto.stock_unidades) {
    toast(`No hay mas stock de '${producto.nombre}'`, true);
    return;
  }
  state.carrito.set(producto.id, { producto, cantidad: cantidadActual + 1 });
  renderCarrito();
}

function cambiarCantidadCarrito(productoId, delta) {
  const item = state.carrito.get(productoId);
  if (!item) return;
  const nueva = item.cantidad + delta;
  if (nueva <= 0) {
    state.carrito.delete(productoId);
  } else if (nueva > item.producto.stock_unidades) {
    toast(`No hay mas stock de '${item.producto.nombre}'`, true);
    return;
  } else {
    item.cantidad = nueva;
  }
  renderCarrito();
}

function renderCarrito() {
  const cont = document.getElementById("carrito-items");
  cont.innerHTML = "";
  if (state.carrito.size === 0) {
    cont.appendChild(el("p", { class: "muted" }, "Sin productos todavia"));
  }
  let total = 0;
  for (const { producto, cantidad } of state.carrito.values()) {
    const subtotal = producto.precio_venta_unidad * cantidad;
    total += subtotal;
    cont.appendChild(
      el("div", { class: "cart-item" }, [
        el("span", {}, `${producto.nombre}`),
        el("div", { class: "qty-stepper" }, [
          el("button", { type: "button", onclick: () => cambiarCantidadCarrito(producto.id, -1) }, "\u2212"),
          el("span", {}, String(cantidad)),
          el("button", { type: "button", onclick: () => cambiarCantidadCarrito(producto.id, 1) }, "+"),
          el("span", { class: "muted", style: "min-width:70px;text-align:right;display:inline-block" }, fmtCOP(subtotal)),
        ]),
      ])
    );
  }
  document.getElementById("carrito-total").textContent = fmtCOP(total);
  actualizarBotonConfirmar();
}

document.getElementById("metodo-pago-venta").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-metodo]");
  if (!btn) return;
  state.metodoPagoVenta = btn.dataset.metodo;
  document.querySelectorAll("#metodo-pago-venta button").forEach((b) => b.classList.toggle("selected", b === btn));
  actualizarBotonConfirmar();
});

function actualizarBotonConfirmar() {
  document.getElementById("confirmar-venta").disabled = !(state.carrito.size > 0 && state.metodoPagoVenta);
}

document.getElementById("confirmar-venta").addEventListener("click", async () => {
  const items = [...state.carrito.values()].map(({ producto, cantidad }) => ({ producto_id: producto.id, cantidad }));
  try {
    const venta = await api("/ventas", { method: "POST", body: { metodo_pago: state.metodoPagoVenta, items } });
    toast(`Venta registrada — ${fmtCOP(venta.total)}`);
    state.carrito.clear();
    state.metodoPagoVenta = null;
    document.querySelectorAll("#metodo-pago-venta button").forEach((b) => b.classList.remove("selected"));
    await loadVentaView();
  } catch (e) {
    toast(e.message, true);
  }
});

// --------------------------------------------------------------- Cuentas --

let cuentasArchivadas = false;

async function loadCuentasView() {
  const cont = document.getElementById("clientes-lista");
  cont.innerHTML = '<p class="muted">Cargando...</p>';

  const todos = await api("/clientes?incluir_inactivos=true");
  const clientes = todos.filter((c) => c.activo === !cuentasArchivadas);

  document.getElementById("clientes-titulo").textContent = cuentasArchivadas
    ? "Clientes archivados"
    : "Cuentas de clientes frecuentes";
  document.getElementById("toggle-archivados-btn").textContent = cuentasArchivadas
    ? "\u2190 Ver activos"
    : "Ver archivados";
  document.getElementById("nuevo-cliente-btn").style.display = cuentasArchivadas ? "none" : "";

  if (clientes.length === 0) {
    cont.innerHTML = "";
    cont.appendChild(
      el("p", { class: "empty-state" }, cuentasArchivadas ? "No hay clientes archivados." : "No hay clientes frecuentes todavia.")
    );
    return;
  }

  const detalles = await Promise.all(clientes.map((c) => api(`/clientes/${c.id}`)));
  cont.innerHTML = "";
  for (const c of detalles) {
    if (cuentasArchivadas) {
      cont.appendChild(
        el("div", { class: "list-item", style: "cursor:default" }, [
          el("div", {}, [
            el("div", { style: "font-weight:700" }, c.nombre),
            c.saldo_pendiente > 0 ? el("span", { class: "muted" }, `quedo con ${fmtCOP(c.total_a_cobrar)} sin cobrar`) : el("span", { class: "muted" }, "sin saldo pendiente"),
          ]),
          el(
            "button",
            {
              class: "btn btn-cyan btn-sm",
              onclick: async () => {
                try {
                  await api(`/clientes/${c.id}/restaurar`, { method: "POST" });
                  toast(`${c.nombre} restaurado`);
                  await loadCuentasView();
                } catch (err) {
                  toast(err.message, true);
                }
              },
            },
            "Restaurar"
          ),
        ])
      );
      continue;
    }
    cont.appendChild(
      el("div", { class: "list-item", onclick: () => abrirClienteModal(c.id) }, [
        el("div", {}, [
          el("div", { style: "font-weight:700" }, [
            c.nombre + " ",
            c.es_inversionista ? el("span", { class: "chip inversionista" }, `${c.pct_descuento}% desc.`) : null,
          ]),
          el("span", { class: `chip ${c.estado}` }, c.estado),
        ]),
        el("div", { style: "text-align:right" }, [
          el("div", { style: "font-family:var(--font-heading);color:var(--spray-yellow)" }, fmtCOP(c.total_a_cobrar)),
          el("div", { class: "muted" }, c.total_a_cobrar > 0 ? "a cobrar" : "al dia"),
        ]),
      ])
    );
  }
}

document.getElementById("nuevo-cliente-btn").addEventListener("click", () => abrirFormCliente());
document.getElementById("toggle-archivados-btn").addEventListener("click", () => {
  cuentasArchivadas = !cuentasArchivadas;
  loadCuentasView().catch((e) => toast(e.message, true));
});

function abrirFormCliente(existente) {
  const isAdmin = state.usuario.rol === "admin";
  const camposDescuento = isAdmin
    ? [
        el("div", { class: "field" }, [
          el("label", {}, [
            el("input", { type: "checkbox", id: "cliente-inversionista", checked: existente && existente.es_inversionista ? "checked" : null, style: "width:auto;margin-right:8px" }),
            "Es inversionista/amigo (aplica descuento)",
          ]),
        ]),
        campoNumero("cliente-descuento", "% de descuento", existente ? existente.pct_descuento : 0, 0, 100),
      ]
    : [];
  const wrap = el("form", {}, [
    campoTexto("cliente-nombre", "Nombre / grupo", existente ? existente.nombre : ""),
    ...camposDescuento,
    el("button", { type: "submit", class: "btn btn-primary btn-block" }, existente ? "Guardar" : "Crear cliente"),
  ]);
  wrap.addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = {
      nombre: document.getElementById("cliente-nombre").value.trim(),
      es_inversionista: isAdmin ? document.getElementById("cliente-inversionista").checked : false,
      pct_descuento: isAdmin ? Number(document.getElementById("cliente-descuento").value) || 0 : 0,
    };
    try {
      if (existente) await api(`/clientes/${existente.id}`, { method: "PATCH", body });
      else await api("/clientes", { method: "POST", body });
      toast("Cliente guardado");
      closeModal();
      await loadCuentasView();
    } catch (err) {
      toast(err.message, true);
    }
  });
  openModal(existente ? "Editar cliente" : "Nuevo cliente frecuente", wrap);
}

async function abrirClienteModal(clienteId) {
  const c = await api(`/clientes/${clienteId}`);
  if (!state.productos.length) {
    state.productos = await api("/productos").catch(() => []);
  }
  const isAdmin = state.usuario.rol === "admin";

  const body = el("div", {}, []);

  body.appendChild(
    el("div", { class: "flex-between" }, [
      el("span", { class: `chip ${c.estado}` }, c.estado),
      isAdmin
        ? el("div", { style: "display:flex;gap:8px" }, [
            el("button", { class: "btn btn-ghost btn-sm", onclick: () => { closeModal(); abrirFormCliente(c); } }, "Editar"),
            el(
              "button",
              {
                class: "btn btn-danger btn-sm",
                onclick: async () => {
                  const aviso = c.saldo_pendiente > 0
                    ? `${c.nombre} todavia tiene ${fmtCOP(c.total_a_cobrar)} sin cobrar. Archivar igual?`
                    : `Archivar a ${c.nombre}? Sale de la lista activa, se puede restaurar despues.`;
                  if (!confirm(aviso)) return;
                  try {
                    await api(`/clientes/${clienteId}`, { method: "DELETE" });
                    toast(`${c.nombre} archivado`);
                    closeModal();
                    await loadCuentasView();
                  } catch (err) {
                    toast(err.message, true);
                  }
                },
              },
              "Archivar"
            ),
          ])
        : null,
    ])
  );
  if (c.creado_por_nombre) {
    body.appendChild(el("p", { class: "muted", style: "margin-top:4px" }, `Cuenta abierta por ${c.creado_por_nombre}`));
  }

  body.appendChild(el("h3", { class: "mt" }, "Consumo pendiente"));
  const consumosCont = el("div", {});
  if (c.consumos_pendientes.length === 0) {
    consumosCont.appendChild(el("p", { class: "muted" }, "Sin consumo pendiente."));
  } else {
    for (const item of c.consumos_pendientes) {
      consumosCont.appendChild(
        el("div", { class: "cart-item" }, [
          el("span", {}, `${item.cantidad}\u00d7 ${item.producto_nombre}`),
          el("span", {}, fmtCOP(item.subtotal)),
        ])
      );
    }
  }
  body.appendChild(consumosCont);

  if (c.descuento_estimado > 0) {
    body.appendChild(
      el("div", { class: "cart-item" }, [el("span", { class: "muted" }, "Subtotal"), el("span", { class: "muted" }, fmtCOP(c.saldo_pendiente))])
    );
    body.appendChild(
      el("div", { class: "cart-item" }, [
        el("span", { class: "muted" }, `Descuento inversionista (${c.pct_descuento}%)`),
        el("span", { style: "color:var(--spray-pink)" }, `\u2212${fmtCOP(c.descuento_estimado)}`),
      ])
    );
  }
  body.appendChild(
    el("div", { class: "total-row" }, [
      el("span", { class: "label" }, "A cobrar"),
      el("span", { class: "value" }, fmtCOP(c.total_a_cobrar)),
    ])
  );

  // Agregar consumo
  body.appendChild(el("h3", { class: "mt" }, "Agregar consumo"));
  const productosConStock = state.productos.filter((p) => p.stock_unidades > 0);
  if (productosConStock.length === 0) {
    body.appendChild(el("p", { class: "muted" }, "No hay productos con stock para agregar."));
  } else {
    const selectProducto = el(
      "select",
      { id: "consumo-producto" },
      productosConStock.map((p) => el("option", { value: p.id }, `${p.nombre} — ${fmtCOP(p.precio_venta_unidad)}`))
    );
    const inputCantidad = el("input", { type: "number", id: "consumo-cantidad", value: "1", min: "1", style: "width:70px" });
    const formConsumo = el("form", { class: "flex-between" }, [selectProducto, inputCantidad, el("button", { type: "submit", class: "btn btn-cyan btn-sm" }, "Agregar")]);
    formConsumo.addEventListener("submit", async (e) => {
      e.preventDefault();
      const producto_id = Number(selectProducto.value);
      const cantidad = Number(inputCantidad.value);
      if (!producto_id || !cantidad || cantidad < 1) return;
      try {
        await api(`/clientes/${clienteId}/consumos`, { method: "POST", body: { items: [{ producto_id, cantidad }] } });
        toast("Consumo agregado");
        state.productos = [];
        closeModal();
        await abrirClienteModal(clienteId);
      } catch (err) {
        toast(err.message, true);
      }
    });
    body.appendChild(formConsumo);
  }

  // Liquidar
  if (c.saldo_pendiente > 0) {
    body.appendChild(el("h3", { class: "mt" }, "Liquidar cuenta"));
    let metodoSel = null;
    const metodos = el("div", { class: "payment-methods" }, [
      el("button", { type: "button", onclick: (e) => seleccionar(e, "tarjeta") }, "Tarjeta"),
      el("button", { type: "button", onclick: (e) => seleccionar(e, "nequi") }, "Nequi"),
      el("button", { type: "button", onclick: (e) => seleccionar(e, "efectivo") }, "Efectivo"),
    ]);
    function seleccionar(e, m) {
      metodoSel = m;
      metodos.querySelectorAll("button").forEach((b) => b.classList.toggle("selected", b === e.target));
      btnLiquidar.disabled = false;
    }
    const btnLiquidar = el(
      "button",
      {
        class: "btn btn-accent btn-block mt",
        disabled: "disabled",
        onclick: async () => {
          try {
            const liq = await api(`/clientes/${clienteId}/liquidar`, { method: "POST", body: { metodo_pago: metodoSel } });
            toast(`Cuenta liquidada — ${fmtCOP(liq.total_pagado)}${liq.descuento_aplicado ? ` (desc. ${fmtCOP(liq.descuento_aplicado)})` : ""}`);
            closeModal();
            await loadCuentasView();
          } catch (err) {
            toast(err.message, true);
          }
        },
      },
      `Confirmar liquidacion — ${fmtCOP(c.total_a_cobrar)}`
    );
    body.appendChild(metodos);
    body.appendChild(btnLiquidar);
  }

  openModal(c.nombre, body);
}

// ------------------------------------------------------------- Productos --

let productosArchivados = false;

async function loadProductosView() {
  const todos = await api("/productos/precios?incluir_inactivos=true");
  const filas = todos.filter((p) => p.activo === !productosArchivados);
  document.getElementById("productos-titulo").textContent = productosArchivados ? "Productos archivados" : "Productos";
  document.getElementById("toggle-productos-archivados-btn").textContent = productosArchivados ? "\u2190 Ver activos" : "Ver archivados";
  document.getElementById("nuevo-producto-btn").style.display = productosArchivados ? "none" : "";

  const tbody = document.getElementById("productos-tabla");
  tbody.innerHTML = "";
  if (filas.length === 0) {
    const msg = productosArchivados ? "No hay productos archivados." : "Sin productos todavia.";
    tbody.appendChild(el("tr", {}, [el("td", { colspan: "7", class: "empty-state" }, msg)]));
    return;
  }
  for (const p of filas) {
    tbody.appendChild(
      el("tr", {}, [
        el("td", {}, p.nombre),
        el("td", {}, p.categoria || "\u2014"),
        el("td", { class: "num" }, String(p.stock_unidades)),
        el("td", { class: "num" }, fmtCOP(p.costo_por_unidad)),
        el("td", { class: "num" }, fmtCOP(p.precio_venta_unidad)),
        el("td", { class: "num" }, `${p.margen_pct}%`),
        el("td", {}, [
          el("button", { class: "btn btn-ghost btn-sm", onclick: () => abrirAccionesProducto(p) }, "\u22ef"),
        ]),
      ])
    );
  }
}

document.getElementById("nuevo-producto-btn").addEventListener("click", () => abrirFormProducto());
document.getElementById("toggle-productos-archivados-btn").addEventListener("click", () => {
  productosArchivados = !productosArchivados;
  loadProductosView().catch((e) => toast(e.message, true));
});

function campoTexto(id, label, value = "") {
  return el("div", { class: "field" }, [el("label", { for: id }, label), el("input", { id, value })]);
}
function campoNumero(id, label, value = 0, min = 0, max) {
  const attrs = { id, type: "number", value: String(value), min: String(min) };
  if (max !== undefined) attrs.max = String(max);
  return el("div", { class: "field" }, [el("label", { for: id }, label), el("input", attrs)]);
}

function abrirFormProducto(existente) {
  const wrap = el("form", {}, [
    campoTexto("prod-nombre", "Nombre", existente ? existente.nombre : ""),
    campoTexto("prod-categoria", "Categoria", existente ? existente.categoria : ""),
    campoTexto("prod-unidad", "Unidad de compra (ej. paca, caja)", existente ? existente.unidad_compra : "unidad"),
    campoNumero("prod-factor", "Unidades por caja/paca", existente ? existente.factor_conversion : 1, 1),
    campoNumero("prod-costo", "Costo por caja/paca ($)", existente ? existente.costo_por_caja : 0, 0),
    campoNumero("prod-precio", "Precio de venta por unidad ($)", existente ? existente.precio_venta_unidad : 0, 0),
    existente ? null : campoNumero("prod-stock", "Stock inicial (unidades)", 0, 0),
    el("button", { type: "submit", class: "btn btn-primary btn-block" }, existente ? "Guardar cambios" : "Crear producto"),
  ]);
  wrap.addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = {
      nombre: document.getElementById("prod-nombre").value.trim(),
      categoria: document.getElementById("prod-categoria").value.trim(),
      unidad_compra: document.getElementById("prod-unidad").value.trim() || "unidad",
      factor_conversion: Number(document.getElementById("prod-factor").value) || 1,
      costo_por_caja: Number(document.getElementById("prod-costo").value) || 0,
      precio_venta_unidad: Number(document.getElementById("prod-precio").value) || 0,
    };
    if (!existente) body.stock_unidades = Number(document.getElementById("prod-stock").value) || 0;
    try {
      if (existente) await api(`/productos/${existente.id}`, { method: "PATCH", body });
      else await api("/productos", { method: "POST", body });
      toast("Producto guardado");
      closeModal();
      await loadProductosView();
    } catch (err) {
      toast(err.message, true);
    }
  });
  openModal(existente ? "Editar producto" : "Nuevo producto", wrap);
}

function abrirAccionesProducto(p) {
  if (!p.activo) {
    const body = el("div", {}, [
      el("p", { class: "muted" }, "Este producto esta archivado."),
      el(
        "button",
        {
          class: "btn btn-cyan btn-block mt",
          onclick: async () => {
            try {
              await api(`/productos/${p.id}/restaurar`, { method: "POST" });
              toast(`${p.nombre} restaurado`);
              closeModal();
              await loadProductosView();
            } catch (err) {
              toast(err.message, true);
            }
          },
        },
        "Restaurar"
      ),
    ]);
    openModal(p.nombre, body);
    return;
  }

  const body = el("div", {}, [
    el("button", { class: "btn btn-ghost btn-block", onclick: () => abrirFormProducto(p) }, "Editar producto"),
    el("button", { class: "btn btn-ghost btn-block mt", onclick: () => abrirFormEntrada(p) }, "+ Registrar entrada"),
    el("button", { class: "btn btn-ghost btn-block mt", onclick: () => abrirFormDevolucion(p) }, "\u2212 Registrar devolucion"),
    el("button", { class: "btn btn-ghost btn-block mt", onclick: () => abrirHistorialMovimientos(p) }, "Ver historial"),
    el(
      "button",
      {
        class: "btn btn-danger btn-block mt",
        onclick: async () => {
          if (!confirm(`Dar de baja '${p.nombre}'?`)) return;
          try {
            await api(`/productos/${p.id}`, { method: "DELETE" });
            toast("Producto dado de baja");
            closeModal();
            await loadProductosView();
          } catch (err) {
            toast(err.message, true);
          }
        },
      },
      "Dar de baja"
    ),
  ]);
  openModal(p.nombre, body);
}

function abrirFormEntrada(producto) {
  const wrap = el("form", {}, [
    campoNumero("entrada-cantidad", "Unidades que entran", 1, 1),
    campoNumero("entrada-costo", "Costo total del lote ($, opcional)", 0, 0),
    campoTexto("entrada-referencia", "Referencia (factura, opcional)", ""),
    el("button", { type: "submit", class: "btn btn-primary btn-block" }, "Registrar entrada"),
  ]);
  wrap.addEventListener("submit", async (e) => {
    e.preventDefault();
    const costo = Number(document.getElementById("entrada-costo").value) || 0;
    const body = {
      cantidad_unidades: Number(document.getElementById("entrada-cantidad").value),
      costo_total: costo > 0 ? costo : null,
      referencia: document.getElementById("entrada-referencia").value.trim(),
    };
    try {
      await api(`/productos/${producto.id}/entradas`, { method: "POST", body });
      toast("Entrada registrada");
      closeModal();
      await loadProductosView();
    } catch (err) {
      toast(err.message, true);
    }
  });
  openModal(`Entrada — ${producto.nombre}`, wrap);
}

function abrirFormDevolucion(producto) {
  const wrap = el("form", {}, [
    campoNumero("dev-cantidad", "Unidades a devolver", 1, 1),
    campoTexto("dev-referencia", "Referencia (opcional)", ""),
    el("button", { type: "submit", class: "btn btn-primary btn-block" }, "Registrar devolucion"),
  ]);
  wrap.addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = {
      cantidad_unidades: Number(document.getElementById("dev-cantidad").value),
      referencia: document.getElementById("dev-referencia").value.trim(),
    };
    try {
      await api(`/productos/${producto.id}/devoluciones`, { method: "POST", body });
      toast("Devolucion registrada");
      closeModal();
      await loadProductosView();
    } catch (err) {
      toast(err.message, true);
    }
  });
  openModal(`Devolucion — ${producto.nombre}`, wrap);
}

async function abrirHistorialMovimientos(producto) {
  const movimientos = await api(`/productos/${producto.id}/movimientos`);
  const body = el("div", {}, []);
  if (movimientos.length === 0) {
    body.appendChild(el("p", { class: "muted" }, "Sin movimientos todavia."));
  }
  for (const m of movimientos) {
    body.appendChild(
      el("div", { class: "cart-item" }, [
        el("span", {}, [
          el("span", { class: `chip ${m.tipo === "entrada" ? "saldada" : "abierta"}` }, m.tipo),
          ` ${m.cantidad_unidades}u`,
          m.referencia ? el("div", { class: "muted" }, m.referencia) : null,
        ]),
        el("span", { class: "muted" }, fmtFecha(m.fecha)),
      ])
    );
  }
  openModal(`Historial — ${producto.nombre}`, body);
}

// -------------------------------------------------------------- Reportes --

async function loadReportesView() {
  await cargarReporteVentas();
  await cargarReporteDeuda();
  await cargarReporteUsuarios();
}

document.getElementById("reporte-modo-rango").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-modo]");
  if (!btn) return;
  document.querySelectorAll("#reporte-modo-rango button").forEach((b) => b.classList.toggle("selected", b === btn));
  const esFechas = btn.dataset.modo === "fechas";
  document.getElementById("reporte-filtro-horas").style.display = esFechas ? "none" : "";
  document.getElementById("reporte-filtro-fechas").style.display = esFechas ? "" : "none";
});

document.getElementById("reporte-ventas-btn").addEventListener("click", () => cargarReporteVentas().catch((e) => toast(e.message, true)));
document.getElementById("reporte-ventas-fechas-btn").addEventListener("click", () => cargarReporteVentas().catch((e) => toast(e.message, true)));

async function cargarReporteVentas() {
  const data = await api("/reportes/ventas");
  const cont = document.getElementById("reporte-ventas-resultado");
  cont.innerHTML = "";

  cont.appendChild(el("h3", {}, "Por metodo de pago"));
  const tablaMetodo = el("table", {}, [
    el("thead", {}, el("tr", {}, [el("th", {}, "Metodo"), el("th", { class: "num" }, "Transacciones"), el("th", { class: "num" }, "Total")])),
  ]);
  const tbodyMetodo = el("tbody", {});
  for (const fila of data.por_metodo_pago) {
    tbodyMetodo.appendChild(
      el("tr", {}, [el("td", {}, fila.metodo_pago), el("td", { class: "num" }, String(fila.cantidad_transacciones)), el("td", { class: "num" }, fmtCOP(fila.total))])
    );
  }
  tablaMetodo.appendChild(tbodyMetodo);
  cont.appendChild(tablaMetodo);

  cont.appendChild(el("h3", { class: "mt" }, "Por usuario"));
  if (data.por_usuario.length === 0) {
    cont.appendChild(el("p", { class: "muted" }, "Sin ventas en este rango."));
  } else {
    const tablaUsuario = el("table", {}, [
      el("thead", {}, el("tr", {}, [el("th", {}, "Usuario"), el("th", { class: "num" }, "Transacciones"), el("th", { class: "num" }, "Total")])),
    ]);
    const tbodyUsuario = el("tbody", {});
    for (const fila of data.por_usuario) {
      tbodyUsuario.appendChild(
        el("tr", {}, [el("td", {}, fila.usuario_nombre), el("td", { class: "num" }, String(fila.cantidad_transacciones)), el("td", { class: "num" }, fmtCOP(fila.total))])
      );
    }
    tablaUsuario.appendChild(tbodyUsuario);
    cont.appendChild(tablaUsuario);
  }

  cont.appendChild(
    el("div", { class: "total-row" }, [el("span", { class: "label" }, "Total general"), el("span", { class: "value" }, fmtCOP(data.total_general))])
  );
}

async function cargarReporteUsuarios() {
  const usuarios = await api("/usuarios?incluir_inactivos=true");
  const cont = document.getElementById("reporte-usuarios-resultado");
  cont.innerHTML = "";
  const tabla = el("table", {}, [
    el("thead", {}, el("tr", {}, [el("th", {}, "Usuario"), el("th", {}, "Rol"), el("th", {}, "Estado"), el("th", {}, "Creado por")])),
  ]);
  const tbody = el("tbody", {});
  for (const u of usuarios) {
    tbody.appendChild(
      el("tr", {}, [
        el("td", {}, u.nombre),
        el("td", {}, el("span", { class: `role-badge ${u.rol}` }, u.rol)),
        el("td", {}, u.activo ? "Activo" : "Inactivo"),
        el("td", { class: "muted" }, u.creado_por_nombre || "\u2014 (sembrado inicial)"),
      ])
    );
  }
  tabla.appendChild(tbody);
  cont.appendChild(tabla);
}

async function cargarReporteDeuda() {
  const data = await api("/reportes/deuda-pendiente");
  const cont = document.getElementById("reporte-deuda-resultado");
  cont.innerHTML = "";
  if (data.clientes.length === 0) {
    cont.appendChild(el("p", { class: "empty-state" }, "Nadie tiene deuda pendiente."));
    return;
  }
  for (const c of data.clientes) {
    cont.appendChild(
      el("div", { class: "cart-item" }, [
        el("span", {}, [c.nombre, c.descuento_estimado > 0 ? el("span", { class: "muted" }, ` (subtotal ${fmtCOP(c.saldo_pendiente)}, ya con desc.)`) : null]),
        el("span", { style: "color:var(--spray-orange);font-weight:700" }, fmtCOP(c.total_a_cobrar)),
      ])
    );
  }
  cont.appendChild(
    el("div", { class: "total-row" }, [el("span", { class: "label" }, "Total pendiente"), el("span", { class: "value" }, fmtCOP(data.total_deuda_pendiente))])
  );
}

// -------------------------------------------------------------- Usuarios --

async function loadUsuariosView() {
  const usuarios = await api("/usuarios?incluir_inactivos=true");
  const cont = document.getElementById("usuarios-lista");
  cont.innerHTML = "";
  for (const u of usuarios) {
    cont.appendChild(
      el("div", { class: "list-item", onclick: () => abrirAccionesUsuario(u) }, [
        el("span", {}, u.nombre + (u.activo ? "" : " (inactivo)")),
        el("div", { style: "display:flex;align-items:center;gap:8px" }, [
          el("span", { class: `role-badge ${u.rol}` }, u.rol),
          el("button", { class: "btn btn-ghost btn-sm", onclick: (e) => { e.stopPropagation(); abrirAccionesUsuario(u); } }, "\u22ef"),
        ]),
      ])
    );
  }
}

function abrirAccionesUsuario(u) {
  const esUnoMismo = u.id === state.usuario.id;
  const body = el("div", {}, [
    el(
      "button",
      {
        class: "btn btn-ghost btn-block",
        onclick: async () => {
          if (!confirm(`Generar una contrasena nueva para '${u.nombre}'?`)) return;
          try {
            const r = await api(`/usuarios/${u.id}/resetear-password`, { method: "POST" });
            closeModal();
            mostrarPasswordReseteada(r);
          } catch (err) {
            toast(err.message, true);
          }
        },
      },
      "Resetear contrasena"
    ),
    esUnoMismo
      ? el("p", { class: "muted mt" }, "No podes desactivarte a vos mismo.")
      : el(
          "button",
          {
            class: `btn btn-block mt ${u.activo ? "btn-danger" : "btn-accent"}`,
            onclick: async () => {
              try {
                if (u.activo) await api(`/usuarios/${u.id}`, { method: "DELETE" });
                else await api(`/usuarios/${u.id}`, { method: "PATCH", body: { activo: true } });
                toast(`Usuario ${u.activo ? "desactivado" : "reactivado"}`);
                closeModal();
                await loadUsuariosView();
              } catch (err) {
                toast(err.message, true);
              }
            },
          },
          u.activo ? "Desactivar usuario" : "Reactivar usuario"
        ),
  ]);
  openModal(u.nombre, body);
}

function mostrarPasswordReseteada(r) {
  const body = el("div", {}, [
    el("p", {}, `Contrasena nueva para ${r.nombre} — copiala ahora, no se vuelve a mostrar:`),
    el("div", { class: "cart-item", style: "font-family:monospace;font-size:1.1rem;justify-content:center" }, [
      el("span", {}, r.password_nueva),
    ]),
    el("p", { class: "muted mt" }, "Va a tener que cambiarla en su proximo login."),
  ]);
  openModal("Contrasena reseteada", body);
}

document.getElementById("nuevo-usuario-btn").addEventListener("click", () => {
  const wrap = el("form", {}, [
    campoTexto("usr-nombre", "Nombre de usuario", ""),
    el("div", { class: "field" }, [
      el("label", { for: "usr-rol" }, "Rol"),
      el("select", { id: "usr-rol" }, [el("option", { value: "encargado" }, "Encargado"), el("option", { value: "admin" }, "Admin")]),
    ]),
    campoTexto("usr-password", "Contrasena provisional (minimo 12 caracteres)", ""),
    el("p", { class: "muted" }, "El usuario debera cambiarla en su primer login."),
    el("button", { type: "submit", class: "btn btn-primary btn-block" }, "Crear usuario"),
  ]);
  wrap.addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = {
      nombre: document.getElementById("usr-nombre").value.trim(),
      rol: document.getElementById("usr-rol").value,
      password: document.getElementById("usr-password").value,
    };
    try {
      await api("/usuarios", { method: "POST", body });
      toast("Usuario creado");
      closeModal();
      await loadUsuariosView();
    } catch (err) {
      toast(err.message, true);
    }
  });
  openModal("Nuevo usuario", wrap);
});

// ---------------------------------------------------------- Event wiring --

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = document.getElementById("login-submit");
  const errBox = document.getElementById("login-error");
  errBox.classList.remove("visible");
  btn.disabled = true;
  try {
    await login(document.getElementById("login-usuario").value.trim(), document.getElementById("login-password").value);
  } catch (err) {
    errBox.textContent = err.message;
    errBox.classList.add("visible");
  } finally {
    btn.disabled = false;
  }
});

document.getElementById("password-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const errBox = document.getElementById("password-error");
  errBox.classList.remove("visible");
  const nueva = document.getElementById("pw-nueva").value;
  const confirma = document.getElementById("pw-confirma").value;
  if (nueva !== confirma) {
    errBox.textContent = "Las contrasenas nuevas no coinciden";
    errBox.classList.add("visible");
    return;
  }
  try {
    await api("/auth/cambiar-password", {
      method: "POST",
      body: { password_actual: document.getElementById("pw-actual").value, password_nueva: nueva },
    });
    toast("Contrasena actualizada");
    await afterLogin();
  } catch (err) {
    errBox.textContent = err.message;
    errBox.classList.add("visible");
  }
});

document.getElementById("logout-btn").addEventListener("click", logout);
document.getElementById("logout-from-password").addEventListener("click", (e) => {
  e.preventDefault();
  logout();
});

document.querySelectorAll(".pw-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.toggleFor);
    const mostrando = input.type === "text";
    input.type = mostrando ? "password" : "text";
    btn.setAttribute("aria-label", mostrando ? "Mostrar contrasena" : "Ocultar contrasena");
  });
});

// ----------------------------------------------------------------- Init --

// Banner de demo
(function addDemoBanner() {
  const banner = document.createElement("div");
  banner.style.cssText = "position:fixed;top:0;left:0;right:0;z-index:200;background:#0071E3;color:#FFFFFF;text-align:center;padding:6px 12px;font-size:0.82rem;font-weight:600;letter-spacing:0.02em;font-family:Inter,-apple-system,sans-serif;";
  banner.innerHTML = 'DEMO INTERACTIVO — los datos viven en memoria, no se guardan. Usuario: <b>admin</b> / Contrasena: <b>cualquiera</b>';
  document.body.prepend(banner);
  document.body.style.paddingTop = "32px";
})();

(function init() {
  showScreen("login-screen");
})();
