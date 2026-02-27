const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('sobremi', { title: 'Sobre mí' });
});

module.exports = router;
