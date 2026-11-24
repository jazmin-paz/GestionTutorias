<script setup>
import {
  computed,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from 'vue'
import BarraLateral from '../components/BarraLateral.vue'
import PieBiblioteca from '../components/PieBiblioteca.vue'
import {
  cargarCursos,
  cargarTutorias as leerTutorias,
  escucharCursos,
  escucharTutorias,
  estudiantesPorCurso,
  guardarTutorias,
} from '../lib/datosLocales'

const props = defineProps({
  sesion: { type: Object, default: null },
})

const milisegundosHora = 60 * 60 * 1000
const minuto = 60 * 1000
const usuarioId = computed(() => props.sesion?.user?.id || 'cuenta-demo')
const ahora = ref(Date.now())
const reloj = setInterval(() => {
  ahora.value = Date.now()
}, 30000)
const tutorias = ref([])
const cursos = ref([])
const cargando = ref(false)
const mensaje = ref('')
const error = ref('')
const editandoId = ref('')
const avisoEditado = ref(false)
const tutoriaSeleccionada = ref(null)
const estadoAsistencia = ref('presente')
const motivoInasistencia = ref('')

function nuevaFicha() {
  return {
    estudiante: '',
    email_estudiante: '',
    email_familia: '',
    curso: '',
    asignatura: '',
    fecha_tutoria: '',
    hora_tutoria: '',
    notificacion_local: '',
    contenidos: '',
  }
}

const ficha = reactive(nuevaFicha())
const fechaMinima = computed(() => {
  const fecha = new Date(ahora.value)
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`
})
const fechaHoraMinimaAviso = computed(() =>
  localDateTimeString(new Date(ahora.value + minuto)),
)
const materiasDisponibles = computed(
  () =>
    cursos.value.find((curso) => curso.nombre === ficha.curso)?.materias || [],
)
const estudiantesDisponibles = computed(
  () => {
    const nombres = estudiantesPorCurso[ficha.curso] || []
    return ficha.estudiante && !nombres.includes(ficha.estudiante)
      ? [...nombres, ficha.estudiante]
      : nombres
  },
)
const modoEdicion = computed(() => Boolean(editandoId.value))

function localDateTimeString(fecha) {
  const date = new Date(fecha)
  const ajuste = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - ajuste).toISOString().slice(0, 16)
}

function actualizarNotificacion() {
  if (avisoEditado.value || !ficha.fecha_tutoria || !ficha.hora_tutoria) return
  const inicio = new Date(`${ficha.fecha_tutoria}T${ficha.hora_tutoria}`)
  const diferencia = inicio.getTime() - ahora.value
  if (diferencia <= minuto) {
    ficha.notificacion_local = ''
    return
  }

  const anticipacion = Math.min(
    milisegundosHora,
    Math.max(minuto, Math.floor(diferencia / 2 / minuto) * minuto),
  )
  const aviso = new Date(Math.floor((inicio.getTime() - anticipacion) / minuto) * minuto)
  ficha.notificacion_local = localDateTimeString(aviso)
}

watch(
  () => [ficha.fecha_tutoria, ficha.hora_tutoria],
  actualizarNotificacion,
)
watch(
  () => ficha.curso,
  (curso, anterior) => {
    if (!anterior || curso === anterior || modoEdicion.value) return
    ficha.estudiante = ''
    ficha.asignatura = ''
    ficha.email_estudiante = ''
    ficha.email_familia = ''
  },
)

const citasOrdenadas = computed(() =>
  [...tutorias.value].sort((a, b) => {
    const fechaA = new Date(`${a.fecha_tutoria}T${a.hora_tutoria}`)
    const fechaB = new Date(`${b.fecha_tutoria}T${b.hora_tutoria}`)
    return fechaA - fechaB
  }),
)

function fechaYHora(cita) {
  const [anio, mes, dia] = cita.fecha_tutoria.split('-').map(Number)
  const fecha = new Date(anio, mes - 1, dia)
  return `${fecha.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })} · ${cita.hora_tutoria.slice(0, 5)}`
}

function fechaHoraCita(cita) {
  return new Date(`${cita.fecha_tutoria}T${cita.hora_tutoria}`)
}

function puedeRegistrarAsistencia(cita) {
  return fechaHoraCita(cita).getTime() <= Date.now()
}

function nombreProfesor() {
  return (
    props.sesion?.user?.user_metadata?.nombre ||
    props.sesion?.user?.email ||
    'Docente'
  )
}

function cargarTutorias() {
  cargando.value = true
  error.value = ''

  try {
    tutorias.value = leerTutorias(usuarioId.value)
    cursos.value = cargarCursos(usuarioId.value)
  } catch (causa) {
    error.value = `No se pudieron leer los datos de este navegador: ${causa instanceof Error ? causa.message : 'Error desconocido.'}`
  } finally {
    cargando.value = false
  }
}

watch(
  usuarioId,
  cargarTutorias,
  { immediate: true },
)

let dejarDeEscucharTutorias
let dejarDeEscucharCursos
onMounted(() => {
  dejarDeEscucharTutorias = escucharTutorias(usuarioId.value, cargarTutorias)
  dejarDeEscucharCursos = escucharCursos(usuarioId.value, cargarTutorias)
})

function persistirTutorias(actualizadas) {
  try {
    guardarTutorias(usuarioId.value, actualizadas)
    tutorias.value = actualizadas
    return true
  } catch (causa) {
    error.value = `No se pudieron guardar las tutorías en este navegador: ${causa instanceof Error ? causa.message : 'Error desconocido.'}`
    return false
  }
}

function validarFicha() {
  const ahora = Date.now()
  const inicio = new Date(`${ficha.fecha_tutoria}T${ficha.hora_tutoria}`)
  const aviso = new Date(ficha.notificacion_local)

  if (inicio.getTime() <= ahora + minuto) {
    return 'Elegí una fecha y hora de tutoría al menos un minuto en el futuro.'
  }
  if (Number.isNaN(aviso.getTime()) || aviso.getTime() <= ahora) {
    return 'Elegí una fecha y hora futura para el aviso.'
  }
  if (aviso.getTime() >= inicio.getTime()) {
    return 'El aviso debe programarse antes del comienzo de la tutoría.'
  }
  return ''
}

function limpiarFicha() {
  Object.assign(ficha, nuevaFicha())
  editandoId.value = ''
  avisoEditado.value = false
}

function guardarTutoria() {
  if (!props.sesion?.user?.id) {
    error.value = 'Iniciá sesión con una cuenta docente para guardar tutorías.'
    return
  }

  const validacion = validarFicha()
  if (validacion) {
    error.value = validacion
    mensaje.value = ''
    return
  }

  error.value = ''
  mensaje.value = ''

  const datos = {
    id: editandoId.value || `tutoria-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    created_by: props.sesion.user.id,
    profesor: nombreProfesor(),
    estudiante: ficha.estudiante.trim(),
    email_estudiante: ficha.email_estudiante.trim().toLowerCase(),
    email_familia: ficha.email_familia.trim().toLowerCase(),
    curso: ficha.curso,
    asignatura: ficha.asignatura,
    fecha_tutoria: ficha.fecha_tutoria,
    hora_tutoria: ficha.hora_tutoria,
    notificacion_programada_para: new Date(ficha.notificacion_local).toISOString(),
    contenidos: ficha.contenidos.trim(),
    asistencia_estado: 'pendiente',
    motivo_inasistencia: '',
    notificacion_estado: 'pendiente',
    informe_estado: 'no_aplica',
  }

  const nuevasTutorias = editandoId.value
    ? tutorias.value.map((tutoria) =>
        tutoria.id === editandoId.value
          ? {
              ...tutoria,
              ...datos,
              asistencia_estado: tutoria.asistencia_estado,
              motivo_inasistencia: tutoria.motivo_inasistencia,
              notificacion_estado: 'pendiente',
              informe_estado: tutoria.informe_estado,
            }
          : tutoria,
      )
    : [...tutorias.value, datos]

  if (!persistirTutorias(nuevasTutorias)) return

  mensaje.value = editandoId.value
    ? 'Los cambios de la tutoría se guardaron en este navegador.'
    : 'La tutoría quedó programada. El aviso aparecerá aquí cuando llegue la fecha elegida.'
  limpiarFicha()
}

