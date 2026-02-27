const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/calificaciones.json');

// Leer calificaciones
function leerCalificaciones() {
  if (!fs.existsSync(DB_PATH)) return [];
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data || '[]');
}

// Guardar calificaciones
function guardarCalificaciones(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

router.get('/', (req, res) => {
  const calificaciones = leerCalificaciones();
  res.render('califica', { title: 'Califica tu experiencia', calificaciones });
});

router.post('/', (req, res) => {
  const { nombre, disenio, navegacion, contenido, velocidad, presentacion, general } = req.body;
  const errors = {};

  // ← Leer PRIMERO antes de validar
  const calificaciones = leerCalificaciones();

  // Validar nombre y duplicado
  if (!nombre || nombre.trim().length < 2) {
    errors.nombre = 'El nombre debe tener al menos 2 caracteres.';
  } else {
    const nombreExiste = calificaciones.some(
      c => c.nombre.toLowerCase() === nombre.trim().toLowerCase()
    );
    if (nombreExiste) {
      errors.nombre = `Ya existe una calificación de "${nombre.trim()}". Solo se permite una por usuario.`;
    }
  }

  // Validar estrellas
  const campos = { disenio, navegacion, contenido, velocidad, presentacion, general };
  Object.keys(campos).forEach(key => {
    if (!campos[key] || campos[key] < 1 || campos[key] > 6) {
      errors[key] = 'Por favor selecciona una calificación.';
    }
  });

  if (Object.keys(errors).length > 0) {
    return res.render('califica', {
      title: 'Califica tu experiencia',
      errors,
      formData: req.body,
      calificaciones
    });
  }

  const nueva = {
    id: Date.now(),
    nombre: nombre.trim(),
    fecha: new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }),
    disenio: parseInt(disenio),
    navegacion: parseInt(navegacion),
    contenido: parseInt(contenido),
    velocidad: parseInt(velocidad),
    presentacion: parseInt(presentacion),
    general: parseInt(general),
    promedio: ((parseInt(disenio) + parseInt(navegacion) + parseInt(contenido) + parseInt(velocidad) + parseInt(presentacion) + parseInt(general)) / 6).toFixed(1)
  };

  calificaciones.unshift(nueva);
  guardarCalificaciones(calificaciones);

  res.render('califica', {
    title: 'Califica tu experiencia',
    success: { nombre: nueva.nombre },
    calificaciones
  });
});

module.exports = router;