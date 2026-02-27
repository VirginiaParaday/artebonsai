require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const i18n = require('./middleware/i18n');

const app = express();

// Motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Parseo de formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Idioma (cookie + detección automática)
app.use(cookieParser());
app.use(i18n);

// Rutas
const indexRouter = require('./routes/index');
const sobremiRouter = require('./routes/sobremi');
const galeriaRouter = require('./routes/galeria');
const guiasRouter = require('./routes/guias');
const blogRouter = require('./routes/blog');
const recursosRouter = require('./routes/recursos');
const calificaRouter = require('./routes/califica');
const contactoRouter = require('./routes/contacto');

app.use('/', indexRouter);
app.use('/sobre-mi', sobremiRouter);
app.use('/galeria', galeriaRouter);
app.use('/guias', guiasRouter);
app.use('/blog', blogRouter);
app.use('/recursos', recursosRouter);
app.use('/califica', calificaRouter);
app.use('/contacto', contactoRouter);

// 404
app.use((req, res) => {
    res.status(404).render('404', { title: 'Página no encontrada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌿 Servidor Bonsái corriendo en http://localhost:${PORT}`);
});

module.exports = app;