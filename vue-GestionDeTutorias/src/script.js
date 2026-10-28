
/* ==========================================
   DATOS PRINCIPALES
========================================== */

const colores = [
    "#dceee1",
    "#f5e9bc",
    "#f3d9dd",
    "#d9e9f5",
    "#e9def4",
    "#f5e3d3"
];

function datosIniciales() {
    return {
        cursos: [
            { id: 1, nombre: "Curso 1", materias: [] },
            { id: 2, nombre: "Curso 2", materias: [] },
            { id: 3, nombre: "Curso 3", materias: [] }
        ],
        tutorias: [],
        cursoActual: 1
    };
}

let datos;

try {
    datos = JSON.parse(localStorage.getItem("educonnectDatos"));
    if (!datos || !Array.isArray(datos.cursos) ||
        !Array.isArray(datos.tutorias)) {
        datos = datosIniciales();
    }
} catch (error) {
    datos = datosIniciales();
}

let cursoActual = datos.cursoActual || 1;
let fechaVisible = new Date();
fechaVisible.setDate(1);

function guardarDatos() {
    datos.cursoActual = cursoActual;
    localStorage.setItem("educonnectDatos", JSON.stringify(datos));
}

function obtenerCurso() {
    return datos.cursos.find(curso => curso.id === cursoActual);
}

function fechaLocal(fecha) {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
}

function fechaDeTexto(texto) {
    const [anio, mes, dia] = texto.split("-").map(Number);
    return new Date(anio, mes - 1, dia);
}

/* ==========================================
   CURSOS
========================================== */

function mostrarCursos() {
    const lista = document.getElementById("listaCursos");
    lista.innerHTML = "";

    datos.cursos.forEach(curso => {
        const boton = document.createElement("button");
        boton.className = "curso";
        boton.textContent = curso.nombre;

        if (curso.id === cursoActual) {
            boton.classList.add("activo");
        }

        boton.addEventListener("click", () => {
            mostrarCurso(curso.id);
        });

        lista.appendChild(boton);
    });
}

function mostrarCurso(id) {
    cursoActual = id;
    guardarDatos();
    actualizarPantalla();
}

function agregarCurso() {
    const nombre = prompt("¿Cómo querés llamar al nuevo curso?");

    if (nombre === null) return;

    const nombreLimpio = nombre.trim();

    if (!nombreLimpio) {
        alert("Ingresá un nombre válido.");
        return;
    }

    if (nombreLimpio.length > 40) {
        alert("El nombre debe tener como máximo 40 caracteres.");
        return;
    }

    const nuevoId = Math.max(
        0,
        ...datos.cursos.map(curso => curso.id)
    ) + 1;

    datos.cursos.push({
        id: nuevoId,
        nombre: nombreLimpio,
        materias: []
    });

    cursoActual = nuevoId;
    guardarDatos();
    actualizarPantalla();
}

/* ==========================================
   MATERIAS
========================================== */

function mostrarCajaMateria() {
    document.getElementById("cajaMateria")
        .classList.remove("oculto");

    document.getElementById("nombreMateria").focus();
}

function cerrarCajaMateria() {
    document.getElementById("cajaMateria")
        .classList.add("oculto");

    document.getElementById("nombreMateria").value = "";
}

function agregarMateria(evento) {
    evento.preventDefault();

    const input = document.getElementById("nombreMateria");
    const nombre = input.value.trim();

    if (!nombre) return;

    const curso = obtenerCurso();

    const existe = curso.materias.some(materia =>
        materia.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (existe) {
        alert("Esta materia ya existe en el curso.");
        return;
    }

    const nuevoId = Math.max(
        0,
        ...datos.cursos.flatMap(c =>
            c.materias.map(m => m.id)
        )
    ) + 1;

    curso.materias.push({
        id: nuevoId,
        nombre: nombre,
        color: colores[curso.materias.length % colores.length]
    });

    guardarDatos();
    cerrarCajaMateria();
    actualizarPantalla();
}

function mostrarMaterias() {
    const lista = document.getElementById("listaMaterias");
    lista.innerHTML = "";

    const materias = obtenerCurso().materias;

    if (materias.length === 0) {
        lista.innerHTML = `
            <div class="estadoVacio">
                Todavía no agregaste materias a este curso.
                <p>¡Empezá agregando una!</p>
            </div>
        `;
        return;
    }

    materias.forEach(materia => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "materia";
        tarjeta.style.backgroundColor = materia.color;

        const nombre = document.createElement("span");
        nombre.textContent = materia.nombre;

        const boton = document.createElement("button");
        boton.className = "eliminar";
        boton.textContent = "×";
        boton.title = "Eliminar materia";
        boton.setAttribute("aria-label", "Eliminar " + materia.nombre);

        boton.addEventListener("click", () => {
            eliminarMateria(materia.id);
        });

        tarjeta.appendChild(nombre);
        tarjeta.appendChild(boton);
        lista.appendChild(tarjeta);
    });
}

