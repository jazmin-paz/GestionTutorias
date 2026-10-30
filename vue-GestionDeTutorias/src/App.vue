
<script setup>
import { ref } from 'vue'
import Observaciones from './views/observaciones.vue'
import Perfil from './views/perfil.vue'
import Asistencia from './views/asistencia.vue'
import Historial from './views/historial.vue'

const paginaActual = ref('biblioteca')
</script>

<template>

  <!-- SIDEBAR GENERAL -->
  <aside class="sidebar">

    <a
      href="#"
      class="sidebar-icon"
      @click.prevent="paginaActual = 'biblioteca'"
    >
      🏠
    </a>

    <a
      href="#"
      class="sidebar-icon biblioteca-icon"
      @click.prevent="paginaActual = 'biblioteca'"
    >
      📚
    </a>

    <a
      href="#"
      class="sidebar-icon perfil-icon"
      @click.prevent="paginaActual = 'perfil'"
    >
      👤
    </a>

  </aside>

  <!-- BIBLIOTECA -->
  <template v-if="paginaActual === 'biblioteca'">

    <main class="main-content">

      <div class="encabezado">

        <h1 class="title">
          Biblioteca
        </h1>

        <p class="subtitulo">
          Seleccioná una sección para consultar la información.
        </p>

      </div>

      <div class="opciones">

        <a
          href="#"
          class="opcion"
          @click.prevent="paginaActual = 'historial'"
        >
          <div class="icono-circular">↩</div>
          <span>Historial</span>
        </a>

        <a
          href="#"
          class="opcion"
          @click.prevent="paginaActual = 'observaciones'"
        >
          <div class="icono-circular">📋</div>
          <span>Observaciones</span>
        </a>

        <a
          href="#"
          class="opcion"
          @click.prevent="paginaActual = 'asistencia'"
        >
          <div class="icono-circular">✓</div>
          <span>Registro de Asistencias</span>
        </a>

      </div>

    </main>

    <footer class="footer">
      <p>
        © 2026 Biblioteca · Escuela ProA La Falda
      </p>
    </footer>

  </template>

  <Observaciones
    v-else-if="paginaActual === 'observaciones'"
    @volver="paginaActual = 'biblioteca'"
  />

  <Perfil
    v-else-if="paginaActual === 'perfil'"
  />

  <Asistencia 
    v-else-if="paginaActual === 'asistencia'" 
  />

  <Historial 
    v-else-if="paginaActual === 'historial'" 
  />

</template>