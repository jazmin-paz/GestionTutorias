const coloresMaterias = ['#b9d9c5', '#f0dfa5', '#edc3c8', '#bdd8e9', '#d9c5e8']

export const cursosIniciales = [
  'Primer año',
  'Segundo año',
  'Tercer año',
].map((nombre, indice) => ({
  id: indice + 1,
  nombre,
  materias: [],
}))

export const estudiantesPorCurso = {
  'Primer año': ['Mateo González', 'Valentina Rodríguez', 'Santiago Fernández'],
  'Segundo año': ['Camila Martínez', 'Tomás López', 'Martina Sánchez'],
  'Tercer año': ['Lucas Romero', 'Agustina Torres', 'Benjamín Herrera'],
  'Cuarto año': ['Julieta Castro', 'Franco Medina'],
  'Quinto año': ['Sofía Navarro', 'Juan Cruz Molina'],
  'Sexto año': ['Emilia Vargas', 'Nicolás Pereyra'],
}

function storageKey(tipo, usuarioId) {
  return `gestion-${tipo}:${usuarioId || 'cuenta-demo'}`
}

function eventoDato(tipo, usuarioId) {
  return `${storageKey(tipo, usuarioId)}:actualizado`
}

function cargarLista(tipo, usuarioId, valorInicial) {
  const contenido = localStorage.getItem(storageKey(tipo, usuarioId))
  if (!contenido) return valorInicial

  const valor = JSON.parse(contenido)
  if (!Array.isArray(valor)) {
    throw new Error(`El contenido local de ${tipo} no tiene un formato válido.`)
  }
  return valor
}

function guardarLista(tipo, usuarioId, valor) {
  const llave = storageKey(tipo, usuarioId)
  localStorage.setItem(llave, JSON.stringify(valor))
  window.dispatchEvent(new Event(eventoDato(tipo, usuarioId)))
}

export function cargarCursos(usuarioId) {
  return cargarLista(
    'cursos',
    usuarioId,
    cursosIniciales.map((curso) => ({ ...curso, materias: [] })),
  )
}

export function guardarCursos(usuarioId, cursos) {
  guardarLista('cursos', usuarioId, cursos)
}

export function escucharCursos(usuarioId, callback) {
  return escuchar('cursos', usuarioId, callback)
}

export function cargarTutorias(usuarioId) {
  return cargarLista('tutorias', usuarioId, [])
}

export function guardarTutorias(usuarioId, tutorias) {
  guardarLista('tutorias', usuarioId, tutorias)
}

export function escucharTutorias(usuarioId, callback) {
  return escuchar('tutorias', usuarioId, callback)
}

export function cargarObservaciones(usuarioId) {
  return cargarLista('observaciones', usuarioId, [])
}

export function guardarObservaciones(usuarioId, observaciones) {
  guardarLista('observaciones', usuarioId, observaciones)
}

export function escucharObservaciones(usuarioId, callback) {
  return escuchar('observaciones', usuarioId, callback)
}

export function cargarPerfil(usuarioId) {
  const contenido = localStorage.getItem(storageKey('perfil', usuarioId))
  if (!contenido) return null

  const perfil = JSON.parse(contenido)
  if (!perfil || typeof perfil !== 'object' || Array.isArray(perfil)) {
    throw new Error('El perfil guardado no tiene un formato válido.')
  }
  if (
    perfil.foto &&
    (typeof perfil.foto !== 'string' ||
      perfil.foto.length > 1_000_000 ||
      !/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(perfil.foto))
  ) {
    throw new Error('La foto guardada no tiene un formato seguro.')
  }
  return perfil
}

export function guardarPerfil(usuarioId, perfil) {
  const llave = storageKey('perfil', usuarioId)
  localStorage.setItem(llave, JSON.stringify(perfil))
  window.dispatchEvent(new Event(eventoDato('perfil', usuarioId)))
}

export function escucharPerfil(usuarioId, callback) {
  return escuchar('perfil', usuarioId, callback)
}

function escuchar(tipo, usuarioId, callback) {
  const key = storageKey(tipo, usuarioId)
  const evento = eventoDato(tipo, usuarioId)
  const cambioEntrePestanas = (e) => {
    if (e.key === key) callback()
  }

  window.addEventListener(evento, callback)
  window.addEventListener('storage', cambioEntrePestanas)
  return () => {
    window.removeEventListener(evento, callback)
    window.removeEventListener('storage', cambioEntrePestanas)
  }
}

export function coloresDeMateria() {
  return coloresMaterias
}
