// ==========================================
// VARIABLES DE ESTADO
// ==========================================

let contador = 0;
let capacidad = 100;
let historial = [];
let panelCapacidadAbierto = false;
let panelHistorialAbierto = false;

// ==========================================
// REFERENCIAS A LOS ELEMENTOS HTML
// ==========================================

const elNumero        = document.getElementById('numero');
const elEstado        = document.getElementById('estado');
const elBarra         = document.getElementById('barra');
const elBarraTexto    = document.getElementById('barra-texto');
const elBotonEntrar   = document.getElementById('boton-entrar');
const elBotonSalir    = document.getElementById('boton-salir');
const elBotonCap      = document.getElementById('boton-capacidad');
const elBotonHist     = document.getElementById('boton-historial');
const elBotonRein     = document.getElementById('boton-reiniciar');
const elPanelCap      = document.getElementById('panel-capacidad');
const elPanelHist     = document.getElementById('panel-historial');
const elSlider        = document.getElementById('slider-capacidad');
const elValorSlider   = document.getElementById('valor-slider');
const elListaHist     = document.getElementById('lista-historial');

// ==========================================
// FUNCIÓN PRINCIPAL: ACTUALIZAR PANTALLA
// ==========================================

function actualizarPantalla() {

  // Actualizar el número grande
  elNumero.textContent = contador;

  // Calcular el porcentaje de ocupación
  const porcentaje = Math.round((contador / capacidad) * 100);

  // Actualizar la barra de capacidad
  const anchoBarra = Math.min(porcentaje, 100);
  elBarra.style.width = anchoBarra + '%';
  elBarraTexto.textContent = contador + ' / ' + capacidad;

  // Actualizar el color de la barra según ocupación
  if (porcentaje >= 100) {
    elBarra.style.background = '#E24B4A';
  } else if (porcentaje >= 80) {
    elBarra.style.background = '#EF9F27';
  } else {
    elBarra.style.background = '#1D9E75';
  }

  // Actualizar el badge de estado
  elEstado.classList.remove('casi-lleno', 'lleno');

  if (contador === 0) {
    elEstado.textContent = 'Vacío';
  } else if (porcentaje >= 100) {
    elEstado.textContent = '¡Lleno!';
    elEstado.classList.add('lleno');
  } else if (porcentaje >= 80) {
    elEstado.textContent = 'Casi lleno — ' + porcentaje + '%';
    elEstado.classList.add('casi-lleno');
  } else {
    elEstado.textContent = porcentaje + '% ocupado';
  }
}

// ==========================================
// FUNCIÓN: ANIMAR EL NÚMERO
// ==========================================

function animarNumero(direccion) {
  const clase = direccion === 'subir' ? 'animar-subir' : 'animar-bajar';
  elNumero.classList.add(clase);
  setTimeout(function() {
    elNumero.classList.remove(clase);
  }, 200);
}

// ==========================================
// FUNCIÓN: OBTENER HORA ACTUAL
// ==========================================

function obtenerHora() {
  const ahora = new Date();
  const horas   = String(ahora.getHours()).padStart(2, '0');
  const minutos = String(ahora.getMinutes()).padStart(2, '0');
  const segundos = String(ahora.getSeconds()).padStart(2, '0');
  return horas + ':' + minutos + ':' + segundos;
}

// ==========================================
// FUNCIÓN: AGREGAR AL HISTORIAL
// ==========================================

function agregarHistorial(accion) {
  const entrada = {
    accion: accion,
    cantidad: contador,
    hora: obtenerHora()
  };
  historial.unshift(entrada);
  if (historial.length > 50) {
    historial.pop();
  }
  if (panelHistorialAbierto) {
    renderizarHistorial();
  }
}

// ==========================================
// FUNCIÓN: RENDERIZAR HISTORIAL EN PANTALLA
// ==========================================

function renderizarHistorial() {
  if (historial.length === 0) {
    elListaHist.innerHTML = '<p class="sin-historial">Sin movimientos aún</p>';
    return;
  }
  let html = '';
  for (let i = 0; i < historial.length; i++) {
    const item = historial[i];
    html += '<div class="fila-historial">';
    html += '<span>' + item.accion + '</span>';
    html += '<span>' + item.cantidad + ' personas</span>';
    html += '<span>' + item.hora + '</span>';
    html += '</div>';
  }
  elListaHist.innerHTML = html;
}

// ==========================================
// EVENTOS DE LOS BOTONES
// ==========================================

elBotonEntrar.addEventListener('click', function() {
  contador = contador + 1;
  animarNumero('subir');
  agregarHistorial('Ingresó');
  actualizarPantalla();
});

elBotonSalir.addEventListener('click', function() {
  if (contador === 0) return;
  contador = contador - 1;
  animarNumero('bajar');
  agregarHistorial('Salió');
  actualizarPantalla();
});

elBotonRein.addEventListener('click', function() {
  if (contador === 0) return;
  contador = 0;
  agregarHistorial('Reinicio');
  actualizarPantalla();
});

elBotonCap.addEventListener('click', function() {
  panelCapacidadAbierto = !panelCapacidadAbierto;
  if (panelCapacidadAbierto) {
    elPanelCap.classList.add('visible');
  } else {
    elPanelCap.classList.remove('visible');
  }
});

elBotonHist.addEventListener('click', function() {
  panelHistorialAbierto = !panelHistorialAbierto;
  if (panelHistorialAbierto) {
    elPanelHist.classList.add('visible');
    renderizarHistorial();
  } else {
    elPanelHist.classList.remove('visible');
  }
});

elSlider.addEventListener('input', function() {
  capacidad = parseInt(elSlider.value);
  elValorSlider.textContent = capacidad + ' personas';
  actualizarPantalla();
});

// ==========================================
// ARRANQUE: DIBUJAR LA PANTALLA INICIAL
// ==========================================

actualizarPantalla();
