<script setup>
import { ref, reactive } from 'vue'
const emit = defineEmits(['volver'])
const mensaje = ref('')
const ficha = reactive({ fecha: '', curso: '', asignatura: '', estudiante: '', contenidos: '', motivos: '' })
let guardada = null
function guardar() {
  if (!ficha.fecha || !ficha.curso || !ficha.asignatura || !ficha.estudiante) {
    mensaje.value = 'Completá fecha, curso, asignatura y estudiante.'
    return
  }
  guardada = { ...ficha }
  mensaje.value = 'Observación guardada durante esta sesión.'
}
function cancelar() {
  Object.assign(ficha, guardada || { fecha: '', curso: '', asignatura: '', estudiante: '', contenidos: '', motivos: '' })
  mensaje.value = 'Cambios sin guardar descartados.'
}


function imprimir() {
  window.print()
}
</script>

<template>

  


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
            id="fecha" v-model="ficha.fecha"
          >

        </div>


        <div class="campo-observacion">

          <label for="curso">
            Curso
          </label>

          <select id="curso" v-model="ficha.curso">

            <option value="">
              Seleccionar curso
            </option>

            <option>
              Primer año
            </option>

            <option>
              Segundo año
            </option>

            <option>
              Tercer año
            </option>

            <option>
              Cuarto año
            </option>

            <option>
              Quinto año
            </option>

            <option>
              Sexto año
            </option>

          </select>

        </div>


        <div class="campo-observacion">

          <label for="asignatura">
            Asignatura
          </label>

          <select id="asignatura" v-model="ficha.asignatura">

            <option value="">
              Seleccionar asignatura
            </option>

            <option>
              Matemática
            </option>

            <option>
              Lengua
            </option>

            <option>
              Historia
            </option>

            <option>
              Geografía
            </option>

            <option>
              Inglés
            </option>

            <option>
              Biología
            </option>

            <option>
              Física
            </option>

            <option>
              Química
            </option>

            <option>
              Informática
            </option>

            <option>
              Educación Física
            </option>

          </select>

        </div>

      </div>


      <!-- ESTUDIANTE -->

      <div class="campo-observacion estudiante-observacion">

        <label for="estudiante">
          Estudiante
        </label>

        <select id="estudiante" v-model="ficha.estudiante">

          <option value="">
            Seleccionar estudiante
          </option>

          <option>
            Mateo González
          </option>

          <option>
            Valentina Rodríguez
          </option>

          <option>
            Santiago Fernández
          </option>

          <option>
            Camila Martínez
          </option>

          <option>
            Tomás López
          </option>

          <option>
            Martina Sánchez
          </option>

          <option>
            Lucas Romero
          </option>

          <option>
            Agustina Torres
          </option>

          <option>
            Benjamín Herrera
          </option>

          <option>
            Julieta Castro
          </option>

          <option>
            Franco Medina
          </option>

          <option>
            Sofía Navarro
          </option>

          <option>
            Juan Cruz Molina
          </option>

          <option>
            Emilia Vargas
          </option>

          <option>
            Nicolás Pereyra
          </option>

        </select>

      </div>


      <!-- CONTENIDOS Y MOTIVOS -->

      <div class="fila-textareas">

        <div class="campo-observacion">

          <label for="contenidos">
            Contenidos a trabajar
          </label>

          <textarea
            id="contenidos" v-model="ficha.contenidos"
            placeholder="Escriba los contenidos trabajados durante la tutoría..."
          ></textarea>

        </div>


        <div class="campo-observacion">

          <label for="motivos">
            Motivos de la tutoría
          </label>

          <textarea
            id="motivos" v-model="ficha.motivos"
            placeholder="Escriba el motivo de la tutoría..."
          ></textarea>

        </div>

      </div>


      <!-- BOTONES -->

      <p role="status">{{ mensaje }}</p><div class="botones-observacion">

        <button
          class="boton-observacion boton-editar" @click="guardar"
        >
          Guardar cambios
        </button>


        <button
          class="boton-observacion boton-reprogramar" @click="mensaje = 'Elegí otra fecha y pulsá Guardar cambios.'"
        >
          Reprogramar
        </button>


        <button
          class="boton-observacion boton-cancelar" @click="cancelar"
        >
          Cancelar
        </button>


        <button
          class="boton-observacion boton-reenviar" @click="mensaje = 'El envío de correos requiere conectar un servidor.'"
        >
          Reenviar
        </button>


        <button
          class="boton-observacion boton-imprimir"
          @click="imprimir"
        >
          Imprimir
        </button>


        <button
          class="boton-observacion boton-volver"
          @click="emit('volver')"
        >
          Volver
        </button>

      </div>

    </div>

  </main>


  

