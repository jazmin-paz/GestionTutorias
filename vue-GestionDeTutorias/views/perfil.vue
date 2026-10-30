<template>
  <main class="main-content">
    <div class="perfil-contenedor">
      <h1>Información Personal</h1>

      <!-- INFORMACIÓN DEL USUARIO -->
      <div class="perfil-superior">

        <!-- FOTO DE PERFIL -->
        <div class="foto-seccion">
          <label for="fotoUsuario" class="foto-perfil">
            <i
              v-if="!imagenPerfil"
              class="fa-solid fa-user"
              id="iconoFoto"
            ></i>

            <img
              v-else
              :src="imagenPerfil"
              alt="Foto de perfil"
              id="imagenPerfil"
            />
          </label>

          <input
            ref="inputFoto"
            type="file"
            id="fotoUsuario"
            accept="image/*"
            @change="cambiarFoto"
          />

          <p>Haz clic para agregar una foto</p>

          <button
            type="button"
            class="boton-quitar-foto"
            id="quitarFoto"
            @click="quitarFoto"
          >
            <i class="fa-solid fa-trash"></i>
            Quitar foto
          </button>
        </div>

        <!-- DATOS DEL USUARIO -->
        <div class="datos-usuario">

          <!-- NOMBRE -->
          <div class="campo-perfil">
            <label for="nombreApellido">
              Nombre y Apellido
            </label>

            <div class="input-perfil">
              <i class="fa-solid fa-user"></i>

              <input
                type="text"
                id="nombreApellido"
                v-model="perfil.nombreApellido"
                placeholder="Ingrese su nombre y apellido"
              />
            </div>
          </div>

          <!-- CORREO -->
          <div class="campo-perfil">
            <label for="correoElectronico">
              Correo electrónico
            </label>

            <div class="input-perfil">
              <i class="fa-solid fa-envelope"></i>

              <input
                type="email"
                id="correoElectronico"
                v-model="perfil.correoElectronico"
                placeholder="Ingrese su correo electrónico"
              />
            </div>
          </div>

          <!-- TELÉFONO -->
          <div class="campo-perfil">
            <label for="numeroTelefono">
              Número de teléfono
            </label>

            <div class="input-perfil">
              <i class="fa-solid fa-phone"></i>

              <input
                type="tel"
                id="numeroTelefono"
                v-model="perfil.numeroTelefono"
                placeholder="Ingrese su número de teléfono"
              />
            </div>
          </div>

          <!-- CARGO -->
          <div class="campo-perfil">
            <label for="cargo">
              Cargo
            </label>

            <div class="input-perfil">
              <i class="fa-solid fa-briefcase"></i>

              <select
                id="cargo"
                v-model="perfil.cargo"
              >
                <option value="">
                  Seleccione un cargo
                </option>

                <option value="docente">
                  Docente
                </option>

                <option value="gestion">
                  Equipo de gestión
                </option>
              </select>
            </div>
          </div>

        </div>
      </div>

      <!-- ASIGNACIONES -->
      <div class="asignaciones">

        <!-- MATERIAS -->
        <button
          type="button"
          class="boton-asignacion"
          id="botonMaterias"
          @click="abrirMaterias"
        >
          <i class="fa-solid fa-book"></i>

          <span>Materias asignadas</span>

          <small>
            {{
              materiasAsignadas.length
                ? materiasAsignadas.join(", ")
                : "Seleccionar materias"
            }}
          </small>
        </button>

        <!-- CURSOS -->
        <button
          type="button"
          class="boton-asignacion"
          id="botonCursos"
          @click="abrirCursos"
        >
          <i class="fa-solid fa-school"></i>

          <span>Cursos asignados</span>

          <small>
            {{
              cursosAsignados.length
                ? cursosAsignados.join(", ")
                : "Seleccionar cursos"
            }}
          </small>
        </button>

      </div>

      <!-- GUARDAR PERFIL -->
      <div class="guardar-perfil">
        <button
          type="button"
          class="boton-guardar-perfil"
          id="guardarCambios"
          @click="guardarCambios"
        >
          <i class="fa-solid fa-floppy-disk"></i>
          Guardar cambios
        </button>
      </div>

    </div>

    <!-- =================================================
         MODAL DE MATERIAS
         ================================================= -->
    <div
      v-if="modalMateriasAbierto"
      class="modal-perfil"
      id="modalMaterias"
      @click.self="cerrarMaterias"
    >
      <div class="modal-contenido-perfil">

        <button
          type="button"
          class="cerrar-modal"
          id="cerrarMaterias"
          @click="cerrarMaterias"
          aria-label="Cerrar modal de materias"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>

        <h2>Materias asignadas</h2>

        <p>
          Seleccione las materias que tiene asignadas.
        </p>

        <div class="lista-opciones">
          <label
            v-for="materia in opcionesMaterias"
            :key="materia"
          >
            <input
              type="checkbox"
              :value="materia"
              v-model="materiasTemporales"
            />

            {{ materia }}
          </label>
        </div>

        <div class="guardar-perfil">
          <button
            type="button"
            class="boton-guardar-perfil"
            id="guardarMaterias"
            @click="guardarMaterias"
          >
            <i class="fa-solid fa-floppy-disk"></i>
            Guardar cambios
          </button>
        </div>

      </div>
    </div>

    <!-- =================================================
         MODAL DE CURSOS
         ================================================= -->
    <div
      v-if="modalCursosAbierto"
      class="modal-perfil"
      id="modalCursos"
      @click.self="cerrarCursos"
    >
      <div class="modal-contenido-perfil">

        <button
          type="button"
          class="cerrar-modal"
          id="cerrarCursos"
          @click="cerrarCursos"
          aria-label="Cerrar modal de cursos"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>

        <h2>Cursos asignados</h2>

        <p>
          Seleccione los cursos a los que enseña.
        </p>

        <div class="lista-opciones">
          <label
            v-for="curso in opcionesCursos"
            :key="curso.value"
          >
            <input
              type="checkbox"
              :value="curso.value"
              v-model="cursosTemporales"
            />

            {{ curso.label }}
          </label>
        </div>

        <div class="guardar-perfil">
          <button
            type="button"
            class="boton-guardar-perfil"
            id="guardarCursos"
            @click="guardarCursos"
          >
            <i class="fa-solid fa-floppy-disk"></i>
            Guardar cambios
          </button>
        </div>

      </div>
    </div>

  </main>
</template>

<script setup>
import "./perfil.js";
import { usePerfil } from "./perfil.js";

const {
  perfil,
  imagenPerfil,
  inputFoto,

  materiasAsignadas,
  cursosAsignados,

  materiasTemporales,
  cursosTemporales,

  opcionesMaterias,
  opcionesCursos,

  modalMateriasAbierto,
  modalCursosAbierto,

  cambiarFoto,
  quitarFoto,

  abrirMaterias,
  cerrarMaterias,
  guardarMaterias,

  abrirCursos,
  cerrarCursos,
  guardarCursos,

  guardarCambios
} = usePerfil();
</script>