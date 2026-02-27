const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Inicio', pageClass: 'page-inicio' });
});

module.exports = router;
