<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import {
  cargarCursos,
  coloresDeMateria,
  escucharCursos,
  guardarCursos,
} from '../lib/datosLocales'

const props = defineProps({
  sesion: { type: Object, default: null },
})

const usuarioId = computed(() => props.sesion?.user?.id || 'cuenta-demo')
const cursos = ref([])
const cursoId = ref(1)
const cursoActual = computed(() =>
  cursos.value.find((curso) => curso.id === cursoId.value),
)
const materiaSeleccionadaId = ref(null)
const materiaActual = computed(
  () =>
    cursoActual.value?.materias.find(
      (materia) => materia.id === materiaSeleccionadaId.value,
    ) || null,
)
const mostrarCaja = ref(false)
const nombreMateria = ref('')
const entradaMateria = ref(null)
const error = ref('')
const nombresCursos = [
  'Primer año',
  'Segundo año',
  'Tercer año',
  'Cuarto año',
  'Quinto año',
  'Sexto año',
]
const colores = coloresDeMateria()

function cargarDatos() {
  try {
    cursos.value = cargarCursos(usuarioId.value)
    if (cursos.value.length === 0) {
      cursos.value = [
        { id: 1, nombre: 'Primer año', materias: [] },
        { id: 2, nombre: 'Segundo año', materias: [] },
        { id: 3, nombre: 'Tercer año', materias: [] },
      ]
    }
    if (!cursos.value.some((curso) => curso.id === cursoId.value)) {
      cursoId.value = cursos.value[0]?.id || 1
    }
  } catch (causa) {
    error.value = `No se pudieron cargar los cursos: ${causa instanceof Error ? causa.message : 'Error desconocido.'}`
  }
}

function persistirDatos(nuevosCursos) {
  try {
    guardarCursos(usuarioId.value, nuevosCursos)
    cursos.value = nuevosCursos
    error.value = ''
    return true
  } catch (causa) {
    error.value = `No se pudieron guardar los cursos: ${causa instanceof Error ? causa.message : 'Error desconocido.'}`
    return false
  }
}

watch(usuarioId, cargarDatos, { immediate: true })

let dejarDeEscuchar
onMounted(() => {
  dejarDeEscuchar = escucharCursos(usuarioId.value, cargarDatos)
})
onUnmounted(() => dejarDeEscuchar?.())

function agregarCurso() {
  const id = Math.max(0, ...cursos.value.map((curso) => curso.id)) + 1
  const nombre = nombresCursos[id - 1] || `Curso ${id}`
  persistirDatos([...cursos.value, { id, nombre, materias: [] }])
  cursoId.value = id
  materiaSeleccionadaId.value = null
}

async function mostrarCajaMateria() {
  mostrarCaja.value = true
  await nextTick()
  entradaMateria.value.focus()
}

function agregarMateria() {
  const nombre = nombreMateria.value.trim()
  if (!nombre || !cursoActual.value) return
  const materias = cursoActual.value.materias
  const id = Math.max(0, ...materias.map((materia) => materia.id)) + 1
  const nuevosCursos = cursos.value.map((curso) =>
    curso.id === cursoId.value
      ? {
          ...curso,
          materias: [
            ...curso.materias,
            {
              id,
              nombre,
              color: colores[(id - 1) % colores.length],
            },
          ],
        }
      : curso,
  )
  persistirDatos(nuevosCursos)
  nombreMateria.value = ''
}

function eliminarMateria(id) {
  const materia = cursoActual.value?.materias.find((item) => item.id === id)
  if (!materia) return
  if (
    !window.confirm(
      `¿Estás seguro de que querés eliminar "${materia.nombre}" de este curso?`,
    )
  ) {
    return
  }

  const nuevosCursos = cursos.value.map((curso) =>
    curso.id === cursoId.value
      ? {
          ...curso,
          materias: curso.materias.filter((item) => item.id !== id),
        }
      : curso,
  )
  if (persistirDatos(nuevosCursos) && materiaSeleccionadaId.value === id) {
    materiaSeleccionadaId.value = null
  }
}
</script>

