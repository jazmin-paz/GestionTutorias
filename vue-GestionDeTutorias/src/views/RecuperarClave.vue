<script setup>
import { ref } from 'vue'

const email = ref('')
const mensaje = ref('')

function restablecer() {
  mensaje.value = 'La recuperación por correo necesita un servicio de envío.'
}
</script>

<template>
  <section class="pantalla-acceso">
    <div class="cuadro">
      <div class="marca" aria-label="ProA La Falda">
        <span class="marca-simbolo" aria-hidden="true">
          <svg viewBox="0 0 32 32" width="30" height="30" fill="none">
            <path
              d="M7 23.5V8.5h8.2a5.2 5.2 0 1 1 0 10.4H11"
              stroke="currentColor"
              stroke-width="2.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M18 18.5h6.5M21.25 15.25v6.5M11 23.5v-6"
              stroke="currentColor"
              stroke-width="2.4"
              stroke-linecap="round"
            />
          </svg>
        </span>
        <span>ProA · La Falda</span>
      </div>
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
