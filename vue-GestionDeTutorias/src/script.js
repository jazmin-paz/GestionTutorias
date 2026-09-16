/* =========================
   CURSOS
========================= */

let numeroDeCursos = 3;

let cursoActual = 1;


/* Cada curso tiene sus propias materias */

let materiasPorCurso = {

    1: [],

    2: [],

    3: []

};



/* Colores de las materias */

let colores = [

    "#b9d9c5",

    "#f0dfa5",

    "#edc3c8",

    "#bdd8e9",

    "#d9c5e8"

];


let colorActual = 0;



/* =========================
   CAMBIAR DE CURSO
========================= */

function mostrarCurso(numero) {

    cursoActual = numero;


    /* Cambiar título */

    document.getElementById("cursoActual").innerHTML =
        "Curso " + numero;


    /* Quitar el botón activo */

    let cursos =
        document.querySelectorAll(".curso");


    cursos.forEach(function(curso) {

        curso.classList.remove("activo");

    });


    /* Activar el curso seleccionado */

    cursos[numero - 1].classList.add("activo");


    /* Mostrar las materias de ese curso */

    mostrarMaterias();

}



/* =========================
   AGREGAR CURSO
========================= */

function agregarCurso() {

    numeroDeCursos++;


    /* Crear espacio para sus materias */

    materiasPorCurso[numeroDeCursos] = [];


    /* Crear botón */

    let nuevoCurso =
        document.createElement("button");


    nuevoCurso.className = "curso";


    nuevoCurso.innerHTML =
        "Curso " + numeroDeCursos;


    nuevoCurso.onclick = function() {

        mostrarCurso(numeroDeCursos);

    };


    document
        .getElementById("listaCursos")
        .appendChild(nuevoCurso);

}



/* =========================
   MOSTRAR CAJA DE MATERIA
========================= */

function mostrarCajaMateria() {

    document
        .getElementById("cajaMateria")
        .style.display = "block";


    document
        .getElementById("nombreMateria")
        .focus();

}



/* =========================
   AGREGAR MATERIA
========================= */

function agregarMateria() {

    let input =
        document.getElementById("nombreMateria");


    let nombre =
        input.value;


    /* Si está vacío no hacemos nada */

    if (nombre == "") {

        return;

    }


    /* Guardar materia */

    materiasPorCurso[cursoActual].push({

        nombre: nombre,

        color: colores[colorActual]

    });


    /* Cambiar color */

    colorActual++;


    if (colorActual == colores.length) {

        colorActual = 0;

    }


    /* Limpiar */

    input.value = "";


    /* Mostrar */

    mostrarMaterias();

}



/* =========================
   MOSTRAR MATERIAS
========================= */

function mostrarMaterias() {

    let lista =
        document.getElementById("listaMaterias");


    lista.innerHTML = "";


    let materias =
        materiasPorCurso[cursoActual];


    materias.forEach(function(materia, indice) {


        let nuevaMateria =
            document.createElement("div");


        nuevaMateria.className = "materia";


        nuevaMateria.style.backgroundColor =
            materia.color;


        nuevaMateria.innerHTML =
            materia.nombre;


        /* Botón eliminar */

        let boton =
            document.createElement("button");


        boton.className = "eliminar";

        boton.innerHTML = "×";


        boton.onclick = function() {

            eliminarMateria(indice);

        };


        nuevaMateria.appendChild(boton);


        lista.appendChild(nuevaMateria);

    });

}



/* =========================
   ELIMINAR MATERIA
========================= */

function eliminarMateria(indice) {

    materiasPorCurso[cursoActual].splice(indice, 1);


    mostrarMaterias();

}