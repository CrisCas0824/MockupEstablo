/* ══════════════════════════════════════════
   ESTABLO MONTENEGRO — script.js
   Sistema de gestión completo
══════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════════
   1. ESTADO GLOBAL
══════════════════════════════════════════ */
const App = {
  currentPage: 'inicio',
  carouselIndex: 0,
  carouselTimer: null,
  toastTimer: null,

  reservas: [
    { id: '001', cliente: 'Carlos Gutiérrez', telefono: '+51 944-111-222', servicio: 'Cancha fútbol', fecha: '2026-05-03', hora: '10:00', personas: 10, estado: 'Confirmado', obs: '' },
    { id: '002', cliente: 'María Torres',     telefono: '+51 944-333-444', servicio: 'Piscina',       fecha: '2026-05-03', hora: '11:00', personas: 5,  estado: 'Pendiente',  obs: '' },
    { id: '003', cliente: 'Familia Rojas',    telefono: '+51 944-555-666', servicio: 'Evento privado',fecha: '2026-05-04', hora: '13:00', personas: 30, estado: 'Confirmado', obs: '' },
    { id: '004', cliente: 'Pedro Llauce',     telefono: '+51 944-777-888', servicio: 'Restaurante',   fecha: '2026-05-02', hora: '12:30', personas: 8,  estado: 'Cancelado',  obs: '' },
    { id: '005', cliente: 'José Vásquez',     telefono: '+51 944-999-000', servicio: 'Vóley',         fecha: '2026-05-03', hora: '16:00', personas: 12, estado: 'Confirmado', obs: '' },
  ],

  canchasReservas: [
    { id: 'C01', cliente: 'Carlos Gutiérrez', cancha: 'Fútbol N°1', tipo: 'Fútbol', fecha: '2026-05-03', hora: '10:00', duracion: 2, total: 200, estado: 'Confirmado' },
    { id: 'C02', cliente: 'Andrés Muro',      cancha: 'Fútbol N°2', tipo: 'Fútbol', fecha: '2026-05-03', hora: '09:00', duracion: 1, total: 80,  estado: 'Confirmado' },
    { id: 'C03', cliente: 'José Vásquez',     cancha: 'Vóley N°1',  tipo: 'Vóley',  fecha: '2026-05-03', hora: '11:00', duracion: 2, total: 100, estado: 'Pendiente'  },
  ],

  pedidos: [
    { id: 'P001', mesa: 5, items: [{ qty: 2, nombre: 'Cuy Frito' }, { qty: 4, nombre: 'Chicha Morada' }], total: 102, estado: 'Pendiente', hora: '12:03 PM' },
    { id: 'P002', mesa: 8, items: [{ qty: 1, nombre: 'Parrilla Campestre' }, { qty: 2, nombre: 'Pisco Sour' }], total: 85, estado: 'Pendiente', hora: '12:10 PM' },
    { id: 'P003', mesa: 2, items: [{ qty: 1, nombre: 'Ceviche Clásico' }, { qty: 1, nombre: 'Causa Limeña' }], total: 46, estado: 'Pendiente', hora: '12:18 PM' },
    { id: 'P004', mesa: 1, items: [{ qty: 3, nombre: 'Pollo a la Brasa' }, { qty: 3, nombre: 'King Kong' }], total: 162, estado: 'Preparando', hora: '11:50 AM', tiempoEst: '~15 min' },
    { id: 'P005', mesa: 11, items: [{ qty: 2, nombre: 'Cuy Frito' }, { qty: 1, nombre: 'Parrilla Campestre' }], total: 125, estado: 'Preparando', hora: '11:58 AM', tiempoEst: '~8 min' },
    { id: 'P006', mesa: 3, items: [{ qty: 2, nombre: 'Ceviche Clásico' }], total: 56, estado: 'Entregado', hora: '11:30 AM' },
    { id: 'P007', mesa: 7, items: [{ qty: 1, nombre: 'Parrilla Campestre' }], total: 55, estado: 'Entregado', hora: '11:45 AM' },
  ],

  editingReservaId: null,
  menuCat: 'all',
  nextReservaNum: 6,
  nextCanchaNum: 4,
  nextPedidoNum: 8,
};

/* ══════════════════════════════════════════
   2. LOGIN
══════════════════════════════════════════ */
function initLogin() {
  const btnLogin  = document.getElementById('btnLogin');
  const togglePw  = document.getElementById('togglePw');
  const pwInput   = document.getElementById('password');
  const remember  = document.getElementById('remember');

  // Recordar usuario
  const savedUser = localStorage.getItem('em_user');
  if (savedUser) {
    document.getElementById('username').value = savedUser;
    if (remember) remember.checked = true;
  }

  togglePw?.addEventListener('click', () => {
    const isText = pwInput.type === 'text';
    pwInput.type = isText ? 'password' : 'text';
    togglePw.innerHTML = isText
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
  });

  btnLogin?.addEventListener('click', handleLogin);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.getElementById('page-login')?.classList.contains('active')) {
      handleLogin();
    }
  });
}

