
<template>
  <main class="main-content">
    <div class="asistencia-contenedor">

      <h1 class="asistencia-titulo">
        Registro de Asistencia
      </h1>

      <!-- ESTUDIANTE - FECHA - HORARIO -->
      <div class="asistencia-fila-tres">

        <div class="campo-asistencia">
          <label for="estudiante">Estudiante</label>

          <select id="estudiante" v-model="asistencia.estudiante" required>
            <option value="">Seleccionar estudiante</option>
            <option>Mateo González</option>
            <option>Valentina Rodríguez</option>
            <option>Santiago Fernández</option>
            <option>Camila Martínez</option>
            <option>Tomás López</option>
            <option>Martina Sánchez</option>
            <option>Lucas Romero</option>
            <option>Agustina Torres</option>
            <option>Benjamín Herrera</option>
            <option>Julieta Castro</option>
            <option>Franco Medina</option>
            <option>Sofía Navarro</option>
            <option>Juan Cruz Molina</option>
            <option>Emilia Vargas</option>
            <option>Nicolás Pereyra</option>
          </select>
        </div>

        <div class="campo-asistencia">
          <label for="fecha">Fecha</label>

          <input
            type="date"
            id="fecha"
            v-model="asistencia.fecha"
            required
          />
        </div>

        <div class="campo-asistencia">
          <label for="horario">Horario</label>

          <select id="horario" v-model="asistencia.horario" required>
            <option value="">Seleccionar horario</option>
            <option>7:30 - 8:00</option>
            <option>14:30 - 15:00</option>
            <option>15:00 - 15:30</option>
            <option>15:30 - 16:00</option>
            <option>16:00 - 16:30</option>
            <option>16:30 - 17:00</option>
            <option>17:00 - 17:30</option>
            <option>17:30 - 18:00</option>
          </select>
        </div>

      </div>

      <!-- ASIGNATURA - ESTADO - CONVOCADOS -->
      <div class="asistencia-fila-tres">

        <div class="campo-asistencia">
          <label for="asignatura">Asignatura</label>

          <select id="asignatura" v-model="asistencia.asignatura" required>
            <option value="">Seleccionar asignatura</option>
            <option>Inglés</option>
            <option>Matemática</option>
            <option>Lengua</option>
            <option>Historia</option>
            <option>Geografía</option>
            <option>Biología</option>
            <option>Física</option>
            <option>Química</option>
          </select>
        </div>

        <div class="campo-asistencia">
          <label for="estado">Estado</label>

          <select id="estado" v-model="asistencia.estado" required>
            <option value="">Seleccionar estado</option>
            <option>Presente</option>
            <option>Ausente</option>
            <option>Llegó tarde</option>
          </select>
        </div>

        <div class="campo-asistencia">
          <label for="convocados">Estudiantes convocados</label>

          <input
            type="number"
            id="convocados"
            min="1"
            placeholder="Cantidad"
            v-model.number="asistencia.convocados"
            required
          />
        </div>

      </div>

      <!-- OBSERVACIONES Y COMPROMISOS -->
      <div class="asistencia-fila-textareas">

        <div class="campo-asistencia">
          <label for="observaciones">Observaciones</label>

          <textarea
            id="observaciones"
            v-model="asistencia.observaciones"
            placeholder="Escriba las observaciones de la tutoría..."
          ></textarea>
        </div>

        <div class="campo-asistencia compromisos">
          <label for="compromisos">Compromisos Futuros</label>

          <textarea
            id="compromisos"
            v-model="asistencia.compromisos"
            placeholder="Escriba los compromisos futuros..."
          ></textarea>
        </div>

      </div>

      <!-- CONTENIDOS -->
      <div class="campo-asistencia contenido-asistencia">
        <label for="contenidos">Contenidos a trabajar</label>

        <textarea
          id="contenidos"
          v-model="asistencia.contenidos"
          placeholder="Escriba los contenidos trabajados durante la tutoría..."
        ></textarea>
      </div>

      <!-- ACTIVIDADES Y GUARDAR -->
      <div class="asistencia-fila-final">

        <div class="campo-asistencia actividades">
          <label for="actividades">Actividades realizadas</label>

          <textarea
            id="actividades"
            v-model="asistencia.actividades"
            placeholder="Escriba las actividades realizadas..."
          ></textarea>
        </div>

        <button
          type="button"
          id="guardar-asistencia"
          class="boton-guardar-asistencia"
          @click="guardarAsistencia"
        >
          <i class="fa-solid fa-floppy-disk"></i>
          Guardar asistencia
        </button>

      </div>

    </div>
  </main>
</template>

<script setup>
import { reactive } from "vue";

const asistenciaInicial = () => ({
  estudiante: "",
  fecha: "",
  horario: "",
  asignatura: "",
  estado: "",
  convocados: "",
  observaciones: "",
  compromisos: "",
  contenidos: "",
  actividades: ""
});

const asistencia = reactive(asistenciaInicial());

function guardarAsistencia() {
  // Validar los campos obligatorios
  if (
    !asistencia.estudiante ||
    !asistencia.fecha ||
    !asistencia.horario ||
    !asistencia.asignatura ||
    !asistencia.estado ||
    !asistencia.convocados ||
    asistencia.convocados < 1
  ) {
    alert("Completá todos los campos obligatorios antes de guardar.");
    return;
  }

  try {
    // Recuperar los registros anteriores
    const registrosGuardados = JSON.parse(
      localStorage.getItem("registroAsistencias") || "[]"
    );

    if (!Array.isArray(registrosGuardados)) {
      throw new Error("Los registros guardados no tienen un formato válido.");
    }

    // Crear un nuevo registro
    const nuevoRegistro = {
      id: Date.now(),
      estudiante: asistencia.estudiante,
      fecha: asistencia.fecha,
      horario: asistencia.horario,
      asignatura: asistencia.asignatura,
      estado: asistencia.estado,
      convocados: asistencia.convocados,
      observaciones: asistencia.observaciones,
      compromisos: asistencia.compromisos,
      contenidos: asistencia.contenidos,
      actividades: asistencia.actividades
    };

    // Agregarlo a la lista
    registrosGuardados.push(nuevoRegistro);

    // Guardar en localStorage
    localStorage.setItem(
      "registroAsistencias",
      JSON.stringify(registrosGuardados)
    );

    alert("¡Asistencia guardada correctamente!");

    // Limpiar el formulario
    Object.assign(asistencia, asistenciaInicial());

  } catch (error) {
    console.error("Error al guardar la asistencia:", error);
    alert("No se pudo guardar la asistencia. Intentá nuevamente.");
  }
}
</script>