<script setup>
import { computed, onUnmounted, ref } from 'vue'
import FormularioRegistro from './components/formularioRegistro.vue'
import InicioSesion from './views/InicioSesion.vue'
import RecuperarClave from './views/RecuperarClave.vue'
import PanelPrincipal from './views/PanelPrincipal.vue'
import Biblioteca from './views/Biblioteca.vue'
import HistorialTutorias from './views/HistorialTutorias.vue'
import Observaciones from './views/Observaciones.vue'
import AsistenciasTutorias from './views/AsistenciasTutorias.vue'
import CrearTutoria from './views/CrearTutoria.vue'
import PerfilUsuario from './views/PerfilUsuario.vue'
import { cargarPerfil } from './lib/datosLocales'

const pantallas = {
  inicio: InicioSesion,
  registro: FormularioRegistro,
  recuperar: RecuperarClave,
  panel: PanelPrincipal,
  biblioteca: Biblioteca,
  historial: HistorialTutorias,
  observaciones: Observaciones,
  asistencias: AsistenciasTutorias,
  CrearTutoria,
  perfil: PerfilUsuario,
}
const pagina = ref('inicio')
const sesion = ref(null)
const usuarios = ref([
  {
    id: 'cuenta-demo',
    nombre: 'Giovana',
    email: 'giovana@proa.local',
    contrasena: '1234',
    rol: 'Equipo de gestión',
  },
])
const mensaje = ref('')
const mensajeRegistro = ref('')
const avisoInicio = ref('')
const actual = computed(() => pantallas[pagina.value])
const eventos = computed(
  () =>
    ({
      inicio: { ingresar },
      registro: { 'registrar-cuenta': registrar },
      perfil: { 'perfil-actualizado': actualizarPerfil },
    })[pagina.value] || {},
)

function actualizarPagina() {
  const destino = window.location.hash.slice(1)
  pagina.value = Object.hasOwn(pantallas, destino) ? destino : 'inicio'
  mensaje.value = pagina.value === 'inicio' ? avisoInicio.value : ''
  if (pagina.value === 'inicio') avisoInicio.value = ''
  mensajeRegistro.value = ''
}

function registrar(nuevo, completar) {
  const correoEnUso = usuarios.value.some(
    (usuario) => usuario.email.toLowerCase() === nuevo.email.toLowerCase(),
  )
  if (correoEnUso) {
    mensajeRegistro.value = 'Ya existe una cuenta con ese correo.'
    completar(false)
    return
  }

  usuarios.value.push({
    id: `docente-${encodeURIComponent(nuevo.email.toLowerCase())}`,
    ...nuevo,
  })
  avisoInicio.value =
    'Cuenta creada en esta sesión. Iniciá sesión con tu nombre o correo.'
  completar(true)
  window.location.hash = 'inicio'
}

function ingresar({ nombre, contrasena }) {
  const usuario = usuarios.value.find(
    (cuenta) =>
      (cuenta.nombre.toLowerCase() === nombre.toLowerCase() ||
        cuenta.email.toLowerCase() === nombre.toLowerCase()) &&
      cuenta.contrasena === contrasena,
  )
  if (usuario) {
    let perfilGuardado
    try {
      perfilGuardado = cargarPerfil(usuario.id)
    } catch (causa) {
      mensaje.value = `No se pudo leer el perfil guardado: ${causa instanceof Error ? causa.message : 'Error desconocido.'}`
      return
    }
    sesion.value = {
      user: {
        id: usuario.id,
        email: usuario.email,
        user_metadata: {
          nombre: perfilGuardado?.nombre || usuario.nombre,
          rol: usuario.rol,
        },
      },
    }
    window.location.hash = 'panel'
  } else {
    mensaje.value = 'El usuario o contraseña no existen o son incorrectos.'
  }
}

function actualizarPerfil(datos) {
  const usuarioId = sesion.value?.user?.id
  const usuario = usuarios.value.find((cuenta) => cuenta.id === usuarioId)
  if (!usuario || !sesion.value) return

  usuario.nombre = datos.nombre
  usuario.telefono = datos.telefono
  sesion.value = {
    ...sesion.value,
    user: {
      ...sesion.value.user,
      user_metadata: {
        ...sesion.value.user.user_metadata,
        nombre: datos.nombre,
      },
    },
  }
}

actualizarPagina()
window.addEventListener('hashchange', actualizarPagina)

onUnmounted(() => {
  window.removeEventListener('hashchange', actualizarPagina)
})
</script>

<template>
  <KeepAlive>
    <component
      :is="actual"
      v-bind="
        pagina === 'inicio'
          ? { mensaje }
          : pagina === 'registro'
            ? { mensaje: mensajeRegistro }
            : ['panel', 'CrearTutoria', 'historial', 'observaciones', 'asistencias', 'perfil'].includes(pagina)
              ? { sesion }
              : {}
      "
      v-on="eventos"
    />
  </KeepAlive>
</template>
