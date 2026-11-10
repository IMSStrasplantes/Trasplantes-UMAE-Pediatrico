const firebaseConfig = {
  apiKey: "AIzaSyBgcIKLtVbKgmaXur5snAcY44OF1tdl6Fc",
  authDomain: "trasplantespediatriaimss.firebaseapp.com",
  projectId: "trasplantespediatriaimss",
  storageBucket: "trasplantespediatriaimss.firebasestorage.app",
  messagingSenderId: "528570429283",
  appId: "1:528570429283:web:6453b0573f1c84eb736d56"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

const loginContainer = document.getElementById('login-container');
const appContainer = document.getElementById('app-container');
const listaPacientesDiv = document.getElementById('lista-pacientes');
const toastContainer = document.getElementById('toast-container');
const modal = document.getElementById('modal-paciente');
const formEdicion = document.getElementById('formulario-edicion');
const btnGuardar = document.getElementById('btn-guardar-cambios');
const btnNuevoPaciente = document.getElementById('btn-nuevo-paciente');
const selectEstadoPaciente = document.getElementById('filtro-estado-paciente');
const selectModalidad = document.getElementById('filtro-modalidad');
const selectOrigen = document.getElementById('filtro-origen');
const selectHemotipo = document.getElementById('filtro-hemotipo');
const badgeContadorModalidad = document.getElementById('badge-contador-modalidad');

const modalPrivacidad = document.getElementById('modal-privacidad');
const btnAbrirPrivacidad = document.getElementById('btn-abrir-privacidad');
const btnCerrarPrivacidad = document.getElementById('btn-cerrar-privacidad');
const btnEntendidoPrivacidad = document.getElementById('btn-entendido-privacidad');
const checkAceptoPrivacidad = document.getElementById('check-acepto-privacidad');

// Botones y ventanas panorámicas
const modalPanelDatos = document.getElementById('modal-panel-datos');
const btnCerrarPanelDatos = document.getElementById('btn-cerrar-panel-datos');
const contenidoPanelDatos = document.getElementById('contenido-panel-datos');
const btnGuardarPanelDatos = document.getElementById('btn-guardar-panel-datos');

const modalPanelProto = document.getElementById('modal-panel-protocolo');
const btnCerrarPanelProto = document.getElementById('btn-cerrar-panel-proto');
const contenidoPanelProto = document.getElementById('contenido-panel-protocolo');
const btnGuardarPanelProto = document.getElementById('btn-guardar-panel-proto');

const modalPanelVal = document.getElementById('modal-panel-valoraciones');
const btnCerrarPanelVal = document.getElementById('btn-cerrar-panel-val');
const contenidoPanelVal = document.getElementById('contenido-panel-valoraciones');
const btnGuardarPanelVal = document.getElementById('btn-guardar-panel-val');

const modalPanelLabs = document.getElementById('modal-panel-labs');
const btnCerrarPanelLabs = document.getElementById('btn-cerrar-panel-labs');
const contenidoPanelLabs = document.getElementById('contenido-panel-labs');
const btnGuardarPanelLabs = document.getElementById('btn-guardar-panel-labs');

const modalPanelImg = document.getElementById('modal-panel-imagen');
const btnCerrarPanelImg = document.getElementById('btn-cerrar-panel-img');
const contenidoPanelImg = document.getElementById('contenido-panel-imagen');
const btnGuardarPanelImg = document.getElementById('btn-guardar-panel-img');

const modalPanelVac = document.getElementById('modal-panel-vacunas');
const btnCerrarPanelVac = document.getElementById('btn-cerrar-panel-vac');
const contenidoPanelVac = document.getElementById('contenido-panel-vacunas');
const btnGuardarPanelVac = document.getElementById('btn-guardar-panel-vac');

const modalPanelInfeccioso = document.getElementById('modal-panel-infeccioso');
const btnCerrarPanelInfeccioso = document.getElementById('btn-cerrar-panel-infeccioso');
const contenidoPanelInfeccioso = document.getElementById('contenido-panel-infeccioso');
const btnGuardarPanelInf = document.getElementById('btn-guardar-panel-inf');

const modalPanelInmunologico = document.getElementById('modal-panel-inmunologico');
const btnCerrarPanelInm = document.getElementById('btn-cerrar-panel-inm');
const contenidoPanelInmunologico = document.getElementById('contenido-panel-inmunologico');
const btnGuardarPanelInm = document.getElementById('btn-guardar-panel-inm');

const modalPanelDonador = document.getElementById('modal-panel-donador');
const btnCerrarPanelDonador = document.getElementById('btn-cerrar-panel-donador');
const contenidoPanelDonador = document.getElementById('contenido-panel-donador');
const btnGuardarPanelDonador = document.getElementById('btn-guardar-panel-donador');

if(btnAbrirPrivacidad) btnAbrirPrivacidad.onclick = () => { if(modalPrivacidad) modalPrivacidad.style.display = 'flex'; };
if(btnCerrarPrivacidad) btnCerrarPrivacidad.onclick = () => { if(modalPrivacidad) modalPrivacidad.style.display = 'none'; };
if(btnEntendidoPrivacidad) btnEntendidoPrivacidad.onclick = () => { if(modalPrivacidad) modalPrivacidad.style.display = 'none'; };

if(btnCerrarPanelDatos) btnCerrarPanelDatos.onclick = () => modalPanelDatos.style.display = 'none';
if(btnCerrarPanelProto) btnCerrarPanelProto.onclick = () => modalPanelProto.style.display = 'none';
if(btnCerrarPanelVal) btnCerrarPanelVal.onclick = () => modalPanelVal.style.display = 'none';
if(btnCerrarPanelLabs) btnCerrarPanelLabs.onclick = () => modalPanelLabs.style.display = 'none';
if(btnCerrarPanelImg) btnCerrarPanelImg.onclick = () => modalPanelImg.style.display = 'none';
if(btnCerrarPanelVac) btnCerrarPanelVac.onclick = () => modalPanelVac.style.display = 'none';
if(btnCerrarPanelInfeccioso) btnCerrarPanelInfeccioso.onclick = () => modalPanelInfeccioso.style.display = 'none';
if(btnCerrarPanelInm) btnCerrarPanelInm.onclick = () => modalPanelInmunologico.style.display = 'none';
if(btnCerrarPanelDonador) btnCerrarPanelDonador.onclick = () => modalPanelDonador.style.display = 'none';

let pacientesData = []; 
let pacienteActualId = null; 
let nombreDoctorActual = ""; 

auth.onAuthStateChanged(user => {
    if (user) {
        reiniciarTemporizadorInactividad();
        loginContainer.style.display = 'none';
        appContainer.style.display = 'block';
        nombreDoctorActual = user.email.split('@')[0]; 
        nombreDoctorActual = "Dr(a). " + nombreDoctorActual.charAt(0).toUpperCase() + nombreDoctorActual.slice(1);
        document.getElementById('perfil-usuario').innerText = "👨‍⚕️ " + nombreDoctorActual;
        iniciarEscuchaPacientes();
        iniciarEscuchaNotificaciones();
    } else {
        clearTimeout(temporizadorInactividad);
        loginContainer.style.display = 'flex';
        appContainer.style.display = 'none';
    }
});

document.getElementById('btn-login').onclick = () => {
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-password').value;
    const errorMsg = document.getElementById('login-error');
    
    if(!checkAceptoPrivacidad.checked) {
        errorMsg.innerText = "⚠️ Debes aceptar el Aviso de Privacidad para iniciar sesión.";
        return;
    }
    if(!email || !pass) { 
        errorMsg.innerText = "Ingresa correo y contraseña."; 
        return; 
    }
    auth.signInWithEmailAndPassword(email, pass).catch(error => { errorMsg.innerText = "Credenciales incorrectas."; });
};
document.getElementById('btn-logout-sesion').onclick = () => auth.signOut();

/* ==========================================
   CIERRE AUTOMÁTICO POR INACTIVIDAD (15 mins)
========================================== */
const TIEMPO_INACTIVIDAD = 15 * 60 * 1000;
let temporizadorInactividad = null;

function reiniciarTemporizadorInactividad() {
    if (!auth.currentUser) return;
    clearTimeout(temporizadorInactividad);
    temporizadorInactividad = setTimeout(async () => {
        if (auth.currentUser) {
            try {
                await auth.signOut();
                alert("Tu sesión se cerró automáticamente por inactividad. Inicia sesión nuevamente para continuar.");
            } catch (error) {
                console.error("Error al cerrar sesión por inactividad:", error);
            }
        }
    }, TIEMPO_INACTIVIDAD);
}

['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'].forEach(evento => {
    document.addEventListener(evento, reiniciarTemporizadorInactividad);
});

function normalizarTexto(texto) {
    if(!texto) return "";
    return String(texto).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/\s+/g, " ").trim();
}

function calcularEdadDinamica(fechaString) {
    if(!fechaString) return "";
    let partes = fechaString.split(/[-/]/); 
    let dia, mes, anio;
    if(partes.length === 3) {
        if (partes[2].length === 4) { dia = parseInt(partes[0]); mes = parseInt(partes[1]); anio = parseInt(partes[2]); } 
        else if (partes[0].length === 4) { anio = parseInt(partes[0]); mes = parseInt(partes[1]); dia = parseInt(partes[2]); }
    }
    if(!anio) return "";
    let nacimiento = new Date(anio, mes - 1, dia);
    let hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    let m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) { edad--; }
    return edad >= 0 ? edad.toString() : "";
}

