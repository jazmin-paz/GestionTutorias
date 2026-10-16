<script setup>
import { ref } from 'vue'
const emit = defineEmits(['navegar'])
const email = ref('')
const mensaje = ref('')
</script>
<template>
  <section class="tarjeta acceso">
    <h1>Restablecer contraseña</h1>
    <p>Esta pantalla permite probar el formulario. Para enviar un enlace de recuperación hace falta conectar un servidor de autenticación.</p>
    <form @submit.prevent="mensaje = 'Correo validado. En esta demostración no se envían mensajes ni se cambia la contraseña.'">
      <label for="recuperar-email">Email</label>
      <input id="recuperar-email" v-model="email" type="email" required />
      <button type="submit">Restablecer contraseña</button>
    </form>
    <p role="status">{{ mensaje }}</p>
    <button class="enlace" @click="emit('navegar', 'inicio')">Volver a iniciar sesión</button>
  </section>
</template>