function handleLogin() {
  const user = document.getElementById('username').value.trim();
  const pass = document.getElementById('password').value.trim();
  const remember = document.getElementById('remember')?.checked;
  const btn = document.getElementById('btnLogin');

  if (!user || !pass) {
    showToast('Por favor ingresa usuario y contraseña', 'warning');
    return;
  }
  if (user !== 'admin' || pass !== '1234') {
    showToast('Credenciales incorrectas. Usa admin / 1234', 'error');
    document.getElementById('password').value = '';
    return;
  }

  if (remember) localStorage.setItem('em_user', user);
  else localStorage.removeItem('em_user');

  btn.textContent = 'Ingresando…';
  btn.disabled = true;

  setTimeout(() => {
    document.getElementById('page-login').classList.remove('active');
    document.getElementById('page-login').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    document.getElementById('userBadge').textContent = user.charAt(0).toUpperCase() + user.slice(1);
    btn.textContent = 'Ingresar al sistema';
    btn.disabled = false;
    initCarousel();
    initNavbar();
    showToast('¡Bienvenido, ' + user + '! 🌿', 'success');
  }, 700);
}

/* ══════════════════════════════════════════
   3. LOGOUT
══════════════════════════════════════════ */
function initLogout() {
  ['btnLogout', 'sidebarLogout'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', () => {
      if (confirm('¿Seguro que deseas cerrar sesión?')) {
        document.getElementById('app').classList.add('hidden');
        document.getElementById('page-login').classList.remove('hidden');
        document.getElementById('page-login').classList.add('active');
        document.getElementById('password').value = '';
        clearInterval(App.carouselTimer);
        showToast('Sesión cerrada correctamente', 'success');
      }
    });
  });
}

/* ══════════════════════════════════════════
   4. NAVEGACIÓN
══════════════════════════════════════════ */
function initNavbar() {
  // Scroll effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 20);
  });

  // Nav links (desktop + footer)
  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const page = el.dataset.page;
      if (page) navigateTo(page);
    });
  });

  // Hamburger
  const hamburger = document.getElementById('hamburger');
  const sidebar   = document.getElementById('sidebar');
  const overlay   = document.getElementById('sidebarOverlay');
  const closeBtn  = document.getElementById('closeSidebar');

  hamburger?.addEventListener('click', openSidebar);
  overlay?.addEventListener('click', closeSidebar);
  closeBtn?.addEventListener('click', closeSidebar);

  function openSidebar() {
    sidebar?.classList.add('open');
    overlay?.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    sidebar?.classList.remove('open');
    overlay?.classList.remove('visible');
    document.body.style.overflow = '';
  }

  // Sidebar items
  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.dataset.page;
      if (page) {
        navigateTo(page);
        closeSidebar();
      }
    });
  });
}

function navigateTo(page) {
  // Ocultar todas las páginas
  document.querySelectorAll('.content-page').forEach(p => p.classList.remove('active'));
  // Mostrar la página destino
  const target = document.getElementById('page-' + page);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Actualizar nav links activo
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector(`.nav-item[data-page="${page}"]`)?.classList.add('active');

  // Actualizar sidebar activo
  document.querySelectorAll('.sidebar-item').forEach(n => n.classList.remove('active'));
  document.querySelector(`.sidebar-item[data-page="${page}"]`)?.classList.add('active');

  App.currentPage = page;

  // Renderizar según página
  if (page === 'reservas')   renderReservas();
  if (page === 'canchas')    renderCanchas();
  if (page === 'pedidos')    renderPedidos();
  if (page === 'dashboard')  renderDashboard();
  if (page === 'menu')       initMenuTabs();
}

/* ══════════════════════════════════════════
   5. CARRUSEL
══════════════════════════════════════════ */
function initCarousel() {
  const track  = document.getElementById('carouselTrack');
  const dotsEl = document.getElementById('carouselDots');
  const prev   = document.getElementById('carouselPrev');
  const next   = document.getElementById('carouselNext');
  if (!track) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const total  = slides.length;

  // Crear dots
  if (dotsEl) {
    dotsEl.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(dot);
    });
  }

  function goTo(idx) {
    App.carouselIndex = (idx + total) % total;
    track.style.transform = `translateX(-${App.carouselIndex * 100}%)`;
    slides.forEach((s, i) => s.classList.toggle('active', i === App.carouselIndex));
    dotsEl?.querySelectorAll('.carousel-dot').forEach((d, i) =>
      d.classList.toggle('active', i === App.carouselIndex)
    );
  }

  prev?.addEventListener('click', () => { clearInterval(App.carouselTimer); goTo(App.carouselIndex - 1); startTimer(); });
  next?.addEventListener('click', () => { clearInterval(App.carouselTimer); goTo(App.carouselIndex + 1); startTimer(); });

  function startTimer() {
    App.carouselTimer = setInterval(() => goTo(App.carouselIndex + 1), 5500);
  }

  goTo(0);
  startTimer();
}

