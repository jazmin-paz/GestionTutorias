<script setup>
import { computed, onUnmounted, ref } from 'vue'
import FormularioRegistro from './components/formularioRegistro.vue'
import InicioSesion from './views/InicioSesion.vue'
import RecuperarClave from './views/RecuperarClave.vue'
import PanelPrincipal from './views/PanelPrincipal.vue'
import Biblioteca from './views/Biblioteca.vue'
import Observaciones from './views/Observaciones.vue'

const pantallas = {
  inicio: InicioSesion,
  registro: FormularioRegistro,
  recuperar: RecuperarClave,
  panel: PanelPrincipal,
  biblioteca: Biblioteca,
  observaciones: Observaciones,
}
const pagina = ref('inicio')
const usuarios = ref([])
const mensaje = ref('')
const actual = computed(() => pantallas[pagina.value])
const eventos = computed(
  () =>
    ({
      inicio: { ingresar },
      registro: { 'registrar-cuenta': registrar },
    })[pagina.value] || {},
)

function actualizarPagina() {
  const destino = window.location.hash.slice(1)
  pagina.value = Object.hasOwn(pantallas, destino) ? destino : 'inicio'
  mensaje.value = ''
}

function registrar(nuevo) {
  usuarios.value.push(nuevo)
  window.location.hash = 'inicio'
}

function ingresar({ nombre, contrasena }) {
  // La cuenta de ejemplo ya estaba definida en el script del equipo.
  const cuentaOriginal = nombre === 'Giovana' && contrasena === '1234'
  const cuentaRegistrada = usuarios.value.some(
    (usuario) =>
      (usuario.nombre === nombre ||
        usuario.email.toLowerCase() === nombre.toLowerCase()) &&
      usuario.contrasena === contrasena,
  )
  if (cuentaOriginal || cuentaRegistrada) {
    window.location.hash = 'panel'
  } else {
    mensaje.value = 'El usuario o contraseña no existen o son incorrectos'
  }
}

actualizarPagina()
window.addEventListener('hashchange', actualizarPagina)
onUnmounted(() => window.removeEventListener('hashchange', actualizarPagina))
</script>

<template>
  <KeepAlive>
    <component
      :is="actual"
      v-bind="pagina === 'inicio' ? { mensaje } : {}"
      v-on="eventos"
    />
  </KeepAlive>
</template>
