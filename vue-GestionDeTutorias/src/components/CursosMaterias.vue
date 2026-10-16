<script setup>
import { computed, nextTick, ref } from 'vue'

const cursos = ref([
  { id: 1, materias: [] },
  { id: 2, materias: [] },
  { id: 3, materias: [] },
])
const cursoId = ref(1)
const cursoActual = computed(() =>
  cursos.value.find((curso) => curso.id === cursoId.value),
)
const mostrarCaja = ref(false)
const nombreMateria = ref('')
const entradaMateria = ref(null)
const colores = ['#b9d9c5', '#f0dfa5', '#edc3c8', '#bdd8e9', '#d9c5e8']
let siguienteMateria = 1
let colorActual = 0

function agregarCurso() {
  cursos.value.push({ id: cursos.value.length + 1, materias: [] })
}

async function mostrarCajaMateria() {
  mostrarCaja.value = true
  await nextTick()
  entradaMateria.value.focus()
}

function agregarMateria() {
  const nombre = nombreMateria.value.trim()
  if (!nombre) return
  cursoActual.value.materias.push({
    id: siguienteMateria++,
    nombre,
    color: colores[colorActual],
  })
  colorActual = (colorActual + 1) % colores.length
  nombreMateria.value = ''
}

function eliminarMateria(id) {
  cursoActual.value.materias = cursoActual.value.materias.filter(
    (materia) => materia.id !== id,
  )
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
          @click="cursoId = curso.id"
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
    <h2>Curso {{ cursoId }}</h2>
    <slot />
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
        <div
          v-for="materia in cursoActual.materias"
          :key="materia.id"
          class="materia"
          :style="{ backgroundColor: materia.color }"
        >
          <span>{{ materia.nombre }}</span>
          <button
            class="eliminar"
            :aria-label="`Eliminar ${materia.nombre}`"
            @click="eliminarMateria(materia.id)"
          >
            ×
          </button>
        </div>
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
.activo {
  font-weight: bold;
}
.materia {
  padding: 12px 18px;
  border-radius: 12px;
}
.cajaMateria,
.listaMaterias {
  margin-top: 16px;
}
</style>
