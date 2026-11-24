import { test, expect } from '@playwright/test'

test('registro conserva validaciones y permite acceder con una cuenta local', async ({
  page,
}) => {
  const errores = []
  page.on('pageerror', (error) => errores.push(error.message))
  await page.goto('/')
  await expect(page.locator('header')).toHaveCount(0)
  await expect(
    page.getByText('Prototipo sin servidor.', { exact: false }),
  ).toHaveCount(0)
  await expect(
    page.getByRole('button', { name: 'Explorar demostración' }),
  ).toHaveCount(0)
  await page.getByRole('link', { name: 'REGISTRATE', exact: true }).click()
  await page.getByRole('button', { name: 'Registrarme', exact: true }).click()
  await expect(
    page.getByText('Completá este campo.', { exact: true }),
  ).toHaveCount(4)
  await expect(
    page.getByText('Seleccioná una opción.', { exact: true }),
  ).toBeVisible()
  await page.getByLabel('Nombre y apellido').fill('Docente de prueba')
  await page
    .getByLabel('Correo electrónico', { exact: true })
    .fill('docente@example.com')
  await page
    .getByRole('button', { name: 'Seleccionar rol', exact: true })
    .click()
  await page.getByRole('button', { name: 'Docente', exact: true }).click()
  await page.getByLabel('Contraseña', { exact: true }).fill('1234')
  await page.getByLabel('Confirmar contraseña', { exact: true }).fill('otra')
  await expect(
    page.getByText('Debe tener 8+ caracteres', { exact: false }),
  ).toBeVisible()
  await expect(
    page.getByText('Las contraseñas no coinciden.', { exact: true }),
  ).toBeVisible()
  await page.getByLabel('Contraseña', { exact: true }).fill('Prueba123!')
  await page
    .getByLabel('Confirmar contraseña', { exact: true })
    .fill('Prueba123!')
  await page
    .getByRole('button', { name: 'Mostrar contraseña', exact: true })
    .click()
  await expect(page.getByLabel('Contraseña', { exact: true })).toHaveAttribute(
    'type',
    'text',
  )
  expect(
    await page
      .locator('.icono-ojo')
      .evaluateAll((imgs) =>
        imgs.every((img) => img.complete && img.naturalWidth > 0),
      ),
  ).toBe(true)
  await page
    .getByRole('button', { name: 'Ocultar contraseña', exact: true })
    .click()
  await page.screenshot({
    path: `test-results/registro-${page.viewportSize().width}.png`,
    fullPage: true,
  })
  await page.getByRole('button', { name: 'Registrarme', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'INICIO DE SESIÓN' }),
  ).toBeVisible()
  await page.getByLabel('Nombre de la cuenta o correo').fill('Docente de prueba')
  await page.getByLabel('Contraseña', { exact: true }).fill('incorrecta')
  await page.getByRole('button', { name: 'ACCEDER', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('incorrectos')
  await page.getByLabel('Contraseña', { exact: true }).fill('Prueba123!')
  await page.getByRole('button', { name: 'ACCEDER', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Mis Tutorías' }),
  ).toBeVisible()
  expect(errores).toEqual([])
})

test('componentes de cursos, materias y biblioteca mantienen los datos al navegar', async ({
  page,
}) => {
  const errores = []
  page.on('pageerror', (error) => errores.push(error.message))
  await page.goto('/#panel')
  await page
    .getByRole('button', { name: '+ Agregar curso', exact: true })
    .click()
  await page
    .getByRole('button', { name: '+ Agregar curso', exact: true })
    .click()
  await page.getByRole('button', { name: 'Curso 4', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Cuarto año', exact: true }),
  ).toBeVisible()
  await page
    .getByRole('button', { name: '+ Agregar materia', exact: true })
    .click()
  await page
    .getByRole('textbox', { name: 'Nombre de la materia' })
    .fill('Programación')
  await page.getByRole('button', { name: 'Agregar', exact: true }).click()
  await page.getByRole('button', { name: 'Curso 5', exact: true }).click()
  await expect(page.getByText('Programación', { exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: 'Curso 4', exact: true }).click()
  await expect(page.getByText('Programación', { exact: true })).toBeVisible()
  await expect(page.locator('.nombre-dia')).toHaveCount(7)
  await expect(page.getByRole('button', { name: 'Mes siguiente' })).toHaveCount(1)
  await page.getByRole('link', { name: 'Biblioteca', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Biblioteca', exact: true }),
  ).toBeVisible()
  await page.getByRole('link', { name: /Observaciones/ }).click()
  await page.getByRole('tab', { name: /Notas solo para vos/ }).click()
  await page.getByLabel('Fecha', { exact: true }).fill('2026-10-16')
  await page.getByLabel('Título', { exact: true }).fill('Seguimiento')
  await page.getByLabel('Tu nota privada', { exact: true }).fill('Variables y funciones')
  await page
    .getByRole('button', { name: 'Guardar nota privada', exact: true })
    .click()
  await expect(page.getByRole('status')).toContainText('solo para tu registro')
  await page
    .getByLabel('Tu nota privada', { exact: true })
    .fill('Cambio sin guardar')
  await page.getByRole('button', { name: 'Cancelar', exact: true }).click()
  await expect(
    page.getByLabel('Tu nota privada', { exact: true }),
  ).toHaveValue('Variables y funciones')
  await page.getByRole('button', { name: 'Volver a Biblioteca' }).click()
  await page.getByRole('link', { name: /Observaciones/ }).click()
  await page.getByRole('tab', { name: /Notas solo para vos/ }).click()
  await expect(
    page.getByLabel('Tu nota privada', { exact: true }),
  ).toHaveValue('Variables y funciones')
  await page.screenshot({
    path: `test-results/observaciones-${page.viewportSize().width}.png`,
    fullPage: true,
  })
  await page.getByRole('link', { name: 'Inicio', exact: true }).click()
  await expect(page.getByText('Programación', { exact: true })).toBeVisible()
  page.once('dialog', (dialog) => dialog.accept())
  await page
    .getByRole('button', { name: 'Eliminar Programación', exact: true })
    .click()
  await expect(page.getByText('Programación', { exact: true })).toHaveCount(0)
  await page.getByRole('link', { name: 'CrearTutoria', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'CrearTutoria', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText('Iniciá sesión para programar y administrar tus tutorías.'),
  ).toBeVisible()
  expect(errores).toEqual([])
})

test('recuperación conserva formulario y enlace originales', async ({
  page,
}) => {
  await page.goto('/')
  await page
    .getByRole('link', { name: 'Restablecer contraseña', exact: true })
    .click()
  await page.getByLabel('EMAIL', { exact: true }).fill('no-es-email')
  await page
    .getByRole('button', { name: 'RESTABLECER CONTRASEÑA', exact: true })
    .click()
  await expect(page.getByRole('status')).toBeEmpty()
  await page.getByLabel('EMAIL', { exact: true }).fill('docente@example.com')
  await page
    .getByRole('button', { name: 'RESTABLECER CONTRASEÑA', exact: true })
    .click()
  await expect(page.getByRole('status')).toContainText('necesita un servicio')
  await page.getByRole('link', { name: 'INICIAR SESIÓN', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'INICIO DE SESIÓN' }),
  ).toBeVisible()
})

test('CrearTutoria funciona sin configuración externa', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByLabel('Nombre de la cuenta o correo').fill('Giovana')
  await page.getByLabel('Contraseña', { exact: true }).fill('1234')
  await page.getByRole('button', { name: 'ACCEDER', exact: true }).click()
  await page
    .getByRole('link', { name: 'CrearTutoria', exact: true })
    .click()

  await expect(
    page.getByRole('heading', { name: 'CrearTutoria', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Programar tutoría' }),
  ).toBeVisible()
  await expect(page.getByLabel('Correo del estudiante')).toBeVisible()
  await expect(page.getByLabel('Correo de la familia')).toBeVisible()
})

test('CrearTutoria guarda la cita localmente y permite editarla sin límite de 48 horas', async ({
  page,
}) => {
  const fechaLocal = (fecha) => {
    const ajuste = fecha.getTimezoneOffset() * 60000
    return new Date(fecha.getTime() - ajuste).toISOString()
  }
  const fechaTutoria = new Date(Date.now() + 6 * 60 * 60 * 1000)
  fechaTutoria.setMinutes(0, 0, 0)
  const horaTutoria = `${String(fechaTutoria.getHours()).padStart(2, '0')}:00`
  const fechaAviso = new Date(fechaTutoria.getTime() - 60 * 60 * 1000)

  await page.goto('/')
  await page.getByLabel('Nombre de la cuenta o correo').fill('Giovana')
  await page.getByLabel('Contraseña', { exact: true }).fill('1234')
  await page.getByRole('button', { name: 'ACCEDER', exact: true }).click()
  await page.getByRole('button', { name: 'Curso 3', exact: true }).click()
  await page
    .getByRole('button', { name: '+ Agregar materia', exact: true })
    .click()
  await page
    .getByRole('textbox', { name: 'Nombre de la materia' })
    .fill('Matemática')
  await page.getByRole('button', { name: 'Agregar', exact: true }).click()
  await page.getByRole('link', { name: 'CrearTutoria', exact: true }).click()
  await page.getByLabel('Curso', { exact: true }).selectOption({ label: 'Tercer año' })
  await page.getByLabel('Asignatura', { exact: true }).selectOption('Matemática')
  await page.getByLabel('Estudiante', { exact: true }).selectOption('Lucas Romero')
  await page
    .getByLabel('Fecha de la tutoría')
    .fill(fechaLocal(fechaTutoria).slice(0, 10))
  await page.getByLabel('Hora').fill(horaTutoria)
  await page
    .getByLabel('Enviar aviso el')
    .fill(fechaLocal(fechaAviso).slice(0, 16))
  await page
    .getByLabel('Correo del estudiante')
    .fill('estudiante@example.com')
  await page
    .getByLabel('Correo de la familia')
    .fill('familia@example.com')
  await page
    .getByLabel('Contenidos a trabajar')
    .fill('Ecuaciones')
  await page.getByRole('button', { name: 'Programar tutoría' }).click()

  await expect(page.getByText('Lucas Romero')).toBeVisible()
  await expect(page.getByText('Aviso programado')).toBeVisible()
  await expect
    .poll(() =>
      page.evaluate(() =>
        JSON.parse(localStorage.getItem('gestion-tutorias:cuenta-demo') || '[]')
          .length,
      ),
    )
    .toBe(1)

  await page.getByRole('link', { name: 'Inicio', exact: true }).click()
  await page.getByRole('button', { name: 'Curso 3', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Próximas tutorías' })).toBeVisible()
  await expect(page.locator('.tarjeta-proxima')).toContainText('Lucas Romero')
  await expect(page.locator('.evento-tutoria')).toContainText('Lucas Romero')
  await expect(page.locator('.evento-tutoria')).toContainText('Matemática')
  await page.getByRole('link', { name: 'CrearTutoria', exact: true }).click()
  await page.getByRole('button', { name: 'Editar', exact: true }).click()
  await page.getByLabel('Contenidos a trabajar').fill('Ecuaciones lineales')
  await page.getByRole('button', { name: 'Guardar cambios' }).click()
  await expect(page.getByText('Ecuaciones lineales')).toBeVisible()

  await page.goto('/')
  await page.getByLabel('Nombre de la cuenta o correo').fill('Giovana')
  await page.getByLabel('Contraseña', { exact: true }).fill('1234')
  await page.getByRole('button', { name: 'ACCEDER', exact: true }).click()
  await page.getByRole('link', { name: 'CrearTutoria', exact: true }).click()
  await expect(page.getByText('Lucas Romero')).toBeVisible()
  await expect(page.getByText('Ecuaciones lineales')).toBeVisible()
})

test('CrearTutoria registra ausencia y justificación localmente', async ({
  page,
}) => {
  const fechaPasada = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const fecha = `${fechaPasada.getFullYear()}-${String(fechaPasada.getMonth() + 1).padStart(2, '0')}-${String(fechaPasada.getDate()).padStart(2, '0')}`
  const cita = {
    id: 'tutoria-pasada',
    created_by: 'cuenta-demo',
    profesor: 'Giovana',
    estudiante: 'Estudiante de prueba',
    email_estudiante: 'estudiante@example.com',
    email_familia: 'familia@example.com',
    curso: '3° año',
    asignatura: 'Matemática',
    fecha_tutoria: fecha,
    hora_tutoria: '00:00',
    notificacion_programada_para: new Date(Date.now() - 2 * 86400000).toISOString(),
    contenidos: 'Ecuaciones',
    asistencia_estado: 'pendiente',
    motivo_inasistencia: '',
    notificacion_estado: 'pendiente',
    informe_estado: 'no_aplica',
  }

  await page.addInitScript((citaSemilla) => {
    localStorage.setItem(
      'gestion-tutorias:cuenta-demo',
      JSON.stringify([citaSemilla]),
    )
  }, cita)
  await page.goto('/')
  await page.getByLabel('Nombre de la cuenta o correo').fill('Giovana')
  await page.getByLabel('Contraseña', { exact: true }).fill('1234')
  await page.getByRole('button', { name: 'ACCEDER', exact: true }).click()
  await page.getByRole('link', { name: 'CrearTutoria', exact: true }).click()
  await page.getByRole('button', { name: 'Registrar asistencia' }).click()
  await page
    .getByLabel('Resultado de la tutoría')
    .selectOption('ausente')
  await page.getByLabel('Motivo de inasistencia').fill('Enfermedad')
  await page.getByRole('button', { name: 'Guardar asistencia' }).click()
  await expect(page.getByText('Ausente', { exact: true })).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Preparar informe' }),
  ).toBeVisible()
  await expect
    .poll(() =>
      page.evaluate(() => {
            const [guardada] = JSON.parse(
          localStorage.getItem('gestion-tutorias:cuenta-demo') || '[]',
        )
        return [guardada.asistencia_estado, guardada.motivo_inasistencia]
      }),
    )
    .toEqual(['ausente', 'Enfermedad'])

  await page.getByRole('button', { name: 'Editar asistencia' }).click()
  await page
    .getByLabel('Resultado de la tutoría')
    .selectOption('justificada')
  await page
    .getByLabel('Detalle de la justificación')
    .fill('Certificado médico')
  await page.getByRole('button', { name: 'Guardar asistencia' }).click()
  await expect(page.getByText('Justificada', { exact: true })).toBeVisible()
  await expect(
    page.getByText('Certificado médico', { exact: false }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Preparar informe' }),
  ).toHaveCount(0)
})

test('historial, asistencias y observaciones comparten tutorías guardadas', async ({
  page,
}) => {
  const fechaRelativa = (desplazamiento) => {
    const fecha = new Date(Date.now() + desplazamiento)
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`
  }
  const tutorias = [
    {
      id: 'pasada',
      estudiante: 'Mateo González',
      curso: 'Primer año',
      asignatura: 'Lengua',
      fecha_tutoria: fechaRelativa(-2 * 86400000),
      hora_tutoria: '10:00',
      contenidos: 'Comprensión lectora',
      asistencia_estado: 'ausente',
      motivo_inasistencia: 'Enfermedad',
    },
    {
      id: 'futura',
      estudiante: 'Lucas Romero',
      curso: 'Tercer año',
      asignatura: 'Matemática',
      fecha_tutoria: fechaRelativa(2 * 86400000),
      hora_tutoria: '11:00',
      contenidos: 'Ecuaciones',
      asistencia_estado: 'pendiente',
      motivo_inasistencia: '',
    },
  ]

  await page.addInitScript((registros) => {
    localStorage.setItem(
      'gestion-tutorias:cuenta-demo',
      JSON.stringify(registros),
    )
  }, tutorias)
  await page.goto('/#historial')
  await expect(
    page.getByRole('heading', { name: 'Historial de tutorías' }),
  ).toBeVisible()
  await expect(page.getByText('Mateo González', { exact: true })).toBeVisible()
  await page.getByLabel('Filtrar por curso').selectOption('Primer año')
  await page.getByLabel('Filtrar por materia').selectOption('Lengua')
  await expect(page.getByText('Lucas Romero', { exact: true })).toHaveCount(0)
  await page.getByLabel('Ordenar historial').selectOption('sin_orden')

  await page.getByRole('link', { name: 'Biblioteca', exact: true }).click()
  await page.getByRole('link', { name: 'Registro de Asistencias' }).click()
  await expect(
    page.getByRole('heading', { name: 'Registro de asistencias' }),
  ).toBeVisible()
  await expect(page.getByText('Ausente', { exact: true })).toBeVisible()
  await expect(page.getByText('Pendiente', { exact: true })).toBeVisible()

  await page.getByRole('link', { name: 'Biblioteca', exact: true }).click()
  await page.getByRole('link', { name: /Observaciones/ }).click()
  await expect(page.getByText('Mateo González', { exact: true })).toBeVisible()
  await page
    .getByRole('button', { name: 'Agregar observación de Mateo González' })
    .click()
  await page
    .getByLabel('Observaciones que viste', { exact: true })
    .fill('Se mostró atento durante la tutoría.')
  await page
    .getByRole('button', { name: 'Guardar observación', exact: true })
    .click()
  await expect(page.getByRole('status')).toContainText('guardada')
  await expect(
    page.getByRole('button', { name: 'Editar observación de Mateo González' }),
  ).toBeVisible()
  await expect
    .poll(() =>
      page.evaluate(() => {
        const [guardada] = JSON.parse(
          localStorage.getItem('gestion-observaciones:cuenta-demo') || '[]',
        )
        return guardada?.tutoria_id
      }),
    )
    .toBe('pasada')
})

test('el perfil guarda datos y foto de forma local sin permitir cambiar rol o correo', async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'gestion-cursos:cuenta-demo',
      JSON.stringify([
        {
          id: 1,
          nombre: 'Primer año',
          materias: [{ id: 1, nombre: 'Lengua' }],
        },
      ]),
    )
  })
  await page.goto('/')
  await page.getByLabel('Nombre de la cuenta o correo').fill('Giovana')
  await page.getByLabel('Contraseña', { exact: true }).fill('1234')
  await page.getByRole('button', { name: 'ACCEDER', exact: true }).click()
  await page.getByRole('link', { name: 'Perfil de usuario' }).click()

  await expect(
    page.getByRole('heading', { name: 'Información personal' }),
  ).toBeVisible()
  await expect(page.getByText('Equipo de gestión', { exact: true })).toBeVisible()
  await expect(page.getByText('Primer año', { exact: true })).toBeVisible()
  await expect(page.getByText('Lengua', { exact: true })).toBeVisible()
  await expect(page.getByLabel('Correo electrónico')).toHaveAttribute('readonly', '')
  await expect(page.locator('#perfil-cargo')).toHaveAttribute('readonly', '')

  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADUlEQVR4nGGP4z8AAAMBAQDJ/pLvAAAAAElFTkSuQmCC',
    'base64',
  )
  await page.locator('input[aria-label="Elegir foto de perfil"]').setInputFiles({
    name: 'archivo.svg',
    mimeType: 'image/svg+xml',
    buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>'),
  })
  await expect(page.getByRole('alert')).toContainText('No se admiten archivos SVG')
  await page.locator('input[aria-label="Elegir foto de perfil"]').setInputFiles({
    name: 'foto.png',
    mimeType: 'image/png',
    buffer: png,
  })
  await expect(page.getByRole('img', { name: 'Foto de perfil' })).toBeVisible()
  await page
    .getByLabel('Nombre y apellido', { exact: true })
    .fill('Giovana Paz')
  await page
    .getByLabel('Número de teléfono', { exact: true })
    .fill('+54 9 351 123 4567')
  await page.getByRole('button', { name: 'Guardar cambios' }).click()
  await expect(page.getByRole('status')).toContainText('guardaron')
  await expect
    .poll(() =>
      page.evaluate(() => {
        const perfil = JSON.parse(
          localStorage.getItem('gestion-perfil:cuenta-demo') || '{}',
        )
        return [
          perfil.nombre,
          perfil.telefono,
          perfil.foto?.startsWith('data:image/jpeg;base64,'),
        ]
      }),
    )
    .toEqual(['Giovana Paz', '+54 9 351 123 4567', true])

  await page.goto('/')
  await page.getByLabel('Nombre de la cuenta o correo').fill('Giovana')
  await page.getByLabel('Contraseña', { exact: true }).fill('1234')
  await page.getByRole('button', { name: 'ACCEDER', exact: true }).click()
  await page.getByRole('link', { name: 'Perfil de usuario' }).click()
  await expect(page.getByLabel('Nombre y apellido')).toHaveValue('Giovana Paz')
  await expect(page.getByLabel('Número de teléfono')).toHaveValue(
    '+54 9 351 123 4567',
  )
})
