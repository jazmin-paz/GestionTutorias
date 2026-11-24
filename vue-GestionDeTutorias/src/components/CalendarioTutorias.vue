<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { cargarTutorias, escucharTutorias } from '../lib/datosLocales'

const props = defineProps({
  curso: { type: Object, default: null },
  materia: { type: Object, default: null },
  userId: { type: String, default: 'cuenta-demo' },
})

const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const mesActual = ref(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
const tutorias = ref([])
const error = ref('')
const usuarioId = computed(() => props.userId || 'cuenta-demo')

function cargarDatos() {
  try {
    tutorias.value = cargarTutorias(usuarioId.value)
    error.value = ''
  } catch (causa) {
    error.value = `No se pudieron cargar las tutorías: ${causa instanceof Error ? causa.message : 'Error desconocido.'}`
  }
}

watch(usuarioId, cargarDatos, { immediate: true })

let dejarDeEscuchar
onMounted(() => {
  dejarDeEscuchar = escucharTutorias(usuarioId.value, cargarDatos)
})
onUnmounted(() => dejarDeEscuchar?.())

const mesTitulo = computed(() =>
  mesActual.value.toLocaleDateString('es-AR', {
    month: 'long',
    year: 'numeric',
  }),
)

const tutoriasFiltradas = computed(() =>
  tutorias.value.filter((tutoria) => {
    if (props.curso && tutoria.curso !== props.curso.nombre) return false
    if (props.materia && tutoria.asignatura !== props.materia.nombre) return false
    return true
  }),
)

const diasCalendario = computed(() => {
  const primerDia = mesActual.value
  const inicio = new Date(primerDia)
  inicio.setDate(primerDia.getDate() - ((primerDia.getDay() + 6) % 7))

  return Array.from({ length: 42 }, (_, indice) => {
    const fecha = new Date(inicio)
    fecha.setDate(inicio.getDate() + indice)
    const llave = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`

    return {
      fecha,
      llave,
      numero: fecha.getDate(),
      esDelMes: fecha.getMonth() === mesActual.value.getMonth(),
      esHoy: llave === fechaDeHoy(),
      esFinDeSemana: fecha.getDay() === 0 || fecha.getDay() === 6,
      tutorias: tutoriasDelDia(llave),
    }
  })
})

function fechaDeHoy() {
  const hoy = new Date()
  return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`
}

function tutoriasDelDia(llave) {
  return tutoriasFiltradas.value.filter((tutoria) => tutoria.fecha_tutoria === llave)
}

const totalMes = computed(
  () => diasCalendario.value.reduce((total, dia) => total + dia.tutorias.length, 0),
)
const proximasTutorias = computed(() =>
  tutoriasFiltradas.value
    .filter((tutoria) => new Date(`${tutoria.fecha_tutoria}T${tutoria.hora_tutoria}`).getTime() >= Date.now())
    .sort(
      (a, b) =>
        new Date(`${a.fecha_tutoria}T${a.hora_tutoria}`).getTime() -
        new Date(`${b.fecha_tutoria}T${b.hora_tutoria}`).getTime(),
    )
    .slice(0, 3),
)

function cambiarMes(cantidad) {
  mesActual.value = new Date(
    mesActual.value.getFullYear(),
    mesActual.value.getMonth() + cantidad,
    1,
  )
}

function hora(tutoria) {
  return tutoria.hora_tutoria.slice(0, 5)
}

function fechaCorta(tutoria) {
  const fecha = new Date(`${tutoria.fecha_tutoria}T${tutoria.hora_tutoria}`)
  return fecha.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
  })
}
</script>

<template>
  <section class="panel-calendario" aria-label="Calendario de tutorías">
    <header class="encabezado-calendario">
      <div class="identidad-calendario">
        <span class="icono-calendario" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
            <rect x="3.5" y="5" width="17" height="16" rx="3" stroke="currentColor" stroke-width="1.8" />
            <path d="M7.5 3v4M16.5 3v4M3.5 9.5h17M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </span>
        <div>
        <p class="calendario-etiqueta">AGENDA DEL CURSO</p>
        <h2>Calendario</h2>
        <p class="filtro-calendario">
          {{ curso?.nombre || 'Todos los cursos' }}
          <template v-if="materia"> · {{ materia.nombre }}</template>
        </p>
        </div>
      </div>
      <div class="controles-mes">
        <button
          type="button"
          class="cambiar-mes"
          aria-label="Mes anterior"
          @click="cambiarMes(-1)"
        >
          ‹
        </button>
        <span class="mes-titulo">{{ mesTitulo }}</span>
        <button
          type="button"
          class="cambiar-mes"
          aria-label="Mes siguiente"
          @click="cambiarMes(1)"
        >
          ›
        </button>
      </div>
    </header>

    <div class="resumen-encabezado">
      <span class="etiqueta-agenda">
        {{ curso?.nombre || 'Todos los cursos' }}
        <template v-if="materia"> / {{ materia.nombre }}</template>
      </span>
      <span class="conteo-mes">
        {{ totalMes }} {{ totalMes === 1 ? 'tutoría este mes' : 'tutorías este mes' }}
      </span>
    </div>

    <p v-if="error" class="error-calendario" role="alert">{{ error }}</p>
    <div class="calendario">
      <div
        v-for="dia in diasSemana"
        :key="dia"
        class="nombre-dia"
      >
        {{ dia }}
      </div>
      <div
        v-for="dia in diasCalendario"
        :key="dia.llave"
        class="dia"
        :aria-label="`${dia.numero}${dia.tutorias.length ? `, ${dia.tutorias.length} tutorías` : ''}`"
        :class="{
          'fuera-del-mes': !dia.esDelMes,
          'dia-hoy': dia.esHoy,
          'dia-fin-de-semana': dia.esFinDeSemana,
          'dia-con-tutorias': dia.tutorias.length > 0,
        }"
      >
        <span class="numero-dia">{{ dia.numero }}</span>
        <div class="eventos-dia">
          <div
            v-for="tutoria in dia.tutorias.slice(0, 3)"
            :key="tutoria.id"
            class="evento-tutoria"
            :title="`${hora(tutoria)} · ${tutoria.estudiante} · ${tutoria.asignatura}`"
          >
            <span class="hora-evento">{{ hora(tutoria) }}</span>
            <span class="nombre-evento">{{ tutoria.estudiante }}</span>
            <span class="materia-evento">{{ tutoria.asignatura }}</span>
          </div>
          <span v-if="dia.tutorias.length > 3" class="mas-eventos">
            +{{ dia.tutorias.length - 3 }} más
          </span>
        </div>
      </div>
    </div>

    <section class="proximas-tutorias" aria-label="Próximas tutorías">
      <header class="encabezado-proximas">
        <div>
          <p class="calendario-etiqueta">TU AGENDA</p>
          <h3>Próximas tutorías</h3>
        </div>
        <span class="contador-proximas">{{ proximasTutorias.length }}</span>
      </header>
      <div v-if="proximasTutorias.length" class="lista-proximas">
        <article
          v-for="tutoria in proximasTutorias"
          :key="tutoria.id"
          class="tarjeta-proxima"
        >
          <span class="fecha-proxima">{{ fechaCorta(tutoria) }}</span>
          <div class="detalle-proxima">
            <strong>{{ tutoria.estudiante }}</strong>
            <span>{{ tutoria.curso }} · {{ tutoria.asignatura }}</span>
          </div>
          <span class="hora-proxima">{{ hora(tutoria) }}</span>
        </article>
      </div>
      <p v-else class="agenda-vacia">
        Las tutorías que programes para este curso aparecerán acá.
      </p>
    </section>
  </section>
</template>

<style scoped>
.panel-calendario {
  width: 100%;
  margin: 20px 0;
  padding: 26px;
  overflow: hidden;
  border: 1px solid #e1ebe3;
  border-radius: 24px;
  background:
    radial-gradient(circle at 100% 0, rgba(214, 235, 219, 0.62), transparent 16rem),
    #fff;
  box-shadow: 0 16px 38px rgba(27, 62, 43, 0.07);
}

.encabezado-calendario {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding-bottom: 19px;
  border-bottom: 1px solid #edf1ed;
}

.identidad-calendario {
  display: flex;
  align-items: center;
  gap: 13px;
}

.icono-calendario {
  display: grid;
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  place-items: center;
  border: 1px solid #d6e8db;
  border-radius: 15px;
  background: linear-gradient(145deg, #f3faf4, #e4f1e7);
  color: #34795a;
}

.calendario-etiqueta {
  margin: 0 0 5px;
  color: #56836a;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.15em;
}

.encabezado-calendario h2 {
  margin: 0;
  color: #203d2f;
  font-size: 22px;
  font-weight: 780;
  letter-spacing: -0.045em;
}

.filtro-calendario {
  margin: 5px 0 0;
  color: #728078;
  font-size: 12px;
}

.controles-mes {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px;
  border: 1px solid #e6ede7;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.78);
}

.mes-titulo {
  min-width: 140px;
  color: #263d30;
  font-size: 13px;
  font-weight: 750;
  text-align: center;
  text-transform: capitalize;
}

.cambiar-mes {
  display: grid;
  width: 33px;
  height: 33px;
  place-items: center;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: #34795a;
  font-size: 23px;
  line-height: 1;
  transition: background-color 0.18s ease, transform 0.18s ease;
}

.cambiar-mes:hover {
  transform: translateY(-1px);
  background: #e8f2eb;
}

.resumen-encabezado {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 15px 1px 12px;
}

.etiqueta-agenda {
  max-width: 70%;
  overflow: hidden;
  padding: 6px 10px;
  border: 1px solid #dfece2;
  border-radius: 999px;
  background: #f3f8f4;
  color: #456b52;
  font-size: 10px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conteo-mes {
  color: #7b8880;
  font-size: 10px;
  font-weight: 650;
}

.calendario {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 7px;
}

.nombre-dia {
  padding: 9px 2px 8px;
  color: #829087;
  font-size: 9px;
  font-weight: 800;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.dia {
  position: relative;
  min-width: 0;
  min-height: 103px;
  padding: 8px;
  border: 1px solid #e9efea;
  border-radius: 13px;
  background: linear-gradient(155deg, #fff 0%, #fbfdfb 100%);
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
}

.dia:hover {
  z-index: 1;
  transform: translateY(-2px);
  border-color: #c8dfce;
  box-shadow: 0 8px 18px rgba(43, 101, 66, 0.08);
}

.dia.dia-fin-de-semana {
  background: linear-gradient(155deg, #f7faf7 0%, #f2f7f3 100%);
}

.dia.fuera-del-mes {
  background: #f7f9f7;
  color: #aeb9b1;
  opacity: 0.68;
}

.dia-con-tutorias {
  border-color: #d3e6d8;
  background: linear-gradient(155deg, #f7fcf8 0%, #f0f8f2 100%);
}

.dia-hoy {
  border-color: #68a67c;
  box-shadow: inset 0 0 0 1px #68a67c;
}

.numero-dia {
  display: inline-grid;
  width: 27px;
  height: 27px;
  place-items: center;
  border-radius: 9px;
  color: #59695f;
  font-size: 11px;
  font-weight: 750;
}

.dia-hoy .numero-dia {
  background: linear-gradient(145deg, #4a9a70, #34795a);
  color: #fff;
  box-shadow: 0 3px 8px rgba(52, 121, 90, 0.22);
}

.eventos-dia {
  display: grid;
  gap: 5px;
  margin-top: 5px;
}

.evento-tutoria {
  display: grid;
  gap: 3px;
  min-width: 0;
  padding: 6px 7px;
  border: 1px solid #d5e7da;
  border-left: 3px solid #4a9a70;
  border-radius: 8px;
  background: linear-gradient(135deg, #edf7ef, #e7f2ea);
  color: #285d40;
  font-size: 9px;
  line-height: 1.3;
}

.hora-evento {
  width: fit-content;
  padding: 2px 5px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.78);
  font-weight: 800;
}

.nombre-evento,
.materia-evento {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nombre-evento {
  font-weight: 750;
}

.materia-evento {
  color: #5b7764;
  font-size: 8px;
}

.mas-eventos {
  padding-left: 2px;
  color: #56836a;
  font-size: 9px;
  font-weight: 700;
}

.proximas-tutorias {
  margin-top: 22px;
  padding: 17px 18px;
  border: 1px solid #e4ece5;
  border-radius: 16px;
  background: linear-gradient(135deg, #fbfdfb, #f5f9f5);
}

.encabezado-proximas {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.encabezado-proximas .calendario-etiqueta {
  margin-bottom: 4px;
}

.encabezado-proximas h3 {
  margin: 0;
  color: #294435;
  font-size: 15px;
  font-weight: 750;
  letter-spacing: -0.025em;
}

.contador-proximas {
  display: grid;
  width: 29px;
  height: 29px;
  place-items: center;
  border: 1px solid #d5e7da;
  border-radius: 10px;
  background: #eaf4ed;
  color: #34795a;
  font-size: 11px;
  font-weight: 800;
}

.lista-proximas {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 9px;
}

.tarjeta-proxima {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid #e5eee7;
  border-radius: 12px;
  background: #fff;
}

.fecha-proxima {
  display: grid;
  min-width: 45px;
  min-height: 42px;
  place-items: center;
  padding: 5px;
  border-radius: 10px;
  background: #eaf4ed;
  color: #34795a;
  font-size: 10px;
  font-weight: 800;
  text-align: center;
  text-transform: capitalize;
}

.detalle-proxima {
  display: grid;
  min-width: 0;
  flex: 1;
  gap: 4px;
}

.detalle-proxima strong,
.detalle-proxima span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detalle-proxima strong {
  color: #294435;
  font-size: 11px;
}

.detalle-proxima span {
  color: #7b8880;
  font-size: 9px;
}

.hora-proxima {
  align-self: flex-start;
  padding: 5px 7px;
  border-radius: 7px;
  background: #f2f7f3;
  color: #486b53;
  font-size: 9px;
  font-weight: 750;
}

.agenda-vacia {
  margin: 0;
  padding: 12px 14px;
  border: 1px dashed #d9e6dc;
  border-radius: 11px;
  color: #7b8880;
  font-size: 11px;
  line-height: 1.5;
}

.error-calendario {
  margin: 12px 0;
  color: #99453e;
  font-size: 12px;
}

@media (max-width: 1050px) {
  .dia {
    min-height: 88px;
    padding: 6px;
  }

  .evento-tutoria {
    padding: 5px;
  }
}

@media (max-width: 700px) {
  .panel-calendario {
    padding: 18px 13px;
    border-radius: 19px;
  }

  .encabezado-calendario {
    align-items: flex-start;
    flex-direction: column;
    padding-bottom: 15px;
  }

  .controles-mes {
    align-self: stretch;
    justify-content: space-between;
  }

  .calendario {
    gap: 4px;
  }

  .dia {
    min-height: 76px;
    padding: 4px;
    border-radius: 9px;
  }

  .numero-dia {
    width: 23px;
    height: 23px;
  }

  .evento-tutoria {
    gap: 2px;
    padding: 3px;
    border-left-width: 2px;
    font-size: 8px;
  }

  .materia-evento {
    display: none;
  }

}

@media (max-width: 430px) {
  .panel-calendario {
    padding: 16px 10px;
  }

  .nombre-dia {
    padding-inline: 1px;
    font-size: 8px;
  }

  .dia {
    min-height: 62px;
    padding: 3px;
  }

  .nombre-evento,
  .materia-evento {
    display: none;
  }

  .evento-tutoria {
    justify-items: center;
    padding: 3px 1px;
    border-left: 0;
    font-size: 8px;
  }

  .hora-evento {
    padding: 1px 2px;
    font-size: 7px;
  }

  .resumen-encabezado {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
