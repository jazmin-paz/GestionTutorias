<template>
  <main class="app">
    <formularioRegistro @registrar-cuenta="registrarCuenta" />

    <p v-if="ultimoRegistro" class="confirmacion">
      Cuenta creada para {{ ultimoRegistro.nombre }}
      ({{ ultimoRegistro.rol }})
    </p>
  </main>
</template>

<script>
import formularioRegistro from './components/formularioRegistro.vue'

export default {
  name: 'App',
  components: {
    formularioRegistro
  },

  data() {
    return {
      usuarios: [],
      ultimoRegistro: null
    }
  },

  methods: {
    registrarCuenta(nuevoUsuario) {
      // Por ahora se guarda solo en memoria, sin conexión a backend
      this.usuarios.push(nuevoUsuario)
      this.ultimoRegistro = nuevoUsuario
    }
  }
}
</script>

<style>
body {
  margin: 0;
  background: CEEDB2;
  font-family: Arial, sans-serif;
}

.app {
  padding: 32px;
}
.confirmacion {
  margin-top: 16px;
  padding: 12px;
  background: #dcfce7;
  border-radius: 8px;
  color: #166534;
}
</style>