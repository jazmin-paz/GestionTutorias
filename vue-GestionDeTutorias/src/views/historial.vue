
<template>
  <main class="main-content">
    <div class="historial-contenedor">

      <h1 class="historial-titulo">Historial</h1>

      <!-- BOTÓN PARA NUEVA TUTORÍA -->
      <div class="historial-acciones">
        <button
          type="button"
          class="boton-guardar-asistencia"
          @click="abrirFormulario"
        >
          <i class="fa-solid fa-plus"></i>
          Nueva tutoría
        </button>
      </div>

      <!-- FORMULARIO -->
      <div v-if="formularioAbierto" class="formulario-historial">

        <h2>{{ editando ? "Editar tutoría" : "Registrar tutoría" }}</h2>

        <div class="formulario-historial-campos">

          <div class="campo-asistencia">
            <label for="fecha-tutoria">Fecha</label>
            <input
              id="fecha-tutoria"
              type="date"
              v-model="formulario.fecha"
            />
          </div>

          <div class="campo-asistencia">
            <label for="materia-tutoria">Motivo / Materia</label>

            <select
              id="materia-tutoria"
              v-model="formulario.motivo"
            >
              <option value="">Seleccionar materia</option>
              <option>Matemática</option>
              <option>Lengua</option>
              <option>Historia</option>
              <option>Geografía</option>
              <option>Biología</option>
              <option>Física</option>
              <option>Química</option>
              <option>Inglés</option>
            </select>
          </div>

          <div class="campo-asistencia">
            <label for="presentes">Estudiantes presentes</label>
            <input
              id="presentes"
              type="number"
              min="0"
              step="1"
              placeholder="Cantidad"
              v-model.number="formulario.presentes"
            />
          </div>

          <div class="campo-asistencia">
            <label for="total-estudiantes">Total del curso</label>
            <input
              id="total-estudiantes"
              type="number"
              min="1"
              step="1"
              placeholder="Cantidad total"
              v-model.number="formulario.total"
            />
          </div>

        </div>

        <p v-if="errorFormulario" class="error-historial">
          {{ errorFormulario }}
        </p>

        <div class="botones-formulario-historial">
          <button
            type="button"
            class="boton-guardar-asistencia"
            @click="guardarTutoria"
          >
            <i class="fa-solid fa-floppy-disk"></i>
            {{ editando ? "Guardar cambios" : "Guardar tutoría" }}
          </button>

          <button
            type="button"
            class="boton-cancelar-historial"
            @click="cerrarFormulario"
          >
            Cancelar
          </button>
        </div>

      </div>

      <!-- SELECTOR DE MES -->
      <div class="selector-mes">

        <button
          type="button"
          class="boton-mes"
          @click="cambiarMes(-1)"
          aria-label="Mes anterior"
        >
          <i class="fa-solid fa-chevron-left"></i>
        </button>

        <h2>{{ nombreMes }}</h2>

        <button
          type="button"
          class="boton-mes"
          @click="cambiarMes(1)"
          aria-label="Mes siguiente"
        >
          <i class="fa-solid fa-chevron-right"></i>
        </button>

      </div>

      <!-- TABLA -->
      <div class="tabla-contenedor">

        <table class="tabla-historial">

          <thead>
            <tr>
              <th>Fecha</th>
              <th>Motivo</th>
              <th>Estudiantes</th>
              <th>Estadísticas</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>

            <tr
              v-for="tutoria in tutoriasDelMes"
              :key="tutoria.id"
            >
              <td>{{ formatearFecha(tutoria.fecha) }}</td>

              <td>{{ tutoria.motivo }}</td>

              <td>
                {{ tutoria.presentes }} / {{ tutoria.total }}
              </td>

              <td>
                <div>
                  Presentes: {{ tutoria.presentes }}
                </div>

                <div>
                  Ausentes: {{ tutoria.total - tutoria.presentes }}
                </div>

                <strong>
                  Asistencia: {{ calcularPorcentaje(tutoria) }}%
                </strong>

                <div>
                  Inasistencia: {{ calcularInasistencia(tutoria) }}%
                </div>
              </td>

              <td>
                <div class="acciones-historial">

                  <button
                    type="button"
                    class="boton-editar-historial"
                    title="Editar tutoría"
                    @click="editarTutoria(tutoria)"
                  >
                    <i class="fa-solid fa-pen"></i>
                  </button>

                  <button
                    type="button"
                    class="boton-eliminar-historial"
                    title="Eliminar tutoría"
                    @click="eliminarTutoria(tutoria.id)"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>

                </div>
              </td>
            </tr>

          </tbody>

        </table>

      </div>

      <p
        v-if="tutoriasDelMes.length === 0"
        class="sin-registros"
      >
        No hay tutorías registradas este mes.
      </p>

    </div>
  </main>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";

const CLAVE_HISTORIAL = "historialTutorias";

const fechaActual = new Date();

