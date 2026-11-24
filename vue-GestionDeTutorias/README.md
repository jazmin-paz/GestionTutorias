# Gestión de Tutorías

Aplicación Vue 3 para organizar tutorías escolares.

## Ejecutar

Requiere Node.js 22.18+ o 24.12+.

```powershell
cd vue-GestionDeTutorias
npm install
npm run dev
```

Abrí la dirección que muestra Vite. No hace falta configurar Supabase ni crear claves.

## CrearTutoria

Desde el icono debajo del inicio se pueden programar tutorías con estudiante, curso, materia, fecha y hora, contenidos y correos de contacto. Los datos se guardan en el almacenamiento local del navegador.

- Los cursos y materias se comparten con el calendario; al elegir un curso, el formulario muestra sus materias y una lista de estudiantes de prueba.
- Se puede programar una tutoría con menos de 48 horas de anticipación y editarla sin ese límite.
- El aviso debe configurarse para un momento futuro anterior a la cita. Puede prepararse desde la agenda al llegar la hora elegida.
- Una vez vencida la hora del aviso, la app muestra **Preparar aviso**. Al pulsarlo, abre un borrador de correo para estudiante y familia; hay que confirmar el envío desde el programa de correo.
- Después de la tutoría se registra presente, ausente o justificada, con el motivo correspondiente.
- Para una ausencia se puede preparar un informe por correo a estudiante y familia.

**Límites del modo local:** las tutorías quedan solo en ese navegador y dispositivo; no se sincronizan con otras personas ni se respaldan en un servidor. Los avisos no se envían automáticamente: la app debe estar abierta para mostrar cuándo están listos, y el correo se envía al confirmar el borrador. Para automatizar avisos o compartir datos entre usuarios hace falta un backend.

Para probar el panel, usá la cuenta de demostración **Giovana** con contraseña **1234**. Las cuentas nuevas solo existen durante la sesión actual; después de recargar, hay que volver a registrarlas para entrar. Las citas de cada correo quedan guardadas en el mismo navegador. Este acceso local es de demostración y no protege información sensible.

## Otras secciones y pruebas

El panel conserva cursos y materias localmente, y el calendario muestra las tutorías del curso y la materia seleccionados. Biblioteca incluye el historial (con filtros por curso y materia), el registro de asistencia y observaciones nuevas o asociadas a tutorías pasadas. Estos datos también quedan en el almacenamiento local del navegador.

El ícono de usuario abre el perfil con foto, nombre, teléfono, cargo y resumen de cursos/materias. El correo y el cargo no se pueden editar desde el perfil. Las imágenes se aceptan solo en formatos JPG, PNG o WebP, con límite de 5 MB, y se reducen antes de guardarse. La foto y los datos del perfil se almacenan localmente por cuenta; como esta demostración no tiene autenticación de servidor ni cifrado, no debe usarse con datos sensibles.

```powershell
npm run build
npx playwright install chromium
npm run test:e2e
```

Las pruebas recorren las pantallas en escritorio y móvil. Para usar Chrome instalado, definir `CHROME_PATH` con la ruta completa del ejecutable.
