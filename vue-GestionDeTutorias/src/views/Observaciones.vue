<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import BarraLateral from '../components/BarraLateral.vue'
import PieBiblioteca from '../components/PieBiblioteca.vue'
import {
  cargarObservaciones,
  cargarTutorias,
  escucharObservaciones,
  escucharTutorias,
  guardarObservaciones,
} from '../lib/datosLocales'

const props = defineProps({
  sesion: { type: Object, default: null },
})

const usuarioId = computed(() => props.sesion?.user?.id || 'cuenta-demo')
const seccionActiva = ref('tutorias')
const mensaje = ref('')
const error = ref('')
const tutorias = ref([])
const observaciones = ref([])
const tutoriaSeleccionadaId = ref('')
const notaPersonalId = ref('')
const copiaNotaPersonal = ref(null)
const fichaTutoria = reactive({ contenidos: '', observacion: '' })
const fichaPersonal = reactive({ fecha: fechaActual(), titulo: '', texto: '' })

const tutoriasOrdenadas = computed(() =>
  [...tutorias.value].sort(
    (a, b) => fechaHora(b).getTime() - fechaHora(a).getTime(),
  ),
)
const notasPersonales = computed(() =>
  [...observaciones.value]
    .filter((observacion) => !observacion.tutoria_id)
    .sort(
      (a, b) =>
        new Date(b.actualizada_en || b.creada_en) -
        new Date(a.actualizada_en || a.creada_en),
    ),
)
const tutoriaSeleccionada = computed(
  () =>
    tutorias.value.find((tutoria) => tutoria.id === tutoriaSeleccionadaId.value) ||
    null,
)

function cargarDatos() {
  try {
    tutorias.value = cargarTutorias(usuarioId.value)
    observaciones.value = cargarObservaciones(usuarioId.value)
    error.value = ''
  } catch (causa) {
    error.value = `No se pudieron cargar los datos: ${causa instanceof Error ? causa.message : 'Error desconocido.'}`
  }
}

watch(usuarioId, cargarDatos, { immediate: true })

let dejarDeEscucharTutorias
let dejarDeEscucharObservaciones
onMounted(() => {
  dejarDeEscucharTutorias = escucharTutorias(usuarioId.value, cargarDatos)
  dejarDeEscucharObservaciones = escucharObservaciones(
    usuarioId.value,
    cargarDatos,
  )
})
onUnmounted(() => {
  dejarDeEscucharTutorias?.()
  dejarDeEscucharObservaciones?.()
})

function fechaActual() {
  const fecha = new Date()
  const ajuste = fecha.getTimezoneOffset() * 60000
  return new Date(fecha.getTime() - ajuste).toISOString().slice(0, 10)
}

function fechaHora(tutoria) {
  return new Date(`${tutoria.fecha_tutoria}T${tutoria.hora_tutoria}`)
}

function ocurrio(tutoria) {
  return (
    fechaHora(tutoria).getTime() <= Date.now() ||
    (tutoria.asistencia_estado &&
      tutoria.asistencia_estado !== 'pendiente')
  )
}

function estadoTutoria(tutoria) {
  const estado = tutoria.asistencia_estado
  if (estado === 'presente') return 'Presente'
  if (estado === 'ausente') return 'Ausente'
  if (estado === 'justificada') return 'Justificada'
  return ocurrio(tutoria) ? 'Realizada' : 'Programada'
}

function fechaLegible(tutoria) {
  const fecha = fechaHora(tutoria)
  return `${fecha.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })} · ${tutoria.hora_tutoria.slice(0, 5)}`
}

function observacionDeTutoria(tutoriaId) {
  return observaciones.value.find(
    (observacion) => observacion.tutoria_id === tutoriaId,
  )
}

function seleccionarTutoria(tutoria) {
  if (!ocurrio(tutoria)) return
  tutoriaSeleccionadaId.value = tutoria.id
  const guardada = observacionDeTutoria(tutoria.id)
  fichaTutoria.contenidos = guardada?.contenidos || tutoria.contenidos || ''
  fichaTutoria.observacion =
    guardada?.motivos || tutoria.motivo_inasistencia || ''
  mensaje.value = ''
  error.value = ''
}

