<script setup>
import { computed, ref } from 'vue'
const cursos = ref([{ id: 1, nombre: 'Curso 1', materias: [] }, { id: 2, nombre: 'Curso 2', materias: [] }, { id: 3, nombre: 'Curso 3', materias: [] }])
const cursoId = ref(1)
const actual = computed(() => cursos.value.find(c => c.id === cursoId.value))
const mostrarCaja = ref(false)
const nombreMateria = ref('')
const colores = ['#b9d9c5', '#f0dfa5', '#edc3c8', '#bdd8e9', '#d9c5e8']
let siguienteMateria = 1
const hoy = new Date()
const mes = ref(new Date(hoy.getFullYear(), hoy.getMonth(), 1))
const tituloMes = computed(() => mes.value.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }))
const dias = computed(() => {
  const inicio = (mes.value.getDay() + 6) % 7
  const cantidad = new Date(mes.value.getFullYear(), mes.value.getMonth() + 1, 0).getDate()
  return [...Array(inicio).fill(null), ...Array.from({ length: cantidad }, (_, i) => i + 1)]
})
function cambiarMes(delta) { mes.value = new Date(mes.value.getFullYear(), mes.value.getMonth() + delta, 1) }
function agregarCurso() {
  const id = Math.max(...cursos.value.map(c => c.id)) + 1
  cursos.value.push({ id, nombre: `Curso ${id}`, materias: [] })
  cursoId.value = id
}
function agregarMateria() {
  if (!nombreMateria.value.trim()) return
  actual.value.materias.push({ id: siguienteMateria++, nombre: nombreMateria.value.trim(), color: colores[actual.value.materias.length % colores.length] })
  nombreMateria.value = ''
}
</script>
<template>
  <section class="panel">
    <h1>Mis Tutorías</h1>
    <p>No hay tutorías programadas. La programación y asistencia todavía están en desarrollo.</p>
    <div class="fila cursos" aria-label="Cursos">
      <button v-for="curso in cursos" :key="curso.id" :class="{ activo: cursoId === curso.id }" :aria-pressed="cursoId === curso.id" @click="cursoId = curso.id">{{ curso.nombre }}</button>
      <button class="secundario" @click="agregarCurso">+ Agregar curso</button>
    </div>
    <h2>{{ actual.nombre }}</h2>
    <div class="fila mes">
      <button aria-label="Mes anterior" @click="cambiarMes(-1)">←</button><h2>{{ tituloMes }}</h2><button aria-label="Mes siguiente" @click="cambiarMes(1)">→</button>
    </div>
    <div class="calendario" aria-label="Calendario mensual">
      <strong v-for="dia in ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']" :key="dia">{{ dia }}</strong>
      <div v-for="(dia, indice) in dias" :key="indice" class="dia" :class="{ hoy: dia === hoy.getDate() && mes.getMonth() === hoy.getMonth() && mes.getFullYear() === hoy.getFullYear() }">{{ dia }}</div>
    </div>
    <div class="fila"><h2>Materias</h2><button @click="mostrarCaja = !mostrarCaja">+ Agregar materia</button></div>
    <form v-if="mostrarCaja" class="fila" @submit.prevent="agregarMateria">
      <label for="materia">Nombre de la materia</label><input id="materia" v-model="nombreMateria" required /><button type="submit">Agregar</button>
    </form>
    <div class="materias">
      <p v-if="!actual.materias.length">Este curso todavía no tiene materias.</p>
      <div v-for="materia in actual.materias" :key="materia.id" class="materia" :style="{ background: materia.color }">
        <span>{{ materia.nombre }}</span><button class="enlace" :aria-label="`Eliminar ${materia.nombre}`" @click="actual.materias = actual.materias.filter(m => m.id !== materia.id)">×</button>
      </div>
    </div>
  </section>
</template>
<style scoped>
.panel { max-width: 1000px; margin: auto; }
.fila { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin: 20px 0; }
.mes { justify-content: space-between; }
.mes h2 { text-transform: capitalize; }
.calendario { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 4px; }
.calendario strong { padding: 8px; text-align: center; }
.dia { min-height: 70px; padding: 10px; background: #f7fcf6; border-radius: 8px; }
.hoy { outline: 2px solid #347c59; font-weight: bold; }
.activo { background: #174c33; }
.materias { display: flex; flex-wrap: wrap; gap: 12px; }
.materia { padding: 12px 18px; border-radius: 12px; display: flex; gap: 20px; align-items: center; }
@media(max-width: 600px) { .dia { min-height: 48px; padding: 6px; } .calendario { gap: 2px; } }
</style>
