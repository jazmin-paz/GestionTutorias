<script setup>
import BarraLateral from '../components/BarraLateral.vue'
import NotificacionesTutorias from '../components/NotificacionesTutorias.vue'
import CursosMaterias from '../components/CursosMaterias.vue'
import CalendarioTutorias from '../components/CalendarioTutorias.vue'

defineProps({
  sesion: { type: Object, default: null },
})
</script>

<template>
  <BarraLateral />
  <main class="contenido">
    <NotificacionesTutorias />
    <h1>Mis Tutorías</h1>
    <CursosMaterias :sesion="sesion">
      <template #default="{ curso, materia, userId }">
        <CalendarioTutorias
          :curso="curso"
          :materia="materia"
          :user-id="userId"
        />
      </template>
    </CursosMaterias>
  </main>
</template>

<style scoped>
.contenido {
  margin-left: 120px;
  min-height: 100vh;
  padding: 36px clamp(22px, 4vw, 56px) 56px;
  max-width: 1560px;
}

.contenido > h1 {
  margin: 34px 0 24px;
  color: #203d2f;
  font-size: clamp(30px, 3.5vw, 40px);
  font-weight: 750;
  letter-spacing: -0.055em;
}

@media (max-width: 700px) {
  .contenido {
    margin-left: 80px;
    padding: 18px 14px 36px;
  }

  .contenido > h1 {
    margin: 26px 0 18px;
  }
}
</style>
