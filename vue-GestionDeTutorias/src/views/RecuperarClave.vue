<script setup>
import { ref } from 'vue'

const email = ref('')
const mensaje = ref('')

function restablecer() {
  // No existe todavía un servicio de envío de correos.
  mensaje.value = 'El envío de recuperación todavía no está disponible.'
}
</script>

<template>
  <section class="pantalla-acceso">
    <div class="cuadro">
      <h1>RESTABLECER CONTRASEÑA</h1>
      <p class="explicacion">
        Ingresá tu email. Te enviaremos un mensaje para restablecer tu
        contraseña.
      </p>
      <form @submit.prevent="restablecer">
        <label for="email">EMAIL</label>
        <input id="email" v-model="email" type="email" required />
        <button type="submit">RESTABLECER CONTRASEÑA</button>
      </form>
      <p id="mensaje" role="status">{{ mensaje }}</p>
      <div class="separador">───── también podés optar por ─────</div>
      <a class="iniciar" href="#inicio">INICIAR SESIÓN</a>
    </div>
  </section>
</template>

<style scoped src="../assets/recuperar.css"></style>
