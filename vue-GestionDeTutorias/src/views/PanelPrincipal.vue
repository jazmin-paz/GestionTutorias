<script setup>
import BarraLateral from '../components/BarraLateral.vue'
import NotificacionesTutorias from '../components/NotificacionesTutorias.vue'
import CursosMaterias from '../components/CursosMaterias.vue'
import CalendarioTutorias from '../components/CalendarioTutorias.vue'
</script>

<template>
  <BarraLateral />
  <main class="contenido">
    <NotificacionesTutorias />
    <h1>Mis Tutorías</h1>
    <CursosMaterias><CalendarioTutorias /></CursosMaterias>
  </main>
</template>

<style scoped>
.contenido {
  margin-left: 120px;
  padding: 32px;
}
h1 {
  color: #347c59;
}
@media (max-width: 700px) {
  .contenido {
    margin-left: 80px;
    padding: 20px 12px;
  }
}
</style>