function guardarObservacionTutoria() {
  const tutoria = tutoriaSeleccionada.value
  if (!tutoria || !ocurrio(tutoria)) {
    error.value = 'Seleccioná una tutoría realizada para agregar observaciones.'
    return
  }
  if (!fichaTutoria.observacion.trim()) {
    error.value = 'Escribí las observaciones que viste durante la tutoría.'
    mensaje.value = ''
    return
  }

  const ahora = new Date().toISOString()
  const existente = observacionDeTutoria(tutoria.id)
  const registro = {
    ...(existente || {}),
    id:
      existente?.id ||
      `observacion-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    tipo: 'tutoria',
    tutoria_id: tutoria.id,
    fecha: tutoria.fecha_tutoria,
    curso: tutoria.curso,
    asignatura: tutoria.asignatura,
    estudiante: tutoria.estudiante,
    contenidos: fichaTutoria.contenidos.trim(),
    motivos: fichaTutoria.observacion.trim(),
    creada_en: existente?.creada_en || ahora,
    actualizada_en: ahora,
  }
  guardarRegistros(
    existente
      ? observaciones.value.map((item) =>
          item.id === existente.id ? registro : item,
        )
      : [...observaciones.value, registro],
    'Observación de tutoría guardada.',
  )
}

function editarNotaPersonal(nota) {
  notaPersonalId.value = nota.id
  copiaNotaPersonal.value = {
    fecha: nota.fecha || fechaActual(),
    titulo: nota.titulo || (nota.estudiante ? `Observación de ${nota.estudiante}` : ''),
    texto: nota.texto || [nota.contenidos, nota.motivos].filter(Boolean).join('\n'),
  }
  Object.assign(fichaPersonal, copiaNotaPersonal.value)
  mensaje.value = ''
  error.value = ''
}

function nuevaNotaPersonal() {
  notaPersonalId.value = ''
  copiaNotaPersonal.value = null
  Object.assign(fichaPersonal, {
    fecha: fechaActual(),
    titulo: '',
    texto: '',
  })
  mensaje.value = ''
  error.value = ''
}

function guardarNotaPersonal() {
  if (
    !fichaPersonal.fecha ||
    !fichaPersonal.titulo.trim() ||
    !fichaPersonal.texto.trim()
  ) {
    error.value = 'Completá la fecha, el título y la nota personal.'
    mensaje.value = ''
    return
  }

  const existente = observaciones.value.find(
    (observacion) => observacion.id === notaPersonalId.value,
  )
  const ahora = new Date().toISOString()
  const registro = {
    ...(existente || {}),
    id:
      notaPersonalId.value ||
      `nota-personal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    tipo: 'privada',
    tutoria_id: '',
    fecha: fichaPersonal.fecha,
    titulo: fichaPersonal.titulo.trim(),
    texto: fichaPersonal.texto.trim(),
    creada_en: existente?.creada_en || ahora,
    actualizada_en: ahora,
  }
  const siguientes = existente
    ? observaciones.value.map((item) =>
        item.id === existente.id ? registro : item,
      )
    : [...observaciones.value, registro]

  if (!guardarRegistros(siguientes, 'Nota personal guardada solo para tu registro.')) {
    return
  }
  notaPersonalId.value = registro.id
  copiaNotaPersonal.value = { ...fichaPersonal }
}

function guardarRegistros(siguientes, confirmacion) {
  try {
    guardarObservaciones(usuarioId.value, siguientes)
    observaciones.value = siguientes
    error.value = ''
    mensaje.value = confirmacion
    return true
  } catch (causa) {
    error.value = `No se pudo guardar: ${causa instanceof Error ? causa.message : 'Error desconocido.'}`
    mensaje.value = ''
    return false
  }
}

function cancelarNotaPersonal() {
  if (copiaNotaPersonal.value) {
    Object.assign(fichaPersonal, copiaNotaPersonal.value)
    mensaje.value = 'Cambios sin guardar descartados.'
    error.value = ''
    return
  }
  nuevaNotaPersonal()
  mensaje.value = 'Formulario limpiado.'
}

