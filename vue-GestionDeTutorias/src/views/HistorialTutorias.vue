<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import BarraLateral from '../components/BarraLateral.vue'
import PieBiblioteca from '../components/PieBiblioteca.vue'
import {
  cargarTutorias,
  escucharTutorias,
} from '../lib/datosLocales'

const props = defineProps({
  sesion: { type: Object, default: null },
})

const usuarioId = computed(() => props.sesion?.user?.id || 'cuenta-demo')
const tutorias = ref([])
const error = ref('')
const cursoFiltro = ref('')
const materiaFiltro = ref('')
const orden = ref('recientes')

function cargarDatos() {
  try {
    tutorias.value = cargarTutorias(usuarioId.value)
    error.value = ''
  } catch (causa) {
    error.value = `No se pudo cargar el historial: ${causa instanceof Error ? causa.message : 'Error desconocido.'}`
  }
}

watch(usuarioId, cargarDatos, { immediate: true })

let dejarDeEscuchar
onMounted(() => {
  dejarDeEscuchar = escucharTutorias(usuarioId.value, cargarDatos)
})
onUnmounted(() => dejarDeEscuchar?.())

const cursos = computed(() =>
  [...new Set(tutorias.value.map((tutoria) => tutoria.curso).filter(Boolean))].sort(),
)
const materias = computed(() =>
  [
    ...new Set(
      tutorias.value
        .filter((tutoria) => !cursoFiltro.value || tutoria.curso === cursoFiltro.value)
        .map((tutoria) => tutoria.asignatura)
        .filter(Boolean),
    ),
  ].sort(),
)
const historial = computed(() => {
  const coincidencias = tutorias.value.filter(
    (tutoria) =>
      (!cursoFiltro.value || tutoria.curso === cursoFiltro.value) &&
      (!materiaFiltro.value || tutoria.asignatura === materiaFiltro.value),
  )

  if (orden.value === 'sin_orden') return coincidencias
  const direccion = orden.value === 'antiguas' ? 1 : -1
  return [...coincidencias].sort(
    (a, b) => direccion * (fechaHora(a).getTime() - fechaHora(b).getTime()),
  )
})

watch(cursoFiltro, () => {
  materiaFiltro.value = ''
})

function fechaHora(tutoria) {
  return new Date(`${tutoria.fecha_tutoria}T${tutoria.hora_tutoria}`)
}