function eliminarMateria(id) {
    const curso = obtenerCurso();

    const tieneTutorias = datos.tutorias.some(tutoria =>
        tutoria.cursoId === cursoActual &&
        tutoria.materiaId === id
    );

    if (tieneTutorias) {
        alert("Primero eliminá las tutorías asociadas a esta materia.");
        return;
    }

    if (!confirm("¿Querés eliminar esta materia?")) return;

    curso.materias = curso.materias.filter(materia =>
        materia.id !== id
    );

    guardarDatos();
    actualizarPantalla();
}

/* ==========================================
   CALENDARIO
========================================== */

function mostrarCalendario() {
    const calendario = document.getElementById("calendario");
    calendario.innerHTML = "";

    const anio = fechaVisible.getFullYear();
    const mes = fechaVisible.getMonth();

    const nombreMes = fechaVisible.toLocaleDateString("es-AR", {
        month: "long",
        year: "numeric"
    });

    document.getElementById("mesActual").textContent = nombreMes;

    const diasSemana = [
        "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"
    ];

    diasSemana.forEach(nombre => {
        const encabezado = document.createElement("div");
        encabezado.className = "nombreDia";
        encabezado.textContent = nombre;
        calendario.appendChild(encabezado);
    });

    const primerDia = new Date(anio, mes, 1).getDay();
    const espacios = (primerDia + 6) % 7;

    const cantidadDias = new Date(anio, mes + 1, 0).getDate();

    for (let i = 0; i < espacios; i++) {
        const vacio = document.createElement("div");
        vacio.className = "dia vacio";
        calendario.appendChild(vacio);
    }

    const hoy = fechaLocal(new Date());

    for (let numero = 1; numero <= cantidadDias; numero++) {
        const fecha = fechaLocal(new Date(anio, mes, numero));

        const boton = document.createElement("button");
        boton.className = "dia";
        boton.type = "button";
        boton.setAttribute("aria-label", "Programar tutoría el " + fecha);

        if (fecha === hoy) {
            boton.classList.add("hoy");
        }

        const numeroDia = document.createElement("span");
        numeroDia.className = "numeroDia";
        numeroDia.textContent = numero;
        boton.appendChild(numeroDia);

        const tutoriasDelDia = datos.tutorias.filter(tutoria =>
            tutoria.cursoId === cursoActual &&
            tutoria.fecha === fecha
        ).sort((a, b) => a.hora.localeCompare(b.hora));

        tutoriasDelDia.slice(0, 2).forEach(tutoria => {
            const evento = document.createElement("span");
            evento.className = "eventoDia";
            evento.textContent = tutoria.hora + " " + tutoria.materia;
            boton.appendChild(evento);
        });

        if (tutoriasDelDia.length > 2) {
            const extra = document.createElement("span");
            extra.className = "eventoDia";
            extra.textContent = `+${tutoriasDelDia.length - 2} más`;
            boton.appendChild(extra);
        }

        boton.addEventListener("click", () => {
            abrirModal(fecha);
        });

        calendario.appendChild(boton);
    }
}

function cambiarMes(cantidad) {
    fechaVisible.setMonth(fechaVisible.getMonth() + cantidad);
    mostrarCalendario();
}

function volverHoy() {
    fechaVisible = new Date();
    fechaVisible.setDate(1);
    mostrarCalendario();
}