/* ══════════════════════════════════════════
   6. TOAST
══════════════════════════════════════════ */
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  clearTimeout(App.toastTimer);
  toast.textContent = msg;
  toast.className = 'toast ' + type;
  toast.classList.remove('hidden');
  App.toastTimer = setTimeout(() => toast.classList.add('hidden'), 3400);
}

/* ══════════════════════════════════════════
   7. MODAL DE RESERVA
══════════════════════════════════════════ */
function initModal() {
  const overlay    = document.getElementById('reservaModal');
  const btnOpen    = document.getElementById('openReservaModal');
  const btnClose   = document.getElementById('closeModal');
  const btnCancel  = document.getElementById('cancelModal');
  const btnSave    = document.getElementById('saveReserva');
  const btnCanchaR = document.getElementById('openReservaCancha');

  btnOpen?.addEventListener('click', () => openModal());
  btnCanchaR?.addEventListener('click', () => openModal('Cancha fútbol'));
  btnClose?.addEventListener('click', closeModal);
  btnCancel?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  btnSave?.addEventListener('click', saveReserva);

  // Tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay && !overlay.classList.contains('hidden')) closeModal();
  });
}

function openModal(servicio = '', reservaId = null) {
  const overlay = document.getElementById('reservaModal');
  const title   = document.getElementById('modalTitle');
  if (!overlay) return;

  App.editingReservaId = reservaId;

  if (reservaId) {
    const r = App.reservas.find(x => x.id === reservaId);
    if (r) {
      title.textContent = 'Editar Reserva';
      document.getElementById('modalCliente').value  = r.cliente;
      document.getElementById('modalTelefono').value = r.telefono;
      document.getElementById('modalServicio').value = r.servicio;
      document.getElementById('modalPersonas').value = r.personas;
      document.getElementById('modalFecha').value    = r.fecha;
      document.getElementById('modalHora').value     = r.hora;
      document.getElementById('modalObs').value      = r.obs || '';
    }
  } else {
    title.textContent = 'Nueva Reserva';
    document.getElementById('modalCliente').value  = '';
    document.getElementById('modalTelefono').value = '';
    document.getElementById('modalServicio').value = servicio || 'Cancha fútbol';
    document.getElementById('modalPersonas').value = '';
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('modalFecha').value = today;
    document.getElementById('modalHora').value  = '';
    document.getElementById('modalObs').value   = '';
  }

  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  document.getElementById('modalCliente').focus();
}

function closeModal() {
  document.getElementById('reservaModal')?.classList.add('hidden');
  document.body.style.overflow = '';
  App.editingReservaId = null;
}

function saveReserva() {
  const cliente  = document.getElementById('modalCliente').value.trim();
  const telefono = document.getElementById('modalTelefono').value.trim();
  const servicio = document.getElementById('modalServicio').value;
  const personas = parseInt(document.getElementById('modalPersonas').value) || 0;
  const fecha    = document.getElementById('modalFecha').value;
  const hora     = document.getElementById('modalHora').value;
  const obs      = document.getElementById('modalObs').value.trim();

  if (!cliente) { showToast('El nombre del cliente es obligatorio', 'warning'); return; }
  if (!fecha)   { showToast('Selecciona una fecha', 'warning'); return; }
  if (!hora)    { showToast('Selecciona una hora', 'warning'); return; }
  if (personas < 1) { showToast('Ingresa el número de personas', 'warning'); return; }

  if (App.editingReservaId) {
    const idx = App.reservas.findIndex(r => r.id === App.editingReservaId);
    if (idx !== -1) {
      App.reservas[idx] = { ...App.reservas[idx], cliente, telefono, servicio, personas, fecha, hora, obs };
      showToast('✅ Reserva actualizada correctamente', 'success');
    }
  } else {
    const newId = String(App.nextReservaNum++).padStart(3, '0');
    App.reservas.push({ id: newId, cliente, telefono, servicio, personas, fecha, hora, obs, estado: 'Pendiente' });
    showToast('✅ Reserva creada correctamente', 'success');
  }

  closeModal();
  renderReservas();
  updateStats();
}