function tituloNota(nota) {
  return nota.titulo || (nota.estudiante ? `Observación de ${nota.estudiante}` : 'Nota personal')
}

function textoNota(nota) {
  return nota.texto || [nota.contenidos, nota.motivos].filter(Boolean).join(' · ')
}

function volver() {
  window.location.hash = 'biblioteca'
}

function imprimir() {
  window.print()
}
</script>

<template>
  <BarraLateral />

  <main class="main-content">
    <div class="observaciones-contenedor">
      <header class="encabezado-observaciones">
        <p class="sobretitulo-observaciones">BIBLIOTECA · SEGUIMIENTO</p>
        <h1 class="observaciones-titulo">Observaciones</h1>
        <p class="introduccion-observaciones">
          Registrá lo que observaste en una tutoría o guardá una nota personal
          aparte.
        </p>
      </header>

      <div class="selector-tipo" role="tablist" aria-label="Tipo de observación">
        <button
          type="button"
          role="tab"
          :aria-selected="seccionActiva === 'tutorias'"
          :class="{ activo: seccionActiva === 'tutorias' }"
          @click="
            seccionActiva = 'tutorias';
            mensaje = '';
            error = ''
          "
        >
          Observaciones de tutorías
          <span>{{ tutorias.length }}</span>
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="seccionActiva === 'personales'"
          :class="{ activo: seccionActiva === 'personales' }"
          @click="
            seccionActiva = 'personales';
            mensaje = '';
            error = ''
          "
        >
          Notas solo para vos
          <span>{{ notasPersonales.length }}</span>
        </button>
      </div>

      <p v-if="error" class="estado-observacion error" role="alert">{{ error }}</p>
      <p v-else-if="mensaje" class="estado-observacion" role="status">{{ mensaje }}</p>

      <section
        v-if="seccionActiva === 'tutorias'"
        class="seccion-tutorias"
        role="tabpanel"
      >
        <header class="encabezado-seccion">
          <div>
            <h2>Tutorías cargadas</h2>
            <p>Elegí una tutoría realizada para registrar lo que observaste.</p>
          </div>
          <span class="contador-seccion">{{ tutorias.length }}</span>
        </header>

        <p v-if="tutorias.length === 0" class="vacio-observaciones">
          Todavía no hay tutorías cargadas. Cuando programes una, va a aparecer
          acá.
        </p>
        <div v-else class="lista-tutorias-observaciones">
          <article
            v-for="tutoria in tutoriasOrdenadas"
            :key="tutoria.id"
            class="tarjeta-tutoria-observacion"
            :class="{
              seleccionada: tutoriaSeleccionadaId === tutoria.id,
              'tutoria-pendiente': !ocurrio(tutoria),
            }"
          >
            <div class="fecha-tutoria-observacion">
              <span class="icono-fecha" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                  <rect x="3.5" y="5" width="17" height="16" rx="3" stroke="currentColor" stroke-width="1.8" />
                  <path d="M7.5 3v4M16.5 3v4M3.5 9.5h17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                </svg>
              </span>
              <span>{{ fechaLegible(tutoria) }}</span>
            </div>
            <div class="detalle-tutoria-observacion">
              <h3>{{ tutoria.estudiante }}</h3>
              <p>{{ tutoria.curso }} · {{ tutoria.asignatura }}</p>
              <span
                class="estado-tutoria-observacion"
                :class="`estado-${tutoria.asistencia_estado || (ocurrio(tutoria) ? 'realizada' : 'pendiente')}`"
              >
                {{ estadoTutoria(tutoria) }}
              </span>
            </div>
            <button
              type="button"
              class="accion-tutoria-observacion"
              :aria-label="`${observacionDeTutoria(tutoria.id) ? 'Editar' : 'Agregar'} observación de ${tutoria.estudiante}`"
              :disabled="!ocurrio(tutoria)"
              @click="seleccionarTutoria(tutoria)"
            >
              {{
                !ocurrio(tutoria)
                  ? 'Aún no realizada'
                  : observacionDeTutoria(tutoria.id)
                    ? 'Ver / editar'
                    : 'Agregar observación'
              }}
            </button>
          </article>
        </div>

        <form
          v-if="tutoriaSeleccionada"
          class="editor-observacion-tutoria"
          @submit.prevent="guardarObservacionTutoria"
        >
          <div class="resumen-tutoria-seleccionada">
            <p class="sobretitulo-observaciones">OBSERVACIÓN DE TUTORÍA</p>
            <h3>{{ tutoriaSeleccionada.estudiante }}</h3>
            <p>
              {{ fechaLegible(tutoriaSeleccionada) }} ·
              {{ tutoriaSeleccionada.curso }} ·
              {{ tutoriaSeleccionada.asignatura }}
            </p>
          </div>
          <div class="campo-observacion">
            <label for="contenidos-tutoria">Contenidos trabajados</label>
            <textarea
              id="contenidos-tutoria"
              v-model="fichaTutoria.contenidos"
              rows="3"
              placeholder="Temas que se trabajaron..."
            ></textarea>
          </div>
          <div class="campo-observacion">
            <label for="observacion-tutoria">Observaciones que viste</label>
            <textarea
              id="observacion-tutoria"
              v-model="fichaTutoria.observacion"
              rows="4"
              placeholder="Anotá avances, dificultades o aspectos importantes..."
              required
            ></textarea>
          </div>
          <div class="botones-observacion">
            <button type="submit" class="boton-observacion boton-editar">
              Guardar observación
            </button>
            <button
              type="button"
              class="boton-observacion boton-cancelar"
              @click="tutoriaSeleccionadaId = ''"
            >
              Cerrar
            </button>
          </div>
        </form>
      </section>

      <section
        v-else
        class="seccion-personal"
        role="tabpanel"
        aria-label="Notas personales privadas"
      >
        <header class="encabezado-seccion">
          <div>
            <h2>Notas solo para vos</h2>
            <p>
              Este espacio es independiente: no se vincula con ninguna tutoría,
              estudiante o familia.
            </p>
          </div>
          <span class="contador-seccion">{{ notasPersonales.length }}</span>
        </header>

        <form class="editor-nota-personal" @submit.prevent="guardarNotaPersonal">
          <div class="fila-datos">
            <div class="campo-observacion">
              <label for="fecha-personal">Fecha</label>
              <input
                id="fecha-personal"
                v-model="fichaPersonal.fecha"
                type="date"
                required
              />
            </div>
            <div class="campo-observacion titulo-personal">
              <label for="titulo-personal">Título</label>
              <input
                id="titulo-personal"
                v-model="fichaPersonal.titulo"
                type="text"
                placeholder="Ej.: Seguimiento del curso"
                required
              />
            </div>
          </div>
          <div class="campo-observacion">
            <label for="texto-personal">Tu nota privada</label>
            <textarea
              id="texto-personal"
              v-model="fichaPersonal.texto"
              rows="5"
              placeholder="Escribí una nota que quede solo en tu registro..."
              required
            ></textarea>
          </div>
          <div class="botones-observacion">
            <button type="submit" class="boton-observacion boton-editar">
              {{ notaPersonalId ? 'Guardar cambios' : 'Guardar nota privada' }}
            </button>
            <button
              type="button"
              class="boton-observacion boton-cancelar"
              @click="cancelarNotaPersonal"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="boton-observacion boton-imprimir"
              @click="imprimir"
            >
              Imprimir
            </button>
          </div>
        </form>

        <div v-if="notasPersonales.length" class="historial-observaciones">
          <h2>Notas guardadas</h2>
          <button
            v-for="nota in notasPersonales"
            :key="nota.id"
            type="button"
            class="item-observacion"
            @click="editarNotaPersonal(nota)"
          >
            <span class="contenido-nota-lista">
              <strong>{{ tituloNota(nota) }}</strong>
              <small>{{ nota.fecha || 'Sin fecha' }}</small>
              <span>{{ textoNota(nota) }}</span>
            </span>
            <span class="editar-nota" aria-hidden="true">›</span>
          </button>
        </div>
      </section>

      <footer class="pie-observaciones">
        <button type="button" class="boton-volver" @click="volver">Volver a Biblioteca</button>
      </footer>
    </div>
  </main>

  <PieBiblioteca />
