<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import BarraLateral from '../components/BarraLateral.vue'
import PieBiblioteca from '../components/PieBiblioteca.vue'
import {
  cargarCursos,
  cargarPerfil,
  escucharCursos,
  escucharPerfil,
  guardarPerfil,
} from '../lib/datosLocales'

const props = defineProps({
  sesion: { type: Object, default: null },
})
const emit = defineEmits(['perfil-actualizado'])

const usuarioId = computed(() => props.sesion?.user?.id || '')
const tieneSesion = computed(() => Boolean(usuarioId.value))
const cargo = computed(
  () => props.sesion?.user?.user_metadata?.rol || 'Sin cargo asignado',
)
const cursos = ref([])
const fotoInput = ref(null)
const error = ref('')
const mensaje = ref('')
const perfil = reactive({
  nombre: '',
  email: '',
  telefono: '',
  foto: '',
})
const iniciales = computed(() => {
  const inicialesNombre = perfil.nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join('')
  return inicialesNombre || 'U'
})
const totalMaterias = computed(() =>
  cursos.value.reduce((total, curso) => total + curso.materias.length, 0),
)

function cargarDatos() {
  if (!tieneSesion.value) return
  try {
    const guardado = cargarPerfil(usuarioId.value)
    perfil.nombre =
      guardado?.nombre || props.sesion.user.user_metadata?.nombre || ''
    perfil.email = props.sesion.user.email || ''
    perfil.telefono = guardado?.telefono || ''
    perfil.foto = guardado?.foto || ''
    cursos.value = cargarCursos(usuarioId.value)
    error.value = ''
  } catch (causa) {
    error.value = `No se pudo cargar la información personal: ${causa instanceof Error ? causa.message : 'Error desconocido.'}`
  }
}

watch(usuarioId, cargarDatos, { immediate: true })

let dejarDeEscucharCursos
let dejarDeEscucharPerfil
onMounted(() => {
  if (!tieneSesion.value) return
  dejarDeEscucharCursos = escucharCursos(usuarioId.value, cargarDatos)
  dejarDeEscucharPerfil = escucharPerfil(usuarioId.value, cargarDatos)
})
onUnmounted(() => {
  dejarDeEscucharCursos?.()
  dejarDeEscucharPerfil?.()
})

