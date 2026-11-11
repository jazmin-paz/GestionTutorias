<script setup>
const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
const dias = [
  3,
  4,
  5,
  6,
  7,
  10,
  11,
  12,
  13,
  14,
  17,
  18,
  19,
  20,
  21,
  24,
  25,
  26,
  27,
  28,
  31,
  null,
  null,
  null,
  null,
]
</script>

<template>
  <div class="calendario" aria-label="Calendario de tutorías">
    <div v-for="dia in diasSemana" :key="dia" class="nombreDia">{{ dia }}</div>
    <div
      v-for="(dia, indice) in dias"
      :key="indice"
      class="dia"
      :class="{ vacio: dia === null }"
    >
      <span>{{ dia }}</span>
    </div>
  </div>
</template>

<style scoped>
.calendario {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 4px;
}
.nombreDia {
  overflow-wrap: anywhere;
  text-align: center;
}
.dia {
  min-height: 70px;
  padding: 10px;
  background: #f7fcf6;
  border-radius: 8px;
}
</style>