</template>

<style scoped src="../assets/contenido.css"></style>
<style scoped src="../assets/observaciones.css"></style>
<style scoped>
.observaciones-contenedor {
  width: min(100%, 1040px);
}

.encabezado-observaciones {
  margin-bottom: 24px;
}

.observaciones-titulo {
  margin-bottom: 8px;
}

.introduccion-observaciones {
  margin: 0;
  color: #728078;
  font-size: 13px;
  line-height: 1.6;
}

.selector-tipo {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
  margin: 0 0 24px;
  padding: 6px;
  border: 1px solid #e6ede7;
  border-radius: 14px;
  background: #f7faf7;
}

.selector-tipo button {
  display: flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 9px 13px;
  border: 1px solid transparent;
  border-radius: 10px;
  background: transparent;
  color: #637269;
  font-size: 12px;
  font-weight: 700;
  transition: background-color 0.18s ease, box-shadow 0.18s ease, color 0.18s ease;
}

.selector-tipo button.activo {
  border-color: #e0ebe2;
  background: #fff;
  color: #285d40;
  box-shadow: 0 3px 9px rgba(35, 75, 49, 0.07);
}

.selector-tipo button span,
.contador-seccion {
  display: inline-grid;
  min-width: 24px;
  height: 24px;
  place-items: center;
  border-radius: 8px;
  background: #eaf3ec;
  color: #34795a;
  font-size: 10px;
  font-weight: 800;
}

