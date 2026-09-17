<script setup>
import { ref } from 'vue'
import Observaciones from './views/observaciones.vue'

const paginaActual = ref('biblioteca')
</script>

<template>

  <!-- BIBLIOTECA -->
  <template v-if="paginaActual === 'biblioteca'">

    <aside class="sidebar">

      <a href="#" class="sidebar-icon">
        🏠
      </a>

      <a href="#" class="sidebar-icon biblioteca-icon">
        📚
      </a>

      <a href="#" class="sidebar-icon perfil-icon">
        👤
      </a>

    </aside>


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

        <a href="#" class="opcion">

          <div class="icono-circular">
            ↩
          </div>

          <span>
            Historial
          </span>

        </a>


        <!-- OBSERVACIONES -->

        <a
          href="#"
          class="opcion"
          @click.prevent="paginaActual = 'observaciones'"
        >

          <div class="icono-circular">
            📋
          </div>

          <span>
            Observaciones
          </span>

        </a>


        <a href="#" class="opcion">

          <div class="icono-circular">
            ✓
          </div>

          <span>
            Registro de Asistencias
          </span>

        </a>

      </div>

    </main>


    <footer class="footer">

      <p>
        © 2026 Biblioteca · Escuela ProA La Falda
      </p>

    </footer>

  </template>


  <!-- OBSERVACIONES -->

  <Observaciones
    v-else-if="paginaActual === 'observaciones'"
    @volver="paginaActual = 'biblioteca'"
  />

</template>