<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import BarraLateral from '../components/BarraLateral.vue'
import PieBiblioteca from '../components/PieBiblioteca.vue'
import { cargarTutorias, escucharTutorias } from '../lib/datosLocales'

const props = defineProps({
  sesion: { type: Object, default: null },
})

const usuarioId = computed(() => props.sesion?.user?.id || 'cuenta-demo')
const tutorias = ref([])
const error = ref('')

function cargarDatos() {
  try {
    tutorias.value = cargarTutorias(usuarioId.value)
    error.value = ''
  } catch (causa) {
    error.value = `No se pudieron cargar las asistencias: ${causa instanceof Error ? causa.message : 'Error desconocido.'}`
  }
}

watch(usuarioId, cargarDatos, { immediate: true })

let dejarDeEscuchar
onMounted(() => {
  dejarDeEscuchar = escucharTutorias(usuarioId.value, cargarDatos)
})
onUnmounted(() => dejarDeEscuchar?.())

const asistencias = computed(() =>
  [...tutorias.value].sort(
    (a, b) =>
      new Date(`${b.fecha_tutoria}T${b.hora_tutoria}`).getTime() -
      new Date(`${a.fecha_tutoria}T${a.hora_tutoria}`).getTime(),
  ),
)

const conteo = computed(() =>
  asistencias.value.reduce(
    (resumen, tutoria) => {
      const estado = tutoria.asistencia_estado || 'pendiente'
      resumen[estado] = (resumen[estado] || 0) + 1
      return resumen
    },
    { pendiente: 0, presente: 0, ausente: 0, justificada: 0 },
  ),
)

function fechaLegible(tutoria) {
  const fecha = new Date(`${tutoria.fecha_tutoria}T${tutoria.hora_tutoria}`)
  return `${fecha.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })} · ${tutoria.hora_tutoria.slice(0, 5)}`
}

function nombreEstado(estado) {
  return {
    pendiente: 'Pendiente',
    presente: 'Presente',
    ausente: 'Ausente',
    justificada: 'Justificada',
  }[estado] || 'Pendiente'
}
</script>

<template>
  <BarraLateral />
  <main class="pagina-asistencias">
    <header class="encabezado-asistencias">
      <div>
        <p class="sobretitulo">BIBLIOTECA · SEGUIMIENTO</p>
        <h1>Registro de asistencias</h1>
        <p>Revisá el resultado de cada tutoría programada.</p>
      </div>
      <a class="accion-asistencias" href="#CrearTutoria">Administrar tutorías</a>
    </header>

    <section class="resumen-asistencias" aria-label="Resumen de asistencias">
      <article><strong>{{ conteo.pendiente }}</strong><span>Pendientes</span></article>
      <article><strong>{{ conteo.presente }}</strong><span>Presentes</span></article>
      <article><strong>{{ conteo.ausente }}</strong><span>Ausentes</span></article>
      <article><strong>{{ conteo.justificada }}</strong><span>Justificadas</span></article>
    </section>

    <section class="panel-asistencias">
      <p v-if="error" class="mensaje-asistencias error-asistencias" role="alert">
        {{ error }}
      </p>
      <p v-else-if="asistencias.length === 0" class="vacio-asistencias">
        Todavía no hay tutorías. Las que programes aparecerán en este registro.
      </p>
      <div v-else class="lista-asistencias">
        <article
          v-for="tutoria in asistencias"
          :key="tutoria.id"
          class="tarjeta-asistencia"
        >
          <div class="detalle-asistencia">
            <h2>{{ tutoria.estudiante }}</h2>
            <p>{{ tutoria.curso }} · {{ tutoria.asignatura }}</p>
            <p class="fecha-asistencia">{{ fechaLegible(tutoria) }}</p>
          </div>
          <div class="resultado-asistencia">
            <span
              class="chip-asistencia"
              :class="`estado-${tutoria.asistencia_estado || 'pendiente'}`"
            >
              {{ nombreEstado(tutoria.asistencia_estado) }}
            </span>
            <small v-if="tutoria.motivo_inasistencia">
              {{ tutoria.asistencia_estado === 'justificada' ? 'Justificación' : 'Motivo' }}:
              {{ tutoria.motivo_inasistencia }}
            </small>
          </div>
        </article>
      </div>
    </section>
  </main>
  <PieBiblioteca />
</template>

<style scoped>
.pagina-asistencias {
  width: min(100% - 120px, 1120px);
  min-height: calc(100vh - 72px);
  margin-left: 120px;
  padding: 38px 28px 24px;
}

.encabezado-asistencias,
.panel-asistencias,
.resumen-asistencias article {
  border: 1px solid #e3ebe5;
  border-radius: 22px;
  background: #fff;
  box-shadow: var(--sombra);
}

.encabezado-asistencias {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 18px;
  padding: 30px 34px;
  background: linear-gradient(135deg, #fff, #eff7f0);
}

.sobretitulo {
  margin: 0 0 8px;
  color: #56836a;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.15em;
}

h1 {
  margin: 0;
  color: #203d2f;
  font-size: clamp(26px, 4vw, 36px);
  letter-spacing: -0.05em;
}

.encabezado-asistencias p:not(.sobretitulo) {
  margin: 9px 0 0;
  color: #728078;
  font-size: 13px;
}

.accion-asistencias {
  flex: 0 0 auto;
  padding: 11px 15px;
  border-radius: 11px;
  background: #34795a;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
}

.resumen-asistencias {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 18px;
}

.resumen-asistencias article {
  display: grid;
  gap: 5px;
  padding: 17px;
}

.resumen-asistencias strong {
  color: #34795a;
  font-size: 25px;
  letter-spacing: -0.04em;
}

.resumen-asistencias span,
.resultado-asistencia small {
  color: #728078;
  font-size: 11px;
}

.panel-asistencias {
  padding: 24px;
}

.lista-asistencias {
  display: grid;
  gap: 11px;
}

.tarjeta-asistencia {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 17px;
  border: 1px solid #e5ece6;
  border-radius: 15px;
  background: #fcfdfc;
}

.detalle-asistencia h2 {
  margin: 0 0 4px;
  color: #263b30;
  font-size: 14px;
}

.detalle-asistencia p {
  margin: 0;
  color: #728078;
  font-size: 11px;
  line-height: 1.6;
}

.fecha-asistencia {
  margin-top: 5px !important;
  color: #34795a !important;
  font-weight: 700;
}

.resultado-asistencia {
  display: grid;
  justify-items: end;
  gap: 7px;
}

.chip-asistencia {
  padding: 6px 10px;
  border-radius: 999px;
  background: #f5f2e9;
  color: #806b41;
  font-size: 10px;
  font-weight: 700;
}

.estado-presente {
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

.vacio-asistencias,
.mensaje-asistencias {
  padding: 22px;
  border: 1px dashed #dce6df;
  border-radius: 14px;
  color: #728078;
  font-size: 13px;
  text-align: center;
}

.error-asistencias {
  border-color: #f0d7d4;
  background: #fff6f5;
  color: #9a403b;
}

@media (max-width: 700px) {
  .pagina-asistencias {
    width: calc(100% - 78px);
    margin-left: 78px;
    padding: 23px 12px 18px;
  }

  .encabezado-asistencias {
    align-items: flex-start;
    flex-direction: column;
    padding: 24px 20px;
  }

  .resumen-asistencias {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .panel-asistencias {
    padding: 16px 12px;
  }

  .tarjeta-asistencia {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
  }

  .resultado-asistencia {
    justify-items: start;
  }
}
</style>