</template>
<style scoped>
@media print { .botones-observacion { display: none; } }


* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

#app {
    width: 100%;
    min-height: 100%;
}

body {
    font-family: Arial, Helvetica, sans-serif;
    background-color: #c7e4c3;
    color: #26332d;
    min-height: 100vh;
}


/* =====================================================
   BARRA LATERAL
   ===================================================== */

.sidebar {
    position: fixed;
    left: 20px;
    top: 20px;
    bottom: 20px;
    width: 75px;

    background-color: #57bb7f;
    border-radius: 25px;

    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 25px 0;

    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);

    z-index: 10;
}

.sidebar-icon {
    width: 50px;
    height: 50px;

    display: flex;
    justify-content: center;
    align-items: center;

    color: #269b61;
    text-decoration: none;

    border-radius: 15px;

    font-size: 22px;

    transition: 0.25s ease;
}

.biblioteca-icon {
    margin-top: 25px;
}

.perfil-icon {
    margin-top: auto;
}

.sidebar-icon:hover {
    background-color: #e5f3eb;
    color: #20774d;
    transform: scale(1.05);
}


/* =====================================================
   CONTENIDO PRINCIPAL
   ===================================================== */

.main-content {
    margin-left: 120px;

    min-height: 100vh;

    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 80px 50px;
}

h1 {
    font-size: 42px;
    font-weight: 600;

    color: #347c59;

    margin-bottom: 10px;
}


/* =====================================================
   ENCABEZADO DE BIBLIOTECA
   ===================================================== */

