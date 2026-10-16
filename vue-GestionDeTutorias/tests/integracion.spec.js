import { test, expect } from '@playwright/test'

test('registro conserva selector de rol, validaciones e iconos originales', async ({
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
  await page.getByLabel('Nombre de la cuenta').fill('Docente de prueba')
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
  await page.goto('/')
  await page.getByLabel('Nombre de la cuenta').fill('Giovana')
  await page.getByLabel('Contraseña', { exact: true }).fill('1234')
  await page.getByRole('button', { name: 'ACCEDER', exact: true }).click()
  await page
    .getByRole('button', { name: '+ Agregar curso', exact: true })
    .click()
  await page
    .getByRole('button', { name: '+ Agregar curso', exact: true })
    .click()
  await page.getByRole('button', { name: 'Curso 4', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Curso 4', exact: true }),
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
  await expect(page.locator('.nombreDia')).toHaveCount(5)
  await expect(page.getByRole('button', { name: 'Mes siguiente' })).toHaveCount(
    0,
  )
  await page.getByRole('link', { name: 'Biblioteca', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Biblioteca', exact: true }),
  ).toBeVisible()
  await page.getByRole('link', { name: /Observaciones/ }).click()
  await page.getByLabel('Fecha', { exact: true }).fill('2026-10-16')
  await page
    .getByLabel('Curso', { exact: true })
    .selectOption({ label: 'Quinto año' })
  await page
    .getByLabel('Asignatura', { exact: true })
    .selectOption({ label: 'Informática' })
  await page
    .getByLabel('Estudiante', { exact: true })
    .selectOption({ label: 'Mateo González' })
  await page
    .getByLabel('Contenidos a trabajar', { exact: true })
    .fill('Variables y funciones')
  await page.getByRole('button', { name: 'Editar', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('guardada')
  await page
    .getByLabel('Contenidos a trabajar', { exact: true })
    .fill('Cambio sin guardar')
  await page.getByRole('button', { name: 'Cancelar', exact: true }).click()
  await expect(
    page.getByLabel('Contenidos a trabajar', { exact: true }),
  ).toHaveValue('Variables y funciones')
  await page.getByRole('button', { name: 'Volver', exact: true }).click()
  await page.getByRole('link', { name: /Observaciones/ }).click()
  await expect(
    page.getByLabel('Contenidos a trabajar', { exact: true }),
  ).toHaveValue('Variables y funciones')
  await page.screenshot({
    path: `test-results/observaciones-${page.viewportSize().width}.png`,
    fullPage: true,
  })
  await page.getByRole('link', { name: 'Inicio', exact: true }).click()
  await expect(page.getByText('Programación', { exact: true })).toBeVisible()
  await page
    .getByRole('button', { name: 'Eliminar Programación', exact: true })
    .click()
  await expect(page.getByText('Programación', { exact: true })).toHaveCount(0)
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
  await expect(page.getByRole('status')).toContainText('no está disponible')
  await page.getByRole('link', { name: 'INICIAR SESIÓN', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'INICIO DE SESIÓN' }),
  ).toBeVisible()
})
