const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.render('guias', { title: 'Guías y Consejos' }));
module.exports = router;