.encabezado {
    background-color: #347c59;

    border-radius: 15px;

    padding: 30px 100px;
    margin-bottom: 45px;

    text-align: center;

    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.title {
    margin: 0;

    color: white;
    font-size: 32px;
}

.subtitulo {
    margin: 10px 0 0;

    color: white;
    font-size: 16px;
}


/* =====================================================
   OPCIONES DE BIBLIOTECA
   ===================================================== */

.opciones {
    width: 100%;
    max-width: 1000px;

    display: flex;
    justify-content: center;
    align-items: flex-start;

    gap: 80px;
}

.opcion {
    text-decoration: none;
    color: #26332d;

    display: flex;
    flex-direction: column;
    align-items: center;

    width: 220px;

    transition: 0.25s ease;
}

.icono-circular {
    width: 155px;
    height: 155px;

    border-radius: 50%;

    background-color: #57bb7f;

    display: flex;
    justify-content: center;
    align-items: center;

    color: #438b66;
    font-size: 52px;

    margin-bottom: 25px;

    box-shadow: 0 8px 20px rgba(55, 120, 85, 0.10);

    transition: 0.3s ease;
}

.opcion span {
    font-size: 19px;
    font-weight: 600;

    text-align: center;
    line-height: 1.4;
}

.opcion:hover {
    transform: translateY(-8px);
}

.opcion:hover .icono-circular {
    background-color: #438b66;
    color: white;

    box-shadow: 0 12px 25px rgba(55, 120, 85, 0.20);

    transform: scale(1.05);
}


/* =====================================================
   FICHA DE OBSERVACIONES
   ===================================================== */

.observaciones-contenedor {
    width: 90%;
    max-width: 1000px;

    background-color: white;

    padding: 35px;

    border-radius: 20px;

    box-shadow: 0 5px 20px rgba(55, 120, 85, 0.12);
}


/* =====================================================
   TÍTULO DE OBSERVACIONES
   ===================================================== */

.observaciones-titulo {
    text-align: center;

    color: #347c59;

    font-size: 32px;

    margin-bottom: 30px;
}


/* =====================================================
   FECHA - CURSO - ASIGNATURA
   ===================================================== */

.fila-datos {
    width: 100%;

    display: grid;

    grid-template-columns: repeat(3, 1fr);

    gap: 18px;

    margin-bottom: 20px;
}


/* =====================================================
   CAMPOS DEL FORMULARIO
   ===================================================== */

.campo-observacion {
    display: flex;

    flex-direction: column;

    gap: 8px;
}

.campo-observacion label {
    font-size: 15px;

    font-weight: 600;

    color: #347c59;
}


/* =====================================================
   INPUTS, SELECTS Y TEXTAREAS
   ===================================================== */

.campo-observacion input,
.campo-observacion select,
.campo-observacion textarea {
    width: 100%;

    padding: 13px;

    border: 1px solid #b8d6c1;

    border-radius: 10px;

    background-color: #f8fcf9;

    color: #26332d;

    font-size: 15px;

    outline: none;

    transition: 0.25s ease;
}


/* =====================================================
   EFECTO AL SELECCIONAR UN CAMPO
   ===================================================== */

.campo-observacion input:focus,
.campo-observacion select:focus,
.campo-observacion textarea:focus {
    border-color: #57bb7f;

    box-shadow: 0 0 0 3px rgba(87, 187, 127, 0.15);
}


/* =====================================================
   ESTUDIANTE
   ===================================================== */

.estudiante-observacion {
    margin-bottom: 20px;
}


/* =====================================================
   CONTENIDOS Y MOTIVOS
   ===================================================== */

.fila-textareas {
    display: grid;

    grid-template-columns: 1fr 1fr;

    gap: 20px;

    margin-bottom: 30px;
}

.campo-observacion textarea {
    min-height: 150px;

    resize: vertical;
}


/* =====================================================
   BOTONES DE OBSERVACIONES
   ===================================================== */

.botones-observacion {
    display: grid;

    grid-template-columns: repeat(3, 1fr);

    gap: 12px;
}

.boton-observacion {
    border: none;

    padding: 14px;

    border-radius: 10px;

    font-size: 15px;

    font-weight: 600;

    cursor: pointer;

    transition: 0.25s ease;
}


/* =====================================================
   EFECTO HOVER DE LOS BOTONES
   ===================================================== */

.boton-observacion:hover {
    transform: translateY(-2px);

    box-shadow: 0 5px 12px rgba(55, 120, 85, 0.15);
}


/* =====================================================
   COLORES DE LOS BOTONES
   ===================================================== */

.boton-editar {
    background-color: #90caf9;
    color: #0d47a1;
}

.boton-reprogramar {
    background-color: #ffcc80;
    color: #e65100;
}

.boton-cancelar {
    background-color: #ef9a9a;
    color: #b71c1c;
}

.boton-reenviar {
    background-color: #b39ddb;
    color: #4527a0;
}

.boton-imprimir {
    background-color: #b0bec5;
    color: #263238;
}

.boton-volver {
    background-color: #a5d6a7;
    color: #1b5e20;
}


/* =====================================================
   FOOTER
   ===================================================== */

.footer {
    margin-top: 60px;

    padding: 50px;

    text-align: center;

    background-color: #57bb7f;

    color: white;

    font-size: 13px;
}

.footer p {
    margin: 0;
}


/* =====================================================
   RESPONSIVE - PANTALLAS MEDIANAS
   ===================================================== */

@media (max-width: 900px) {

    .opciones {
        gap: 30px;
    }

    .icono-circular {
        width: 135px;
        height: 135px;

        font-size: 45px;
    }

    .observaciones-contenedor {
        max-width: 800px;
    }

    .fila-datos {
        grid-template-columns: 1fr 1fr;
    }

}


/* =====================================================
   RESPONSIVE - CELULARES
   ===================================================== */

@media (max-width: 700px) {

    .sidebar {
        width: 60px;

        left: 10px;
        top: 10px;
        bottom: 10px;
    }

    .sidebar-icon {
        width: 45px;
        height: 45px;
    }

    .main-content {
        margin-left: 80px;

        padding: 50px 20px;
    }

    h1 {
        font-size: 34px;
    }

    .opciones {
        flex-direction: column;

        align-items: center;

        gap: 40px;
    }

    .observaciones-contenedor {
        padding: 25px;
    }

    .observaciones-titulo {
        font-size: 28px;
    }

    .fila-datos {
        grid-template-columns: 1fr;
    }

    .fila-textareas {
        grid-template-columns: 1fr;
    }

    .botones-observacion {
        grid-template-columns: 1fr;
    }

}
.main-content { margin-left: 0; min-height: auto; padding: 28px 12px; }
.opcion { border: 0; background: transparent; cursor: pointer; }
.encabezado { padding: 28px; } .observaciones-contenedor { width: 100%; }

</style>