/* ══════════════════════════════════════════
   8. RENDER RESERVAS
══════════════════════════════════════════ */
function renderReservas(filtro = '', filtroServicio = '', filtroEstado = '') {
  const tbody = document.getElementById('reservasBody');
  if (!tbody) return;

  const filtered = App.reservas.filter(r => {
    const matchText = r.cliente.toLowerCase().includes(filtro.toLowerCase()) ||
                      r.servicio.toLowerCase().includes(filtro.toLowerCase());
    const matchServ = !filtroServicio || r.servicio === filtroServicio;
    const matchEst  = !filtroEstado  || r.estado === filtroEstado;
    return matchText && matchServ && matchEst;
  });

  tbody.innerHTML = filtered.map(r => {
    const initials = r.cliente.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    const badgeClass = r.estado === 'Confirmado' ? 'confirmed' : r.estado === 'Pendiente' ? 'pending' : 'cancelled';
    const servicioTag = getServicioTag(r.servicio);
    const horaFmt = formatHora(r.hora);
    return `
      <tr data-estado="${r.estado}">
        <td><span class="row-id">${r.id}</span></td>
        <td>
          <div class="client-cell">
            <div class="client-avatar">${initials}</div>
            <div><strong>${r.cliente}</strong><br/><small>${r.telefono || '—'}</small></div>
          </div>
        </td>
        <td>${servicioTag}</td>
        <td>${r.fecha}</td>
        <td>${horaFmt}</td>
        <td><span class="personas-badge">${r.personas} pers.</span></td>
        <td>
          <select class="estado-select badge ${badgeClass}" data-id="${r.id}" onchange="cambiarEstado('${r.id}', this.value)">
            <option value="Confirmado" ${r.estado === 'Confirmado' ? 'selected' : ''}>Confirmado</option>
            <option value="Pendiente"  ${r.estado === 'Pendiente'  ? 'selected' : ''}>Pendiente</option>
            <option value="Cancelado"  ${r.estado === 'Cancelado'  ? 'selected' : ''}>Cancelado</option>
          </select>
        </td>
        <td class="actions-cell">
          <button class="btn-action edit-btn" title="Editar" onclick="editReserva('${r.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-action del-btn" title="Eliminar" onclick="deleteReserva('${r.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
          </button>
        </td>
      </tr>`;
  }).join('');

  document.getElementById('tableCount').textContent =
    `Mostrando ${filtered.length} de ${App.reservas.length} reservas`;

  updateStats();
}

function getServicioTag(servicio) {
  const map = {
    'Cancha fútbol': ['cancha-tag', '⚽'],
    'Vóley':         ['voley-tag',  '🏐'],
    'Piscina':       ['piscina-tag','🏊'],
    'Restaurante':   ['rest-tag',   '🍽️'],
    'Evento privado':['evento-tag', '🎉'],
  };
  const [cls, icon] = map[servicio] || ['rest-tag', '📋'];
  return `<span class="servicio-tag ${cls}">${icon} ${servicio}</span>`;
}