function editarTutoria(cita) {
  editandoId.value = cita.id
  avisoEditado.value = false
  Object.assign(ficha, {
    estudiante: cita.estudiante,
    email_estudiante: cita.email_estudiante,
    email_familia: cita.email_familia,
    curso: cita.curso,
    asignatura: cita.asignatura,
    fecha_tutoria: cita.fecha_tutoria,
    hora_tutoria: cita.hora_tutoria.slice(0, 5),
    notificacion_local: '',
    contenidos: cita.contenidos || '',
  })
  mensaje.value = ''
  error.value = ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function abrirAsistencia(cita) {
  if (!puedeRegistrarAsistencia(cita)) {
    error.value = 'La asistencia se registra después de la fecha y hora de la tutoría.'
    return
  }
  tutoriaSeleccionada.value = cita
  estadoAsistencia.value =
    cita.asistencia_estado === 'pendiente' ? 'presente' : cita.asistencia_estado
  motivoInasistencia.value = cita.motivo_inasistencia || ''
  mensaje.value = ''
  error.value = ''
}

function enviarInforme(cita) {
  const cuerpo = [
    `Hola, compartimos el informe de la tutoría de ${cita.estudiante}.`,
    '',
    `Fecha: ${fechaYHora(cita)}`,
    `Curso: ${cita.curso} · ${cita.asignatura}`,
    `Docente: ${cita.profesor}`,
    `Asistencia: ${cita.asistencia_estado === 'justificada' ? 'Inasistencia justificada' : 'Ausente'}`,
    `Motivo: ${cita.motivo_inasistencia || 'Sin motivo indicado'}`,
  ].join('\n')
  const preparado = prepararCorreo(
    cita,
    'Informe de inasistencia a tutoría',
    cuerpo,
  )
  if (!preparado) return false

  const actualizadas = tutorias.value.map((tutoria) =>
    tutoria.id === cita.id ? { ...tutoria, informe_estado: 'preparado' } : tutoria,
  )
  if (!persistirTutorias(actualizadas)) return false

  mensaje.value =
    'Se preparó el informe en tu aplicación de correo. Revisalo y confirmá el envío.'
  error.value = ''
  return true
}

function prepararCorreo(cita, asunto, cuerpo) {
  const destinatarios = [
    cita.email_estudiante,
    cita.email_familia,
  ].filter(Boolean)
  if (destinatarios.length === 0) {
    error.value = 'Esta tutoría no tiene correos de contacto.'
    return false
  }

  const enlace = `mailto:${destinatarios.join(',')}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`
  window.location.href = enlace
  return true
}

function prepararAviso(cita) {
  const cuerpo = [
    `Hola, les recordamos la tutoría de ${cita.estudiante}.`,
    '',
    `Fecha: ${fechaYHora(cita)}`,
    `Curso: ${cita.curso} · ${cita.asignatura}`,
    `Docente: ${cita.profesor}`,
    `Contenidos: ${cita.contenidos || 'A confirmar'}`,
  ].join('\n')
  const preparado = prepararCorreo(cita, 'Recordatorio de tutoría', cuerpo)
  if (!preparado) return

  const actualizadas = tutorias.value.map((tutoria) =>
    tutoria.id === cita.id
      ? { ...tutoria, notificacion_estado: 'preparado' }
      : tutoria,
  )
  if (!persistirTutorias(actualizadas)) return
  mensaje.value =
    'Se preparó el aviso en tu aplicación de correo. Revisalo y confirmá el envío.'
}

function estadoAviso(cita) {
  if (cita.notificacion_estado === 'preparado') return 'Aviso preparado'
  if (cita.notificacion_estado === 'error') return 'Aviso pendiente'
  if (cita.notificacion_estado === 'pendiente') {
    return new Date(cita.notificacion_programada_para).getTime() <= ahora.value
      ? 'Aviso listo para preparar'
      : 'Aviso programado'
  }
  return 'Aviso programado'
}

function guardarAsistencia() {
  const cita = tutoriaSeleccionada.value
  if (!cita) return
  if (
    ['ausente', 'justificada'].includes(estadoAsistencia.value) &&
    !motivoInasistencia.value.trim()
  ) {
    error.value = 'Indicá el motivo de la inasistencia o su justificación.'
    return
  }

  error.value = ''
  const nuevasTutorias = tutorias.value.map((tutoria) =>
    tutoria.id === cita.id
      ? {
      ...tutoria,
      asistencia_estado: estadoAsistencia.value,
      motivo_inasistencia: motivoInasistencia.value.trim(),
      informe_estado:
        estadoAsistencia.value === 'ausente' ? 'pendiente' : 'no_aplica',
        }
      : tutoria,
  )
  if (!persistirTutorias(nuevasTutorias)) return

  tutoriaSeleccionada.value = null
  if (estadoAsistencia.value === 'ausente') {
    mensaje.value =
      'Inasistencia registrada. Prepará el informe para estudiante y familia desde la tutoría.'
  } else {
    mensaje.value =
      estadoAsistencia.value === 'justificada'
        ? 'La inasistencia quedó registrada como justificada.'
        : 'La asistencia quedó registrada.'
  }
}

function reintentarInforme(cita) {
  error.value = ''
  enviarInforme(cita)
}

onUnmounted(() => {
  clearInterval(reloj)
  dejarDeEscucharTutorias?.()
  dejarDeEscucharCursos?.()
})
</script>

<template>
  <BarraLateral />
  <main class="crear-tutoria">
    <template v-if="!sesion">
      <section class="estado-acceso">
        <p class="sobretitulo">ACCESO DOCENTE</p>
        <h1>CrearTutoria</h1>
        <p>Iniciá sesión para programar y administrar tus tutorías.</p>
        <a href="#inicio">Iniciar sesión</a>
      </section>
    </template>
    <template v-else>
      <header class="encabezado">
        <div>
          <p class="sobretitulo">ORGANIZACIÓN ACADÉMICA</p>
          <h1>CrearTutoria</h1>
          <p class="introduccion">
            Programá tutorías con los cursos y materias de tu calendario,
            notificá a la familia y registrá el resultado.
          </p>
        </div>
        <div class="resumen">
          <span class="resumen-numero">{{ tutorias.length }}</span>
          <span class="resumen-texto">tutorías registradas</span>
        </div>
      </header>

      <p v-if="error" class="mensaje error" role="alert">{{ error }}</p>
      <p v-if="mensaje" class="mensaje exito" role="status">{{ mensaje }}</p>
      <p class="nota-local">
        Modo local: se guarda en este dispositivo. Dejá la página abierta para
        ver cuándo preparar los avisos; los correos se confirman desde tu
        aplicación de correo.
      </p>

      <section class="panel formulario-panel">
        <header class="panel-encabezado">
          <div>
            <p class="sobretitulo">{{ modoEdicion ? 'ACTUALIZACIÓN' : 'NUEVA CITA' }}</p>
            <h2>{{ modoEdicion ? 'Editar tutoría' : 'Programar tutoría' }}</h2>
          </div>
          <span class="etiqueta-privacidad">Solo visible para tu cuenta</span>
        </header>

        <form class="formulario-cita" @submit.prevent="guardarTutoria">
          <div class="campo">
            <label for="estudiante">Estudiante</label>
            <select
              id="estudiante"
              v-model="ficha.estudiante"
              required
            >
              <option disabled value="">
                {{
                  ficha.curso
                    ? 'Seleccionar estudiante'
                    : 'Primero seleccioná un curso'
                }}
              </option>
              <option
                v-for="estudiante in estudiantesDisponibles"
                :key="estudiante"
                :value="estudiante"
              >
                {{ estudiante }}
              </option>
            </select>
          </div>
          <div class="campo">
            <label for="curso">Curso</label>
            <select id="curso" v-model="ficha.curso" required>
              <option disabled value="">Seleccionar curso</option>
              <option
                v-for="curso in cursos"
                :key="curso.id"
                :value="curso.nombre"
              >
                {{ curso.nombre }}
              </option>
            </select>
          </div>
          <div class="campo">
            <label for="asignatura">Asignatura</label>
            <select
              id="asignatura"
              v-model="ficha.asignatura"
              :disabled="materiasDisponibles.length === 0"
              required
            >
              <option disabled value="">
                {{
                  ficha.curso
                    ? 'Agregá o seleccioná una materia en el inicio'
                    : 'Primero seleccioná un curso'
                }}
              </option>
              <option
                v-for="materia in materiasDisponibles"
                :key="materia.id"
                :value="materia.nombre"
              >
                {{ materia.nombre }}
              </option>
            </select>
          </div>
          <div class="campo">
            <label for="fecha-tutoria">Fecha de la tutoría</label>
            <input
              id="fecha-tutoria"
              v-model="ficha.fecha_tutoria"
              type="date"
              :min="fechaMinima"
              required
            />
          </div>
          <div class="campo">
            <label for="hora-tutoria">Hora</label>
            <input
              id="hora-tutoria"
              v-model="ficha.hora_tutoria"
              type="time"
              required
            />
          </div>
          <div class="campo">
            <label for="notificacion">Enviar aviso el</label>
            <input
              id="notificacion"
              v-model="ficha.notificacion_local"
              type="datetime-local"
              :min="fechaHoraMinimaAviso"
              :max="
                ficha.fecha_tutoria && ficha.hora_tutoria
                  ? localDateTimeString(
                      new Date(
                        new Date(`${ficha.fecha_tutoria}T${ficha.hora_tutoria}`).getTime() -
                          minuto,
                      ),
                    )
                  : undefined
              "
              @input="avisoEditado = true"
              required
            />
            <small>Elegí un momento anterior al inicio de la tutoría.</small>
          </div>
          <div class="campo">
            <label for="email-estudiante">Correo del estudiante</label>
            <input
              id="email-estudiante"
              v-model="ficha.email_estudiante"
              type="email"
              autocomplete="email"
              placeholder="estudiante@correo.com"
              required
            />
          </div>
          <div class="campo">
            <label for="email-familia">Correo de la familia</label>
            <input
              id="email-familia"
              v-model="ficha.email_familia"
              type="email"
              placeholder="familia@correo.com"
              required
            />
          </div>
          <div class="campo campo-completo">
            <label for="contenidos">Contenidos a trabajar</label>
            <textarea
              id="contenidos"
              v-model="ficha.contenidos"
              rows="3"
              placeholder="Temas o contenidos previstos para la tutoría"
            ></textarea>
          </div>
          <div class="acciones-formulario campo-completo">
            <button type="submit" class="boton-principal">
              {{ modoEdicion ? 'Guardar cambios' : 'Programar tutoría' }}
            </button>
            <button
              v-if="modoEdicion"
              type="button"
              class="boton-secundario"
              @click="limpiarFicha"
            >
              Cancelar edición
            </button>
          </div>
        </form>
      </section>

      <section class="panel lista-panel">
        <header class="panel-encabezado">
          <div>
            <p class="sobretitulo">AGENDA</p>
            <h2>Tus tutorías</h2>
          </div>
          <button class="boton-secundario boton-actualizar" @click="cargarTutorias">
            Actualizar
          </button>
        </header>

        <p v-if="cargando" class="estado-lista">Cargando tutorías…</p>
        <p v-else-if="tutorias.length === 0" class="estado-lista">
          Todavía no programaste tutorías. Completá el formulario para crear la
          primera.
        </p>

        <div v-else class="lista-citas">
          <article v-for="cita in citasOrdenadas" :key="cita.id" class="cita">
            <div class="cita-principal">
              <div class="cita-fecha">
                <svg viewBox="0 0 24 24" width="21" height="21" fill="none" aria-hidden="true">
                  <rect x="3.5" y="5" width="17" height="16" rx="3" stroke="currentColor" stroke-width="1.8" />
                  <path d="M7.5 3v4M16.5 3v4M3.5 9.5h17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                </svg>
                <span>{{ fechaYHora(cita) }}</span>
              </div>
              <h3>{{ cita.estudiante }}</h3>
              <p>{{ cita.curso }} · {{ cita.asignatura }}</p>
              <p v-if="cita.contenidos" class="cita-contenidos">
                {{ cita.contenidos }}
              </p>
            </div>
            <div class="cita-detalles">
              <span class="estado-chip" :class="`estado-${cita.asistencia_estado}`">
                {{
                  {
                    pendiente: 'Asistencia pendiente',
                    presente: 'Presente',
                    ausente: 'Ausente',
                    justificada: 'Justificada',
                  }[cita.asistencia_estado]
                }}
              </span>
              <span
                class="aviso-chip"
                :class="`aviso-${cita.notificacion_estado}`"
              >
                {{ estadoAviso(cita) }}
              </span>
              <span class="destinatarios">
                Aviso para estudiante y familia
              </span>
              <span v-if="cita.motivo_inasistencia" class="motivo">
                Motivo: {{ cita.motivo_inasistencia }}
              </span>
              <span v-if="cita.informe_estado === 'preparado'" class="informe-enviado">
                Informe preparado para enviar
              </span>
            </div>
            <div class="acciones-cita">
              <button
                v-if="
                  cita.notificacion_estado === 'pendiente' &&
                  new Date(cita.notificacion_programada_para).getTime() <= ahora
                "
                class="boton-secundario"
                @click="prepararAviso(cita)"
              >
                Preparar aviso
              </button>
              <button class="boton-secundario" @click="editarTutoria(cita)">
                Editar
              </button>
              <button
                v-if="puedeRegistrarAsistencia(cita)"
                class="boton-secundario"
                @click="abrirAsistencia(cita)"
              >
                {{ cita.asistencia_estado === 'pendiente' ? 'Registrar asistencia' : 'Editar asistencia' }}
              </button>
              <button
                v-if="
                  cita.asistencia_estado === 'ausente' &&
                  cita.informe_estado !== 'preparado'
                "
                class="boton-secundario"
                @click="reintentarInforme(cita)"
              >
                Preparar informe
              </button>
            </div>

            <form
              v-if="tutoriaSeleccionada?.id === cita.id"
              class="formulario-asistencia"
              @submit.prevent="guardarAsistencia"
            >
              <label :for="`estado-${cita.id}`">Resultado de la tutoría</label>
              <select
                :id="`estado-${cita.id}`"
                v-model="estadoAsistencia"
              >
                <option value="presente">Presente</option>
                <option value="ausente">Ausente</option>
                <option value="justificada">Justificada</option>
              </select>
              <label :for="`motivo-${cita.id}`">
                {{
                  estadoAsistencia === 'justificada'
                    ? 'Detalle de la justificación'
                    : 'Motivo de inasistencia'
                }}
              </label>
              <textarea
                :id="`motivo-${cita.id}`"
                v-model="motivoInasistencia"
                rows="2"
                :required="estadoAsistencia !== 'presente'"
                :placeholder="
                  estadoAsistencia === 'justificada'
                    ? 'Certificado médico u otra justificación'
                    : 'Motivo informado'
                "
              ></textarea>
              <div class="acciones-asistencia">
                <button type="submit" class="boton-principal">
                  Guardar asistencia
                </button>
                <button
                  type="button"
                  class="boton-secundario"
                  @click="tutoriaSeleccionada = null"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </article>
        </div>
      </section>
    </template>
  </main>
  <PieBiblioteca />
</template>

<style scoped>
.crear-tutoria {
  width: min(100% - 120px, 1120px);
  min-height: calc(100vh - 72px);
  margin-left: 120px;
  padding: 38px 28px 24px;
}

.encabezado,
.panel {
  border: 1px solid #e3ebe5;
  border-radius: 24px;
  background: #fff;
  box-shadow: var(--sombra);
}

.encabezado {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 22px;
  padding: 32px 38px;
  background:
    radial-gradient(circle at 88% 20%, rgba(166, 209, 180, 0.4), transparent 13rem),
    linear-gradient(135deg, #fff 0%, #eff7f0 100%);
}

.sobretitulo {
  margin: 0 0 9px;
  color: #56836a;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.15em;
}

.encabezado h1,
.estado-acceso h1 {
  margin: 0;
  color: #203d2f;
  font-size: clamp(30px, 4vw, 42px);
  font-weight: 750;
  letter-spacing: -0.055em;
  line-height: 1.15;
}

.introduccion {
  max-width: 640px;
  margin: 11px 0 0;
  color: #728078;
  font-size: 14px;
  line-height: 1.65;
}

.resumen {
  display: flex;
  min-width: 156px;
  flex-direction: column;
  align-items: center;
  padding: 15px 19px;
  border: 1px solid #cfe0d3;
  border-radius: 17px;
  background: rgba(255, 255, 255, 0.72);
}

.resumen-numero {
  color: #34795a;
  font-size: 29px;
  font-weight: 800;
  letter-spacing: -0.06em;
  line-height: 1;
}

.resumen-texto {
  margin-top: 6px;
  color: #728078;
  font-size: 10px;
  font-weight: 650;
}

.panel {
  margin-bottom: 20px;
  padding: 28px;
}

.panel-encabezado {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 21px;
}

.panel-encabezado .sobretitulo {
  margin-bottom: 7px;
}

.panel-encabezado h2 {
  margin: 0;
  color: #233b2e;
  font-size: 21px;
  font-weight: 750;
  letter-spacing: -0.035em;
}

.etiqueta-privacidad {
  color: #758279;
  font-size: 11px;
}

.formulario-cita {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 17px;
}

.campo {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 7px;
}

.campo label,
.formulario-asistencia label {
  color: #46564d;
  font-size: 12px;
  font-weight: 700;
}

.campo input,
.campo select,
.campo textarea,
.formulario-asistencia select,
.formulario-asistencia textarea {
  width: 100%;
  min-height: 43px;
  padding: 10px 12px;
  border: 1px solid #dce6df;
  border-radius: 11px;
  background: #fbfdfb;
  color: #263b30;
  font: inherit;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.campo textarea,
.formulario-asistencia textarea {
  min-height: 84px;
  resize: vertical;
}

.campo input:focus,
.campo select:focus,
.campo textarea:focus,
.formulario-asistencia select:focus,
.formulario-asistencia textarea:focus {
  border-color: #69a985;
  box-shadow: 0 0 0 4px rgba(74, 154, 112, 0.12);
}

.campo small {
  color: #89958e;
  font-size: 10px;
  line-height: 1.4;
}

.campo-completo {
  grid-column: 1 / -1;
}

.acciones-formulario,
.acciones-asistencia,
.acciones-cita {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 9px;
}

.boton-principal,
.boton-secundario {
  min-height: 39px;
  padding: 9px 14px;
  border: 1px solid transparent;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}

.boton-principal {
  background: #34795a;
  color: #fff;
  box-shadow: 0 6px 14px rgba(52, 121, 90, 0.16);
}

.boton-principal:hover:not(:disabled) {
  transform: translateY(-1px);
  background: #285f44;
}

.boton-principal:disabled {
  cursor: wait;
  opacity: 0.65;
}

.boton-secundario {
  border-color: #dfe8e1;
  background: #fff;
  color: #4b5c52;
}

.boton-secundario:hover {
  border-color: #b9d7c3;
  background: #f2f8f3;
  color: #285d40;
}

.boton-actualizar {
  min-height: 35px;
}

.mensaje {
  margin: 0 0 16px;
  padding: 12px 15px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.5;
}

.mensaje.error {
  border: 1px solid #f0d7d4;
  background: #fff6f5;
  color: #9a403b;
}

.mensaje.exito {
  border: 1px solid #d2e6d7;
  background: #f1f8f2;
  color: #2f704b;
}

.nota-local {
  margin: -5px 0 17px;
  padding: 11px 14px;
  border: 1px solid #dfe8e1;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.78);
  color: #728078;
  font-size: 11px;
  line-height: 1.6;
}

.estado-lista {
  padding: 22px 18px;
  border: 1px dashed #dce6df;
  border-radius: 14px;
  color: #728078;
  font-size: 13px;
  line-height: 1.6;
  text-align: center;
}

.lista-citas {
  display: grid;
  gap: 12px;
}

.cita {
  display: grid;
  grid-template-columns: minmax(200px, 1.1fr) minmax(160px, 0.8fr) auto;
  align-items: center;
  gap: 18px;
  padding: 18px;
  border: 1px solid #e5ece6;
  border-radius: 16px;
  background: #fcfdfc;
}

.cita-fecha {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #34795a;
  font-size: 12px;
  font-weight: 700;
}

.cita-principal h3 {
  margin: 10px 0 4px;
  color: #263b30;
  font-size: 15px;
  font-weight: 750;
}

.cita-principal p {
  margin: 0;
  color: #728078;
  font-size: 12px;
  line-height: 1.55;
}

.cita-principal .cita-contenidos {
  margin-top: 6px;
}

.cita-detalles {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 7px;
}

.estado-chip,
.aviso-chip {
  padding: 6px 9px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
}

.estado-pendiente,
.aviso-pendiente {
  background: #f5f2e9;
  color: #806b41;
}

.estado-presente,
.aviso-enviada {
  background: #e8f2eb;
  color: #34704d;
}

.estado-ausente,
.aviso-error {
  background: #f9e9e7;
  color: #99453e;
}

.estado-justificada,
.aviso-enviando {
  background: #eceaf5;
  color: #5b557e;
}

.destinatarios,
.motivo,
.informe-enviado,
.limite-edicion {
  color: #7d8981;
  font-size: 10px;
  line-height: 1.45;
}

.informe-enviado {
  color: #34704d;
  font-weight: 700;
}

.acciones-cita {
  justify-content: flex-end;
}

.formulario-asistencia {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: minmax(150px, 0.4fr) minmax(180px, 1fr);
  align-items: center;
  gap: 10px 13px;
  margin-top: 3px;
  padding: 16px;
  border: 1px solid #e3ebe5;
  border-radius: 13px;
  background: #f8fbf8;
}

.formulario-asistencia .acciones-asistencia {
  grid-column: 1 / -1;
}

.estado-acceso {
  max-width: 660px;
  margin: 60px auto;
  padding: 34px;
  border: 1px solid #e3ebe5;
  border-radius: 22px;
  background: #fff;
  box-shadow: var(--sombra);
}

.estado-acceso > p:not(.sobretitulo) {
  color: #728078;
  font-size: 14px;
  line-height: 1.6;
}

.estado-acceso a {
  display: inline-flex;
  margin-top: 7px;
  padding: 11px 15px;
  border-radius: 10px;
  background: #34795a;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
}

@media (max-width: 900px) {
  .formulario-cita {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .cita {
    grid-template-columns: minmax(0, 1fr) minmax(150px, 0.8fr);
  }

  .acciones-cita {
    grid-column: 1 / -1;
    justify-content: flex-start;
  }
}

@media (max-width: 700px) {
  .crear-tutoria {
    width: calc(100% - 78px);
    margin-left: 78px;
    padding: 23px 12px 18px;
  }

  .encabezado {
    align-items: flex-start;
    flex-direction: column;
    padding: 25px 22px;
    border-radius: 21px;
  }

  .resumen {
    width: 100%;
    flex-direction: row;
    justify-content: center;
    gap: 10px;
  }

  .resumen-texto {
    margin-top: 0;
  }

  .panel {
    padding: 21px 16px;
    border-radius: 20px;
  }
}

@media (max-width: 520px) {
  .formulario-cita,
  .cita {
    grid-template-columns: 1fr;
  }

  .panel-encabezado {
    align-items: flex-start;
  }

  .etiqueta-privacidad {
    max-width: 116px;
    text-align: right;
  }

  .formulario-asistencia {
    grid-template-columns: 1fr;
  }
}
</style>
