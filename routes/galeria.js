const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.render('galeria', { title: 'Galería' }));
module.exports = router;
