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

Desde Inicio de sesión se puede crear una cuenta con el enlace REGISTRATE. El registro conserva el selector de rol, las validaciones de nombre, correo, contraseña y confirmación, y los íconos del ojo del equipo.

Con una cuenta creada en la misma sesión se puede acceder al panel usando su nombre o correo. Se conserva también la cuenta de ejemplo del script original: `Giovana` / `1234`. El panel permite agregar cursos y agregar o eliminar materias de cada curso. El calendario conserva los días del diseño original. Los íconos de la barra lateral conectan el panel, la biblioteca y el inicio de sesión.

En Biblioteca está la ficha de observaciones: permite completar datos, guardar una ficha en memoria, descartar cambios posteriores e imprimir. La ficha se conserva al volver a la biblioteca y al cambiar de pantalla.

## Alcance del prototipo

No hay servidor, base de datos ni autorización por roles. Las cuentas, materias y observaciones duran en memoria hasta recargar o cerrar la página. Usar datos de prueba. Las claves no se guardan en almacenamiento del navegador.

Recuperación de contraseña valida el formato del correo, pero no envía mensajes ni modifica claves. El botón Reenviar también indica que falta conectar un servidor. Historial, asistencia y programación de tutorías continúan pendientes.

## Estructura e integración

- `index.html` carga `src/main.js`; `src/App.vue` conecta todas las pantallas.
- `src/components/formularioRegistro.vue` conserva el formulario de `Registro` y sus validaciones. Corrige rutas de los SVG, contraste del texto y controles accesibles.
- `src/views/InicioSesion.vue` y `RecuperarClave.vue` integran los prototipos de `inicio` y `contraseña`.
- `src/views/PanelPrincipal.vue` compone `BarraLateral`, `NotificacionesTutorias`, `CursosMaterias` y `CalendarioTutorias`. Cada curso conserva sus materias y su identificador.
- `src/views/Biblioteca.vue` y `Observaciones.vue` integran `Biblio` con estilos aislados y una importación válida.

`BarraLateral` y `PieBiblioteca` reutilizan la navegación y el pie originales de Biblioteca. Los estilos están separados por pantalla; no se repite la hoja completa de Biblioteca en cada vista. Se retiraron los HTML, scripts y recursos de plantilla que ya no se usan. Sus versiones originales permanecen en el historial de Git y en las ramas del equipo.

`App.vue` coordina las pantallas mediante rutas como `#inicio`, `#registro`, `#panel`, `#biblioteca` y `#observaciones`. No agrega cabecera, logos, botones ni leyendas. Los enlaces del navegador permiten retroceder entre pantallas.

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