function calcularClaseAlertaVencimiento(fechaStr) {
    if (!fechaStr || normalizarTexto(fechaStr) === 'PENDIENTE' || normalizarTexto(fechaStr) === 'SIN ASIGNAR') return 'alerta-amarilla';
    let match = fechaStr.match(/(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})/) || fechaStr.match(/(\d{2,4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (!match) return ''; 
    let d, m, a;
    if (match[1].length === 4) {
        a = parseInt(match[1]); m = parseInt(match[2]); d = parseInt(match[3]);
    } else {
        d = parseInt(match[1]); m = parseInt(match[2]); a = parseInt(match[3]);
        if (a < 100) a += 2000;
    }
    let fechaEstudio = new Date(a, m - 1, d);
    let hoy = new Date();
    let diferenciaMeses = (hoy.getFullYear() - fechaEstudio.getFullYear()) * 12 + (hoy.getMonth() - fechaEstudio.getMonth());
    if (diferenciaMeses > 6) return 'alerta-roja'; 
    return '';
}

function obtenerValorSeguro(paciente, posiblesNombres) {
    if (!paciente) return ''; 
    for (let nombre of posiblesNombres) {
        let nombreLimpio = normalizarTexto(nombre);
        const key = Object.keys(paciente).find(k => normalizarTexto(k) === nombreLimpio);
        if (key && paciente[key] !== undefined && paciente[key] !== null) return paciente[key];
    }
    return ''; 
}

function verificarEstadoSeccion(paciente, camposArr) {
    let tieneRojo = false;
    let tieneAmarillo = false;
    camposArr.forEach(c => {
        let val = obtenerValorSeguro(paciente, [c]);
        let clase = calcularClaseAlertaVencimiento(val);
        if (clase === 'alerta-roja') tieneRojo = true;
        else if (clase === 'alerta-amarilla' || val.trim() === '') tieneAmarillo = true;
    });
    if (tieneRojo) return '<span style="height:10px; width:10px; background-color:#e74c3c; border-radius:50%; display:inline-block; float:right;" title="Estudios vencidos (>6 meses)"></span>';
    if (tieneAmarillo) return '<span style="height:10px; width:10px; background-color:#f1c40f; border-radius:50%; display:inline-block; float:right;" title="Pendientes o datos faltantes"></span>';
    return '<span style="height:10px; width:10px; background-color:#2ecc71; border-radius:50%; display:inline-block; float:right;" title="Al día"></span>';
}

function actualizarContadores(todosLosPacientes) {
    let total = todosLosPacientes.length;
    let proceso = 0, comite = 0, enlistado = 0, trasplantado = 0, finados = 0;

    todosLosPacientes.forEach(p => {
        let finadoVal = obtenerValorSeguro(p, ['Finado']).toUpperCase();
        let esFinado = finadoVal === 'SI' || finadoVal.includes('FINADO');
        if (esFinado) { finados++; return; }

        let estDb = obtenerValorSeguro(p, ['EstatusGeneral', 'Estatus']);
        let leg = obtenerValorSeguro(p, ['Enlistado']);
        let estActual = 'EN PROCESO';
        if(estDb && estDb.trim() !== '') estActual = estDb.toUpperCase();
        else if (leg && leg.toUpperCase() === 'SI') estActual = 'ENLISTADO';

        if(estActual === 'EN PROCESO') proceso++;
        else if(estActual === 'COMITE') comite++;
        else if(estActual === 'ENLISTADO') enlistado++;
        else if(estActual === 'TRASPLANTADO') trasplantado++;
    });

    document.getElementById('contador-total').innerText = total;
    document.getElementById('contador-proceso').innerText = proceso;
    document.getElementById('contador-comite').innerText = comite;
    document.getElementById('contador-enlistado').innerText = enlistado;
    document.getElementById('contador-trasplantado').innerText = trasplantado;
    document.getElementById('contador-finados').innerText = finados;
}

function renderizarPacientes(pacientes) {
    listaPacientesDiv.innerHTML = ''; 
    if (pacientes.length === 0) {
        listaPacientesDiv.innerHTML = '<p class="cargando">No hay pacientes que coincidan con esta selección.</p>';
        return;
    }

    pacientes.sort((a, b) => {
        let tratA = normalizarTexto(obtenerValorSeguro(a, ['Tratamiento', 'Modalidad'])) || "Z_SIN TRATAMIENTO";
        let tratB = normalizarTexto(obtenerValorSeguro(b, ['Tratamiento', 'Modalidad'])) || "Z_SIN TRATAMIENTO";
        if (tratA < tratB) return -1;
        if (tratA > tratB) return 1;
        let nombreA = normalizarTexto(obtenerValorSeguro(a, ['Receptor', 'NOMBRE REAL', 'NOMBRE', 'Nombre']));
        let nombreB = normalizarTexto(obtenerValorSeguro(b, ['Receptor', 'NOMBRE REAL', 'NOMBRE', 'Nombre']));
        return nombreA.localeCompare(nombreB);
    });

    let tratamientoActual = "";

    pacientes.forEach(paciente => {
        const nombrePaciente = obtenerValorSeguro(paciente, ['Receptor', 'NOMBRE REAL', 'NOMBRE', 'Nombre']);
        const nssPaciente = obtenerValorSeguro(paciente, ['NSS', 'nss']);
        const fn = obtenerValorSeguro(paciente, ['FN', 'F.N.']);
        const edadDinamica = calcularEdadDinamica(fn) || obtenerValorSeguro(paciente, ['Edad']);
        
        const tratamiento = obtenerValorSeguro(paciente, ['Tratamiento', 'Modalidad']) || 'No especificado';
        const nefro = obtenerValorSeguro(paciente, ['Nefrología']);
        const trasplante = obtenerValorSeguro(paciente, ['Trasplante']);
        const tipoDonador = obtenerValorSeguro(paciente, ['Tipo de Donador', 'Vivo / Cadáver']);
        const finadoVal = obtenerValorSeguro(paciente, ['Finado']).toUpperCase();
        const esFinado = finadoVal === 'SI' || finadoVal.includes('FINADO');
        
        if (tratamiento !== tratamientoActual) {
            tratamientoActual = tratamiento;
            listaPacientesDiv.innerHTML += `
                <div style="background: #006341; color: white; padding: 8px 12px; border-radius: 6px; font-weight: bold; margin-top: 15px; margin-bottom: 5px; font-size: 14px;">
                    📂 Tratamiento: ${tratamiento}
                </div>
            `;
        }

        let estDb = obtenerValorSeguro(paciente, ['EstatusGeneral', 'Estatus']);
        let leg = obtenerValorSeguro(paciente, ['Enlistado']);
        let estActual = 'EN PROCESO';
        if(estDb && estDb.trim() !== '') estActual = estDb.toUpperCase();
        else if (leg && leg.toUpperCase() === 'SI') estActual = 'ENLISTADO';

        let claseEstatus = 'estatus-proceso';
        let textoEstatus = 'En Proceso';

        if(estActual === 'ENLISTADO') { claseEstatus = 'estatus-completo'; textoEstatus = 'Enlistado'; }
        else if(estActual === 'COMITE') { claseEstatus = 'estatus-comite'; textoEstatus = 'Comité'; }
        else if(estActual === 'TRASPLANTADO') { claseEstatus = 'estatus-trasplantado'; textoEstatus = 'Trasplantado'; }
        
        if(esFinado) { claseEstatus = 'estatus-proceso'; textoEstatus = 'Archivo / Finado'; }

        const idEnlistado = obtenerValorSeguro(paciente, ['ID Enlistado', 'ID']);
        const idBadge = (estActual === 'ENLISTADO' && idEnlistado) ? ` <span style="background: #007bff; color: white; padding: 2px 8px; border-radius: 10px; font-size: 12px; font-weight: normal; margin-left: 8px;">ID: ${idEnlistado}</span>` : '';

        let nefroLimpio = normalizarTexto(nefro);
        let iconoNefro = (!nefro || nefroLimpio.includes('PENDIENT')) ? '⚠️' : '👨‍⚕️';
        let iconoTrasplante = (!trasplante || normalizarTexto(trasplante).includes('PENDIENT')) ? '⚠️' : '👨‍⚕️';
        let tratamientoTexto = `<strong>Tratamiento:</strong> ${tratamiento}`;
        let donadorTexto = tipoDonador && tipoDonador !== 'Sin Asignar' ? ` | <strong>Donador:</strong> ${tipoDonador}` : '';

        listaPacientesDiv.innerHTML += `
            <div class="tarjeta-paciente" onclick="abrirDetalles('${paciente.id}')" ${esFinado ? 'style="background-color: #f8f9fa; border-left: 5px solid #6c757d;"' : ''}>
                <div class="paciente-header">
                    <div>
                        <h3 class="paciente-nombre" ${esFinado ? 'style="color: #6c757d;"' : ''}>${nombrePaciente || 'Sin Nombre'}${idBadge}</h3>
                        <p class="paciente-datos"><strong>NSS:</strong> ${nssPaciente || 'S/N'} | <strong>Edad:</strong> ${edadDinamica ? edadDinamica + ' años' : 'S/D'} | ${tratamientoTexto} ${donadorTexto}</p>
                    </div>
                </div>
                <div style="background: #eef2f5; padding: 10px; border-radius: 6px; margin: 10px 0; font-size: 13px;">
                    <p style="margin-bottom: 4px;"><strong>${iconoNefro} Nefrología:</strong> ${nefro || 'Pendiente'}</p>
                    <p><strong>${iconoTrasplante} Trasplante:</strong> ${trasplante || 'Pendiente'}</p>
                </div>
                <span class="estatus ${claseEstatus}" ${esFinado ? 'style="background-color: #6c757d; color: white;"' : ''}>${textoEstatus}</span>
            </div>
        `;
    });
}

if(selectEstadoPaciente) { selectEstadoPaciente.addEventListener('change', ejecutarFiltro); }
if(selectModalidad) { selectModalidad.addEventListener('change', ejecutarFiltro); }
if(selectOrigen) { selectOrigen.addEventListener('change', ejecutarFiltro); }
if(selectHemotipo) { selectHemotipo.addEventListener('change', ejecutarFiltro); }

const radiosBusqueda = document.querySelectorAll('input[name="tipoBusqueda"]');
const inputsBusqueda = {
    nombre: document.getElementById('busquedaNombre'),
    nss: document.getElementById('busquedaNss')
};

radiosBusqueda.forEach(radio => {
    radio.addEventListener('change', (e) => {
        Object.values(inputsBusqueda).forEach(input => { if(input) { input.disabled = true; input.value = ''; }});
        if(inputsBusqueda[e.target.value]) { inputsBusqueda[e.target.value].disabled = false; inputsBusqueda[e.target.value].focus(); }
        ejecutarFiltro();
    });
});
Object.values(inputsBusqueda).forEach(input => { if(input) input.addEventListener('input', ejecutarFiltro); });

function ejecutarFiltro() {
    actualizarContadores(pacientesData);
    const vistaSeleccionada = selectEstadoPaciente ? selectEstadoPaciente.value : 'todos'; 
    const modalidadSeleccionada = selectModalidad ? selectModalidad.value : 'todas';
    const origenSeleccionado = selectOrigen ? selectOrigen.value : 'todos';
    const hemotipoSeleccionado = selectHemotipo ? selectHemotipo.value : 'todos';

    let tipoActivo = 'nombre';
    const radioActivo = document.querySelector('input[name="tipoBusqueda"]:checked');
    if(radioActivo) tipoActivo = radioActivo.value;
    const termino = inputsBusqueda[tipoActivo] ? inputsBusqueda[tipoActivo].value.toLowerCase().trim() : '';

    const pacientesFiltrados = pacientesData.filter(paciente => {
        const finadoVal = obtenerValorSeguro(paciente, ['Finado']).toUpperCase();
        const esFinado = finadoVal === 'SI' || finadoVal.includes('FINADO');
        
        let estDb = obtenerValorSeguro(paciente, ['EstatusGeneral', 'Estatus']);
        let leg = obtenerValorSeguro(paciente, ['Enlistado']);
        let estActual = 'EN PROCESO';
        if(estDb && estDb.trim() !== '') estActual = estDb.toUpperCase();
        else if (leg && leg.toUpperCase() === 'SI') estActual = 'ENLISTADO';

        if (vistaSeleccionada === 'finados') {
            if (!esFinado) return false;
        } else {
            if (esFinado) return false;
            if (vistaSeleccionada !== 'todos' && estActual !== vistaSeleccionada) return false;
        }

        if (modalidadSeleccionada !== 'todas') {
            let tratPaciente = normalizarTexto(obtenerValorSeguro(paciente, ['Tratamiento', 'Modalidad']));
            let filtroNorm = normalizarTexto(modalidadSeleccionada);
            if (!tratPaciente.includes(filtroNorm)) return false;
        }

        if (origenSeleccionado !== 'todos') {
            let tipoDonadorVal = normalizarTexto(obtenerValorSeguro(paciente, ['Tipo de Donador', 'Vivo / Cadáver', 'Vivo / Cadaver', 'Tipo Donador']));
            let origenNorm = normalizarTexto(origenSeleccionado);
            if (origenNorm.includes('CADAVER')) {
                if (!tipoDonadorVal.includes('CADAVER')) return false;
            } else if (origenNorm.includes('VIVO NO RELACIONADO')) {
                if (!tipoDonadorVal.includes('NO RELACIONADO')) return false;
            } else if (origenNorm.includes('VIVO RELACIONADO')) {
                if (!tipoDonadorVal.includes('VIVO') || tipoDonadorVal.includes('NO RELACIONADO')) return false;
            }
        }

        if (hemotipoSeleccionado !== 'todos') {
            let hemotipoPaciente = normalizarTexto(obtenerValorSeguro(paciente, ['Hemotipo']));
            let filtroHemoNorm = normalizarTexto(hemotipoSeleccionado);
            if (!hemotipoPaciente.includes(filtroHemoNorm)) return false;
        }

        if (termino === '') return true;
        if (tipoActivo === 'nombre') {
            let nombreRec = obtenerValorSeguro(paciente, ['Receptor', 'NOMBRE REAL', 'NOMBRE', 'Nombre']);
            let nombreDon = obtenerValorSeguro(paciente, ['Donador', 'Nombre ']);
            return normalizarTexto(nombreRec).includes(normalizarTexto(termino)) || 
                   normalizarTexto(nombreDon).includes(normalizarTexto(termino));
        } else if (tipoActivo === 'nss') {
            let nssRec = obtenerValorSeguro(paciente, ['NSS', 'nss']);
            let nssDon = obtenerValorSeguro(paciente, ['NSS Donador', 'NSS.1']);
            return normalizarTexto(nssRec).includes(normalizarTexto(termino)) || 
                   normalizarTexto(nssDon).includes(normalizarTexto(termino));
        }
    });

    if(badgeContadorModalidad) {
        badgeContadorModalidad.innerText = `Mostrando: ${pacientesFiltrados.length} resultados`;
    }

    renderizarPacientes(pacientesFiltrados);
}

btnNuevoPaciente.onclick = () => {
    pacienteActualId = "nuevo_" + Date.now();
    let pacienteVacio = { Receptor: "Nuevo Paciente", Finado: "NO" };
    abrirModalConDatos(pacienteVacio, true);
};

window.abrirDetalles = function(idDocumento) {
    const paciente = pacientesData.find(p => p.id === idDocumento);
    pacienteActualId = idDocumento; 
    abrirModalConDatos(paciente, false);
};

function abrirModalConDatos(paciente, esNuevo) {
    document.getElementById('modal-nombre').innerText = esNuevo ? "Registrar Nuevo Paciente" : obtenerValorSeguro(paciente, ['Receptor', 'NOMBRE REAL', 'NOMBRE', 'Nombre']);

    let estDb = obtenerValorSeguro(paciente, ['EstatusGeneral', 'Estatus']);
    let leg = obtenerValorSeguro(paciente, ['Enlistado']);
    let estadoFinal = 'EN PROCESO';
    if(estDb && estDb.trim() !== '') estadoFinal = estDb.toUpperCase();
    else if (leg && leg.toUpperCase() === 'SI') estadoFinal = 'ENLISTADO';

    let ultimaConsultaVal = obtenerValorSeguro(paciente, ['Ultima Consulta', 'Última Consulta', 'Fecha Ultima Consulta']);
    let proximaConsultaVal = obtenerValorSeguro(paciente, ['Proxima Consulta', 'Próxima Consulta', 'Fecha Proxima Consulta']);
    let fechaInicioProtoVal = obtenerValorSeguro(paciente, ['Fecha Inicio Protocolo', 'FI/ Protocolo', 'FN Protocolo', 'Fecha Inicio', 'FN/ ']);
    let idEnlistadoVal = obtenerValorSeguro(paciente, ['ID Enlistado', 'ID']);

    let tipoTrasplanteVal = obtenerValorSeguro(paciente, ['Tipo de Trasplante (1ro / 2do)', 'Tipo de Trasplante']);
    let causaPerdidaVal = obtenerValorSeguro(paciente, ['Causa de Pérdida de Injerto Previa', 'Causa de Pérdida']);
    let vTMin = normalizarTexto(tipoTrasplanteVal);

    let dotDatos = verificarEstadoSeccion(paciente, ['Receptor', 'NSS', 'Tratamiento', 'Nefrología', 'Trasplante', 'FN']);
    let dotProto = verificarEstadoSeccion(paciente, ['Fecha Inicio Protocolo', 'Fecha Comité', 'Fecha Enlistado']);
    let dotVal = verificarEstadoSeccion(paciente, ['Cardiología', 'Oftalmo', 'Otorrino', 'Psicología', 'Psiquiatría', 'Dental', 'Cx/ Trasplante', 'Anestesiología', 'Infectología / Urología']);
    let dotLabs = verificarEstadoSeccion(paciente, ['Prueba cruzada banco', 'Cultivo exudado']);
    let dotImg = verificarEstadoSeccion(paciente, ['USG RENAL', 'URETROCISTO', 'TAC SENOS']);
    let dotVac = verificarEstadoSeccion(paciente, ['Hep B', 'Hep A', 'Varicela', 'Neumococo', 'SRP', 'Influenza', 'Td']);
    let dotInf = verificarEstadoSeccion(paciente, ['Herpes I IgG', 'Herpes I IgM', 'Herpes II IgG', 'Herpes II IgM', 'CMV IgG', 'CMV IgM', 'Tuberculosis (TB Gold)', 'Toxoplasma', 'TORCH', 'Rubeola', 'Epstein Barr (EB)', 'BAAR Orina', 'BAAR Esputo', 'BAAR Jugo Gastrico', 'EGO', 'Urocultivo', 'Exudado Faringeo', 'VIH', 'VHC', 'VHB']);
    let dotInm = verificarEstadoSeccion(paciente, ['Cuerpos CDC', 'HLA', 'RAI', 'Antigsingle', 'Complemento', 'Inmunológicos', 'Anticuerpos', 'Metabólicos', 'Pruebas tiroideas', 'PTH', 'VIT D', 'Prueba de Linfocitos CDC']);
    let dotDon = verificarEstadoSeccion(paciente, ['Donador', 'NSS Donador', 'Tipo de Donador']);

    let htmlFormulario = `
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 15px;">
            <button type="button" id="btn-abrir-panel-datos" style="background: #006341; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 11px; text-align:left;">👤 Datos Generales ${dotDatos}</button>
            <button type="button" id="btn-abrir-panel-proto" style="background: #2980b9; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 11px; text-align:left;">📅 Protocolo ${dotProto}</button>
            <button type="button" id="btn-abrir-panel-val" style="background: #27ae60; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 11px; text-align:left;">📋 Valoraciones ${dotVal}</button>
            <button type="button" id="btn-abrir-panel-labs" style="background: #e67e22; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 11px; text-align:left;">🧪 Laboratorios ${dotLabs}</button>
            <button type="button" id="btn-abrir-panel-img" style="background: #8e44ad; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 11px; text-align:left;">🩻 Imagen ${dotImg}</button>
            <button type="button" id="btn-abrir-panel-vac" style="background: #16a085; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 11px; text-align:left;">💉 Vacunas ${dotVac}</button>
            <button type="button" id="btn-abrir-panel-infeccioso" style="background: #c0392b; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 11px; text-align:left;">🧬 Infeccioso ${dotInf}</button>
            <button type="button" id="btn-abrir-panel-inmunologico" style="background: #34495e; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 11px; text-align:left;">🛡️ Inmunología ${dotInm}</button>
            <button type="button" id="btn-abrir-panel-donador" style="background: #d35400; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 11px; text-align:left; grid-column: span 3;">🩸 Donador ${dotDon}</button>
        </div>

        <div style="background: #eef9f5; border: 2px solid #006341; padding: 14px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #006341; margin-bottom: 10px; font-size: 15px;">📅 Control de Citas y Fechas de Protocolo</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                <div class="form-grupo" style="margin-bottom:0;">
                    <label style="font-weight: bold; color: #006341;">Última Consulta</label>
                    <input type="text" data-campo="Ultima Consulta" value="${ultimaConsultaVal}" placeholder="Ej. 12/10/2026">
                </div>
                <div class="form-grupo" style="margin-bottom:0;">
                    <label style="font-weight: bold; color: #006341;">Próxima Consulta</label>
                    <input type="text" data-campo="Proxima Consulta" value="${proximaConsultaVal}" placeholder="Ej. 12/11/2026">
                </div>
            </div>
            <div class="form-grupo" style="margin-bottom: 10px;">
                <label style="font-weight: bold; color: #006341;">Fecha de Inicio de Protocolo</label>
                <input type="text" data-campo="Fecha Inicio Protocolo" value="${fechaInicioProtoVal}" placeholder="Ej. 25/02/2025">
            </div>
            <div class="form-grupo" style="margin-bottom: 10px;">
                <label style="font-weight: bold; color: #d35400;">¿Trasplante previo? (1ro / 2do)</label>
                <select data-campo="Tipo de Trasplante (1ro / 2do)" id="select-principal-trasplante" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-weight: bold;">
                    <option value="Sin Asignar" ${vTMin===''?'selected':''}>No especificado (Nunca trasplantado)</option>
                    <option value="1er Trasplante" ${vTMin.includes('1') || vTMin.includes('PRIMER')?'selected':''}>1er Trasplante</option>
                    <option value="2do Trasplante" ${vTMin.includes('2') || vTMin.includes('SEGUNDO')?'selected':''}>2do Trasplante</option>
                </select>
            </div>
            <div class="form-grupo" id="div-principal-causa" style="margin-bottom: 0; display: ${vTMin.includes('1') || vTMin.includes('2') || vTMin.includes('PRIMER') || vTMin.includes('SEGUNDO') ? 'block' : 'none'};">
                <label style="font-weight: bold; color: #d35400;">Motivo / Causa de Pérdida de Injerto</label>
                <input type="text" data-campo="Causa de Pérdida de Injerto Previa" value="${causaPerdidaVal}" placeholder="Describir causa de pérdida..." style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
        </div>

        <div class="form-grupo">
            <label style="color:#006341; font-size: 16px;">▶ Estatus del Paciente</label>
            <select data-campo="EstatusGeneral" id="select-estatus-general" style="border: 2px solid #006341; width: 100%; padding: 12px; border-radius: 8px; font-weight:bold; font-size: 15px;">
                <option value="EN PROCESO" ${estadoFinal === 'EN PROCESO' ? 'selected' : ''}>⏳ En Proceso</option>
                <option value="COMITE" ${estadoFinal === 'COMITE' ? 'selected' : ''}>⚖️ A Comité</option>
                <option value="ENLISTADO" ${estadoFinal === 'ENLISTADO' ? 'selected' : ''}>✅ Enlistado</option>
                <option value="TRASPLANTADO" ${estadoFinal === 'TRASPLANTADO' ? 'selected' : ''}>🎉 Trasplantado</option>
            </select>
        </div>

        <div class="form-grupo" id="div-id-enlistado" style="display: ${estadoFinal === 'ENLISTADO' ? 'block' : 'none'}; background: #e8f4fd; border: 2px solid #007bff; padding: 12px; border-radius: 8px; margin-top: 10px;">
            <label style="font-weight: bold; color: #004085;">🆔 ID de Enlistado</label>
            <input type="text" data-campo="ID Enlistado" value="${idEnlistadoVal}" placeholder="Ingrese ID de enlistado..." style="margin-top: 5px; width: 100%; padding: 10px; border: 1px solid #007bff; border-radius: 6px;">
        </div>

        <div class="form-grupo" id="div-notas-comite" style="display: ${estadoFinal === 'COMITE' ? 'block' : 'none'}; margin-top: 10px;">
            <label style="color:#2980b9;">📝 Notas del Comité</label>
            <textarea data-campo="Notas Comite" style="width: 100%; padding: 12px; border: 1px solid #2980b9; border-radius: 8px; min-height: 100px; font-size: 15px;" placeholder="Observaciones del comité...">${obtenerValorSeguro(paciente, ['Notas Comite'])}</textarea>
        </div>
        <hr style="margin: 20px 0; border: 0; border-top: 1px solid #ddd;">
    `;

    let camposPendientes = ['PENDIENTES', 'TRANSFUSIONES', 'ALERGIAS'];
    let htmlPendientes = `<details><summary style="font-weight:bold; color:#d35400;">📌 Pendientes y Otros</summary><div class="detalle-contenido" style="padding:10px;">`;
    camposPendientes.forEach(campo => {
        let val = obtenerValorSeguro(paciente, [campo]);
        htmlPendientes += `<div class="form-grupo"><label>${campo}</label><input type="text" data-campo="${campo}" value="${val}" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;"></div>`;
    });
    htmlPendientes += `</div></details>`;

    formEdicion.innerHTML = htmlFormulario + htmlPendientes;
    
    document.getElementById('select-estatus-general').addEventListener('change', function(e) {
        document.getElementById('div-notas-comite').style.display = (e.target.value === 'COMITE') ? 'block' : 'none';
        document.getElementById('div-id-enlistado').style.display = (e.target.value === 'ENLISTADO') ? 'block' : 'none';
    });

    document.getElementById('select-principal-trasplante').addEventListener('change', function() {
        let v = normalizarTexto(this.value);
        document.getElementById('div-principal-causa').style.display = (v.includes('1') || v.includes('2') || v.includes('PRIMER') || v.includes('SEGUNDO')) ? 'block' : 'none';
    });

    if(document.getElementById('btn-abrir-panel-datos')) document.getElementById('btn-abrir-panel-datos').onclick = () => renderizarPanelDatos(paciente);
    if(document.getElementById('btn-abrir-panel-proto')) document.getElementById('btn-abrir-panel-proto').onclick = () => renderizarPanelProtocolo(paciente);
    if(document.getElementById('btn-abrir-panel-val')) document.getElementById('btn-abrir-panel-val').onclick = () => renderizarPanelValoraciones(paciente);
    if(document.getElementById('btn-abrir-panel-labs')) document.getElementById('btn-abrir-panel-labs').onclick = () => renderizarPanelLabs(paciente);
    if(document.getElementById('btn-abrir-panel-img')) document.getElementById('btn-abrir-panel-img').onclick = () => renderizarPanelImagen(paciente);
    if(document.getElementById('btn-abrir-panel-vac')) document.getElementById('btn-abrir-panel-vac').onclick = () => renderizarPanelVacunas(paciente);
    if(document.getElementById('btn-abrir-panel-infeccioso')) document.getElementById('btn-abrir-panel-infeccioso').onclick = () => renderizarPanelInfeccioso(paciente);
    if(document.getElementById('btn-abrir-panel-inmunologico')) document.getElementById('btn-abrir-panel-inmunologico').onclick = () => renderizarPanelInmunologico(paciente);
    if(document.getElementById('btn-abrir-panel-donador')) document.getElementById('btn-abrir-panel-donador').onclick = () => renderizarPanelDonador(paciente);

    modal.style.display = 'flex'; 
}

function renderizarPanelDatos(paciente) {
    let campos = ['Receptor', 'NSS', 'Agregado', 'Finado', 'Tratamiento', 'Nefrología', 'Trasplante', 'FN', 'Peso (kg)', 'Talla (cm)', 'Hemotipo', 'Telefono', 'Ciudad', 'Etiología ERC', 'Biopsia (Sí/No)', 'Comórbidos', 'ORINA (Sí / No)'];
    let html = `<h3 style="color:#006341; margin-bottom:15px;">👤 Datos Generales del Paciente</h3><div style="display:grid; grid-template-columns: 1fr 1fr; gap: 15px;">`;
    campos.forEach(c => {
        let v = obtenerValorSeguro(paciente, [c]);
        if (c === 'Tratamiento') {
            let vMin = normalizarTexto(v);
            html += `<div style="background:white; padding:10px; border-radius:6px; border:1px solid #ddd;"><label style="font-weight:bold; color:#006341; font-size:12px; display:block; margin-bottom:4px;">${c}</label><select data-panel-datos="${c}" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;"><option value="Sin Asignar" ${vMin===''?'selected':''}>No especificado</option><option value="Pre-diálisis" ${vMin.includes('PRE')?'selected':''}>Pre-diálisis</option><option value="Diálisis Peritoneal" ${vMin.includes('PERITONEAL')?'selected':''}>Diálisis Peritoneal</option><option value="Hemodiálisis" ${vMin.includes('HEMO')?'selected':''}>Hemodiálisis</option></select></div>`;
        } else if (c === 'Finado') {
            html += `<div style="background:white; padding:10px; border-radius:6px; border:1px solid #ddd;"><label style="font-weight:bold; color:#006341; font-size:12px; display:block; margin-bottom:4px;">${c}</label><select data-panel-datos="${c}" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px; font-weight:bold;"><option value="NO" ${v!=='SI'?'selected':''}>🟢 Activo</option><option value="SI" ${v==='SI'?'selected':''}>⚫ Finado</option></select></div>`;
        } else {
            html += `<div style="background:white; padding:10px; border-radius:6px; border:1px solid #ddd;"><label style="font-weight:bold; color:#006341; font-size:12px; display:block; margin-bottom:4px;">${c}</label><input type="text" data-panel-datos="${c}" value="${v}" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;"></div>`;
        }
    });
    html += `</div>`;
    contenidoPanelDatos.innerHTML = html;
    modalPanelDatos.style.display = 'flex';
}

function renderizarPanelProtocolo(paciente) {
    let campos = ['Fecha Comité', 'Fecha Enlistado', 'Fecha Trasplante'];
    let html = `<h3 style="color:#2980b9; margin-bottom:15px;">📅 Fechas de Protocolo e Hitos</h3><div style="display:grid; grid-template-columns: 1fr 1fr; gap: 15px;">`;
    campos.forEach(c => {
        let v = obtenerValorSeguro(paciente, [c]);
        let claseAlerta = calcularClaseAlertaVencimiento(v);
        html += `<div style="background:white; padding:12px; border-radius:6px; border:1px solid #ddd;"><label style="font-weight:bold; color:#2980b9; font-size:13px; display:block; margin-bottom:4px;">📅 ${c}</label><input type="text" data-panel-proto="${c}" value="${v}" class="${claseAlerta}" placeholder="DD/MM/AAAA" style="width:100%; padding:9px; border-radius:4px;"></div>`;
    });
    html += `</div>`;
    contenidoPanelProto.innerHTML = html;
    modalPanelProto.style.display = 'flex';
}

function renderizarPanelValoraciones(paciente) {
    let camposVal = [
        {val: 'Cardiología', fec: 'Fecha Cardiología'},
        {val: 'Oftalmo', fec: 'Fecha Oftalmo'},
        {val: 'Otorrino', fec: 'Fecha Otorrino'},
        {val: 'Psicología', fec: 'Fecha Psicología'},
        {val: 'Psiquiatría', fec: 'Fecha Psiquiatría'},
        {val: 'Dental', fec: 'Fecha Dental'},
        {val: 'Cx/ Trasplante', fec: 'Fecha Cx/ Trasplante'},
        {val: 'Anestesiología', fec: 'Fecha Anestesiología'},
        {val: 'Infectología / Urología', fec: 'Fecha Infectología / Urología'}
    ];

    let tsVal = obtenerValorSeguro(paciente, ['Trabajo Social']);
    let tsDon = obtenerValorSeguro(paciente, ['Donaciones T.S.', 'Donaciones']);
    let tsFec = obtenerValorSeguro(paciente, ['Fecha Trabajo Social']);
    let claseTsFec = calcularClaseAlertaVencimiento(tsFec);

    let html = `<h3 style="color:#27ae60; margin-bottom:15px;">📋 Valoraciones Médicas</h3>`;
    html += `
        <div style="background: #eef9f5; border: 2px solid #27ae60; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="color: #27ae60; margin: 0 0 10px 0;">🤝 Trabajo Social y Donaciones</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; align-items: flex-end;">
                <div>
                    <label style="font-weight: bold; font-size: 12px; display: block; margin-bottom: 4px;">¿Trabajo Social?</label>
                    <select data-panel-val="Trabajo Social" id="select-ts-panoramico" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc; font-weight: bold;">
                        <option value="No" ${normalizarTexto(tsVal) === 'NO' ? 'selected' : ''}>No</option>
                        <option value="Sí" ${normalizarTexto(tsVal) === 'SI' || normalizarTexto(tsVal) === 'SÍ' ? 'selected' : ''}>Sí</option>
                    </select>
                </div>
                <div id="div-donaciones-panoramico" style="display: ${normalizarTexto(tsVal) === 'SI' || normalizarTexto(tsVal) === 'SÍ' ? 'block' : 'none'};">
                    <label style="font-weight: bold; font-size: 12px; display: block; margin-bottom: 4px;">Cuentas de Donaciones</label>
                    <input type="text" data-panel-val="Donaciones T.S." value="${tsDon}" placeholder="Cantidad..." style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                </div>
                <div>
                    <label style="font-weight: bold; font-size: 12px; display: block; margin-bottom: 4px;">Fecha T.S.</label>
                    <input type="text" data-panel-val="Fecha Trabajo Social" value="${tsFec}" class="${claseTsFec}" placeholder="DD/MM/AAAA" style="width: 100%; padding: 8px; border-radius: 4px; text-align: center;">
                </div>
            </div>
        </div>
    `;

    html += `<div style="display:grid; grid-template-columns: 1fr 1fr; gap: 15px;">`;
    camposVal.forEach(item => {
        let vVal = obtenerValorSeguro(paciente, [item.val]);
        let vFec = obtenerValorSeguro(paciente, [item.fec]);
        let claseAlerta = calcularClaseAlertaVencimiento(vFec);
        html += `
            <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #ddd; display: flex; flex-direction: column; gap: 6px;">
                <label style="font-weight: bold; color: #27ae60; font-size: 13px;">${item.val}</label>
                <div style="display: flex; gap: 8px;">
                    <input type="text" data-panel-val="${item.val}" value="${vVal}" placeholder="Dictamen..." style="flex: 2; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    <input type="text" data-panel-val="${item.fec}" value="${vFec}" class="${claseAlerta}" placeholder="Fecha (DD/MM/AAAA)" style="flex: 1; padding: 8px; border-radius: 4px; text-align: center; font-size: 11px;">
                </div>
            </div>
        `;
    });
    html += `</div>`;
    contenidoPanelVal.innerHTML = html;

    document.getElementById('select-ts-panoramico').addEventListener('change', function() {
        document.getElementById('div-donaciones-panoramico').style.display = (this.value === 'Sí') ? 'block' : 'none';
    });

    modalPanelVal.style.display = 'flex';
}

function renderizarPanelLabs(paciente) {
    let camposLabs = ['Prueba cruzada banco', 'Cultivo exudado'];

    let html = `<h3 style="color:#e67e22; margin-bottom:15px;">🧪 Laboratorios Generales</h3><div style="display:grid; grid-template-columns: 1fr 1fr; gap: 15px;">`;
    camposLabs.forEach(lab => {
        let vLab = obtenerValorSeguro(paciente, [lab]);
        let vFec = obtenerValorSeguro(paciente, [`Fecha ${lab}`]);
        let claseAlerta = calcularClaseAlertaVencimiento(vFec);
        html += `
            <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #ddd; display: flex; flex-direction: column; gap: 6px;">
                <label style="font-weight: bold; color: #e67e22; font-size: 13px;">${lab}</label>
                <div style="display: flex; gap: 8px;">
                    <input type="text" data-panel-labs="${lab}" value="${vLab}" placeholder="Resultado..." style="flex: 2; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    <input type="text" data-panel-labs="Fecha ${lab}" value="${vFec}" class="${claseAlerta}" placeholder="Fecha" style="flex: 1; padding: 8px; border-radius: 4px; text-align: center; font-size: 11px;">
                </div>
            </div>
        `;
    });
    html += `</div>`;
    contenidoPanelLabs.innerHTML = html;
    modalPanelLabs.style.display = 'flex';
}

function renderizarPanelImagen(paciente) {
    let camposImg = ['USG RENAL', 'URETROCISTO', 'TAC SENOS'];
    let html = `<h3 style="color:#8e44ad; margin-bottom:15px;">🩻 Estudios de Imagen</h3><div style="display:flex; flex-direction:column; gap: 15px;">`;
    camposImg.forEach(img => {
        let vImg = obtenerValorSeguro(paciente, [img]);
        let vFec = obtenerValorSeguro(paciente, [`Fecha ${img}`]);
        let claseAlerta = calcularClaseAlertaVencimiento(vFec);
        html += `
            <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #ddd; display: flex; flex-direction: column; gap: 6px;">
                <label style="font-weight: bold; color: #8e44ad; font-size: 13px;">${img}</label>
                <div style="display: flex; gap: 8px;">
                    <input type="text" data-panel-img="${img}" value="${vImg}" placeholder="Reporte..." style="flex: 3; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    <input type="text" data-panel-img="Fecha ${img}" value="${vFec}" class="${claseAlerta}" placeholder="Fecha" style="flex: 1; padding: 8px; border-radius: 4px; text-align: center; font-size: 11px;">
                </div>
            </div>
        `;
    });
    html += `</div>`;
    contenidoPanelImg.innerHTML = html;
    modalPanelImg.style.display = 'flex';
}

function renderizarPanelVacunas(paciente) {
    let camposVac = ['Hep B', 'Hep A', 'Varicela', 'Neumococo', 'SRP', 'Influenza', 'Td'];
    let html = `<h3 style="color:#16a085; margin-bottom:15px;">💉 Cartilla de Vacunación</h3><div style="display:grid; grid-template-columns: 1fr 1fr; gap: 15px;">`;
    camposVac.forEach(vac => {
        let vVac = obtenerValorSeguro(paciente, [vac]);
        let vFec = obtenerValorSeguro(paciente, [`Fecha ${vac}`]);
        let claseAlerta = calcularClaseAlertaVencimiento(vFec);
        html += `
            <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #ddd; display: flex; flex-direction: column; gap: 6px;">
                <label style="font-weight: bold; color: #16a085; font-size: 13px;">${vac}</label>
                <div style="display: flex; gap: 8px;">
                    <input type="text" data-panel-vac="${vac}" value="${vVac}" placeholder="Dosis..." style="flex: 2; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    <input type="text" data-panel-vac="Fecha ${vac}" value="${vFec}" class="${claseAlerta}" placeholder="Fecha" style="flex: 1; padding: 8px; border-radius: 4px; text-align: center; font-size: 11px;">
                </div>
            </div>
        `;
    });
    html += `</div>`;
    contenidoPanelVac.innerHTML = html;
    modalPanelVac.style.display = 'flex';
}

function renderizarPanelInfeccioso(paciente) {
    if(!modalPanelInfeccioso || !contenidoPanelInfeccioso) return;
    const opSignos = (campo) => {
        let val = normalizarTexto(obtenerValorSeguro(paciente, [campo]));
        let selPos = (val === 'POSITIVO' || val === 'POS(+)' || val === '+') ? 'selected' : '';
        let selNeg = (val === 'NEGATIVO' || val === 'NEG(-)' || val === '-') ? 'selected' : '';
        return `
            <select data-panel-campo="${campo}" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc; font-weight: bold; background: ${selPos ? '#e8f5e9' : (selNeg ? '#ffebee' : '#fff')}">
                <option value="">-- Seleccionar --</option>
                <option value="Positivo (+)" ${selPos}>Positivo (+)</option>
                <option value="Negativo (-)" ${selNeg}>Negativo (-)</option>
            </select>
        `;
    };
    const inputFechaCompacta = (campoFecha) => {
        let valF = obtenerValorSeguro(paciente, [campoFecha]);
        let claseAlerta = calcularClaseAlertaVencimiento(valF);
        return `<input type="text" data-panel-campo="${campoFecha}" value="${valF}" class="${claseAlerta}" placeholder="DD/MM/AAAA" style="width: 110px; padding: 6px; border-radius: 4px; font-size: 11px; text-align: center;">`;
    };

    let htmlTabla = `
        <h3 style="color: #c0392b; margin-bottom: 5px;">🧬 Panel Infeccioso - Paciente: ${obtenerValorSeguro(paciente, ['Receptor', 'NOMBRE REAL', 'NOMBRE', 'Nombre'])}</h3>
        
        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; margin-top:15px;">
            <thead>
                <tr style="background: #c0392b; color: white; text-align: left; font-size: 13px;">
                    <th style="padding: 12px 15px;">Estudio Infeccioso (Herpes I y II, CMV)</th>
                    <th style="padding: 12px 15px; width: 180px;">IgG</th>
                    <th style="padding: 12px 15px; width: 140px;">Fecha IgG</th>
                    <th style="padding: 12px 15px; width: 180px;">IgM</th>
                    <th style="padding: 12px 15px; width: 140px;">Fecha IgM</th>
                </tr>
            </thead>
            <tbody>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 15px; font-weight: bold;">Herpes I</td><td>${opSignos('Herpes I IgG')}</td><td>${inputFechaCompacta('Fecha Herpes I IgG')}</td><td>${opSignos('Herpes I IgM')}</td><td>${inputFechaCompacta('Fecha Herpes I IgM')}</td></tr>
                <tr style="border-bottom: 1px solid #eee; background: #fafafa;"><td style="padding: 10px 15px; font-weight: bold;">Herpes II</td><td>${opSignos('Herpes II IgG')}</td><td>${inputFechaCompacta('Fecha Herpes II IgG')}</td><td>${opSignos('Herpes II IgM')}</td><td>${inputFechaCompacta('Fecha Herpes II IgM')}</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 15px; font-weight: bold;">CMV</td><td>${opSignos('CMV IgG')}</td><td>${inputFechaCompacta('Fecha CMV IgG')}</td><td>${opSignos('CMV IgM')}</td><td>${inputFechaCompacta('Fecha CMV IgM')}</td></tr>
            </tbody>
        </table>

        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; margin-top:15px;">
            <thead>
                <tr style="background: #c0392b; color: white; text-align: left; font-size: 13px;">
                    <th style="padding: 12px 15px;">Infecciosas / Serologías / Cultivos / BAAR</th>
                    <th style="padding: 12px 15px; width: 220px;">Resultado</th>
                    <th style="padding: 12px 15px; width: 160px;">Fecha</th>
                </tr>
            </thead>
            <tbody>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 15px; font-weight: bold;">Tuberculosis (TB Gold)</td><td>${opSignos('Tuberculosis (TB Gold)')}</td><td>${inputFechaCompacta('Fecha Tuberculosis (TB Gold)')}</td></tr>
                <tr style="border-bottom: 1px solid #eee; background: #fafafa;"><td style="padding: 10px 15px; font-weight: bold;">Toxoplasmosis (Taxo)</td><td>${opSignos('Toxoplasma')}</td><td>${inputFechaCompacta('Fecha Toxoplasma')}</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 15px; font-weight: bold;">TORCH</td><td>${opSignos('TORCH')}</td><td>${inputFechaCompacta('Fecha TORCH')}</td></tr>
                <tr style="border-bottom: 1px solid #eee; background: #fafafa;"><td style="padding: 10px 15px; font-weight: bold;">Rubeola</td><td>${opSignos('Rubeola')}</td><td>${inputFechaCompacta('Fecha Rubeola')}</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 15px; font-weight: bold;">Epstein Barr (EB)</td><td>${opSignos('Epstein Barr (EB)')}</td><td>${inputFechaCompacta('Fecha Epstein Barr (EB)')}</td></tr>
                <tr style="border-bottom: 1px solid #eee; background: #fafafa;"><td style="padding: 10px 15px; font-weight: bold;">BAAR - Orina</td><td>${opSignos('BAAR Orina')}</td><td>${inputFechaCompacta('Fecha BAAR Orina')}</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 15px; font-weight: bold;">BAAR - Esputo</td><td>${opSignos('BAAR Esputo')}</td><td>${inputFechaCompacta('Fecha BAAR Esputo')}</td></tr>
                <tr style="border-bottom: 1px solid #eee; background: #fafafa;"><td style="padding: 10px 15px; font-weight: bold;">BAAR - Jugo Gástrico</td><td>${opSignos('BAAR Jugo Gastrico')}</td><td>${inputFechaCompacta('Fecha BAAR Jugo Gastrico')}</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 15px; font-weight: bold;">EGO</td><td>${opSignos('EGO')}</td><td>${inputFechaCompacta('Fecha EGO')}</td></tr>
                <tr style="border-bottom: 1px solid #eee; background: #fafafa;"><td style="padding: 10px 15px; font-weight: bold;">Urocultivo</td><td>${opSignos('Urocultivo')}</td><td>${inputFechaCompacta('Fecha Urocultivo')}</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 15px; font-weight: bold;">Exudado Faríngeo</td><td>${opSignos('Exudado Faringeo')}</td><td>${inputFechaCompacta('Fecha Exudado Faringeo')}</td></tr>
                <tr style="border-bottom: 1px solid #eee; background: #fafafa;"><td style="padding: 10px 15px; font-weight: bold;">VIH</td><td>${opSignos('VIH')}</td><td>${inputFechaCompacta('Fecha VIH')}</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 15px; font-weight: bold;">VHC</td><td>${opSignos('VHC')}</td><td>${inputFechaCompacta('Fecha VHC')}</td></tr>
                <tr style="border-bottom: 1px solid #eee; background: #fafafa;"><td style="padding: 10px 15px; font-weight: bold;">VHB</td><td>${opSignos('VHB')}</td><td>${inputFechaCompacta('Fecha VHB')}</td></tr>
            </tbody>
        </table>
    `;
    contenidoPanelInfeccioso.innerHTML = htmlTabla;
    modalPanelInfeccioso.style.display = 'flex';
}

function renderizarPanelInmunologico(paciente) {
    if(!modalPanelInmunologico || !contenidoPanelInmunologico) return;
    const opSignos = (campo) => {
        let val = normalizarTexto(obtenerValorSeguro(paciente, [campo]));
        let selPos = (val === 'POSITIVO' || val === 'POS(+)' || val === '+') ? 'selected' : '';
        let selNeg = (val === 'NEGATIVO' || val === 'NEG(-)' || val === '-') ? 'selected' : '';
        return `
            <select data-panel-inm-campo="${campo}" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc; font-weight: bold; background: ${selPos ? '#e8f5e9' : (selNeg ? '#ffebee' : '#fff')}">
                <option value="">-- Seleccionar --</option>
                <option value="Positivo (+)" ${selPos}>Positivo (+)</option>
                <option value="Negativo (-)" ${selNeg}>Negativo (-)</option>
            </select>
        `;
    };
    const inputFechaCompacta = (campoFecha) => {
        let valF = obtenerValorSeguro(paciente, [campoFecha]);
        let claseAlerta = calcularClaseAlertaVencimiento(valF);
        return `<input type="text" data-panel-inm-campo="${campoFecha}" value="${valF}" class="${claseAlerta}" placeholder="DD/MM/AAAA" style="width: 110px; padding: 6px; border-radius: 4px; font-size: 11px; text-align: center;">`;
    };

    let htmlTabla = `
        <h3 style="color: #34495e; margin-bottom: 5px;">🛡️ Inmunología y Metabolismo - Paciente: ${obtenerValorSeguro(paciente, ['Receptor', 'NOMBRE REAL', 'NOMBRE', 'Nombre'])}</h3>
        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; margin-top:15px;">
            <thead>
                <tr style="background: #34495e; color: white; text-align: left; font-size: 13px;">
                    <th style="padding: 12px 15px;">Prueba Inmunológica, Anticuerpos y Metabólica</th>
                    <th style="padding: 12px 15px; width: 220px;">Resultado</th>
                    <th style="padding: 12px 15px; width: 160px;">Fecha</th>
                </tr>
            </thead>
            <tbody>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 15px; font-weight: bold;">Cuerpos CDC</td><td>${opSignos('Cuerpos CDC')}</td><td>${inputFechaCompacta('Fecha Cuerpos CDC')}</td></tr>
                <tr style="border-bottom: 1px solid #eee; background: #fafafa;"><td style="padding: 10px 15px; font-weight: bold;">HLA</td><td>${opSignos('HLA')}</td><td>${inputFechaCompacta('Fecha HLA')}</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 15px; font-weight: bold;">RAI</td><td>${opSignos('RAI')}</td><td>${inputFechaCompacta('Fecha RAI')}</td></tr>
                <tr style="border-bottom: 1px solid #eee; background: #fafafa;"><td style="padding: 10px 15px; font-weight: bold;">Antígeno Single (Antigsingle)</td><td>${opSignos('Antigsingle')}</td><td>${inputFechaCompacta('Fecha Antigsingle')}</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 15px; font-weight: bold;">Complemento</td><td>${opSignos('Complemento')}</td><td>${inputFechaCompacta('Fecha Complemento')}</td></tr>
                <tr style="border-bottom: 1px solid #eee; background: #fafafa;"><td style="padding: 10px 15px; font-weight: bold;">Inmunológicos</td><td>${opSignos('Inmunológicos')}</td><td>${inputFechaCompacta('Fecha Inmunológicos')}</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 15px; font-weight: bold;">Anticuerpos</td><td>${opSignos('Anticuerpos')}</td><td>${inputFechaCompacta('Fecha Anticuerpos')}</td></tr>
                <tr style="border-bottom: 1px solid #eee; background: #fafafa;"><td style="padding: 10px 15px; font-weight: bold;">Metabólicos</td><td>${opSignos('Metabólicos')}</td><td>${inputFechaCompacta('Fecha Metabólicos')}</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 15px; font-weight: bold;">Pruebas Tiroideas</td><td>${opSignos('Pruebas tiroideas')}</td><td>${inputFechaCompacta('Fecha Pruebas tiroideas')}</td></tr>
                <tr style="border-bottom: 1px solid #eee; background: #fafafa;"><td style="padding: 10px 15px; font-weight: bold;">PTH</td><td>${opSignos('PTH')}</td><td>${inputFechaCompacta('Fecha PTH')}</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 15px; font-weight: bold;">Vitamina D (VIT D)</td><td>${opSignos('VIT D')}</td><td>${inputFechaCompacta('Fecha VIT D')}</td></tr>
                <tr style="border-bottom: 1px solid #eee; background: #fafafa;"><td style="padding: 10px 15px; font-weight: bold;">Prueba de Linfocitos CDC</td><td>${opSignos('Prueba de Linfocitos CDC')}</td><td>${inputFechaCompacta('Fecha Prueba de Linfocitos CDC')}</td></tr>
            </tbody>
        </table>
    `;
    contenidoPanelInmunologico.innerHTML = htmlTabla;
    modalPanelInmunologico.style.display = 'flex';
}

function renderizarPanelDonador(paciente) {
    if(!modalPanelDonador || !contenidoPanelDonador) return;
    
    let tipoDonadorVal = obtenerValorSeguro(paciente, ['Tipo de Donador', 'Vivo / Cadáver']);
    let vMin = normalizarTexto(tipoDonadorVal);

    let html = `
        <div style="margin-bottom: 20px; background: #fff3cd; border-left: 5px solid #f39c12; padding: 12px; border-radius: 4px;">
            <h3 style="color: #856404; margin: 0 0 5px 0;">🩸 Origen y Protocolo del Donador</h3>
            <p style="color: #666; font-size: 12px; margin: 0;">Si el paciente cambia de Cadavérico a Vivo, el sistema desplegará de inmediato todo el protocolo del IMSS para su captura.</p>
        </div>

        <div style="background: white; padding: 15px; border-radius: 8px; border: 2px solid #d35400; margin-bottom: 20px;">
            <label style="font-weight: bold; color: #d35400; display: block; margin-bottom: 8px; font-size: 14px;">Tipo / Origen del Donador</label>
            <select data-panel-donador="Tipo de Donador" id="select-origen-donador-panoramico" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #ccc; font-weight: bold; font-size: 14px;">
                <option value="Cadavérico" ${vMin.includes('CADAVER') ? 'selected' : ''}>💀 Cadavérico</option>
                <option value="Vivo Relacionado" ${vMin.includes('VIVO') && vMin.includes('RELACIONADO') && !vMin.includes('NO') ? 'selected' : ''}>🧬 Vivo Relacionado</option>
                <option value="Vivo No Relacionado" ${vMin.includes('NO RELACIONADO') ? 'selected' : ''}>🤝 Vivo No Relacionado</option>
            </select>
        </div>
        <div id="contenedor-campos-donador-vivo"></div>
    `;

    contenidoPanelDonador.innerHTML = html;

    const selectOrigenDonador = document.getElementById('select-origen-donador-panoramico');
    const contenedorVivo = document.getElementById('contenedor-campos-donador-vivo');

    function actualizarCamposDonadorVivo() {
        let valorSeleccionado = normalizarTexto(selectOrigenDonador.value);
        let esVivoDinamico = valorSeleccionado.includes('VIVO');

        if (!esVivoDinamico) {
            contenedorVivo.innerHTML = `<p style="color: #666; text-align: center; padding: 20px;">Selecciona <strong>Vivo Relacionado</strong> o <strong>Vivo No Relacionado</strong> para desplegar el protocolo completo de estudio del donador del IMSS.</p>`;
            return;
        }

        let generoDonador = normalizarTexto(obtenerValorSeguro(paciente, ['Género del Donador (Masculino / Femenino)', 'Sexo Donador (M/F)']));

        const gruposDonador = [
            {
                cat: "1. FICHA DE IDENTIFICACIÓN Y DATOS GENERALES",
                campos: [
                    'Nombre del Donador', 'NSS Donador', 'CURP Donador', 'Domicilio Donador', 
                    'Correo Electrónico Donador', 'Teléfonos Donador', 'Parentesco con el Receptor', 
                    'Estado Civil Donador', 'Género del Donador (Masculino / Femenino)', 'Edad.1', 'FN.1', 'Peso Donador', 'Talla Donador', 
                    'Índice de Masa Corporal (IMC)', 'Grupo Sanguíneo y RH (Hemotipo)', 'PA Donador', 'Religión Donador', 'AHF Donador', 'APP Donador', 'AGO Donador', 'Exploración Física Donador'
                ]
            },
            {
                cat: "2. LABORATORIO METABÓLICO Y COAGULACIÓN (Vigencia 6 Meses)",
                campos: [
                    'Fecha Labs Metabólicos', '1a. Prueba Cruzada', 'Fecha 1a Prueba Cruzada', 'Biometría Hemática (Hb)', 'Hto Donador', 'Leucocitos Donador', 
                    'Eosinófilos Donador', 'Neutrófilos Donador', 'Linfocitos Donador', 'Basófilos Donador', 
                    'Plaquetas Donador', 'Tiempo de Protrombina (TP)', 'Tiempo de Tromboplastina Parcial (TPT)', 
                    'Glucosa', 'Urea', 'Creatinina', 'Sodio (Na)', 'Potasio (K)', 'Cloro (Cl)', 'Ca', 
                    'Fósforo (P)', 'Magnesio (Mg)', 'Fosfatasa Alcalina', 'Colesterol', 'Triglicéridos', 
                    'Bilirrubina Total (BT)', 'Bilirrubina Directa (BD)', 'Bilirrubina Indirecta (BI)', 
                    'Proteínas Totales', 'Albúmina', 'TGO (AST)', 'TGP (ALT)', 'Ácido Úrico', 
                    'Depuración de Creatinina y Albúmina (Orina 24 hrs)'
                ]
            },
            {
                cat: "3. EXAMEN GENERAL DE ORINA Y CULTIVO (Vigencia 6 Meses)",
                campos: [
                    'Fecha EGO', 'pH Orina', 'Densidad Orina', 'Proteínas Orina', 'Bilirrubinas Orina', 
                    'Glucosa Orina', 'Hemoglobina Orina', 'Eritrocitos Orina', 'Leucocitos Orina', 'Bacterias Orina', 
                    'Fecha Urocultivo', 'Resultado Urocultivo'
                ]
            },
            {
                cat: "4. SEROLOGÍA (Vigencia 6 Meses)",
                campos: [
                    'CMV IgG Donador', 'Fecha CMV IgG', 'CMV IgM Donador', 'Fecha CMV IgM', 
                    'Hepatitis B Donador', 'Fecha Hepatitis B', 'Hepatitis C Donador', 'Fecha Hepatitis C', 
                    'HIV Donador', 'Fecha HIV', 'VDRL Donador', 'Fecha VDRL'
                ]
            },
            {
                cat: "5. ESTUDIOS DE GABINETE E IMAGEN (Vigencia 6 Meses)",
                campos: [
                    'Radiografía de Tórax', 'Fecha Rx Tórax', 'US Renal', 'Fecha US Renal', 
                    'Urografía Excretora o Urotac', 'Fecha Urotac', 'Electrocardiograma', 'Fecha ECG', 
                    'Gamograma Renal', 'Fecha Gamograma', 'Angiografía Renal / Angiotomografía', 'Fecha Angiografía'
                ]
            },
            {
                cat: "6. VALORACIONES ESPECIALES Y PREOPERATORIAS",
                campos: [
                    'Ultrasonido Pélvico (Donadora)', 'Fecha US Pélvico', 'Prueba Inmunológica Embarazo', 'Fecha Prueba Embarazo', 
                    'Antígeno Prostático (Donador >45 años)', 'Fecha Antígeno Prostático', 'Mastografía y/o USG Mamario (>40 años)', 'Fecha Mastografía', 
                    'Valoración Ginecología', 'Fecha Ginecología', 'Otras Valoraciones Interconsultas', 'Fecha Interconsultas'
                ]
            },
            {
                cat: "7. INMUNOLOGÍA Y CONCLUSIONES DEL COMITÉ",
                campos: [
                    '2ª. Prueba Cruzada', 'Fecha 2ª Prueba Cruzada', 'HLA Donador', 'Fecha Presentación Comité', 
                    'Aceptación Comité (SÍ / NO)', 'Pendientes Donador', 'Nefrectomía (Izquierda / Derecha)', 'Dictamen Apto / No Apto'
                ]
            }
        ];

        let htmlVivo = "";
        gruposDonador.forEach(seccionDonador => {
            htmlVivo += `<h4 style="background: #d35400; color: white; padding: 8px 12px; border-radius: 6px; margin: 20px 0 10px 0; font-size: 14px;">📂 ${seccionDonador.cat}</h4>`;
            htmlVivo += `<div style="display:grid; grid-template-columns: 1fr 1fr; gap: 15px;">`;

            seccionDonador.campos.forEach(c => {
                let v = obtenerValorSeguro(paciente, [c]);
                let claseAlerta = calcularClaseAlertaVencimiento(v);

                if (c === 'Dictamen Apto / No Apto') {
                    let selApto = normalizarTexto(v) === 'APTO' ? 'selected' : '';
                    let selNoApto = normalizarTexto(v).includes('NO APTO') ? 'selected' : '';
                    htmlVivo += `
                        <div style="background:white; padding:10px; border-radius:6px; border:1px solid #ddd;">
                            <label style="font-weight:bold; color:#d35400; font-size:12px; display:block; margin-bottom:4px;">${c}</label>
                            <select data-panel-donador="${c}" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px; font-weight:bold; background:${selApto ? '#e8f5e9' : (selNoApto ? '#ffebee' : '#fff')}">
                                <option value="Pendiente">⚠️ Pendiente de Dictamen</option>
                                <option value="APTO" ${selApto}>🟢 APTO PARA TRASPLANTE</option>
                                <option value="NO APTO" ${selNoApto}>🔴 NO APTO</option>
                            </select>
                        </div>
                    `;
                } else if (c === 'Aceptación Comité (SÍ / NO)') {
                    let selSi = normalizarTexto(v) === 'SI' || normalizarTexto(v) === 'SÍ' ? 'selected' : '';
                    let selNo = normalizarTexto(v) === 'NO' ? 'selected' : '';
                    htmlVivo += `
                        <div style="background:white; padding:10px; border-radius:6px; border:1px solid #ddd;">
                            <label style="font-weight:bold; color:#d35400; font-size:12px; display:block; margin-bottom:4px;">${c}</label>
                            <select data-panel-donador="${c}" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px; font-weight:bold;">
                                <option value="">-- Seleccionar --</option>
                                <option value="SÍ" ${selSi}>SÍ</option>
                                <option value="NO" ${selNo}>NO</option>
                            </select>
                        </div>
                    `;
                } else {
                    htmlVivo += `
                        <div style="background:white; padding:10px; border-radius:6px; border:1px solid #ddd;">
                            <label style="font-weight:bold; color:#d35400; font-size:12px; display:block; margin-bottom:4px;">${c}</label>
                            <input type="text" data-panel-donador="${c}" value="${v}" class="${c.toLowerCase().includes('fecha') ? claseAlerta : ''}" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;" placeholder="Escribir dato...">
                        </div>
                    `;
                }
            });
            htmlVivo += `</div>`;
        });
        contenedorVivo.innerHTML = htmlVivo;
    }

    selectOrigenDonador.onchange = function() {
        paciente['Tipo de Donador'] = this.value;
        actualizarCamposDonadorVivo();
    };

    actualizarCamposDonadorVivo();
    modalPanelDonador.style.display = 'flex';
}

// Botones Guardar de Ventanas Panorámicas
if(btnGuardarPanelDatos) {
    btnGuardarPanelDatos.onclick = () => {
        if(!pacienteActualId) return;
        let datos = {};
        modalPanelDatos.querySelectorAll('[data-panel-datos]').forEach(el => { if(el.getAttribute('data-panel-datos')) datos[el.getAttribute('data-panel-datos')] = el.value.trim(); });
        db.collection("Pacientes").doc(pacienteActualId).set(datos, { merge: true }).then(() => modalPanelDatos.style.display = 'none');
    };
}
if(btnGuardarPanelProto) {
    btnGuardarPanelProto.onclick = () => {
        if(!pacienteActualId) return;
        let datos = {};
        modalPanelProto.querySelectorAll('[data-panel-proto]').forEach(el => { if(el.getAttribute('data-panel-proto')) datos[el.getAttribute('data-panel-proto')] = el.value.trim(); });
        db.collection("Pacientes").doc(pacienteActualId).set(datos, { merge: true }).then(() => modalPanelProto.style.display = 'none');
    };
}
if(btnGuardarPanelVal) {
    btnGuardarPanelVal.onclick = () => {
        if(!pacienteActualId) return;
        let datos = {};
        modalPanelVal.querySelectorAll('[data-panel-val]').forEach(el => { if(el.getAttribute('data-panel-val')) datos[el.getAttribute('data-panel-val')] = el.value.trim(); });
        db.collection("Pacientes").doc(pacienteActualId).set(datos, { merge: true }).then(() => modalPanelVal.style.display = 'none');
    };
}
if(btnGuardarPanelLabs) {
    btnGuardarPanelLabs.onclick = () => {
        if(!pacienteActualId) return;
        let datos = {};
        modalPanelLabs.querySelectorAll('[data-panel-labs]').forEach(el => { if(el.getAttribute('data-panel-labs')) datos[el.getAttribute('data-panel-labs')] = el.value.trim(); });
        db.collection("Pacientes").doc(pacienteActualId).set(datos, { merge: true }).then(() => modalPanelLabs.style.display = 'none');
    };
}
if(btnGuardarPanelImg) {
    btnGuardarPanelImg.onclick = () => {
        if(!pacienteActualId) return;
        let datos = {};
        modalPanelImg.querySelectorAll('[data-panel-img]').forEach(el => { if(el.getAttribute('data-panel-img')) datos[el.getAttribute('data-panel-img')] = el.value.trim(); });
        db.collection("Pacientes").doc(pacienteActualId).set(datos, { merge: true }).then(() => modalPanelImg.style.display = 'none');
    };
}
if(btnGuardarPanelVac) {
    btnGuardarPanelVac.onclick = () => {
        if(!pacienteActualId) return;
        let datos = {};
        modalPanelVac.querySelectorAll('[data-panel-vac]').forEach(el => { if(el.getAttribute('data-panel-vac')) datos[el.getAttribute('data-panel-vac')] = el.value.trim(); });
        db.collection("Pacientes").doc(pacienteActualId).set(datos, { merge: true }).then(() => modalPanelVac.style.display = 'none');
    };
}
if(btnGuardarPanelInf) {
    btnGuardarPanelInf.onclick = () => {
        if(!pacienteActualId) return;
        let datos = {};
        modalPanelInfeccioso.querySelectorAll('[data-panel-campo]').forEach(el => { if(el.getAttribute('data-panel-campo')) datos[el.getAttribute('data-panel-campo')] = el.value.trim(); });
        db.collection("Pacientes").doc(pacienteActualId).set(datos, { merge: true }).then(() => modalPanelInfeccioso.style.display = 'none');
    };
}
if(btnGuardarPanelInm) {
    btnGuardarPanelInm.onclick = () => {
        if(!pacienteActualId) return;
        let datos = {};
        modalPanelInmunologico.querySelectorAll('[data-panel-inm-campo]').forEach(el => { if(el.getAttribute('data-panel-inm-campo')) datos[el.getAttribute('data-panel-inm-campo')] = el.value.trim(); });
        db.collection("Pacientes").doc(pacienteActualId).set(datos, { merge: true }).then(() => modalPanelInmunologico.style.display = 'none');
    };
}
if(btnGuardarPanelDonador) {
    btnGuardarPanelDonador.onclick = () => {
        if(!pacienteActualId) return;
        let datos = {};
        modalPanelDonador.querySelectorAll('[data-panel-donador]').forEach(el => { if(el.getAttribute('data-panel-donador')) datos[el.getAttribute('data-panel-donador')] = el.value.trim(); });
        db.collection("Pacientes").doc(pacienteActualId).set(datos, { merge: true }).then(() => modalPanelDonador.style.display = 'none');
    };
}

document.getElementById('btn-cerrar').onclick = () => modal.style.display = 'none';

document.getElementById('btn-historial').onclick = () => {
    document.getElementById('modal-historial').style.display = 'flex';
    const lista = document.getElementById('lista-historial');
    lista.innerHTML = '<p style="text-align:center;">Cargando historial...</p>';
    db.collection('Notificaciones').orderBy('fecha', 'desc').limit(50).get().then(snapshot => {
        lista.innerHTML = '';
        if(snapshot.empty) { lista.innerHTML = '<p>No hay modificaciones recientes.</p>'; return; }
        snapshot.forEach(doc => {
            let data = doc.data();
            let date = data.fecha ? data.fecha.toDate().toLocaleString('es-MX') : 'Fecha reciente';
            lista.innerHTML += `
                <div style="padding: 12px; border-bottom: 1px solid #eee; background: #f8f9fa; border-radius: 6px;">
                    <strong style="color:#006341;">${data.doctor}</strong> modificó a <em>${data.paciente}</em><br>
                    <span style="color: #666; font-size: 12px;">📅 ${date} | <strong>Secciones:</strong> ${data.secciones}</span>
                </div>
            `;
        });
    }).catch(err => { lista.innerHTML = '<p>Error al cargar el historial.</p>'; });
};
document.getElementById('btn-cerrar-historial').onclick = () => document.getElementById('modal-historial').style.display = 'none';

function encontrarSeccion(campo) {
    if(campo.includes('Herpes') || campo.includes('CMV') || campo.includes('Tuberculosis') || campo.includes('Toxoplasma') || campo.includes('BAAR') || campo.includes('VIH') || campo.includes('VHC') || campo.includes('VHB') || campo.includes('Linfocitos') || campo.includes('TORCH') || campo.includes('Rubeola') || campo.includes('Epstein') || campo.includes('EGO') || campo.includes('Urocultivo') || campo.includes('Exudado')) return 'Panel Infeccioso';
    if(campo.includes('Cuerpos') || campo.includes('HLA') || campo.includes('RAI') || campo.includes('Antigsingle') || campo.includes('Complemento') || campo.includes('Inmunológicos') || campo.includes('Anticuerpos') || campo.includes('Metabólicos') || campo.includes('tiroideas') || campo.includes('PTH') || campo.includes('VIT D')) return 'Panel Inmunológico';
    if(campo.includes('Fecha Inicio Protocolo') || campo.includes('Fecha Comité') || campo.includes('Fecha Enlistado') || campo.includes('Fecha Trasplante') || campo.startsWith('FI/') || campo.includes('FN Protocolo')) return 'Fechas de Protocolo e Hitos';
    if(campo.includes('Trasplante (1ro') || campo.includes('Causa de Pérdida')) return 'Historial de Trasplante';
    if(campo === 'Ultima Consulta' || campo === 'Proxima Consulta') return 'Citas Médicas';
    if(campo.includes('Donador') || campo.includes('NSS Donador') || campo.includes('CURP') || campo.includes('Domicilio') || campo.includes('Correo') || campo.includes('Teléfono') || campo.includes('Parentesco') || campo.includes('Ginecológicas') || campo.includes('Cardíacas') || campo.includes('Apto') || campo.includes('Angiotomografía') || campo.includes('Biometría') || campo.includes('Glucosa') || campo.includes('Urea') || campo.includes('Creatinina') || campo.includes('Radiografía') || campo.includes('US Renal') || campo.includes('Gamograma') || campo.includes('Comité')) return 'Donador';
    return 'Datos Generales';
}

btnGuardar.onclick = () => {
    if(!pacienteActualId) return;
    btnGuardar.innerText = "Guardando...";

    const pacienteOriginal = pacientesData.find(p => p.id === pacienteActualId) || {};
    let datosParaGuardar = {};
    let seccionesModificadas = new Set(); 

    try {
        formEdicion.querySelectorAll('input, select, textarea').forEach(elemento => {
            if(elemento.type !== 'radio'){
                const nombreColumna = elemento.getAttribute('data-campo');
                if(nombreColumna){
                    const valorEscrito = String(elemento.value || '').trim();
                    datosParaGuardar[nombreColumna] = valorEscrito;

                    const valorAnterior = String(obtenerValorSeguro(pacienteOriginal, [nombreColumna]) || '').trim();
                    if(valorEscrito !== valorAnterior) { seccionesModificadas.add(encontrarSeccion(nombreColumna)); }
                }
            }
        });

        let fnEscrita = datosParaGuardar['FN'] || datosParaGuardar['F.N.'] || obtenerValorSeguro(pacienteOriginal, ['FN', 'F.N.']);
        if(fnEscrita) {
            datosParaGuardar['Edad'] = calcularEdadDinamica(fnEscrita);
        }

        const fnDonador = datosParaGuardar['FN.1'] || obtenerValorSeguro(pacienteOriginal, ['FN.1', 'Fecha de Nacimiento Donador', 'FN Donador']);
        if (fnDonador) {
            datosParaGuardar['Edad.1'] = calcularEdadDinamica(fnDonador);
        }

        let idDocFinal = pacienteActualId;
        if(pacienteActualId.startsWith("nuevo_")) {
            let nombreReceptor = datosParaGuardar['Receptor'] || "Paciente_Sin_Nombre";
            idDocFinal = normalizarTexto(nombreReceptor).replace(/[^a-zA-Z0-9]/g, "_");
        }

        db.collection("Pacientes").doc(idDocFinal).set(datosParaGuardar, { merge: true }).then(() => {
            if(seccionesModificadas.size > 0) {
                db.collection("Notificaciones").add({
                    doctor: nombreDoctorActual || "Doctor",
                    paciente: String(datosParaGuardar['Receptor'] || 'Un paciente'),
                    secciones: Array.from(seccionesModificadas).join(', '),
                    fecha: firebase.firestore.FieldValue.serverTimestamp()
                }).catch(err => console.log("Aviso falló:", err));
            }
            btnGuardar.innerText = "¡Actualizado!";
            setTimeout(() => { modal.style.display = 'none'; btnGuardar.innerText = "Guardar Cambios"; }, 1000);
        });
    } catch(errorCrash) {
        alert("Error: " + errorCrash.message);
        btnGuardar.innerText = "Guardar Cambios";
    }
}

let unsubscribePacientes = null;
function iniciarEscuchaPacientes() {
    if(unsubscribePacientes) unsubscribePacientes();
    unsubscribePacientes = db.collection("Pacientes").onSnapshot((snapshot) => {
        pacientesData = []; 
        snapshot.forEach((doc) => pacientesData.push({ id: doc.id, ...doc.data() }));
        ejecutarFiltro();
    });
}

let isFirstLoad = true;
function iniciarEscuchaNotificaciones() {
    db.collection("Notificaciones").orderBy("fecha", "desc").limit(1).onSnapshot(snapshot => {
        if (isFirstLoad) { isFirstLoad = false; return; } 
        snapshot.docChanges().forEach(change => {
            if(change.type === 'added') {
                const data = change.doc.data();
                if(data.doctor !== nombreDoctorActual) {
                    mostrarToast(`<b>${data.doctor}</b> actualizó ${data.secciones} de <b>${data.paciente}</b>`);
                }
            }
        });
    });
}

function mostrarToast(mensaje) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `🔔 ${mensaje}`;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 5500); 
}