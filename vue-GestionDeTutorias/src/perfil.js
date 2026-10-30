import { ref, reactive, onMounted } from "vue";

export function usePerfil() {

    /* =================================================
       DATOS DEL USUARIO
       ================================================= */

    const perfil = reactive({
        nombreApellido: "",
        correoElectronico: "",
        numeroTelefono: "",
        cargo: ""
    });


    /* =================================================
       FOTO DE PERFIL
       ================================================= */

    const imagenPerfil = ref("");
    const inputFoto = ref(null);

    function cambiarFoto(evento) {

        const archivo = evento.target.files[0];

        if (!archivo) {
            return;
        }

        if (!archivo.type.startsWith("image/")) {
            alert("Seleccioná un archivo de imagen válido.");
            evento.target.value = "";
            return;
        }

        const lector = new FileReader();

        lector.onload = function (eventoLectura) {

            const resultado = eventoLectura.target.result;

            if (typeof resultado !== "string") {
                return;
            }

            imagenPerfil.value = resultado;

            localStorage.setItem(
                "fotoPerfil",
                resultado
            );

        };

        lector.onerror = function () {
            alert("No se pudo cargar la imagen.");
        };

        lector.readAsDataURL(archivo);

    }


    function quitarFoto() {

        localStorage.removeItem("fotoPerfil");

        imagenPerfil.value = "";

        // Permite seleccionar nuevamente el mismo archivo.
        if (inputFoto.value) {
            inputFoto.value.value = "";
        }

    }


    /* =================================================
       MODAL DE MATERIAS
       ================================================= */

    const modalMateriasAbierto = ref(false);

    const opcionesMaterias = [
        "Matemática",
        "Lengua",
        "Historia",
        "Geografía",
        "Biología",
        "Física",
        "Química",
        "Inglés"
    ];

    const materiasAsignadas = ref([]);
    const materiasTemporales = ref([]);


    function abrirMaterias() {

        // Copiar la selección actual para editarla.
        materiasTemporales.value = [
            ...materiasAsignadas.value
        ];

        modalMateriasAbierto.value = true;

    }


    function cerrarMaterias() {

        modalMateriasAbierto.value = false;

    }


    function guardarMaterias() {

        materiasAsignadas.value = [
            ...materiasTemporales.value
        ];

        localStorage.setItem(
            "materiasAsignadas",
            JSON.stringify(materiasAsignadas.value)
        );

        cerrarMaterias();

    }


    /* =================================================
       MODAL DE CURSOS
       ================================================= */

    const modalCursosAbierto = ref(false);

    const opcionesCursos = [
        { value: "1° A", label: "1°" },
        { value: "2° A", label: "2°" },
        { value: "3° A", label: "3°" },
        { value: "4° A", label: "4°" }
    ];

    const cursosAsignados = ref([]);
    const cursosTemporales = ref([]);


    function abrirCursos() {

        cursosTemporales.value = [
            ...cursosAsignados.value
        ];

        modalCursosAbierto.value = true;

    }


    function cerrarCursos() {

        modalCursosAbierto.value = false;

    }


    function guardarCursos() {

        cursosAsignados.value = [
            ...cursosTemporales.value
        ];

        localStorage.setItem(
            "cursosAsignados",
            JSON.stringify(cursosAsignados.value)
        );

        cerrarCursos();

    }


    /* =================================================
       GUARDAR CAMBIOS DEL PERFIL
       ================================================= */

    function guardarCambios() {

        localStorage.setItem(
            "nombreApellido",
            perfil.nombreApellido
        );

        localStorage.setItem(
            "correoElectronico",
            perfil.correoElectronico
        );

        localStorage.setItem(
            "numeroTelefono",
            perfil.numeroTelefono
        );

        localStorage.setItem(
            "cargo",
            perfil.cargo
        );

        alert("¡Cambios guardados correctamente!");

    }


    /* =================================================
       CARGAR LOS DATOS GUARDADOS
       ================================================= */

    function leerListaLocal(clave) {

        try {

            const datos = JSON.parse(
                localStorage.getItem(clave) || "[]"
            );

            return Array.isArray(datos) ? datos : [];

        } catch {

            return [];

        }

    }


    onMounted(() => {

        // Recuperar los datos personales.
        perfil.nombreApellido =
            localStorage.getItem("nombreApellido") || "";

        perfil.correoElectronico =
            localStorage.getItem("correoElectronico") || "";

        perfil.numeroTelefono =
            localStorage.getItem("numeroTelefono") || "";

        perfil.cargo =
            localStorage.getItem("cargo") || "";


        // Recuperar la foto.
        imagenPerfil.value =
            localStorage.getItem("fotoPerfil") || "";


        // Recuperar materias y cursos.
        materiasAsignadas.value =
            leerListaLocal("materiasAsignadas");

        cursosAsignados.value =
            leerListaLocal("cursosAsignados");

    });


    /* =================================================
       FUNCIONES Y DATOS DISPONIBLES PARA EL COMPONENTE
       ================================================= */

    return {

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

    };

}