/* ==========================================
   CREAR TUTORÍAS
========================================== */

function abrirModal(fecha = null) {
    const materias = obtenerCurso().materias;

    if (materias.length === 0) {
        alert("Primero agregá una materia a este curso.");
        mostrarCajaMateria();
        return;
    }

    const select = document.getElementById("materiaTutoria");
    select.innerHTML = "";

    materias.forEach(materia => {
        const opcion = document.createElement("option");
        opcion.value = materia.id;
        opcion.textContent = materia.nombre;
        select.appendChild(opcion);
    });

    document.getElementById("fechaTutoria").value =
        fecha || fechaLocal(new Date());

    document.getElementById("horaTutoria").value = "10:00";
    document.getElementById("descripcionTutoria").value = "";

    document.getElementById("modalTutoria")
        .classList.remove("oculto");

    select.focus();
}

function cerrarModal() {
    document.getElementById("modalTutoria")
        .classList.add("oculto");
}

function crearTutoria(evento) {
    evento.preventDefault();

    const materiaId = Number(
        document.getElementById("materiaTutoria").value
    );

    const fecha = document.getElementById("fechaTutoria").value;
    const hora = document.getElementById("horaTutoria").value;

    const descripcion = document.getElementById(
        "descripcionTutoria"
    ).value.trim();

    const materia = obtenerCurso().materias.find(m =>
        m.id === materiaId
    );

    if (!materia || !fecha || !hora) {
        alert("Completá los datos obligatorios.");
        return;
    }

    const nuevaTutoria = {
        id: Date.now(),
        cursoId: cursoActual,
        materiaId: materia.id,
        materia: materia.nombre,
        fecha: fecha,
        hora: hora,
        descripcion: descripcion
    };

    datos.tutorias.push(nuevaTutoria);

    const fechaElegida = fechaDeTexto(fecha);
    fechaVisible = new Date(
        fechaElegida.getFullYear(),
        fechaElegida.getMonth(),
        1
    );

    guardarDatos();
    cerrarModal();
    actualizarPantalla();
}

/* ==========================================
   MOSTRAR TUTORÍAS
========================================== */

function mostrarTutorias() {
    const lista = document.getElementById("listaTutorias");
    lista.innerHTML = "";

    const hoy = fechaLocal(new Date());

    const tutorias = datos.tutorias.filter(tutoria =>
        tutoria.cursoId === cursoActual &&
        tutoria.fecha >= hoy
    ).sort((a, b) =>
        (a.fecha + a.hora).localeCompare(b.fecha + b.hora)
    );

    if (tutorias.length === 0) {
        lista.innerHTML = `
            <div class="estadoVacio">
                No hay próximas tutorías programadas.
                <p>Seleccioná una fecha del calendario para comenzar.</p>
            </div>
        `;
        return;
    }

    tutorias.forEach(tutoria => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "tutoriaItem";

        const info = document.createElement("div");
        info.className = "tutoriaInfo";

        const fecha = document.createElement("div");
        fecha.className = "tutoriaFecha";
        fecha.textContent = fechaDeTexto(tutoria.fecha)
            .toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "short"
            });

        const detalles = document.createElement("div");

        const titulo = document.createElement("strong");
        titulo.textContent = tutoria.materia;

        const horario = document.createElement("p");
        horario.textContent = tutoria.hora + " hs";

        detalles.appendChild(titulo);
        detalles.appendChild(horario);

        if (tutoria.descripcion) {
            const descripcion = document.createElement("p");
            descripcion.textContent = tutoria.descripcion;
            detalles.appendChild(descripcion);
        }

        info.appendChild(fecha);
        info.appendChild(detalles);

        const eliminar = document.createElement("button");
        eliminar.className = "botonEliminarTutoria";
        eliminar.textContent = "Eliminar";

        eliminar.addEventListener("click", () => {
            eliminarTutoria(tutoria.id);
        });

        tarjeta.appendChild(info);
        tarjeta.appendChild(eliminar);
        lista.appendChild(tarjeta);
    });
}