const mesMostrado = ref(
  new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1)
);

const tutorias = ref([]);

const formularioAbierto = ref(false);
const editando = ref(false);
const idEditando = ref(null);
const errorFormulario = ref("");

const formularioInicial = () => ({
  fecha: "",
  motivo: "",
  presentes: "",
  total: ""
});

const formulario = reactive(formularioInicial());

// Nombre del mes
const nombreMes = computed(() => {
  return mesMostrado.value.toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric"
  });
});

// Filtrar tutorías del mes seleccionado
const tutoriasDelMes = computed(() => {
  const año = mesMostrado.value.getFullYear();
  const mes = String(mesMostrado.value.getMonth() + 1).padStart(2, "0");

  return tutorias.value
    .filter(tutoria =>
      tutoria.fecha.startsWith(`${año}-${mes}`)
    )
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
});

// Cambiar mes
function cambiarMes(cantidad) {
  mesMostrado.value = new Date(
    mesMostrado.value.getFullYear(),
    mesMostrado.value.getMonth() + cantidad,
    1
  );
}

// Abrir formulario
function abrirFormulario() {
  Object.assign(formulario, formularioInicial());

  editando.value = false;
  idEditando.value = null;
  errorFormulario.value = "";
  formularioAbierto.value = true;
}

// Cerrar formulario
function cerrarFormulario() {
  formularioAbierto.value = false;
  errorFormulario.value = "";
}

// Guardar en localStorage
function guardarEnLocalStorage() {
  localStorage.setItem(
    CLAVE_HISTORIAL,
    JSON.stringify(tutorias.value)
  );
}

// Cargar registros guardados
function cargarTutorias() {
  try {
    const datos = JSON.parse(
      localStorage.getItem(CLAVE_HISTORIAL) || "[]"
    );

    tutorias.value = Array.isArray(datos) ? datos : [];
  } catch (error) {
    console.error("Error al cargar el historial:", error);
    tutorias.value = [];
  }
}

// Validar y guardar tutoría
function guardarTutoria() {
  const presentes = Number(formulario.presentes);
  const total = Number(formulario.total);

  if (
    !formulario.fecha ||
    !formulario.motivo ||
    formulario.presentes === "" ||
    formulario.total === ""
  ) {
    errorFormulario.value = "Completá todos los campos.";
    return;
  }

  if (
    !Number.isInteger(presentes) ||
    !Number.isInteger(total) ||
    total < 1 ||
    presentes < 0
  ) {
    errorFormulario.value = "Ingresá cantidades enteras válidas.";
    return;
  }

  if (presentes > total) {
    errorFormulario.value =
      "Los estudiantes presentes no pueden superar el total del curso.";
    return;
  }

  const nuevaTutoria = {
    id: editando.value ? idEditando.value : Date.now(),
    fecha: formulario.fecha,
    motivo: formulario.motivo,
    presentes,
    total
  };

  if (editando.value) {
    const indice = tutorias.value.findIndex(
      tutoria => tutoria.id === idEditando.value
    );

    if (indice !== -1) {
      tutorias.value[indice] = nuevaTutoria;
    }
  } else {
    tutorias.value.push(nuevaTutoria);
  }

  guardarEnLocalStorage();

  // Mostrar el mes de la tutoría guardada
  const [año, mes] = nuevaTutoria.fecha.split("-");

  mesMostrado.value = new Date(
    Number(año),
    Number(mes) - 1,
    1
  );

  cerrarFormulario();

  alert(
    editando.value
      ? "¡Tutoría actualizada correctamente!"
      : "¡Tutoría guardada correctamente!"
  );
}

// Editar tutoría
function editarTutoria(tutoria) {
  editando.value = true;
  idEditando.value = tutoria.id;

  Object.assign(formulario, {
    fecha: tutoria.fecha,
    motivo: tutoria.motivo,
    presentes: tutoria.presentes,
    total: tutoria.total
  });

  errorFormulario.value = "";
  formularioAbierto.value = true;
}

// Eliminar tutoría
function eliminarTutoria(id) {
  const confirmar = confirm(
    "¿Estás seguro de que querés eliminar esta tutoría?"
  );

  if (!confirmar) return;

  tutorias.value = tutorias.value.filter(
    tutoria => tutoria.id !== id
  );

  guardarEnLocalStorage();

  alert("La tutoría fue eliminada correctamente.");
}

// Calcular porcentajes
function calcularPorcentaje(tutoria) {
  if (!tutoria.total) return 0;

  return Math.round(
    (tutoria.presentes / tutoria.total) * 100
  );
}

function calcularInasistencia(tutoria) {
  return 100 - calcularPorcentaje(tutoria);
}

// Formato de fecha
function formatearFecha(fecha) {
  if (!fecha) return "";

  const [año, mes, dia] = fecha.split("-");

  return `${dia}/${mes}/${año}`;
}

onMounted(() => {
  cargarTutorias();
});
</script>
