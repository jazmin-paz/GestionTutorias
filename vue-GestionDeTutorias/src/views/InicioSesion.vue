<script setup>
import { ref } from 'vue'

defineProps({
  mensaje: { type: String, default: '' },
})
const emit = defineEmits(['ingresar'])
const nombre = ref('')
const contrasena = ref('')

function ingresar() {
  emit('ingresar', {
    nombre: nombre.value.trim(),
    contrasena: contrasena.value,
  })
  contrasena.value = ''
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
      <h1>INICIO DE SESIÓN</h1>
      <form @submit.prevent="ingresar">
        <label for="nombre">Nombre de la cuenta o correo</label>
        <input
          id="nombre"
          v-model="nombre"
          type="text"
          autocomplete="username"
          required
        />
        <label for="contrasena">Contraseña</label>
        <input
          id="contrasena"
          v-model="contrasena"
          type="password"
          autocomplete="current-password"
          required
        />
        <a class="restablecer" href="#recuperar">Restablecer contraseña</a>
        <button type="submit">ACCEDER</button>
      </form>
      <p id="mensaje" role="status">{{ mensaje }}</p>
      <p>¿No tenés una cuenta? <a href="#registro">REGISTRATE</a></p>
    </div>
  </section>
</template>

<style scoped src="../assets/inicio.css"></style>
