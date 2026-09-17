<template>

  <aside class="sidebar">

    <a
      href="#"
      class="sidebar-icon"
      title="Inicio"
    >
      🏠
    </a>

    <a
      href="#"
      class="sidebar-icon biblioteca-icon"
      title="Biblioteca"
      @click.prevent="$emit('volver')"
    >
      📚
    </a>

    <a
      href="#"
      class="sidebar-icon perfil-icon"
      title="Perfil"
    >
      👤
    </a>

  </aside>


  <main class="main-content">

    <div class="observaciones-contenedor">

      <h1 class="observaciones-titulo">
        Observaciones
      </h1>


      <!-- FECHA - CURSO - ASIGNATURA -->

      <div class="fila-datos">

        <div class="campo-observacion">

          <label for="fecha">
            Fecha
          </label>

          <input
            type="date"
            id="fecha"
          >

        </div>


        <div class="campo-observacion">

          <label for="curso">
            Curso
          </label>

          <select id="curso">

            <option value="">
              Seleccionar curso
            </option>

            <option>Primer año</option>
            <option>Segundo año</option>
            <option>Tercer año</option>
            <option>Cuarto año</option>
            <option>Quinto año</option>
            <option>Sexto año</option>

          </select>

        </div>


        <div class="campo-observacion">

          <label for="asignatura">
            Asignatura
          </label>

          <select id="asignatura">

            <option value="">
              Seleccionar asignatura
            </option>

            <option>Matemática</option>
            <option>Lengua</option>
            <option>Historia</option>
            <option>Geografía</option>
            <option>Inglés</option>
            <option>Biología</option>
            <option>Física</option>
            <option>Química</option>
            <option>Informática</option>
            <option>Educación Física</option>

          </select>

        </div>

      </div>


      <!-- ESTUDIANTE -->

      <div class="campo-observacion estudiante-observacion">

        <label for="estudiante">
          Estudiante
        </label>

        <select id="estudiante">

          <option value="">
            Seleccionar estudiante
          </option>

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


      <!-- CONTENIDOS Y MOTIVOS -->

      <div class="fila-textareas">

        <div class="campo-observacion">

          <label for="contenidos">
            Contenidos a trabajar
          </label>

          <textarea
            id="contenidos"
            placeholder="Escriba los contenidos trabajados durante la tutoría..."
          ></textarea>

        </div>


        <div class="campo-observacion">

          <label for="motivos">
            Motivos de la tutoría
          </label>

          <textarea
            id="motivos"
            placeholder="Escriba el motivo de la tutoría..."
          ></textarea>

        </div>

      </div>


      <!-- BOTONES -->

      <div class="botones-observacion">

        <button class="boton-observacion boton-editar">
          Editar
        </button>

        <button class="boton-observacion boton-reprogramar">
          Reprogramar
        </button>

        <button class="boton-observacion boton-cancelar">
          Cancelar
        </button>

        <button class="boton-observacion boton-reenviar">
          Reenviar
        </button>

        <button
          class="boton-observacion boton-imprimir"
          @click="window.print()"
        >
          Imprimir
        </button>

        <button
          class="boton-observacion boton-volver"
          @click="$emit('volver')"
        >
          Volver
        </button>

      </div>

    </div>

  </main>


  <footer class="footer">

    <p>
      © 2026 Biblioteca · Escuela ProA La Falda
    </p>

  </footer>

</template>