function formatHora(hora) {
  if (!hora) return '—';
  const [h, m] = hora.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12  = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function cambiarEstado(id, nuevoEstado) {
  const r = App.reservas.find(x => x.id === id);
  if (r) {
    r.estado = nuevoEstado;
    renderReservas(
      document.getElementById('searchReserva')?.value || '',
      document.getElementById('filterServicio')?.value || '',
      document.getElementById('filterEstado')?.value || ''
    );
    showToast(`Estado actualizado a: ${nuevoEstado}`, 'success');
  }
}

window.editReserva = function(id) { openModal('', id); };

window.deleteReserva = function(id) {
  if (!confirm('¿Eliminar esta reserva?')) return;
  App.reservas = App.reservas.filter(r => r.id !== id);
  renderReservas();
  showToast('Reserva eliminada', 'warning');
};

function updateStats() {
  const conf = App.reservas.filter(r => r.estado === 'Confirmado').length;
  const pend = App.reservas.filter(r => r.estado === 'Pendiente').length;
  const canc = App.reservas.filter(r => r.estado === 'Cancelado').length;
  document.getElementById('countConfirmadas').textContent = conf;
  document.getElementById('countPendientes').textContent  = pend;
  document.getElementById('countCanceladas').textContent  = canc;
  document.getElementById('countTotal').textContent       = App.reservas.length;
}

function initFiltros() {
  const search  = document.getElementById('searchReserva');
  const fServ   = document.getElementById('filterServicio');
  const fEst    = document.getElementById('filterEstado');
  const reRender = () => renderReservas(search?.value || '', fServ?.value || '', fEst?.value || '');
  search?.addEventListener('input', reRender);
  fServ?.addEventListener('change', reRender);
  fEst?.addEventListener('change', reRender);
}

/* ══════════════════════════════════════════
   9. CANCHAS
══════════════════════════════════════════ */
function renderCanchas() {
  const tbody = document.getElementById('canchasBody');
  if (!tbody) return;

  const fText = document.getElementById('searchCancha')?.value || '';
  const fTipo = document.getElementById('filterTipoCancha')?.value || '';

  const filtered = App.canchasReservas.filter(r => {
    const matchText = r.cliente.toLowerCase().includes(fText.toLowerCase()) ||
                      r.cancha.toLowerCase().includes(fText.toLowerCase());
    const matchTipo = !fTipo || r.tipo === fTipo;
    return matchText && matchTipo;
  });

  tbody.innerHTML = filtered.map(r => {
    const initials = r.cliente.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    const icon = r.tipo === 'Fútbol' ? '⚽' : '🏐';
    const tagClass = r.tipo === 'Fútbol' ? 'cancha-tag' : 'voley-tag';
    const badgeClass = r.estado === 'Confirmado' ? 'confirmed' : r.estado === 'Pendiente' ? 'pending' : 'cancelled';
    return `
      <tr data-tipo="${r.tipo}">
        <td><span class="row-id">${r.id}</span></td>
        <td>
          <div class="client-cell">
            <div class="client-avatar">${initials}</div>
            <strong>${r.cliente}</strong>
          </div>
        </td>
        <td><span class="servicio-tag ${tagClass}">${icon} ${r.cancha}</span></td>
        <td>${r.fecha}</td>
        <td>${formatHora(r.hora)}</td>
        <td>${r.duracion} hora${r.duracion > 1 ? 's' : ''}</td>
        <td><strong class="precio-cell">S/ ${r.total}</strong></td>
        <td><span class="badge ${badgeClass}">${r.estado}</span></td>
        <td class="actions-cell">
          <button class="btn-action edit-btn" title="Editar" onclick="editCancha('${r.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-action del-btn" title="Eliminar" onclick="deleteCancha('${r.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
          </button>
        </td>
      </tr>`;
  }).join('');

  const total = filtered.reduce((s, r) => s + r.total, 0);
  const footer = tbody.closest('.table-wrapper')?.querySelector('.table-footer');
  if (footer) footer.innerHTML = `${filtered.length} reservas de canchas · Total: <strong>S/ ${total}</strong>`;
}

window.editCancha = function(id) {
  showToast('✏️ Función de edición de cancha próximamente', 'warning');
};

window.deleteCancha = function(id) {
  if (!confirm('¿Eliminar esta reserva de cancha?')) return;
  App.canchasReservas = App.canchasReservas.filter(r => r.id !== id);
  renderCanchas();
  showToast('Reserva de cancha eliminada', 'warning');
};

window.reservarCancha = function(cancha) {
  openModal(cancha.includes('Fútbol') ? 'Cancha fútbol' : 'Vóley');
  showToast(`Reservando: ${cancha}`, 'success');
};

function initFiltrosCancha() {
  document.getElementById('searchCancha')?.addEventListener('input', renderCanchas);
  document.getElementById('filterTipoCancha')?.addEventListener('change', renderCanchas);
}

/* ══════════════════════════════════════════
   10. PEDIDOS — KANBAN INTERACTIVO
══════════════════════════════════════════ */
function renderPedidos() {
  const cols = {
    'Pendiente':  document.getElementById('kanban-pendiente'),
    'Preparando': document.getElementById('kanban-preparando'),
    'Entregado':  document.getElementById('kanban-entregado'),
  };
  if (!cols['Pendiente']) { renderPedidosStatic(); return; }

  Object.values(cols).forEach(col => {
    const cards = col?.querySelectorAll('.kanban-card');
    cards?.forEach(c => c.remove());
  });

  App.pedidos.forEach(p => {
    const col = cols[p.estado];
    if (!col) return;
    const card = createPedidoCard(p);
    col.appendChild(card);
  });

  updatePedidosResumen();
}

function renderPedidosStatic() {
  // Si no hay IDs en el HTML, trabajamos con los del HTML directamente
  // Añadimos funcionalidad a los botones existentes
  document.querySelectorAll('.btn-confirm').forEach((btn, i) => {
    btn.addEventListener('click', function() {
      const card = btn.closest('.kanban-card');
      if (!card) return;
      const col = card.closest('.kanban-col');
      const nextCol = col?.nextElementSibling;
      if (nextCol) {
        // Mover visualmente
        card.style.animation = 'none';
        card.style.opacity = '0.5';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          card.remove();
          showToast('Pedido confirmado ✅', 'success');
        }, 300);
      }
    });
  });

  document.querySelectorAll('.btn-ready').forEach(btn => {
    btn.addEventListener('click', function() {
      const card = btn.closest('.kanban-card');
      if (!card) return;
      card.style.opacity = '0.5';
      setTimeout(() => {
        card.remove();
        showToast('Pedido marcado como listo 🍽️', 'success');
      }, 300);
    });
  });

  document.querySelectorAll('.btn-bill').forEach(btn => {
    btn.addEventListener('click', function() {
      const card = btn.closest('.kanban-card');
      const mesa = card?.querySelector('.order-num')?.textContent || 'Mesa';
      showToast(`💳 Cobrando ${mesa}…`, 'success');
    });
  });
}