<template>
  <section>
    <div class="encabezadoCursos">
      <div class="listaCursos">
        <button
          v-for="curso in cursos"
          :key="curso.id"
          class="curso"
          :class="{ activo: cursoId === curso.id }"
          :aria-pressed="cursoId === curso.id"
          @click="
            cursoId = curso.id;
            materiaSeleccionadaId = null
          "
        >
          Curso {{ curso.id }}
        </button>
      </div>
      <div class="acciones">
        <button class="agregarCurso" @click="agregarCurso">
          + Agregar curso
        </button>
        <button class="overview">Overview</button>
      </div>
    </div>
    <p v-if="error" class="error-cursos" role="alert">{{ error }}</p>
    <h2 class="titulo-curso">{{ cursoActual?.nombre || `Curso ${cursoId}` }}</h2>
    <slot
      :curso="cursoActual"
      :materia="materiaActual"
      :user-id="usuarioId"
    />
    <div class="materias">
      <div class="encabezadoMaterias">
        <h2>Materias</h2>
        <button class="botonMateria" @click="mostrarCajaMateria">
          + Agregar materia
        </button>
      </div>
      <form
        v-if="mostrarCaja"
        class="cajaMateria"
        @submit.prevent="agregarMateria"
      >
        <input
          ref="entradaMateria"
          v-model="nombreMateria"
          type="text"
          aria-label="Nombre de la materia"
          placeholder="Nombre de la materia"
          required
        />
        <button type="submit">Agregar</button>
      </form>
      <div class="listaMaterias">
        <button
          type="button"
          class="filtro-materia"
          :class="{ seleccionado: materiaSeleccionadaId === null }"
          :aria-pressed="materiaSeleccionadaId === null"
          @click="materiaSeleccionadaId = null"
        >
          Todas
        </button>
        <div
          v-for="materia in cursoActual.materias"
          :key="materia.id"
          class="materia"
          :class="{ 'materia-seleccionada': materiaSeleccionadaId === materia.id }"
          :style="{ backgroundColor: materia.color }"
        >
          <button
            type="button"
            class="seleccionar-materia"
            :aria-pressed="materiaSeleccionadaId === materia.id"
            @click="materiaSeleccionadaId = materia.id"
          >
            {{ materia.nombre }}
          </button>
          <button
            type="button"
            class="eliminar"
            :aria-label="`Eliminar ${materia.nombre}`"
            @click="eliminarMateria(materia.id)"
          >
            ×
          </button>
        </div>
        <p v-if="cursoActual?.materias.length === 0" class="sin-materias">
          Agregá materias para usarlas en el calendario y al programar tutorías.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.encabezadoCursos,
.listaCursos,
.acciones,
.encabezadoMaterias,
.cajaMateria,
.listaMaterias {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.encabezadoCursos,
.encabezadoMaterias {
  justify-content: space-between;
}

section {
  width: 100%;
}

.encabezadoCursos,
.materias {
  padding: 20px;
  border: 1px solid #e3ebe5;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 10px 28px rgba(27, 62, 43, 0.045);
}

.encabezadoCursos {
  padding: 8px 0 16px;
  border-bottom: 1px solid #e8eee9;
}

.curso,
.agregarCurso,
.overview,
.botonMateria,
.cajaMateria button {
  min-height: 40px;
  padding: 9px 15px;
  border: 1px solid #dfe8e1;
  border-radius: 11px;
  background: #fff;
  color: #4b5c52;
  font-size: 13px;
  font-weight: 650;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.curso:hover,
.overview:hover {
  border-color: #b9d7c3;
  background: #f2f8f3;
  color: #285d40;
}

.curso.activo {
  border-color: #34795a;
  background: #34795a;
  color: white;
  font-weight: 750;
  box-shadow: 0 6px 14px rgba(52, 121, 90, 0.18);
}

.agregarCurso,
.botonMateria,
.cajaMateria button {
  border-color: #34795a;
  background: #34795a;
  color: #fff;
}

.agregarCurso:hover,
.botonMateria:hover,
.cajaMateria button:hover {
  transform: translateY(-1px);
  background: #285f44;
}

.overview {
  background: #f4f7f4;
  color: #728078;
}

.contenido section > h2 {
  margin: 21px 0 15px;
  color: #46564d;
  font-size: 16px;
  font-weight: 700;
}

.materia {
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  gap: 7px;
  padding: 12px 14px;
  border: 1px solid rgba(35, 53, 45, 0.06);
  border-radius: 13px;
  color: #31453a;
  font-size: 14px;
  font-weight: 650;
  box-shadow: 0 5px 14px rgba(35, 53, 45, 0.045);
}

.seleccionar-materia {
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font-size: inherit;
  font-weight: inherit;
}

.materia-seleccionada {
  outline: 2px solid #34795a;
  outline-offset: 2px;
}

.filtro-materia {
  min-height: 39px;
  padding: 9px 14px;
  border: 1px solid #dfe8e1;
  border-radius: 11px;
  background: #fff;
  color: #4b5c52;
  font-size: 13px;
  font-weight: 650;
}

.filtro-materia.seleccionado {
  border-color: #34795a;
  background: #e8f2eb;
  color: #285d40;
}

.sin-materias {
  width: 100%;
  margin: 0;
  padding: 7px 0;
  color: #89958e;
  font-size: 12px;
}

.error-cursos {
  margin: 12px 0;
  color: #99453e;
  font-size: 13px;
}

.encabezadoMaterias {
  margin-top: 21px;
}

.encabezadoMaterias h2 {
  margin: 0;
  color: #203d2f;
  font-size: 19px;
  font-weight: 750;
}

.cajaMateria input {
  min-height: 40px;
  padding: 9px 13px;
  border: 1px solid #dce6df;
  border-radius: 11px;
  outline: none;
}

.cajaMateria input:focus {
  border-color: #69a985;
  box-shadow: 0 0 0 4px rgba(74, 154, 112, 0.12);
}

.cajaMateria,
.listaMaterias {
  margin-top: 16px;
}

.eliminar {
  width: 25px;
  height: 25px;
  border: 0;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.68);
  color: #4c5e52;
  font-size: 18px;
  line-height: 1;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.eliminar:hover {
  background: #fff;
  color: #a53d3d;
}

@media (max-width: 520px) {
  .encabezadoCursos {
    align-items: flex-start;
  }

  .acciones {
    width: 100%;
  }

  .agregarCurso,
  .overview {
    flex: 1 1 auto;
  }

  .materias {
    padding: 16px 13px;
  }

  .cajaMateria input {
    flex: 1 1 100%;
  }
}
</style>
