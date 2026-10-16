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
      <a href="#biblioteca" @click.prevent class="opcion">
        <div class="icono-circular">↩</div>

        <span> Historial </span>
      </a>

      <a href="#observaciones" class="opcion">
        <div class="icono-circular">📋</div>

        <span> Observaciones </span>
      </a>

      <a href="#biblioteca" @click.prevent class="opcion">
        <div class="icono-circular">✓</div>

        <span> Registro de Asistencias </span>
      </a>
    </div>
  </main>
  <PieBiblioteca />
</template>
<style scoped src="../assets/contenido.css"></style>
<style scoped src="../assets/biblioteca.css"></style>