function createPedidoCard(p) {
  const card = document.createElement('div');
  card.className = 'kanban-card' + (p.estado === 'Preparando' ? ' cooking-card' : '') + (p.estado === 'Entregado' ? ' delivered' : '');
  card.dataset.id = p.id;

  let topHtml = '';
  if (p.estado === 'Preparando') {
    topHtml = `<div class="cooking-timer">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
      Desde ${p.hora} · ${p.tiempoEst || '~10 min'}
    </div>`;
  }
  if (p.estado === 'Entregado') {
    topHtml = `<div class="delivered-check">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg>
      Entregado a las ${p.hora}
    </div>`;
  }

  const itemsHtml = p.items.map(i =>
    `<li><span class="item-qty">${i.qty}×</span> ${i.nombre}</li>`
  ).join('');

  let btnHtml = '';
  if (p.estado === 'Pendiente') {
    btnHtml = `<button class="btn-sm btn-confirm" onclick="avanzarPedido('${p.id}')">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg> Confirmar</button>`;
  } else if (p.estado === 'Preparando') {
    btnHtml = `<button class="btn-sm btn-ready" onclick="avanzarPedido('${p.id}')">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg> Listo</button>`;
  } else {
    btnHtml = `<button class="btn-sm btn-bill" onclick="cobrarPedido('${p.id}')">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> Cobrar</button>`;
  }

  const timeHtml = p.estado === 'Pendiente'
    ? `<span class="order-time">⏱ ${p.hora}</span>` : '';

  card.innerHTML = `
    ${topHtml}
    <div class="order-top">
      <div class="order-meta">
        <span class="order-num">Mesa ${p.mesa}</span>
        <span class="order-tag-rest">Restaurante</span>
      </div>
      ${timeHtml}
    </div>
    <ul class="order-items">${itemsHtml}</ul>
    <div class="order-bottom">
      <span class="order-total">S/ ${p.total.toFixed(2)}</span>
      ${btnHtml}
    </div>`;
  return card;
}

window.avanzarPedido = function(id) {
  const p = App.pedidos.find(x => x.id === id);
  if (!p) return;
  if (p.estado === 'Pendiente') {
    p.estado = 'Preparando';
    showToast(`Mesa ${p.mesa} → En preparación 🔥`, 'success');
  } else if (p.estado === 'Preparando') {
    p.estado = 'Entregado';
    showToast(`Mesa ${p.mesa} → Entregado ✅`, 'success');
  }
  renderPedidos();
};

window.cobrarPedido = function(id) {
  const p = App.pedidos.find(x => x.id === id);
  if (!p) return;
  showToast(`💳 Cobrando Mesa ${p.mesa}: S/ ${p.total.toFixed(2)}`, 'success');
  setTimeout(() => {
    App.pedidos = App.pedidos.filter(x => x.id !== id);
    renderPedidos();
  }, 1000);
};

function updatePedidosResumen() {
  const pend  = App.pedidos.filter(p => p.estado === 'Pendiente').length;
  const prep  = App.pedidos.filter(p => p.estado === 'Preparando').length;
  const entg  = App.pedidos.filter(p => p.estado === 'Entregado').length;
  const total = App.pedidos.reduce((s, p) => s + p.total, 0);

  const nums = document.querySelectorAll('.ps-num');
  if (nums[0]) nums[0].textContent = pend;
  if (nums[1]) nums[1].textContent = prep;
  if (nums[2]) nums[2].textContent = entg;
  if (nums[3]) nums[3].textContent = `S/ ${total.toFixed(0)}`;

  // Actualizar conteos en headers kanban
  const counts = document.querySelectorAll('.kanban-count');
  if (counts[0]) counts[0].textContent = pend;
  if (counts[1]) counts[1].textContent = prep;
  if (counts[2]) counts[2].textContent = entg;
}

function initNuevoPedido() {
  const btn = document.querySelector('#page-pedidos .btn-primary');
  btn?.addEventListener('click', () => {
    showToast('📋 Módulo de nuevo pedido próximamente', 'warning');
  });
}

