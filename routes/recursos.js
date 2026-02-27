const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.render('recursos', { title: 'Recursos' }));
module.exports = router;