.encabezado-seccion {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin: 0 0 14px;
}

.encabezado-seccion h2,
.historial-observaciones h2 {
  margin: 0;
  color: #203d2f;
  font-size: 18px;
  font-weight: 750;
  letter-spacing: -0.035em;
}

.encabezado-seccion p {
  margin: 6px 0 0;
  color: #728078;
  font-size: 12px;
  line-height: 1.5;
}

.lista-tutorias-observaciones {
  display: grid;
  gap: 10px;
}

.tarjeta-tutoria-observacion {
  display: grid;
  grid-template-columns: minmax(160px, 0.8fr) minmax(170px, 1fr) auto;
  align-items: center;
  gap: 16px;
  padding: 14px;
  border: 1px solid #e5ece6;
  border-radius: 15px;
  background: #fcfdfc;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}

.tarjeta-tutoria-observacion.seleccionada {
  border-color: #79b18b;
  background: #f7fbf8;
  box-shadow: 0 0 0 3px rgba(74, 154, 112, 0.1);
}

.tarjeta-tutoria-observacion.tutoria-pendiente {
  background: #f8faf8;
}

.fecha-tutoria-observacion {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #34795a;
  font-size: 11px;
  font-weight: 700;
}

.icono-fecha {
  display: grid;
  width: 35px;
  height: 35px;
  flex: 0 0 35px;
  place-items: center;
  border-radius: 10px;
  background: #eaf4ed;
}

.detalle-tutoria-observacion h3 {
  margin: 0 0 4px;
  color: #263b30;
  font-size: 13px;
}

.detalle-tutoria-observacion p {
  margin: 0 0 7px;
  color: #728078;
  font-size: 11px;
}

.estado-tutoria-observacion {
  display: inline-flex;
  padding: 4px 8px;
  border-radius: 999px;
  background: #f5f2e9;
  color: #806b41;
  font-size: 9px;
  font-weight: 750;
}

.estado-presente,
.estado-realizada {
  background: #e8f2eb;
  color: #34704d;
}

.estado-ausente {
  background: #f9e9e7;
  color: #99453e;
}

.estado-justificada {
  background: #eceaf5;
  color: #5b557e;
}

.accion-tutoria-observacion {
  min-height: 36px;
  padding: 8px 11px;
  border: 1px solid #d5e5d9;
  border-radius: 9px;
  background: #fff;
  color: #34704d;
  font-size: 10px;
  font-weight: 750;
}

.accion-tutoria-observacion:hover:not(:disabled) {
  border-color: #72a983;
  background: #edf6ef;
}

.accion-tutoria-observacion:disabled {
  cursor: not-allowed;
  color: #9aa59e;
}

.editor-observacion-tutoria,
.editor-nota-personal {
  display: grid;
  gap: 17px;
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #dfeae1;
  border-radius: 16px;
  background: #f9fcf9;
}

.resumen-tutoria-seleccionada {
  padding-bottom: 13px;
  border-bottom: 1px solid #e7eee8;
}

.resumen-tutoria-seleccionada h3 {
  margin: 0 0 5px;
  color: #203d2f;
  font-size: 16px;
}

.resumen-tutoria-seleccionada p:last-child {
  margin: 0;
  color: #728078;
  font-size: 11px;
}

.editor-observacion-tutoria .campo-observacion,
.editor-nota-personal .campo-observacion {
  margin: 0;
}

.editor-observacion-tutoria textarea,
.editor-nota-personal textarea {
  min-height: 90px;
}

.editor-nota-personal textarea {
  min-height: 145px;
}

.fila-datos {
  grid-template-columns: minmax(150px, 0.45fr) minmax(0, 1fr);
  margin: 0;
}

.titulo-personal {
  min-width: 0;
}

.seccion-personal > .editor-nota-personal {
  margin-top: 0;
}

.botones-observacion {
  display: flex;
  flex-wrap: wrap;
  grid-template-columns: none;
  gap: 9px;
  margin: 0;
}

.boton-observacion {
  min-height: 40px;
  padding: 10px 14px;
  font-size: 12px;
}

.historial-observaciones {
  display: grid;
  gap: 9px;
  margin-top: 24px;
  padding-top: 21px;
  border-top: 1px solid #e8eee9;
}

.historial-observaciones h2 {
  margin-bottom: 3px;
}

.item-observacion {
  width: 100%;
}

.contenido-nota-lista {
  display: grid;
  min-width: 0;
  gap: 5px;
}

.contenido-nota-lista strong {
  color: #33493c;
  font-size: 12px;
}

.contenido-nota-lista small {
  color: #7b8880;
  font-size: 10px;
}

.contenido-nota-lista > span {
  overflow: hidden;
  color: #637269;
  font-size: 11px;
  line-height: 1.45;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.editar-nota {
  flex: 0 0 auto;
  color: #34795a;
  font-size: 20px;
}

.vacio-observaciones {
  margin: 0;
  padding: 20px;
  border: 1px dashed #dce6df;
  border-radius: 14px;
  color: #728078;
  font-size: 12px;
  line-height: 1.55;
  text-align: center;
}

.estado-observacion {
  margin: 0 0 14px;
  color: #34795a;
  font-size: 12px;
}

.estado-observacion.error {
  color: #99453e;
}

.pie-observaciones {
  display: flex;
  justify-content: flex-end;
  margin-top: 22px;
}

.boton-volver {
  min-height: 38px;
  padding: 9px 13px;
  border: 0;
  border-radius: 10px;
  background: #34795a;
  color: white;
  font-size: 11px;
  font-weight: 700;
}

@media (max-width: 760px) {
  .tarjeta-tutoria-observacion {
    grid-template-columns: 1fr auto;
    gap: 10px;
  }

  .fecha-tutoria-observacion {
    grid-column: 1 / -1;
  }

  .detalle-tutoria-observacion {
    grid-column: 1;
  }

  .accion-tutoria-observacion {
    grid-column: 2;
    grid-row: 2;
  }
}

@media (max-width: 560px) {
  .selector-tipo {
    grid-template-columns: 1fr;
  }

  .selector-tipo button {
    justify-content: space-between;
  }

  .encabezado-seccion {
    align-items: flex-start;
  }

  .fila-datos {
    grid-template-columns: 1fr;
  }

  .editor-observacion-tutoria,
  .editor-nota-personal {
    padding: 15px;
  }
}
</style>