function fechaLegible(tutoria) {
  const fecha = fechaHora(tutoria)
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
  <main class="pagina-registros">
    <header class="encabezado-registros">
      <div>
        <p class="sobretitulo">BIBLIOTECA · REGISTROS</p>
        <h1>Historial de tutorías</h1>
        <p>Consultá todas las tutorías y filtrá por curso o materia.</p>
      </div>
      <a class="accion-registros" href="#CrearTutoria">Crear tutoría</a>
    </header>

    <section class="panel-registros">
      <div class="controles-registros">
        <label>
          Curso
          <select v-model="cursoFiltro" aria-label="Filtrar por curso">
            <option value="">Todos los cursos</option>
            <option v-for="curso in cursos" :key="curso" :value="curso">
              {{ curso }}
            </option>
          </select>
        </label>
        <label>
          Materia
          <select
            v-model="materiaFiltro"
            aria-label="Filtrar por materia"
            :disabled="materias.length === 0"
          >
            <option value="">Todas las materias</option>
            <option v-for="materia in materias" :key="materia" :value="materia">
              {{ materia }}
            </option>
          </select>
        </label>
        <label>
          Orden
          <select v-model="orden" aria-label="Ordenar historial">
            <option value="recientes">Más recientes primero</option>
            <option value="antiguas">Más antiguas primero</option>
            <option value="sin_orden">Sin orden específico</option>
          </select>
        </label>
      </div>

      <p v-if="error" class="mensaje-registros error-registros" role="alert">
        {{ error }}
      </p>
      <p v-else-if="historial.length === 0" class="vacio-registros">
        No hay tutorías que coincidan con esos filtros.
      </p>
      <div v-else class="lista-registros">
        <article
          v-for="tutoria in historial"
          :key="tutoria.id"
          class="tarjeta-registro"
        >
          <div class="fecha-registro">
            <span class="marca-calendario" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="21" height="21" fill="none">
                <rect x="3.5" y="5" width="17" height="16" rx="3" stroke="currentColor" stroke-width="1.8" />
                <path d="M7.5 3v4M16.5 3v4M3.5 9.5h17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              </svg>
            </span>
            <span>{{ fechaLegible(tutoria) }}</span>
          </div>
          <div class="contenido-registro">
            <h2>{{ tutoria.estudiante }}</h2>
            <p>{{ tutoria.curso }} · {{ tutoria.asignatura }}</p>
            <p v-if="tutoria.contenidos">{{ tutoria.contenidos }}</p>
          </div>
          <div class="estado-registro">
            <span class="chip-estado" :class="`estado-${tutoria.asistencia_estado || 'pendiente'}`">
              {{ nombreEstado(tutoria.asistencia_estado) }}
            </span>
            <small v-if="tutoria.motivo_inasistencia">
              Motivo: {{ tutoria.motivo_inasistencia }}
            </small>
          </div>
        </article>
      </div>
      <p class="conteo-registros">
        {{ historial.length }} {{ historial.length === 1 ? 'tutoría' : 'tutorías' }}
      </p>
    </section>
  </main>
  <PieBiblioteca />
</template>

<style scoped>
.pagina-registros {
  width: min(100% - 120px, 1120px);
  min-height: calc(100vh - 72px);
  margin-left: 120px;
  padding: 38px 28px 24px;
}

.encabezado-registros,
.panel-registros {
  border: 1px solid #e3ebe5;
  border-radius: 24px;
  background: #fff;
  box-shadow: var(--sombra);
}

.encabezado-registros {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
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

.encabezado-registros p:not(.sobretitulo) {
  margin: 9px 0 0;
  color: #728078;
  font-size: 13px;
}

.accion-registros {
  flex: 0 0 auto;
  padding: 11px 15px;
  border-radius: 11px;
  background: #34795a;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
}

.panel-registros {
  padding: 25px;
}

.controles-registros {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 20px;
}

.controles-registros label {
  display: grid;
  gap: 7px;
  color: #46564d;
  font-size: 12px;
  font-weight: 700;
}

.controles-registros select {
  min-width: 0;
  min-height: 41px;
  padding: 9px 11px;
  border: 1px solid #dce6df;
  border-radius: 10px;
  background: #fbfdfb;
  color: #263b30;
  font: inherit;
  font-size: 12px;
}

.lista-registros {
  display: grid;
  gap: 11px;
}

.tarjeta-registro {
  display: grid;
  grid-template-columns: minmax(180px, 0.85fr) minmax(180px, 1fr) auto;
  align-items: center;
  gap: 18px;
  padding: 17px;
  border: 1px solid #e5ece6;
  border-radius: 15px;
  background: #fcfdfc;
}

.fecha-registro {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #34795a;
  font-size: 12px;
  font-weight: 700;
}

.marca-calendario {
  display: grid;
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: 11px;
  background: #e8f2eb;
}

.contenido-registro h2 {
  margin: 0 0 4px;
  color: #263b30;
  font-size: 14px;
}

.contenido-registro p,
.estado-registro small {
  margin: 0;
  color: #728078;
  font-size: 11px;
  line-height: 1.5;
}

.estado-registro {
  display: grid;
  justify-items: start;
  gap: 6px;
}

.chip-estado {
  padding: 6px 9px;
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

.vacio-registros,
.mensaje-registros {
  padding: 22px;
  border: 1px dashed #dce6df;
  border-radius: 14px;
  color: #728078;
  font-size: 13px;
  text-align: center;
}

.error-registros {
  border-color: #f0d7d4;
  background: #fff6f5;
  color: #9a403b;
}

.conteo-registros {
  margin: 15px 0 0;
  color: #728078;
  font-size: 11px;
}

@media (max-width: 850px) {
  .tarjeta-registro {
    grid-template-columns: 1fr 1fr;
  }

  .estado-registro {
    grid-column: 2;
  }
}

@media (max-width: 700px) {
  .pagina-registros {
    width: calc(100% - 78px);
    margin-left: 78px;
    padding: 23px 12px 18px;
  }

  .encabezado-registros {
    align-items: flex-start;
    flex-direction: column;
    padding: 24px 20px;
  }

  .panel-registros {
    padding: 18px 14px;
  }

  .controles-registros {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .tarjeta-registro {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .estado-registro {
    grid-column: auto;
  }
}
</style>