function eliminarTutoria(id) {
    if (!confirm("¿Querés eliminar esta tutoría?")) return;

    datos.tutorias = datos.tutorias.filter(tutoria =>
        tutoria.id !== id
    );

    guardarDatos();
    actualizarPantalla();
}

/* ==========================================
   NOTIFICACIONES Y CONTADOR
========================================== */

function actualizarNotificaciones() {
    const hoy = fechaLocal(new Date());

    const pendientes = datos.tutorias.filter(tutoria =>
        tutoria.fecha >= hoy
    ).sort((a, b) =>
        (a.fecha + a.hora).localeCompare(b.fecha + b.hora)
    );

    document.getElementById("numeroTutorias").textContent =
        pendientes.length;

    const lista = document.getElementById("listaNotificaciones");
    lista.innerHTML = "";

    if (pendientes.length === 0) {
        const mensaje = document.createElement("div");
        mensaje.className = "mensaje";

        const punto = document.createElement("span");
        punto.className = "punto";

        const texto = document.createElement("p");
        texto.textContent = "No hay tutorías pendientes.";

        mensaje.appendChild(punto);
        mensaje.appendChild(texto);
        lista.appendChild(mensaje);
        return;
    }

    pendientes.slice(0, 5).forEach(tutoria => {
        const mensaje = document.createElement("div");
        mensaje.className = "mensaje";

        const punto = document.createElement("span");
        punto.className = "punto";

        const texto = document.createElement("p");
        const curso = datos.cursos.find(c =>
            c.id === tutoria.cursoId
        );

        texto.textContent =
            `${tutoria.materia} · ${curso?.nombre || "Curso"} · ` +
            `${fechaDeTexto(tutoria.fecha).toLocaleDateString("es-AR")} ` +
            `a las ${tutoria.hora}`;

        mensaje.appendChild(punto);
        mensaje.appendChild(texto);
        lista.appendChild(mensaje);
    });
}

/* ==========================================
   ACTUALIZAR PANTALLA
========================================== */

function actualizarPantalla() {
    document.getElementById("cursoActual").textContent =
        obtenerCurso().nombre;

    mostrarCursos();
    mostrarMaterias();
    mostrarCalendario();
    mostrarTutorias();
    actualizarNotificaciones();
}

/* ==========================================
   BOTONES Y EVENTOS
========================================== */

document.getElementById("btnAgregarCurso")
    .addEventListener("click", agregarCurso);

document.getElementById("btnAgregarMateria")
    .addEventListener("click", mostrarCajaMateria);

document.getElementById("cancelarMateria")
    .addEventListener("click", cerrarCajaMateria);

document.getElementById("cajaMateria")
    .addEventListener("submit", agregarMateria);

document.getElementById("mesAnterior")
    .addEventListener("click", () => cambiarMes(-1));

document.getElementById("mesSiguiente")
    .addEventListener("click", () => cambiarMes(1));

document.getElementById("btnHoy")
    .addEventListener("click", volverHoy);

document.getElementById("btnCrearTutoria")
    .addEventListener("click", () => abrirModal());

document.getElementById("btnNuevaTutoria")
    .addEventListener("click", () => abrirModal());

document.getElementById("cerrarModal")
    .addEventListener("click", cerrarModal);

document.getElementById("cancelarTutoria")
    .addEventListener("click", cerrarModal);

document.getElementById("formTutoria")
    .addEventListener("submit", crearTutoria);

document.getElementById("modalTutoria")
    .addEventListener("click", evento => {
        if (evento.target.id === "modalTutoria") {
            cerrarModal();
        }
    });

document.addEventListener("keydown", evento => {
    if (evento.key === "Escape") {
        cerrarModal();
    }
});

document.getElementById("btnInicio")
    .addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

document.getElementById("btnTutorias")
    .addEventListener("click", () => {
        document.querySelector(".proximas")
            .scrollIntoView({ behavior: "smooth" });
    });

document.getElementById("btnPerfil")
    .addEventListener("click", () => {
        alert("La sección de perfil estará disponible próximamente.");
    });

/* ==========================================
   INICIAR APLICACIÓN
========================================== */

if (!obtenerCurso()) {
    cursoActual = datos.cursos[0].id;
}

actualizarPantalla();