async function procesarFoto(archivo) {
  const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp']
  if (!tiposPermitidos.includes(archivo.type)) {
    throw new Error('Elegí una imagen JPG, PNG o WebP. No se admiten archivos SVG.')
  }
  if (archivo.size > 5 * 1024 * 1024) {
    throw new Error('La imagen debe pesar menos de 5 MB.')
  }

  const url = URL.createObjectURL(archivo)
  try {
    const imagen = new Image()
    await new Promise((resolve, reject) => {
      imagen.onload = resolve
      imagen.onerror = () => reject(new Error('No se pudo abrir la imagen elegida.'))
      imagen.src = url
    })
    if (
      imagen.naturalWidth > 8000 ||
      imagen.naturalHeight > 8000 ||
      imagen.naturalWidth * imagen.naturalHeight > 40_000_000
    ) {
      throw new Error('La resolución de la imagen es demasiado grande.')
    }

    const escala = Math.min(1, 512 / Math.max(imagen.naturalWidth, imagen.naturalHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(imagen.naturalWidth * escala))
    canvas.height = Math.max(1, Math.round(imagen.naturalHeight * escala))
    const contexto = canvas.getContext('2d')
    if (!contexto) throw new Error('No se pudo procesar la imagen.')

    contexto.drawImage(imagen, 0, 0, canvas.width, canvas.height)
    const foto = canvas.toDataURL('image/jpeg', 0.82)
    if (foto.length > 1_000_000) {
      throw new Error('La imagen procesada sigue siendo demasiado pesada.')
    }
    return foto
  } finally {
    URL.revokeObjectURL(url)
  }
}

async function cambiarFoto(evento) {
  const [archivo] = evento.target.files || []
  evento.target.value = ''
  if (!archivo) return
  try {
    perfil.foto = await procesarFoto(archivo)
    error.value = ''
    mensaje.value = 'Foto lista. Guardá los cambios para conservarla.'
  } catch (causa) {
    error.value = causa instanceof Error ? causa.message : 'No se pudo procesar la foto.'
    mensaje.value = ''
  }
}

function quitarFoto() {
  perfil.foto = ''
  mensaje.value = 'La foto se quitará cuando guardes los cambios.'
  error.value = ''
}

function guardarCambios() {
  if (!tieneSesion.value) {
    error.value = 'Iniciá sesión para modificar tu perfil.'
    return
  }
  const nombre = perfil.nombre.trim()
  const telefono = perfil.telefono.trim()
  const digitosTelefono = telefono.replace(/\D/g, '')
  if (nombre.length < 2 || nombre.length > 100) {
    error.value = 'El nombre debe tener entre 2 y 100 caracteres.'
    mensaje.value = ''
    return
  }
  if (
    telefono &&
    (!/^[+()0-9.\-\s]+$/.test(telefono) ||
      digitosTelefono.length < 7 ||
      digitosTelefono.length > 15)
  ) {
    error.value = 'Ingresá un teléfono válido con entre 7 y 15 dígitos.'
    mensaje.value = ''
    return
  }

  try {
    guardarPerfil(usuarioId.value, {
      nombre,
      telefono,
      foto: perfil.foto,
    })
    perfil.nombre = nombre
    perfil.telefono = telefono
    emit('perfil-actualizado', { nombre, telefono })
    error.value = ''
    mensaje.value = 'Tus cambios se guardaron en este navegador.'
  } catch (causa) {
    error.value = `No se pudieron guardar los cambios: ${causa instanceof Error ? causa.message : 'Error desconocido.'}`
    mensaje.value = ''
  }
}

function descartarCambios() {
  cargarDatos()
  mensaje.value = 'Se descartaron los cambios sin guardar.'
}

function volver() {
  window.location.hash = 'panel'
}

function abrirSelectorFoto() {
  fotoInput.value?.click()
}
</script>

<template>
  <BarraLateral />

  <main class="perfil-pagina">
    <section v-if="!tieneSesion" class="perfil-sin-sesion">
      <p class="perfil-eyebrow">TU CUENTA</p>
      <h1>Información personal</h1>
      <p>Iniciá sesión para consultar y actualizar tu perfil.</p>
      <a href="#inicio">Ir al inicio de sesión</a>
    </section>

    <template v-else>
      <header class="perfil-encabezado">
        <div>
          <p class="perfil-eyebrow">CUENTA · PERFIL</p>
          <h1>Información personal</h1>
          <p>Revisá tus datos y administrá la información de tu cuenta.</p>
        </div>
        <span class="perfil-insignia">Perfil de usuario</span>
      </header>

      <p v-if="error" class="perfil-mensaje error" role="alert">{{ error }}</p>
      <p v-else-if="mensaje" class="perfil-mensaje" role="status">{{ mensaje }}</p>

      <div class="perfil-presentacion">
        <div class="perfil-avatar">
          <img
            v-if="perfil.foto"
            :src="perfil.foto"
            alt="Foto de perfil"
            class="foto-perfil"
          />
          <span v-else class="avatar-iniciales">{{ iniciales }}</span>
          <button
            type="button"
            class="cambiar-foto"
            aria-label="Cambiar foto de perfil"
            title="Cambiar foto"
            @click="abrirSelectorFoto"
          >
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">
              <path d="M4 7.5h3l1.5-2h7L17 7.5h3v11H4v-11Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
              <circle cx="12" cy="13" r="3.2" stroke="currentColor" stroke-width="1.7" />
            </svg>
          </button>
        </div>
        <div class="perfil-identidad">
          <span class="rol-insignia">{{ cargo }}</span>
          <h2>{{ perfil.nombre || 'Tu nombre y apellido' }}</h2>
          <p>{{ perfil.email }}</p>
          <small v-if="perfil.telefono">{{ perfil.telefono }}</small>
        </div>
        <div class="perfil-datos-rapidos">
          <div>
            <strong>{{ cursos.length }}</strong>
            <span>{{ cursos.length === 1 ? 'curso' : 'cursos' }}</span>
          </div>
          <div>
            <strong>{{ totalMaterias }}</strong>
            <span>{{ totalMaterias === 1 ? 'materia' : 'materias' }}</span>
          </div>
        </div>
      </div>

      <input
        ref="fotoInput"
        class="entrada-foto"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        aria-label="Elegir foto de perfil"
        @change="cambiarFoto"
      />

      <div class="perfil-contenido">
        <section class="panel-perfil panel-datos">
          <header class="panel-perfil-encabezado">
            <div class="icono-panel" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                <circle cx="12" cy="8" r="3.5" stroke="currentColor" stroke-width="1.7" />
                <path d="M4.5 20a7.5 7.5 0 0 1 15 0" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
              </svg>
            </div>
            <div>
              <h2>Datos de la cuenta</h2>
              <p>Actualizá tu nombre y teléfono de contacto.</p>
            </div>
          </header>

          <form class="formulario-perfil" @submit.prevent="guardarCambios">
            <label class="campo-perfil" for="perfil-nombre">
              <span>Nombre y apellido</span>
              <input
                id="perfil-nombre"
                v-model="perfil.nombre"
                type="text"
                autocomplete="name"
                maxlength="100"
                required
              />
            </label>
            <label class="campo-perfil" for="perfil-email">
              <span>Correo electrónico</span>
              <input
                id="perfil-email"
                v-model="perfil.email"
                type="email"
                autocomplete="email"
                readonly
                aria-describedby="ayuda-correo"
              />
              <small id="ayuda-correo">El correo de acceso no se puede cambiar desde este prototipo.</small>
            </label>
            <label class="campo-perfil" for="perfil-telefono">
              <span>Número de teléfono</span>
              <input
                id="perfil-telefono"
                v-model="perfil.telefono"
                type="tel"
                autocomplete="tel"
                inputmode="tel"
                maxlength="25"
                placeholder="+54 9 351 000 0000"
              />
            </label>
            <label class="campo-perfil" for="perfil-cargo">
              <span>Cargo</span>
              <input id="perfil-cargo" :value="cargo" type="text" readonly />
              <small>El cargo se define al crear la cuenta y no se modifica desde el perfil.</small>
            </label>

            <div class="acciones-perfil">
              <button type="submit" class="boton-guardar-perfil">
                Guardar cambios
              </button>
              <button
                type="button"
                class="boton-descartar-perfil"
                @click="descartarCambios"
              >
                Descartar
              </button>
              <button type="button" class="boton-volver-perfil" @click="volver">
                Volver
              </button>
            </div>
          </form>
        </section>

        <aside class="panel-perfil panel-asignaciones">
          <header class="panel-perfil-encabezado">
            <div class="icono-panel" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
                <path d="M4 5.5V21M8 7h8M8 11h8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
              </svg>
            </div>
            <div>
              <h2>Cursos y materias</h2>
              <p>Resumen de lo que tenés cargado en tu agenda.</p>
            </div>
          </header>

          <div v-if="cursos.length" class="lista-cursos-perfil">
            <article
              v-for="curso in cursos"
              :key="curso.id"
              class="curso-perfil"
            >
              <div class="encabezado-curso-perfil">
                <h3>{{ curso.nombre }}</h3>
                <span>{{ curso.materias.length }}</span>
              </div>
              <div v-if="curso.materias.length" class="materias-perfil">
                <span
                  v-for="materia in curso.materias"
                  :key="materia.id"
                  class="materia-perfil"
                >
                  {{ materia.nombre }}
                </span>
              </div>
              <p v-else class="sin-materias-perfil">Todavía no hay materias cargadas.</p>
            </article>
          </div>
          <p v-else class="sin-cursos-perfil">
            Todavía no tenés cursos cargados en tu agenda.
          </p>
        </aside>
      </div>

      <p class="aviso-seguridad-perfil">
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">
          <path d="M12 3 19 6v5.5c0 4.4-3 7.8-7 9.5-4-1.7-7-5.1-7-9.5V6l7-3Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
          <path d="m9 12 2 2 4-4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Tus datos y la foto quedan guardados solo en este navegador. Este modo
        de demostración no ofrece cifrado ni sincronización; no guardes
        información sensible hasta conectar una autenticación segura.
      </p>
    </template>
  </main>

  <PieBiblioteca />
</template>

<style scoped>
.perfil-pagina {
  width: min(100% - 120px, 1180px);
  min-height: calc(100vh - 72px);
  margin-left: 120px;
  padding: 38px 28px 30px;
}

.perfil-encabezado,
.perfil-sin-sesion {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}

.perfil-eyebrow {
  margin: 0 0 8px;
  color: #56836a;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.15em;
}

.perfil-encabezado h1,
.perfil-sin-sesion h1 {
  margin: 0;
  color: #203d2f;
  font-size: clamp(29px, 4vw, 40px);
  font-weight: 780;
  letter-spacing: -0.055em;
}

.perfil-encabezado > div > p:last-child,
.perfil-sin-sesion > p:not(.perfil-eyebrow) {
  margin: 9px 0 0;
  color: #728078;
  font-size: 13px;
  line-height: 1.55;
}

.perfil-insignia {
  padding: 9px 12px;
  border: 1px solid #dce9df;
  border-radius: 999px;
  background: #f3f8f4;
  color: #4a7658;
  font-size: 10px;
  font-weight: 700;
}

.perfil-presentacion,
.panel-perfil,
.perfil-sin-sesion {
  border: 1px solid #e3ebe5;
  border-radius: 22px;
  background: #fff;
  box-shadow: var(--sombra);
}

.perfil-presentacion {
  position: relative;
  display: flex;
  min-height: 185px;
  align-items: center;
  gap: 24px;
  margin-bottom: 18px;
  padding: 28px 32px;
  overflow: hidden;
  background:
    radial-gradient(circle at 87% 20%, rgba(201, 228, 209, 0.62), transparent 16rem),
    linear-gradient(120deg, #fff 0%, #f5faf6 100%);
}

.perfil-avatar {
  position: relative;
  display: grid;
  width: 112px;
  height: 112px;
  flex: 0 0 112px;
  place-items: center;
  overflow: visible;
  border: 4px solid rgba(255, 255, 255, 0.92);
  border-radius: 50%;
  background: linear-gradient(145deg, #d9ebde, #bdd8c5);
  box-shadow: 0 8px 22px rgba(35, 75, 49, 0.14);
}

.foto-perfil {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-iniciales {
  color: #34795a;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.05em;
}

.cambiar-foto {
  position: absolute;
  right: -3px;
  bottom: 1px;
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 2px solid #fff;
  border-radius: 50%;
  background: #34795a;
  color: #fff;
  box-shadow: 0 4px 10px rgba(35, 75, 49, 0.18);
}

.cambiar-foto:hover {
  background: #285d40;
}

.perfil-identidad {
  min-width: 0;
  flex: 1;
}

.rol-insignia {
  display: inline-flex;
  max-width: 100%;
  padding: 6px 9px;
  border: 1px solid #dce9df;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  color: #34704d;
  font-size: 10px;
  font-weight: 750;
}

.perfil-identidad h2 {
  margin: 10px 0 4px;
  overflow-wrap: anywhere;
  color: #203d2f;
  font-size: clamp(20px, 3vw, 27px);
  font-weight: 780;
  letter-spacing: -0.045em;
}

.perfil-identidad p,
.perfil-identidad small {
  display: block;
  margin: 0;
  overflow-wrap: anywhere;
  color: #728078;
  font-size: 12px;
  line-height: 1.55;
}

.perfil-identidad small {
  margin-top: 3px;
}

.perfil-datos-rapidos {
  display: flex;
  flex: 0 0 auto;
  gap: 10px;
}

.perfil-datos-rapidos div {
  display: grid;
  min-width: 82px;
  gap: 4px;
  justify-items: center;
  padding: 13px 10px;
  border: 1px solid #e0ebe2;
  border-radius: 13px;
  background: rgba(255, 255, 255, 0.74);
}

.perfil-datos-rapidos strong {
  color: #34795a;
  font-size: 20px;
  font-weight: 800;
}

.perfil-datos-rapidos span {
  color: #728078;
  font-size: 9px;
  font-weight: 650;
}

.entrada-foto {
  display: none;
}

.perfil-contenido {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(290px, 0.85fr);
  align-items: start;
  gap: 18px;
}

.panel-perfil {
  min-width: 0;
  padding: 24px;
}

.panel-perfil-encabezado {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 20px;
}

.icono-panel {
  display: grid;
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  place-items: center;
  border: 1px solid #dce9df;
  border-radius: 12px;
  background: #f0f7f1;
  color: #34795a;
}

.panel-perfil-encabezado h2 {
  margin: 0;
  color: #263b30;
  font-size: 16px;
  font-weight: 750;
  letter-spacing: -0.025em;
}

.panel-perfil-encabezado p {
  margin: 4px 0 0;
  color: #7b8880;
  font-size: 10px;
  line-height: 1.5;
}

.formulario-perfil {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 13px;
}

.campo-perfil {
  display: grid;
  min-width: 0;
  align-content: start;
  gap: 7px;
}

.campo-perfil > span {
  color: #46564d;
  font-size: 11px;
  font-weight: 700;
}

.campo-perfil input {
  width: 100%;
  min-height: 42px;
  padding: 10px 12px;
  border: 1px solid #dce6df;
  border-radius: 10px;
  background: #fbfdfb;
  color: #263b30;
  font: inherit;
  font-size: 12px;
}

.campo-perfil input:focus {
  border-color: #69a985;
  outline: none;
  box-shadow: 0 0 0 4px rgba(74, 154, 112, 0.12);
}

.campo-perfil input[readonly] {
  background: #f3f6f3;
  color: #6f7d73;
  cursor: not-allowed;
}

.campo-perfil small {
  color: #89958e;
  font-size: 9px;
  line-height: 1.45;
}

.acciones-perfil {
  display: flex;
  grid-column: 1 / -1;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 4px;
}

.boton-guardar-perfil,
.boton-descartar-perfil,
.boton-volver-perfil {
  min-height: 39px;
  padding: 9px 13px;
  border: 1px solid transparent;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 750;
  transition: background-color 0.18s ease, transform 0.18s ease;
}

.boton-guardar-perfil {
  background: #34795a;
  color: #fff;
  box-shadow: 0 5px 12px rgba(52, 121, 90, 0.17);
}

.boton-guardar-perfil:hover {
  transform: translateY(-1px);
  background: #285d40;
}

.boton-descartar-perfil,
.boton-volver-perfil {
  border-color: #dfe8e1;
  background: #fff;
  color: #526259;
}

.boton-descartar-perfil:hover,
.boton-volver-perfil:hover {
  background: #f2f8f3;
}

.lista-cursos-perfil {
  display: grid;
  gap: 10px;
}

.curso-perfil {
  padding: 14px;
  border: 1px solid #e7eee8;
  border-radius: 13px;
  background: #fbfdfb;
}

.encabezado-curso-perfil {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.encabezado-curso-perfil h3 {
  margin: 0;
  color: #33493c;
  font-size: 12px;
  font-weight: 750;
}

.encabezado-curso-perfil > span {
  display: grid;
  min-width: 22px;
  height: 22px;
  place-items: center;
  border-radius: 7px;
  background: #edf5ef;
  color: #34795a;
  font-size: 9px;
  font-weight: 800;
}

.materias-perfil {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.materia-perfil {
  padding: 5px 8px;
  border: 1px solid #dce9df;
  border-radius: 999px;
  background: #fff;
  color: #567461;
  font-size: 9px;
  font-weight: 650;
}

.sin-materias-perfil,
.sin-cursos-perfil {
  margin: 9px 0 0;
  color: #89958e;
  font-size: 10px;
  line-height: 1.5;
}

.perfil-mensaje {
  margin: 0 0 15px;
  padding: 11px 14px;
  border: 1px solid #d2e6d7;
  border-radius: 11px;
  background: #f1f8f2;
  color: #2f704b;
  font-size: 12px;
}

.perfil-mensaje.error {
  border-color: #f0d7d4;
  background: #fff6f5;
  color: #9a403b;
}

.aviso-seguridad-perfil {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  margin: 17px 0 0;
  padding: 13px 15px;
  border: 1px solid #e6ece7;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.74);
  color: #728078;
  font-size: 10px;
  line-height: 1.55;
}

.aviso-seguridad-perfil svg {
  flex: 0 0 17px;
  color: #56836a;
}

.perfil-sin-sesion {
  max-width: 680px;
  flex-direction: column;
  align-items: flex-start;
  margin: 60px auto;
  padding: 34px;
}

.perfil-sin-sesion a {
  margin-top: 18px;
  padding: 11px 14px;
  border-radius: 10px;
  background: #34795a;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
}

@media (max-width: 950px) {
  .perfil-contenido {
    grid-template-columns: 1fr;
  }

  .panel-asignaciones {
    order: 2;
  }
}

@media (max-width: 700px) {
  .perfil-pagina {
    width: calc(100% - 78px);
    margin-left: 78px;
    padding: 23px 12px 20px;
  }

  .perfil-encabezado {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .perfil-presentacion {
    flex-wrap: wrap;
    gap: 15px;
    padding: 22px 18px;
  }

  .perfil-avatar {
    width: 86px;
    height: 86px;
    flex-basis: 86px;
  }

  .perfil-datos-rapidos {
    width: 100%;
    justify-content: flex-start;
    margin-left: 100px;
  }

  .panel-perfil {
    padding: 20px 16px;
  }
}

@media (max-width: 500px) {
  .perfil-presentacion {
    align-items: flex-start;
  }

  .perfil-identidad {
    flex-basis: calc(100% - 105px);
  }

  .perfil-datos-rapidos {
    margin-left: 0;
  }

  .perfil-datos-rapidos div {
    flex: 1;
  }

  .formulario-perfil {
    grid-template-columns: 1fr;
  }

  .acciones-perfil {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .boton-guardar-perfil {
    grid-column: 1 / -1;
  }
}
</style>
