<script setup>
import { computed, ref } from 'vue'
import FormularioRegistro from './components/formularioRegistro.vue'
import InicioSesion from './views/InicioSesion.vue'
import RecuperarClave from './views/RecuperarClave.vue'
import PanelPrincipal from './views/PanelPrincipal.vue'
import Biblioteca from './views/Biblioteca.vue'
const pantallas = { inicio: InicioSesion, registro: FormularioRegistro, recuperar: RecuperarClave, panel: PanelPrincipal, biblioteca: Biblioteca }
const pagina = ref('inicio')
const actual = computed(() => pantallas[pagina.value])
// Prototipo: las cuentas y sus claves viven solo en memoria.
const usuarios = ref([])
const usuario = ref(null)
const mensaje = ref('')
function navegar(destino) { pagina.value = destino; mensaje.value = '' }
function registrar(nuevo) {
  if (usuarios.value.some(u => u.email.toLowerCase() === nuevo.email.toLowerCase())) {
    mensaje.value = 'Ya existe una cuenta con ese correo durante esta sesión.'
    return
  }
  usuarios.value.push(nuevo)
  pagina.value = 'inicio'
  mensaje.value = `Cuenta creada para ${nuevo.nombre} (${nuevo.rol}). Ya podés iniciar sesión con tu correo.`
}
function ingresar(datos) {
  const cuenta = usuarios.value.find(u => u.email.toLowerCase() === datos.email.trim().toLowerCase() && u.contrasena === datos.contrasena)
  if (!cuenta) { mensaje.value = 'El correo o la contraseña son incorrectos. Primero creá una cuenta en esta sesión.'; return }
  usuario.value = { nombre: cuenta.nombre, rol: cuenta.rol }
  navegar('panel')
}
function demostrar() { usuario.value = { nombre: 'Visitante', rol: 'Demostración' }; navegar('panel') }
function salir() { usuario.value = null; navegar('inicio') }
</script>
<template>
  <header class="cabecera">
    <a href="#" @click.prevent="navegar(usuario ? 'panel' : 'inicio')">🌿 Gestión de Tutorías</a>
    <nav aria-label="Navegación principal">
      <template v-if="usuario">
        <button @click="navegar('panel')" :aria-current="pagina === 'panel' ? 'page' : undefined">Mis tutorías</button>
        <button @click="navegar('biblioteca')" :aria-current="pagina === 'biblioteca' ? 'page' : undefined">Biblioteca</button>
        <span>{{ usuario.nombre }} · {{ usuario.rol }}</span>
        <button @click="salir">Salir</button>
      </template>
      <template v-else>
        <button @click="navegar('inicio')">Iniciar sesión</button>
        <button @click="navegar('registro')">Crear cuenta</button>
      </template>
    </nav>
  </header>
  <p class="nota-demo">Prototipo sin servidor. Los datos duran durante esta sesión y se pierden al recargar. Usá datos de prueba.</p>
  <main class="pagina">
    <p v-if="mensaje" class="mensaje" role="status">{{ mensaje }}</p>
    <KeepAlive><component :is="actual" @registrar-cuenta="registrar" @ingresar="ingresar" @demo="demostrar" @navegar="navegar" /></KeepAlive>
  </main>
  <footer>Escuela ProA La Falda · Gestión de Tutorías</footer>
</template>
