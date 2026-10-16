<script setup>
import { ref } from 'vue'
const emit = defineEmits(['ingresar', 'navegar', 'demo'])
const email = ref('')
const contrasena = ref('')
function ingresar() { emit('ingresar', { email: email.value, contrasena: contrasena.value }); contrasena.value = '' }
</script>
<template>
  <section class="tarjeta acceso">
    <h1>Inicio de sesión</h1>
    <form @submit.prevent="ingresar">
      <label for="acceso-email">Correo electrónico</label>
      <input id="acceso-email" v-model="email" type="email" autocomplete="username" required />
      <label for="acceso-clave">Contraseña</label>
      <input id="acceso-clave" v-model="contrasena" type="password" autocomplete="current-password" required />
      <button type="submit">Acceder</button>
    </form>
    <button class="enlace" @click="emit('navegar', 'recuperar')">Restablecer contraseña</button>
    <p>¿No tenés una cuenta? <button class="enlace" @click="emit('navegar', 'registro')">Registrate</button></p>
    <button class="secundario" @click="emit('demo')">Explorar demostración</button>
  </section>
</template>