/* ══════════════════════════════════════════
   11. MENÚ — FILTROS POR CATEGORÍA
══════════════════════════════════════════ */
function initMenuTabs() {
  const tabs = document.querySelectorAll('.menu-tab');
  const cards = document.querySelectorAll('.menu-card');

  // Asegura que todos sean visibles al inicio
  cards.forEach(card => card.style.display = '');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.cat;
      cards.forEach(card => {
        if (cat === 'all' || card.dataset.cat === cat) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  const btnAgregar = document.querySelector('#page-menu .btn-primary');
  btnAgregar?.addEventListener('click', () => {
    showToast('🍽️ Módulo de agregar plato próximamente', 'warning');
  });
}

/* ══════════════════════════════════════════
   12. DASHBOARD
══════════════════════════════════════════ */
function renderDashboard() {
  animateBars();
  animateStockBars();
  updateKPIs();
}

function updateKPIs() {
  // Ingresos del día: restaurante + canchas
  const ingresosRestaurante = App.pedidos.reduce((s, p) => s + p.total, 0);
  const ingresosCanchas = App.canchasReservas.reduce((s, r) => s + r.total, 0);
  const totalDia = ingresosRestaurante + ingresosCanchas + 3800; // base fija

  const kpiValues = document.querySelectorAll('.kpi-value');
  if (kpiValues[0]) kpiValues[0].textContent = `S/ ${totalDia.toLocaleString('es-PE')}`;
  if (kpiValues[1]) kpiValues[1].textContent = App.reservas.filter(r => r.estado === 'Confirmado').length;
  // kpiValues[2] → Plato más vendido (estático)
  // kpiValues[3] → Ocupación (estático)

  // KPIs de canchas
  if (kpiValues[4]) kpiValues[4].textContent = `S/ ${ingresosCanchas}`;
  if (kpiValues[5]) kpiValues[5].textContent = App.canchasReservas.length;
}

function animateBars() {
  const bars = document.querySelectorAll('.bar');
  bars.forEach((bar, i) => {
    const h = bar.style.getPropertyValue('--h');
    bar.style.setProperty('--h', '0%');
    setTimeout(() => bar.style.setProperty('--h', h), 100 + i * 80);
  });
}

function animateStockBars() {
  const fills = document.querySelectorAll('.stock-fill');
  fills.forEach(fill => {
    const w = fill.style.width;
    fill.style.width = '0%';
    setTimeout(() => fill.style.width = w, 400);
  });
}

/* ══════════════════════════════════════════
   13. GALERÍA — LIGHTBOX SIMPLE
══════════════════════════════════════════ */
function initGallery() {
  const items = document.querySelectorAll('.gallery-item');
  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.querySelector('.gallery-caption');
      if (!img) return;

      const overlay = document.createElement('div');
      overlay.className = 'lightbox-overlay';
      overlay.style.cssText = `
        position:fixed;inset:0;background:rgba(0,0,0,0.92);
        z-index:9999;display:flex;align-items:center;justify-content:center;
        flex-direction:column;gap:16px;padding:20px;cursor:zoom-out;
        animation:pageFadeIn 0.25s ease;
      `;
      const imgEl = document.createElement('img');
      imgEl.src = img.src;
      imgEl.style.cssText = 'max-width:90vw;max-height:80vh;object-fit:contain;border-radius:10px;box-shadow:0 20px 60px rgba(0,0,0,0.8);';
      const cap = document.createElement('p');
      cap.textContent = caption?.textContent || '';
      cap.style.cssText = 'color:rgba(201,169,110,0.85);font-size:0.9rem;font-weight:600;letter-spacing:0.5px;';
      overlay.append(imgEl, cap);
      overlay.addEventListener('click', () => overlay.remove());
      document.body.appendChild(overlay);
    });
  });
}

/* ══════════════════════════════════════════
   14. CONTACTO
══════════════════════════════════════════ */
function initContacto() {
  const btnSend = document.getElementById('btnSendMsg');
  btnSend?.addEventListener('click', () => {
    const nombre  = document.querySelector('#page-contacto .contact-form input[type="text"]')?.value.trim();
    const correo  = document.querySelector('#page-contacto .contact-form input[type="email"]')?.value.trim();
    const mensaje = document.querySelector('#page-contacto .contact-form textarea')?.value.trim();
    if (!nombre || !correo || !mensaje) {
      showToast('Por favor completa todos los campos', 'warning');
      return;
    }
    showToast(`✉️ Mensaje de ${nombre} enviado correctamente`, 'success');
    document.querySelectorAll('#page-contacto .contact-form input, #page-contacto .contact-form textarea')
      .forEach(el => el.value = '');
  });
}

/* ══════════════════════════════════════════
   15. BOTONES HERO DE INICIO
══════════════════════════════════════════ */
function initHeroBtns() {
  // Los botones data-page ya son manejados por initNavbar
  // Aquí también inicializamos los botones de servicio
  document.querySelectorAll('.service-btn[data-page]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateTo(btn.dataset.page);
    });
  });
}

