(() => {
  const STORAGE_KEY = "teamtrack-prototype-v1";
  const today = new Date();
  const day = (offset) => { const d = new Date(today); d.setDate(d.getDate() + offset); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  const starter = {
    teams: [{ id: "team-demo", name: "Club Basket", sport: "Baloncesto", seasonId: "season-demo" }],
    seasons: [{ id: "season-demo", name: "Temporada 2026/27", startsOn: "2026-09-01", endsOn: "2027-06-30" }],
    members: [
      { id: "m1", teamId: "team-demo", name: "Lucía Martín", number: "7", role: "Base", status: "active" },
      { id: "m2", teamId: "team-demo", name: "Álex Romero", number: "12", role: "Escolta", status: "active" },
      { id: "m3", teamId: "team-demo", name: "Paula Sánchez", number: "15", role: "Alero", status: "active" },
      { id: "m4", teamId: "team-demo", name: "Hugo Navarro", number: "21", role: "Ala-pívot", status: "active" },
      { id: "m5", teamId: "team-demo", name: "Nora Vidal", number: "33", role: "Pívot", status: "active" }
    ],
    events: [
      { id: "e1", teamId: "team-demo", type: "training", date: day(1), time: "18:30", venue: "Pabellón Norte", opponent: "", status: "scheduled", notes: "Trabajo de transiciones y tiro." },
      { id: "e2", teamId: "team-demo", type: "match", date: day(3), time: "12:00", venue: "Polideportivo Central", opponent: "CB Aurora", status: "scheduled", notes: "" },
      { id: "e3", teamId: "team-demo", type: "training", date: day(-2), time: "19:00", venue: "Pabellón Norte", opponent: "", status: "scheduled", notes: "Sesión de técnica individual." }
    ], attendance: { e3: { m1: "present", m2: "present", m3: "late", m4: "excused", m5: "present" } },
    results: {}, activeTeamId: "team-demo"
  };
  let state = loadState();
  let currentView = "dashboard";
  let calendarOffset = 0;
  let historyFilter = "all";
  let searchTerm = "";
  let toastTimer;
  const content = document.getElementById("app-content");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalBody = document.getElementById("modal-body");
  const esc = (v = "") => String(v).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const id = () => crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  function loadState() { try { const saved = localStorage.getItem(STORAGE_KEY); return saved ? { ...starter, ...JSON.parse(saved) } : structuredClone(starter); } catch { return structuredClone(starter); } }
  function persist(message) { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); render(); if (message) toast(message); }
  function team() { return state.teams.find(t => t.id === state.activeTeamId) || state.teams[0]; }
  function seasonFor(t = team()) { return state.seasons.find(s => s.id === t?.seasonId); }
  function members(includeInactive = true) { return state.members.filter(m => m.teamId === team()?.id && (includeInactive || m.status === "active")); }
  function events(includeCancelled = true) { return state.events.filter(e => e.teamId === team()?.id && (includeCancelled || e.status !== "cancelled")); }
  function localDate(iso) { if (!iso) return null; const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d); }
  function fmtDate(iso, options = { day: "numeric", month: "short" }) { const d = localDate(iso); return d ? new Intl.DateTimeFormat("es-ES", options).format(d) : "Fecha pendiente"; }
  function weekday(iso) { const d = localDate(iso); return d ? new Intl.DateTimeFormat("es-ES", { weekday: "short" }).format(d).replace(".", "") : ""; }
  function initials(name = "") { return name.split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]).join("").toUpperCase() || "TT"; }
  function eventLabel(e) { return e.type === "match" ? "Partido" : "Entrenamiento"; }
  function eventTitle(e) { return e.type === "match" ? `Partido${e.opponent ? ` · ${e.opponent}` : ""}` : "Entrenamiento"; }
  function resultText(e) { const r = state.results[e.id]; if (!r) return "Sin resultado"; return `${r.ourValue} ${r.label || "puntos"} – ${r.theirValue} ${r.label || "puntos"}`; }
  function sortEvents(list) { return [...list].sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)); }
  function eventDateTile(e) { const d = localDate(e.date); return `<div class="date-tile"><b>${d ? d.getDate() : "—"}</b><span>${d ? weekday(e.date) : "fecha"}</span></div>`; }
  function render() {
    const t = team();
    document.getElementById("sidebar-team-name").textContent = t?.name || "Sin equipo";
    document.getElementById("sidebar-team-season").textContent = seasonFor(t)?.name || "Sin temporada";
    document.querySelector(".team-avatar").textContent = initials(t?.name || "TT");
    document.getElementById("nav-roster-count").textContent = members(false).length;
    document.querySelectorAll(".nav-item").forEach(n => n.classList.toggle("active", n.dataset.view === currentView));
    const label = { dashboard: "Resumen", roster: "Plantilla", calendar: "Calendario", history: "Historial", scenarios: "Escenarios", stories: "Historias" }[currentView];
    document.getElementById("breadcrumb-view").textContent = label;
    content.innerHTML = ({ dashboard: renderDashboard, roster: renderRoster, calendar: renderCalendar, history: renderHistory, scenarios: renderScenarios, stories: renderStories }[currentView])();
  }
  function renderScenarios() {
    const scenarios = [
      { id: "team", title: "Preparar el equipo y la temporada", goal: "Organizar la temporada antes de empezar a planificar.", trigger: "Alex empieza una nueva temporada y necesita reunir los datos básicos.", steps: ["Crear o seleccionar una temporada.", "Indicar el nombre del equipo y el deporte.", "Confirmar que el equipo aparece en el espacio de trabajo."], outcome: "El panel identifica el equipo, su deporte y su temporada.", view: "dashboard", action: "new-team", cta: "Preparar equipo" },
      { id: "roster", title: "Poner al día la plantilla", goal: "Mantener una lista útil sin perder el historial de integrantes.", trigger: "Antes de la primera sesión, Alex revisa quién forma parte del equipo.", steps: ["Abrir Plantilla y revisar integrantes activos.", "Añadir o editar el nombre y los datos opcionales.", "Si alguien deja el equipo, marcarlo como inactivo."], outcome: "La plantilla activa queda actualizada y los integrantes inactivos conservan sus registros.", view: "roster", action: "new-member", cta: "Abrir plantilla" },
      { id: "schedule", title: "Planificar la próxima actividad", goal: "Dejar visible cuándo y dónde se reúne el equipo.", trigger: "Alex recibe el horario semanal y lo añade al calendario.", steps: ["Programar un entrenamiento o un partido.", "Introducir fecha y hora; añadir lugar y rival si se conocen.", "Guardar y localizar la actividad en el calendario."], outcome: "La actividad aparece en el calendario del equipo con los datos introducidos.", view: "calendar", action: "new-event", cta: "Programar actividad" },
      { id: "training", title: "Cerrar un entrenamiento", goal: "Registrar lo sucedido después de una sesión.", trigger: "Al terminar el entrenamiento, Alex tiene la asistencia y una nota breve.", steps: ["Abrir un entrenamiento pasado desde Calendario o Historial.", "Marcar el estado de asistencia de cada integrante.", "Añadir notas manuales y guardar el registro."], outcome: "La sesión conserva asistencia y notas; los estados sin guardar no se convierten en ausencias.", view: "calendar", action: "open-training", cta: "Abrir un entrenamiento" },
      { id: "match", title: "Registrar un partido y revisar la temporada", goal: "Conservar un resultado trazable y consultarlo después.", trigger: "Tras el partido, Alex conoce el marcador y quiere mantenerlo junto al evento.", steps: ["Abrir el partido correspondiente.", "Introducir el componente y los valores del equipo y del rival.", "Guardar y consultar el resultado en el Historial o Resumen."], outcome: "El resultado queda asociado al partido; no se inventan valores si falta información.", view: "calendar", action: "open-match", cta: "Abrir un partido" }
    ];
    return `<div class="page-heading"><div><span class="eyebrow">GUÍA DEL ENTRENADOR · INCREMENTO 3</span><h1>Escenarios de uso</h1><p>Recorridos breves para las tareas habituales de Alex y un equipo amateur.</p></div></div>
      <section class="scenario-intro"><span class="scenario-mark">☷</span><div><b>Empieza por una situación concreta</b><p>Los pasos describen el trabajo de Alex. Los botones abren la parte del prototipo donde puede realizarlo.</p></div></section>
      <section class="scenario-grid">${scenarios.map((s, i) => `<article class="scenario-card" data-scenario-code="PS-0${i + 1}"><div class="scenario-card-top"><span class="scenario-number">0${i + 1}</span><span class="scenario-persona">Alex · Entrenador</span></div><h2>${esc(s.title)}</h2><p class="scenario-goal">${esc(s.goal)}</p><div class="scenario-detail"><b>Situación</b><p>${esc(s.trigger)}</p></div><div class="scenario-detail"><b>Recorrido</b><ol>${s.steps.map(step => `<li>${esc(step)}</li>`).join("")}</ol></div><div class="scenario-result"><b>Resultado esperado</b><p>${esc(s.outcome)}</p></div><button class="secondary-button scenario-button" data-action="start-scenario" data-scenario="${s.id}">${esc(s.cta)} <span aria-hidden="true">→</span></button></article>`).join("")}</section>
      <section class="scenario-scope"><span class="eyebrow">PERFILES FUTUROS</span><h2>Escenarios que quedan fuera del prototipo</h2><p>El coordinador que supervisa varios equipos, el jugador que consulta su calendario y el familiar que recibe avisos se mantienen como perfiles futuros. El MVP no crea accesos ni muestra datos a esos perfiles.</p></section>`;
  }
  const stories = [
    ["US-01","PS-01","P0","Crear equipo y temporada","Como Alex, quiero crear un equipo y asociarlo a una temporada para organizar sus datos.","Crear equipo","new-team","El equipo válido se guarda y queda activo; una temporada existente se reutiliza."],
    ["US-02","PS-01","P1","Consultar y editar equipo","Como Alex, quiero consultar y editar el nombre, deporte y fechas para mantenerlos al día.","Editar equipo","edit-team","Editar conserva los registros vinculados al equipo."],
    ["US-03","PS-02","P0","Añadir integrantes","Como Alex, quiero añadir integrantes con dorsal y función opcionales para crear una plantilla flexible.","Añadir integrante","new-member","El nombre es obligatorio; dorsal y función pueden quedar vacíos."],
    ["US-04","PS-02","P0","Consultar y buscar plantilla","Como Alex, quiero filtrar la plantilla para verificar quién pertenece al equipo.","Ver plantilla","roster","La búsqueda no cambia registros y el contador refleja miembros activos."],
    ["US-05","PS-02","P1","Editar o desactivar integrantes","Como Alex, quiero editar o desactivar integrantes sin perder historial.","Gestionar plantilla","roster","Desactivar conserva registros históricos y permite reactivar."],
    ["US-06","PS-03","P0","Programar actividad","Como Alex, quiero programar entrenamientos y partidos para organizar compromisos.","Programar actividad","new-event","Fecha y hora son obligatorias; rival, lugar y notas son opcionales."],
    ["US-07","PS-03","P0","Explorar calendario","Como Alex, quiero consultar las actividades por mes para preparar la semana.","Abrir calendario","calendar","Las actividades se ordenan por fecha y calendario vacío informa que no hay eventos."],
    ["US-08","PS-03","P1","Editar o cancelar actividad","Como Alex, quiero cambiar o cancelar actividades sin borrarlas.","Gestionar calendario","calendar","Cancelar conserva el registro y lo retira de próximas actividades."],
    ["US-09","PS-04","P0","Registrar asistencia","Como Alex, quiero marcar asistencia para disponer de un registro fiable.","Abrir entrenamiento","open-training","Los estados no seleccionados permanecen sin registrar, nunca son ausencias."],
    ["US-10","PS-04|PS-05","P0","Guardar notas manuales","Como Alex, quiero escribir notas en actividades para conservar mis observaciones.","Abrir actividad","open-event","Las notas se guardan en la actividad; no se generan automáticamente."],
    ["US-11","PS-05","P0","Registrar marcador","Como Alex, quiero guardar resultados configurables para reflejar distintos deportes.","Abrir partido","open-match","El resultado se vincula al partido; los valores ausentes no son cero."],
    ["US-12","PS-05","P1","Consultar historial","Como Alex, quiero filtrar actividades pasadas para revisar registros y resultados.","Ver historial","history","Muestra eventos pasados del equipo activo del más reciente al más antiguo."],
    ["US-13","PS-01–05","P0","Consultar resumen","Como Alex, quiero ver el estado del equipo de un vistazo para decidir qué requiere atención.","Ver resumen","dashboard","Los indicadores proceden de registros del equipo activo."],
    ["US-14","PS-01–05","P1","Exportar copia JSON","Como Alex, quiero descargar mis datos para conservarlos fuera del navegador.","Exportar datos","export","La descarga incluye estado y fecha de exportación sin modificar los datos guardados."],
    ["US-15","Futuro","P2","Vista de coordinación multi-equipo","Como Jordan, quiero consultar equipos autorizados para coordinar el club.","Fuera del MVP","future","Requiere cuentas y permisos por equipo; no está implementada."],
    ["US-16","Futuro","P2","Portal de jugador","Como Sam, quiero consultar el calendario compartido en modo lectura.","Fuera del MVP","future","Requiere portal autenticado y protección de notas; no está implementado."],
    ["US-17","Futuro","P2","Portal familiar","Como Taylor, quiero consultar avisos autorizados del equipo de mi hijo.","Fuera del MVP","future","Requiere autorización y controles de privacidad; no está implementado."],
    ["US-18","Futuro","P2","Resumen asistido por IA","Como Alex, quiero pedir un resumen basado en registros para revisar tendencias.","Fuera del MVP","future","Requiere integración validada; debe señalar ausencias de datos."],
    ["US-19","Futuro","P2","Propuestas de IA con aprobación","Como Alex, quiero revisar propuestas antes de guardarlas.","Fuera del MVP","future","Toda propuesta queda en borrador hasta confirmación explícita; no está implementada."]
  ];
  const features = [["F-01","Equipo y temporada","US-01–02","P0","Prototipo"],["F-02","Plantilla multi-deporte","US-03–05","P0","Prototipo"],["F-03","Calendario","US-06–08","P0","Prototipo"],["F-04","Asistencia y notas","US-09–10","P0","Prototipo"],["F-05","Resultados e historial","US-11–12","P0","Prototipo"],["F-06","Resumen y exportación","US-13–14","P1","Prototipo"],["F-07","Portales y asistente IA","US-15–19","P2","Futuro · no implementado"]];
  function renderStories() {
    return `<div class="page-heading"><div><span class="eyebrow">INCREMENTO 4 · TRAZABILIDAD</span><h1>Historias de usuario</h1><p>Historias, criterios de aceptación y acceso a los flujos del prototipo.</p></div></div>
      <section class="scenario-intro"><span class="scenario-mark">✓</span><div><b>19 historias · 14 del MVP · 5 futuras</b><p>P0/P1 describen el alcance del entrenador. P2 requiere cuentas, servicios o integraciones que este prototipo local no ofrece.</p></div></section>
      <section class="story-grid">${stories.map(s => `<article class="story-card"><div class="story-card-top"><b>${s[0]}</b><span class="priority-badge priority-${s[2].toLowerCase()}">${s[2]}</span></div><h2>${esc(s[3])}</h2><p>${esc(s[4])}</p><div class="story-criteria"><b>Criterio de aceptación</b><span>${esc(s[7])}</span></div><div class="story-links">${s[1].split("|").map(code => `<button class="text-button" data-action="go-scenario" data-scenario-code="${esc(code)}">${esc(code)} · Ver escenario</button>`).join("")}<button class="secondary-button" data-action="start-story" data-story="${s[6]}" ${s[6] === "future" ? "disabled" : ""}>${esc(s[5])} →</button></div></article>`).join("")}</section>
      <section class="scenario-scope"><span class="eyebrow">INCREMENTO 5 · PRIORIZACIÓN</span><h2>Lista priorizada de funcionalidades</h2><p>“Prototipo” indica que el flujo existe en el navegador; no equivale a producción.</p><div class="feature-list">${features.map(f => `<div class="feature-row"><b>${f[0]}</b><span><strong>${esc(f[1])}</strong><small>${esc(f[2])}</small></span><span class="priority-badge priority-${f[3].toLowerCase()}">${f[3]}</span><span>${esc(f[4])}</span></div>`).join("")}</div><div class="release-note"><b>Cierre y preparación para mercado</b><p>La versión actual es una demostración local con almacenamiento del navegador. Antes de comercializar hacen falta autenticación, roles y permisos en servidor, base de datos compartida, copias recuperables, privacidad y protección de datos, pruebas de seguridad, despliegue y soporte. No se presenta como producto listo para producción.</p></div></section>`;
  }
  function renderDashboard() {
    const t = team(); if (!t) return emptyTeam();
    const allEvents = sortEvents(events(false)); const now = new Date();
    const upcoming = allEvents.filter(e => new Date(`${e.date}T${e.time || "00:00"}`) >= now).slice(0, 4);
    const recent = [...allEvents].filter(e => new Date(`${e.date}T${e.time || "00:00"}`) < now).reverse().slice(0, 3);
    const activeMembers = members(false);
    const completedMatches = allEvents.filter(e => e.type === "match" && state.results[e.id]).length;
    const nextEvent = upcoming[0];
    return `<div class="page-heading"><div><div class="welcome-line">${esc(new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long" }).format(today))}</div><h1>Resumen del equipo</h1><p>Una vista clara de lo que pasa esta temporada.</p></div><button class="primary-button" data-action="new-event"><span class="button-plus">+</span> Programar actividad</button></div>
      <section class="stats-grid">
        <article class="stat-card"><span class="stat-icon">♙</span><div class="stat-label">Integrantes activos</div><div class="stat-value">${activeMembers.length}</div><div class="stat-sub">en la plantilla</div></article>
        <article class="stat-card"><span class="stat-icon">▦</span><div class="stat-label">Próxima actividad</div><div class="stat-value" style="font-size:${nextEvent ? 18 : 23}px">${nextEvent ? esc(fmtDate(nextEvent.date)) : "—"}</div><div class="stat-sub">${nextEvent ? `${esc(nextEvent.time || "")} · ${esc(eventLabel(nextEvent))}` : "Sin actividades programadas"}</div></article>
        <article class="stat-card"><span class="stat-icon">◷</span><div class="stat-label">Actividades registradas</div><div class="stat-value">${allEvents.length}</div><div class="stat-sub">en esta temporada</div></article>
        <article class="stat-card"><span class="stat-icon">◎</span><div class="stat-label">Resultados guardados</div><div class="stat-value">${completedMatches}</div><div class="stat-sub">partidos con marcador registrado</div></article>
      </section>
      <div class="dashboard-grid"><section class="panel"><div class="panel-header"><div><h2 class="panel-title">Próximas actividades</h2><p class="panel-subtitle">Lo que viene para ${esc(t.name)}.</p></div><button class="text-button" data-view="calendar">Ver calendario →</button></div><div class="event-list">${upcoming.length ? upcoming.map(e => `<div class="event-row" data-event="${esc(e.id)}">${eventDateTile(e)}<div class="event-main"><b>${esc(eventTitle(e))}</b><div class="event-meta"><span>${esc(e.time || "Hora sin definir")}</span><span>·</span><span>${esc(e.venue || "Lugar pendiente")}</span></div></div><span class="event-tag ${e.type === "match" ? "tag-match" : "tag-training"}">${eventLabel(e)}</span></div>`).join("") : `<div class="empty-state"><b>No hay actividades próximas</b>Programa un entrenamiento o un partido para empezar.<br><button class="text-button" data-action="new-event">+ Programar actividad</button></div>`}</div></section>
      <section class="panel"><div class="panel-header"><div><h2 class="panel-title">Plantilla activa</h2><p class="panel-subtitle">${activeMembers.length} integrantes en el equipo</p></div><button class="text-button" data-view="roster">Ver plantilla →</button></div><div class="roster-preview">${activeMembers.slice(0, 5).map(m => `<div class="member-row"><span class="member-initials">${initials(m.name)}</span><span><span class="member-name">${esc(m.name)}</span><span class="member-detail">${esc([m.role, m.number ? `Dorsal ${m.number}` : ""].filter(Boolean).join(" · ") || "Integrante")}</span></span><span class="member-status">Activo</span></div>`).join("") || `<div class="empty-state"><b>La plantilla está vacía</b>Añade el primer integrante.<br><button class="text-button" data-action="new-member">+ Añadir integrante</button></div>`}</div></section></div>
      <div class="bottom-grid"><section class="panel"><div class="panel-header"><div><h2 class="panel-title">${esc(t.name)}</h2><p class="panel-subtitle">Información del equipo</p></div><button class="text-button" data-action="edit-team">Editar →</button></div><div class="mini-row"><span>Deporte</span><b>${esc(t.sport)}</b></div><div class="mini-row"><span>Temporada</span><b>${esc(seasonFor(t)?.name || "Sin temporada")}</b></div><div class="mini-row"><span>Próximo partido</span><b>${esc(upcoming.find(e => e.type === "match") ? fmtDate(upcoming.find(e => e.type === "match").date, { day: "numeric", month: "short", year: "numeric" }) : "Sin programar")}</b></div></section><section class="panel"><div class="panel-header"><div><h2 class="panel-title">Actividad reciente</h2><p class="panel-subtitle">Datos guardados manualmente</p></div></div>${recent.length ? recent.map(e => `<div class="mini-row"><span>${esc(fmtDate(e.date, { day: "numeric", month: "short" }))} · ${esc(eventLabel(e))}</span><b>${e.type === "match" ? esc(resultText(e)) : (state.attendance[e.id] ? "Asistencia guardada" : "Asistencia pendiente")}</b></div>`).join("") : `<div class="empty-state"><b>Aún no hay historial</b>Las actividades pasadas aparecerán aquí.</div>`}</section></div>`;
  }
  function renderRoster() {
    const list = members().filter(m => `${m.name} ${m.role} ${m.number}`.toLowerCase().includes(searchTerm.toLowerCase()));
    return `<div class="page-heading"><div><span class="eyebrow">EQUIPO · ${esc(team()?.sport || "")}</span><h1>Plantilla</h1><p>Administra integrantes y el estado de la plantilla.</p></div><div class="toolbar"><input class="search-input" id="member-search" placeholder="Buscar integrante..." value="${esc(searchTerm)}" aria-label="Buscar integrante"><button class="primary-button" data-action="new-member"><span class="button-plus">+</span> Añadir integrante</button></div></div>
      <section class="roster-card"><div class="table-scroll"><table><thead><tr><th>Integrante</th><th>Dorsal</th><th>Posición / función</th><th>Estado</th><th></th></tr></thead><tbody>${list.length ? list.map(m => `<tr><td><div class="person-cell"><span class="member-initials">${initials(m.name)}</span><span><b>${esc(m.name)}</b><small>${m.status === "active" ? "Miembro del equipo" : "Conservado en el historial"}</small></span></div></td><td>${esc(m.number || "—")}</td><td>${esc(m.role || "—")}</td><td><span class="status-pill ${m.status === "inactive" ? "inactive" : ""}">${m.status === "active" ? "Activo" : "Inactivo"}</span></td><td><div class="row-actions"><button class="small-action" data-action="edit-member" data-id="${esc(m.id)}">Editar</button><button class="small-action" data-action="toggle-member" data-id="${esc(m.id)}">${m.status === "active" ? "Desactivar" : "Reactivar"}</button></div></td></tr>`).join("") : `<tr><td colspan="5"><div class="no-results">${searchTerm ? "No hay integrantes que coincidan con la búsqueda." : "La plantilla está vacía. Añade el primer integrante para empezar."}</div></td></tr>`}</tbody></table></div></section>
      <div class="quick-actions"><button data-action="new-event">＋ Programar actividad</button><button data-action="export">⇩ Exportar datos</button></div>`;
  }
  function renderCalendar() {
    const base = new Date(today.getFullYear(), today.getMonth() + calendarOffset, 1);
    const monthName = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" }).format(base);
    const list = sortEvents(events()).filter(e => { const d = localDate(e.date); return d && d.getFullYear() === base.getFullYear() && d.getMonth() === base.getMonth(); });
    return `<div class="page-heading"><div><span class="eyebrow">ACTIVIDAD DEL EQUIPO</span><h1>Calendario</h1><p>Entrenamientos y partidos de la temporada.</p></div><button class="primary-button" data-action="new-event"><span class="button-plus">+</span> Programar actividad</button></div>
      <section class="panel"><div class="panel-header"><div class="calendar-toolbar"><button class="month-button" data-action="prev-month" aria-label="Mes anterior">‹</button><button class="month-button" data-action="next-month" aria-label="Mes siguiente">›</button><h2 class="calendar-title">${esc(monthName)}</h2></div><span class="panel-subtitle">${list.length} actividades</span></div><div class="calendar-list">${list.length ? list.map(e => `<article class="event-card" data-event="${esc(e.id)}">${eventDateTile(e)}<div class="event-card-main"><div><b>${esc(eventTitle(e))}</b><div class="event-card-meta">${esc(e.time || "Hora pendiente")} · ${esc(e.venue || "Lugar pendiente")}${e.notes ? ` · ${esc(e.notes)}` : ""}</div></div><span class="event-tag ${e.status === "cancelled" ? "tag-cancelled" : e.type === "match" ? "tag-match" : "tag-training"}">${e.status === "cancelled" ? "Cancelado" : eventLabel(e)}</span></div><div class="event-card-actions">${e.type === "match" ? `<span class="result-display">${esc(resultText(e))}</span>` : `<span class="panel-subtitle">${state.attendance[e.id] ? "Asistencia guardada" : "Asistencia sin registrar"}</span>`}<button class="text-button">Abrir →</button></div></article>`).join("") : `<div class="empty-state"><b>No hay actividades este mes</b>Programa una sesión para añadirla al calendario.</div>`}</div></section>`;
  }
  function renderHistory() {
    let list = sortEvents(events()).filter(e => new Date(`${e.date}T${e.time || "00:00"}`) < new Date()).reverse();
    if (historyFilter === "training") list = list.filter(e => e.type === "training");
    if (historyFilter === "match") list = list.filter(e => e.type === "match");
    return `<div class="page-heading"><div><span class="eyebrow">TEMPORADA · ${esc(seasonFor()?.name || "")}</span><h1>Historial</h1><p>Actividad anterior y registros asociados.</p></div><div class="history-filters"><button class="filter-chip ${historyFilter === "all" ? "active" : ""}" data-filter="all">Todo</button><button class="filter-chip ${historyFilter === "training" ? "active" : ""}" data-filter="training">Entrenamientos</button><button class="filter-chip ${historyFilter === "match" ? "active" : ""}" data-filter="match">Partidos</button></div></div><div class="calendar-list">${list.length ? list.map(e => `<article class="event-card" data-event="${esc(e.id)}">${eventDateTile(e)}<div class="event-card-main"><div><b>${esc(eventTitle(e))}</b><div class="event-card-meta">${esc(fmtDate(e.date, { day: "numeric", month: "long", year: "numeric" }))} · ${esc(e.time || "Hora pendiente")} · ${esc(e.venue || "Lugar pendiente")}</div></div><span class="event-tag ${e.status === "cancelled" ? "tag-cancelled" : e.type === "match" ? "tag-match" : "tag-training"}">${e.status === "cancelled" ? "Cancelado" : eventLabel(e)}</span></div><div class="event-card-actions"><span class="result-display">${e.type === "match" ? esc(resultText(e)) : state.attendance[e.id] ? "Asistencia registrada" : "Asistencia sin registrar"}</span><button class="text-button">Ver registro →</button></div></article>`).join("") : `<section class="panel"><div class="empty-state"><b>No hay actividad anterior registrada</b>Cuando una sesión o un partido termine, quedará en este historial.</div></section>`}</div>`;
  }
  function emptyTeam() { return `<div class="page-heading"><div><span class="eyebrow">TEAMTRACK</span><h1>Empieza por tu equipo</h1><p>Crea un equipo y una temporada para organizar la actividad.</p></div></div><section class="panel"><div class="empty-state"><b>Aún no hay equipos</b>El primer paso es crear uno.<br><button class="primary-button" data-action="new-team">＋ Crear equipo</button></div></section>`; }
  function toast(message) { const el = document.getElementById("toast"); el.textContent = message; el.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 2400); }
  function openModal(title, body, eyebrow = "TEAMTRACK") { document.getElementById("modal-title").textContent = title; document.getElementById("modal-eyebrow").textContent = eyebrow; modalBody.innerHTML = body; modalBackdrop.hidden = false; setTimeout(() => modalBody.querySelector("input,select,textarea,button")?.focus(), 0); }
  function closeModal() { modalBackdrop.hidden = true; modalBody.innerHTML = ""; }
  function formButtons(label = "Guardar") { return `<div class="form-actions"><button type="button" class="secondary-button" data-action="close-modal">Cancelar</button><button type="submit" class="primary-button">${label}</button></div>`; }
  function showTeamForm(edit = false) {
    const t = team() || {}; const s = seasonFor(t) || {};
    openModal(edit ? "Editar equipo" : "Crear equipo", `<form id="team-form" data-edit="${edit ? "1" : "0"}" data-id="${esc(t.id || "")}"><div class="form-grid"><div class="field full"><label for="team-name">Nombre del equipo *</label><input id="team-name" name="name" required maxlength="70" value="${esc(t.name || "")}" placeholder="Ej. Club Basket" /></div><div class="field"><label for="team-sport">Deporte *</label><select id="team-sport" name="sport" required><option ${t.sport === "Baloncesto" ? "selected" : ""}>Baloncesto</option><option ${t.sport === "Voleibol" ? "selected" : ""}>Voleibol</option><option ${t.sport === "Fútbol" ? "selected" : ""}>Fútbol</option><option ${t.sport && !["Baloncesto", "Voleibol", "Fútbol"].includes(t.sport) ? "selected" : ""}>Otro</option></select></div><div class="field"><label for="season-name">Temporada *</label><input id="season-name" name="season" required maxlength="50" value="${esc(s.name || "")}" placeholder="Ej. Temporada 2026/27" /></div><div class="field"><label for="season-start">Inicio (opcional)</label><input id="season-start" name="startsOn" type="date" value="${esc(s.startsOn || "")}" /></div><div class="field"><label for="season-end">Fin (opcional)</label><input id="season-end" name="endsOn" type="date" value="${esc(s.endsOn || "")}" /></div></div>${formButtons()}</form>`, "CONFIGURACIÓN DEL EQUIPO");
  }
  function showMemberForm(member = null) {
    openModal(member ? "Editar integrante" : "Añadir integrante", `<form id="member-form" data-id="${esc(member?.id || "")}"><div class="form-grid"><div class="field full"><label for="member-name">Nombre *</label><input id="member-name" name="name" required maxlength="80" value="${esc(member?.name || "")}" placeholder="Nombre y apellidos" /></div><div class="field"><label for="member-number">Dorsal <span class="field-hint">(opcional)</span></label><input id="member-number" name="number" maxlength="10" value="${esc(member?.number || "")}" placeholder="—" /></div><div class="field"><label for="member-role">Posición / función <span class="field-hint">(opcional)</span></label><input id="member-role" name="role" maxlength="40" value="${esc(member?.role || "")}" placeholder="Ej. Base" /></div></div>${formButtons(member ? "Guardar cambios" : "Añadir integrante")}</form>`, "PLANTILLA");
  }
  function showEventForm(event = null) {
    openModal(event ? "Editar actividad" : "Programar actividad", `<form id="event-form" data-id="${esc(event?.id || "")}"><div class="form-grid"><div class="field"><label for="event-type">Tipo *</label><select id="event-type" name="type"><option value="training" ${event?.type !== "match" ? "selected" : ""}>Entrenamiento</option><option value="match" ${event?.type === "match" ? "selected" : ""}>Partido</option></select></div><div class="field"><label for="event-date">Fecha *</label><input id="event-date" name="date" required type="date" value="${esc(event?.date || day(1))}" /></div><div class="field"><label for="event-time">Hora *</label><input id="event-time" name="time" required type="time" value="${esc(event?.time || "18:00")}" /></div><div class="field"><label for="event-place">Lugar <span class="field-hint">(opcional)</span></label><input id="event-place" name="venue" maxlength="100" value="${esc(event?.venue || "")}" placeholder="Pabellón, campo..." /></div><div class="field full" id="opponent-wrap" style="${event?.type === "match" ? "" : "display:none"}"><label for="event-opponent">Rival <span class="field-hint">(opcional)</span></label><input id="event-opponent" name="opponent" maxlength="80" value="${esc(event?.opponent || "")}" placeholder="Nombre del equipo rival" /></div><div class="field full"><label for="event-notes">Notas <span class="field-hint">(opcional)</span></label><textarea id="event-notes" name="notes" maxlength="1000" placeholder="Detalles de la actividad">${esc(event?.notes || "")}</textarea></div></div>${formButtons(event ? "Guardar cambios" : "Programar")}</form>`, "CALENDARIO");
  }
  function showTeamPicker() { openModal("Tus equipos", `<div class="team-list-options">${state.teams.map(t => `<button class="team-option" data-action="select-team" data-id="${esc(t.id)}"><span class="team-avatar">${initials(t.name)}</span><span><b>${esc(t.name)}</b><small>${esc(t.sport)} · ${esc(seasonFor(t)?.name || "Sin temporada")}</small></span></button>`).join("")}<button class="secondary-button" style="margin-top:6px" data-action="new-team">＋ Crear otro equipo</button></div>`, "ESPACIO DE TRABAJO"); }
  function showEventDetail(eventId) {
    const e = state.events.find(x => x.id === eventId); if (!e) return;
    if (e.type === "training") {
      const current = state.attendance[e.id] || {};
      const rows = members(false).map(m => `<label class="attendance-row"><span>${esc(m.name)}</span><select name="attendance:${esc(m.id)}"><option value="unregistered" ${!current[m.id] ? "selected" : ""}>Sin registrar</option><option value="present" ${current[m.id] === "present" ? "selected" : ""}>Presente</option><option value="absent" ${current[m.id] === "absent" ? "selected" : ""}>Ausente</option><option value="late" ${current[m.id] === "late" ? "selected" : ""}>Tarde</option><option value="excused" ${current[m.id] === "excused" ? "selected" : ""}>Justificado</option></select></label>`).join("");
      openModal(eventTitle(e), `<div class="detail-block"><div class="detail-label">${esc(fmtDate(e.date, { day: "numeric", month: "long", year: "numeric" }))} · ${esc(e.time || "Hora pendiente")} · ${esc(e.venue || "Lugar pendiente")}</div></div><form id="attendance-form" data-id="${esc(e.id)}"><div class="detail-block"><div class="detail-label">ASISTENCIA · LO NO REGISTRADO SIGUE PENDIENTE</div><div class="attendance-list">${rows || `<div class="empty-state">Añade integrantes a la plantilla para registrar asistencia.</div>`}</div></div><div class="field" style="margin-top:13px"><label for="session-notes">Notas de la sesión</label><textarea id="session-notes" name="notes" maxlength="1000" placeholder="Notas introducidas por el entrenador">${esc(e.notes || "")}</textarea></div>${formButtons("Guardar registro")}</form><div class="form-actions" style="justify-content:space-between"><button class="danger-link" data-action="cancel-event" data-id="${esc(e.id)}">${e.status === "cancelled" ? "Actividad cancelada" : "Cancelar actividad"}</button><button class="small-action" data-action="edit-event" data-id="${esc(e.id)}">Editar actividad</button></div>`, "REGISTRO DE ENTRENAMIENTO");
    } else {
      const r = state.results[e.id] || {};
      openModal(eventTitle(e), `<div class="detail-block"><div class="detail-label">${esc(fmtDate(e.date, { day: "numeric", month: "long", year: "numeric" }))} · ${esc(e.time || "Hora pendiente")} · ${esc(e.venue || "Lugar pendiente")}</div></div><form id="result-form" data-id="${esc(e.id)}"><div class="field"><label for="result-label">Componente del resultado *</label><input id="result-label" name="label" required maxlength="30" value="${esc(r.label || "Puntos")}" placeholder="Puntos, sets, goles..." /><span class="field-hint">El formato depende del deporte. El resultado no se calcula.</span></div><div class="score-grid" style="margin-top:14px"><div class="field"><label for="our-value">${esc(team()?.name || "Equipo")}</label><input id="our-value" name="ourValue" required type="number" min="0" step="any" value="${r.ourValue !== undefined ? esc(r.ourValue) : ""}" placeholder="—" /></div><div class="score-separator">—</div><div class="field"><label for="their-value">${esc(e.opponent || "Rival")}</label><input id="their-value" name="theirValue" required type="number" min="0" step="any" value="${r.theirValue !== undefined ? esc(r.theirValue) : ""}" placeholder="—" /></div></div><div class="field" style="margin-top:14px"><label for="match-notes">Notas</label><textarea id="match-notes" name="notes" maxlength="1000" placeholder="Observaciones del partido">${esc(e.notes || "")}</textarea></div>${formButtons("Guardar resultado")}</form><div class="form-actions" style="justify-content:space-between"><button class="danger-link" data-action="cancel-event" data-id="${esc(e.id)}">${e.status === "cancelled" ? "Actividad cancelada" : "Cancelar actividad"}</button><button class="small-action" data-action="edit-event" data-id="${esc(e.id)}">Editar actividad</button></div>`, "REGISTRO DE PARTIDO");
    }
  }
  function formData(form) { return Object.fromEntries(new FormData(form).entries()); }
  function handleSubmit(form) {
    const data = formData(form);
    if (form.id === "team-form") {
      if (data.startsOn && data.endsOn && data.endsOn < data.startsOn) return toast("La fecha de fin debe ser posterior al inicio.");
      const season = state.seasons.find(s => s.name.trim().toLowerCase() === data.season.trim().toLowerCase()) || { id: id(), name: data.season.trim(), startsOn: data.startsOn, endsOn: data.endsOn };
      if (!state.seasons.some(s => s.id === season.id)) state.seasons.push(season); else Object.assign(season, { startsOn: data.startsOn, endsOn: data.endsOn });
      if (form.dataset.edit === "1") { const t = state.teams.find(x => x.id === form.dataset.id); Object.assign(t, { name: data.name.trim(), sport: data.sport, seasonId: season.id }); }
      else { const t = { id: id(), name: data.name.trim(), sport: data.sport, seasonId: season.id }; state.teams.push(t); state.activeTeamId = t.id; }
      closeModal(); persist(form.dataset.edit === "1" ? "Equipo actualizado." : "Equipo creado."); return;
    }
    if (form.id === "member-form") {
      const m = state.members.find(x => x.id === form.dataset.id);
      if (m) Object.assign(m, { name: data.name.trim(), number: data.number.trim(), role: data.role.trim() });
      else state.members.push({ id: id(), teamId: team().id, name: data.name.trim(), number: data.number.trim(), role: data.role.trim(), status: "active" });
      closeModal(); persist(m ? "Integrante actualizado." : "Integrante añadido."); return;
    }
    if (form.id === "event-form") {
      const existing = state.events.find(x => x.id === form.dataset.id);
      const record = { ...(existing || { id: id(), teamId: team().id, status: "scheduled" }), type: data.type, date: data.date, time: data.time, venue: data.venue.trim(), opponent: data.type === "match" ? data.opponent.trim() : "", notes: data.notes.trim() };
      if (existing) Object.assign(existing, record); else state.events.push(record);
      closeModal(); persist(existing ? "Actividad actualizada." : "Actividad programada."); return;
    }
    if (form.id === "attendance-form") {
      const eventId = form.dataset.id; const selected = {};
      for (const [key, value] of Object.entries(data)) if (key.startsWith("attendance:") && value !== "unregistered") selected[key.slice("attendance:".length)] = value;
      state.attendance[eventId] = selected;
      const event = state.events.find(x => x.id === eventId); if (event) event.notes = data.notes.trim();
      closeModal(); persist("Asistencia y notas guardadas."); return;
    }
    if (form.id === "result-form") {
      const eventId = form.dataset.id; const event = state.events.find(x => x.id === eventId);
      if (!Number.isFinite(Number(data.ourValue)) || !Number.isFinite(Number(data.theirValue))) return toast("Introduce ambos valores del resultado.");
      state.results[eventId] = { label: data.label.trim(), ourValue: Number(data.ourValue), theirValue: Number(data.theirValue), recordedAt: new Date().toISOString() };
      if (event) event.notes = data.notes.trim();
      closeModal(); persist("Resultado guardado.");
    }
  }
  function exportData() { const blob = new Blob([JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2)], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "teamtrack-datos.json"; a.click(); URL.revokeObjectURL(a.href); toast("Copia JSON descargada."); }
  document.addEventListener("click", e => {
    const viewButton = e.target.closest("[data-view]"); if (viewButton) { currentView = viewButton.dataset.view; searchTerm = ""; render(); document.getElementById("sidebar").classList.remove("open"); return; }
    const eventCard = e.target.closest("[data-event]"); if (eventCard && !e.target.closest("button")) { showEventDetail(eventCard.dataset.event); return; }
    const b = e.target.closest("[data-action]"); if (!b) { if (e.target === modalBackdrop) closeModal(); return; }
    const action = b.dataset.action;
    if (action === "go-scenario") {
      const code = b.dataset.scenarioCode; currentView = "scenarios"; render();
      document.querySelector(`[data-scenario-code="${code}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" }); return;
    }
    if (action === "start-story") {
      const storyAction = b.dataset.story;
      if (storyAction === "new-team") showTeamForm(false);
      else if (storyAction === "edit-team") showTeamForm(true);
      else if (storyAction === "new-member") showMemberForm();
      else if (storyAction === "new-event") showEventForm();
      else if (["open-training", "open-match", "open-event"].includes(storyAction)) {
        const type = storyAction === "open-training" ? "training" : storyAction === "open-match" ? "match" : null;
        const matches = sortEvents(events(false)).filter(ev => !type || ev.type === type);
        const candidate = matches.find(ev => new Date(`${ev.date}T${ev.time || "00:00"}`) <= new Date()) || matches[0];
        if (candidate) showEventDetail(candidate.id); else toast(type === "training" ? "Programa primero un entrenamiento." : type === "match" ? "Programa primero un partido." : "Programa una actividad primero.");
      } else if (["roster", "calendar", "history", "dashboard"].includes(storyAction)) { currentView = storyAction; render(); }
      else if (storyAction === "export") exportData();
      document.getElementById("sidebar").classList.remove("open"); return;
    }
    if (action === "start-scenario") {
      const scenario = b.dataset.scenario;
      if (scenario === "team") { closeModal(); currentView = "dashboard"; render(); showTeamForm(false); }
      if (scenario === "roster") { currentView = "roster"; render(); showMemberForm(); }
      if (scenario === "schedule") { currentView = "calendar"; render(); showEventForm(); }
      if (scenario === "training" || scenario === "match") {
        currentView = "calendar"; render();
        const type = scenario === "training" ? "training" : "match";
        const candidate = sortEvents(events()).find(ev => ev.type === type && ev.status !== "cancelled");
        if (candidate) showEventDetail(candidate.id);
        else toast(scenario === "training" ? "Programa primero un entrenamiento para registrar la sesión." : "Programa primero un partido para registrar el resultado.");
      }
      document.getElementById("sidebar").classList.remove("open"); return;
    }
    if (action === "new-team") { closeModal(); showTeamForm(false); }
    if (action === "edit-team") showTeamForm(true);
    if (action === "new-member") showMemberForm();
    if (action === "edit-member") showMemberForm(state.members.find(m => m.id === b.dataset.id));
    if (action === "toggle-member") { const m = state.members.find(x => x.id === b.dataset.id); if (m) { m.status = m.status === "active" ? "inactive" : "active"; persist(m.status === "active" ? "Integrante reactivado." : "Integrante desactivado. El historial se conserva."); } }
    if (action === "new-event") showEventForm();
    if (action === "edit-event") { const ev = state.events.find(x => x.id === b.dataset.id); closeModal(); showEventForm(ev); }
    if (action === "cancel-event") { const ev = state.events.find(x => x.id === b.dataset.id); if (ev && ev.status !== "cancelled") { ev.status = "cancelled"; closeModal(); persist("Actividad cancelada y conservada en el historial."); } }
    if (action === "close-modal") closeModal();
    if (action === "prev-month") { calendarOffset--; render(); }
    if (action === "next-month") { calendarOffset++; render(); }
    if (action === "select-team") { state.activeTeamId = b.dataset.id; closeModal(); currentView = "dashboard"; persist(); }
    if (action === "export") exportData();
  });
  document.querySelectorAll(".nav-item").forEach(n => n.addEventListener("click", () => { currentView = n.dataset.view; render(); }));
  document.getElementById("team-switcher").addEventListener("click", showTeamPicker);
  document.getElementById("mobile-menu").addEventListener("click", () => document.getElementById("sidebar").classList.toggle("open"));
  document.getElementById("export-data").addEventListener("click", exportData);
  document.querySelector(".close-modal").addEventListener("click", closeModal);
  document.addEventListener("submit", e => { if (["team-form", "member-form", "event-form", "attendance-form", "result-form"].includes(e.target.id)) { e.preventDefault(); handleSubmit(e.target); } });
  document.addEventListener("change", e => { if (e.target.id === "event-type") document.getElementById("opponent-wrap").style.display = e.target.value === "match" ? "" : "none"; if (e.target.matches("[data-filter]")) { historyFilter = e.target.dataset.filter; render(); } });
  document.addEventListener("click", e => { const f = e.target.closest("[data-filter]"); if (f) { historyFilter = f.dataset.filter; render(); } });
  document.addEventListener("input", e => { if (e.target.id === "member-search") { searchTerm = e.target.value; const pos = e.target.selectionStart; render(); const input = document.getElementById("member-search"); input.focus(); input.setSelectionRange(pos, pos); } });
  render();
})();

