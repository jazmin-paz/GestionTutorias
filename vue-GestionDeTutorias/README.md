# Gestión de Tutorías

Aplicación Vue 3 integrada a partir de las ramas del equipo.

## Ejecutar

Requiere Node.js 22.18+ o 24.12+ según `package.json`.

```sh
npm install
npm run dev
```

Abrir la dirección indicada por Vite. Los comandos se ejecutan dentro de `vue-GestionDeTutorias`, donde está `package.json`.

## Recorrer la aplicación

Desde Inicio de sesión se puede crear una cuenta o explorar la demostración. El registro conserva las validaciones de nombre, correo, rol, complejidad de contraseña y confirmación. Los botones del ojo muestran y ocultan las contraseñas.

Con una cuenta creada en la misma sesión se puede acceder al panel. El panel permite cambiar de mes, agregar cursos y agregar o eliminar materias de cada curso. La navegación superior conecta el panel con la biblioteca.

En Biblioteca está la ficha de observaciones: permite completar datos, guardar una ficha en memoria, descartar cambios posteriores e imprimir. La ficha se conserva al volver a la biblioteca y al cambiar de pantalla.

## Alcance del prototipo

No hay servidor, base de datos ni autorización por roles. Las cuentas, materias y observaciones duran en memoria hasta recargar o cerrar la página. Usar datos de prueba. Las claves no se guardan en almacenamiento del navegador.

Recuperación de contraseña valida el formato del correo, pero no envía mensajes ni modifica claves. El botón Reenviar también indica que falta conectar un servidor. Historial, asistencia y programación de tutorías continúan pendientes.

## Estructura e integración

- `index.html` carga `src/main.js`; `src/App.vue` conecta todas las pantallas.
- `src/components/formularioRegistro.vue` conserva el formulario de `Registro` y sus validaciones. Corrige rutas de los SVG, contraste del texto y controles accesibles.
- `src/views/InicioSesion.vue` y `RecuperarClave.vue` integran los prototipos de `inicio` y `contraseña`.
- `src/views/PanelPrincipal.vue` adapta el panel a Vue. Cada curso conserva sus materias y su identificador.
- `src/views/Biblioteca.vue` y `Observaciones.vue` integran `Biblio` con estilos aislados y una importación válida.

Los HTML y scripts originales fuera de estas vistas quedan como referencia histórica; no son los puntos de entrada de la app integrada. La rama `Biblioteca` solo contenía cambios del README. `Registro` y `Panel-Principal` ya estaban incorporadas a `main`; no se borraron sus ramas.

El formulario de `Registro` coincidía con el de `main` antes de esta integración. Los problemas visibles incluían rutas `/icons/` incorrectas y estilos de la plantilla Vue que dividían la aplicación en dos columnas en escritorio.

## Verificación

```sh
npm run build
npx playwright install chromium
npm run test:e2e
```

Las pruebas recorren registro y acceso, errores de validación, íconos, recuperación, cursos, materias, calendario, biblioteca y conservación de observaciones. Se ejecutan en escritorio y con ancho móvil.

Para usar Chrome instalado sin descargar Chromium, definir `CHROME_PATH` con la ruta completa del ejecutable antes de ejecutar las pruebas.

## Trabajo en equipo

Actualizar la rama propia con `main` antes de abrir un PR. Crear cada pantalla en su propio componente y coordinar cambios en `App.vue`. Revisar el resultado del merge y ejecutar compilación y pruebas antes de integrarlo. Evitar resolver conflictos aceptando un archivo completo sin revisar qué funcionalidades se pierden.