/* ══════════════════════════════════════════
   16. ESTADO SELECT STYLES
══════════════════════════════════════════ */
function injectEstadoSelectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .estado-select {
      border: none; cursor: pointer; outline: none;
      font-family: var(--font-body); font-size: 0.72rem;
      font-weight: 700; letter-spacing: 0.5px;
      text-transform: uppercase; border-radius: 30px;
      padding: 4px 12px; -webkit-appearance: none;
      appearance: none; transition: all 0.2s;
    }
    .estado-select.confirmed { background: rgba(74,124,89,0.14); color: var(--forest-mid); }
    .estado-select.pending   { background: rgba(201,169,110,0.2); color: var(--brown-warm); }
    .estado-select.cancelled { background: rgba(160,82,45,0.14); color: var(--terracotta); }
    .estado-select:hover { opacity: 0.85; }

    /* Kanban IDs para JS */
    .kanban-col:nth-child(1) { }
    .kanban-col:nth-child(2) { }
    .kanban-col:nth-child(3) { }

    /* Mejoras para stats ribbon en mobile */
    @media (max-width: 600px) {
      .stats-ribbon { padding: 18px 12px; gap: 10px; }
      .stat-number  { font-size: 1.5rem; }
      .stat-label   { font-size: 0.65rem; }
    }

    /* Animación para tarjetas kanban al avanzar */
    .kanban-card { transition: opacity 0.3s, transform 0.3s; }

    /* Mejora del select de estado en tabla */
    .estado-select option { font-size: 0.85rem; font-weight: 600; text-transform: none; }
  `;
  document.head.appendChild(style);
}

/* ══════════════════════════════════════════
   17. KANBAN IDs — asignar IDs a columnas estáticas
══════════════════════════════════════════ */
function assignKanbanIds() {
  const cols = document.querySelectorAll('#page-pedidos .kanban-col');
  if (cols[0] && !cols[0].id) cols[0].id = 'kanban-pendiente';
  if (cols[1] && !cols[1].id) cols[1].id = 'kanban-preparando';
  if (cols[2] && !cols[2].id) cols[2].id = 'kanban-entregado';
}

/* ══════════════════════════════════════════
   18. ANIMACIONES AL SCROLL (Intersection Observer)
══════════════════════════════════════════ */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'pageFadeIn 0.5s ease forwards';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.kpi-card, .rstat-card, .dish-card, .menu-card, .tarifa-card, .contact-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

/* ══════════════════════════════════════════
   19. MANEJO DEL MENSAJE DE CONTACTO FOOTER
══════════════════════════════════════════ */
function initFooterLinks() {
  // Ya manejados por initNavbar con data-page
  // Solo aseguramos los de los servicios que no tienen data-page
  document.querySelectorAll('.footer-links-col a:not([data-page])').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      showToast('Página en construcción 🚧', 'warning');
    });
  });
  document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      showToast('Síguenos pronto en redes sociales 📱', 'success');
    });
  });
  document.querySelector('.forgot-link')?.addEventListener('click', e => {
    e.preventDefault();
    showToast('Contacta al administrador del sistema', 'warning');
  });
}

/* ══════════════════════════════════════════
   20. INICIO — RENDER
══════════════════════════════════════════ */
function initInicio() {
  // Stats ribbon live update
  const statNums = document.querySelectorAll('.stat-number');
  if (statNums.length) {
    const conf = App.reservas.filter(r => r.estado === 'Confirmado').length;
    const ingresosCanchas = App.canchasReservas.reduce((s, r) => s + r.total, 0);
    if (statNums[0]) statNums[0].textContent = App.reservas.length;
    if (statNums[2]) statNums[2].textContent = `S/ ${(4250 + ingresosCanchas).toLocaleString('es-PE')}`;
    if (statNums[3]) statNums[3].textContent = App.canchasReservas.length;
  }
}

/* ══════════════════════════════════════════
   INIT PRINCIPAL
══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  injectEstadoSelectStyles();
  initLogin();
  initLogout();
  initModal();
  initFiltros();
  initFiltrosCancha();
  initContacto();
  initFooterLinks();
  assignKanbanIds();

  // Renderizar la página activa inicial
  renderReservas();
  updateStats();

  // Inicializar animaciones con pequeño delay para que el DOM esté listo
  setTimeout(() => {
    initScrollAnimations();
    initGallery();
    initInicio();
    renderPedidosStatic(); // Por si los botones del HTML estático necesitan funcionalidad
  }, 300);

  // Listener global para navegación (capturar clicks tarde en el DOM)
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-page]');
    if (el && !el.closest('.nav-links') && !el.closest('.sidebar-nav') && !el.closest('.footer')) {
      // Ya manejado en initNavbar, pero por si acaso
    }
  });
});