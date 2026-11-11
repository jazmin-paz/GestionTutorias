<script setup>
import { ref, reactive } from 'vue'
import BarraLateral from '../components/BarraLateral.vue'
import PieBiblioteca from '../components/PieBiblioteca.vue'
const mensaje = ref('')
const ficha = reactive({
  fecha: '',
  curso: '',
  asignatura: '',
  estudiante: '',
  contenidos: '',
  motivos: '',
})
let guardada = null
function guardar() {
  if (!ficha.fecha || !ficha.curso || !ficha.asignatura || !ficha.estudiante) {
    mensaje.value = 'Completá fecha, curso, asignatura y estudiante.'
    return
  }
  guardada = { ...ficha }
  mensaje.value = 'Observación guardada.'
}
function cancelar() {
  Object.assign(
    ficha,
    guardada || {
      fecha: '',
      curso: '',
      asignatura: '',
      estudiante: '',
      contenidos: '',
      motivos: '',
    },
  )
  mensaje.value = 'Cambios sin guardar descartados.'
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
      <h1 class="observaciones-titulo">Observaciones</h1>

      <div class="fila-datos">
        <div class="campo-observacion">
          <label for="fecha"> Fecha </label>

          <input type="date" id="fecha" v-model="ficha.fecha" />
        </div>

        <div class="campo-observacion">
          <label for="curso"> Curso </label>

          <select id="curso" v-model="ficha.curso">
            <option value="">Seleccionar curso</option>

            <option>Primer año</option>

            <option>Segundo año</option>

            <option>Tercer año</option>

            <option>Cuarto año</option>

            <option>Quinto año</option>

            <option>Sexto año</option>
          </select>
        </div>

        <div class="campo-observacion">
          <label for="asignatura"> Asignatura </label>

          <select id="asignatura" v-model="ficha.asignatura">
            <option value="">Seleccionar asignatura</option>

            <option>Matemática</option>

            <option>Lengua</option>

            <option>Historia</option>

            <option>Geografía</option>

            <option>Inglés</option>

            <option>Biología</option>

            <option>Física</option>

            <option>Química</option>

            <option>Informática</option>

            <option>Educación Física</option>
          </select>
        </div>
      </div>

      <div class="campo-observacion estudiante-observacion">
        <label for="estudiante"> Estudiante </label>

        <select id="estudiante" v-model="ficha.estudiante">
          <option value="">Seleccionar estudiante</option>

          <option>Mateo González</option>

          <option>Valentina Rodríguez</option>

          <option>Santiago Fernández</option>

          <option>Camila Martínez</option>

          <option>Tomás López</option>

          <option>Martina Sánchez</option>

          <option>Lucas Romero</option>

          <option>Agustina Torres</option>

          <option>Benjamín Herrera</option>

          <option>Julieta Castro</option>

          <option>Franco Medina</option>

          <option>Sofía Navarro</option>

          <option>Juan Cruz Molina</option>

          <option>Emilia Vargas</option>

          <option>Nicolás Pereyra</option>
        </select>
      </div>

      <div class="fila-textareas">
        <div class="campo-observacion">
          <label for="contenidos"> Contenidos a trabajar </label>

          <textarea
            id="contenidos"
            v-model="ficha.contenidos"
            placeholder="Escriba los contenidos trabajados durante la tutoría..."
          ></textarea>
        </div>

        <div class="campo-observacion">
          <label for="motivos"> Motivos de la tutoría </label>

          <textarea
            id="motivos"
            v-model="ficha.motivos"
            placeholder="Escriba el motivo de la tutoría..."
          ></textarea>
        </div>
      </div>

      <p role="status">{{ mensaje }}</p>
      <div class="botones-observacion">
        <button class="boton-observacion boton-editar" @click="guardar">
          Editar
        </button>

        <button
          class="boton-observacion boton-reprogramar"
          @click="mensaje = 'Elegí otra fecha y pulsá Editar.'"
        >
          Reprogramar
        </button>

        <button class="boton-observacion boton-cancelar" @click="cancelar">
          Cancelar
        </button>

        <button
          class="boton-observacion boton-reenviar"
          @click="
            mensaje = 'El envío de correos requiere conectar un servidor.'
          "
        >
          Reenviar
        </button>

        <button class="boton-observacion boton-imprimir" @click="imprimir">
          Imprimir
        </button>

        <button class="boton-observacion boton-volver" @click="volver">
          Volver
        </button>
      </div>
    </div>
  </main>

  <PieBiblioteca />
</template>

<style scoped src="../assets/contenido.css"></style>
<style scoped src="../assets/observaciones.css"></style>
