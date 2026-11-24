<script setup>
import BarraLateral from '../components/BarraLateral.vue'
import PieBiblioteca from '../components/PieBiblioteca.vue'
</script>
<template>
  <BarraLateral />
  <main class="main-content">
    <div class="encabezado">
      <h1 class="title">Biblioteca</h1>

      <p class="subtitulo">
        Seleccioná una sección para consultar la información.
      </p>
    </div>

    <div class="opciones">
      <a href="#historial" class="opcion">
        <div class="icono-circular" aria-hidden="true">
          <svg viewBox="0 0 32 32" width="32" height="32" fill="none">
            <path d="M8 11.5A11 11 0 1 1 6.3 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            <path d="M8 5v7h7M16 10v7l4.5 2.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <span>Historial</span>
      </a>

      <a href="#observaciones" class="opcion">
        <div class="icono-circular" aria-hidden="true">
          <svg viewBox="0 0 32 32" width="32" height="32" fill="none">
            <path d="M11 7h10a2 2 0 0 1 2 2v17H9V9a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
            <path d="M13 7.5V5h6v2.5M13 14h6M13 18h6M13 22h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <span>Observaciones</span>
      </a>

      <a href="#asistencias" class="opcion">
        <div class="icono-circular" aria-hidden="true">
          <svg viewBox="0 0 32 32" width="32" height="32" fill="none">
            <path d="M8 6.5h16v20H8zM11 3.5h13v3M5 9.5v17h3" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
            <path d="m11.5 17 3 3 6-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <span>Registro de Asistencias</span>
      </a>
    </div>
  </main>
  <PieBiblioteca />
</template>
<style scoped src="../assets/contenido.css"></style>
<style scoped src="../assets/biblioteca.css"></style>
