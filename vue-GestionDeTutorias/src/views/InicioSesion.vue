<script setup>
import { ref } from 'vue'

defineProps({ mensaje: { type: String, default: '' } })
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
      <h1>INICIO DE SESIÓN</h1>
      <form @submit.prevent="ingresar">
        <label for="nombre">Nombre de la cuenta</label>
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
