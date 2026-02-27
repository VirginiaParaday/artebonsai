const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configurar transporte
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.get('/', (req, res) => {
  res.render('contacto', { title: 'Contacto' });
});

router.post('/', async (req, res) => {
  const { nombre, correo, mensaje } = req.body;
  const errors = {};

  // Validaciones
  if (!nombre || nombre.trim().length < 2) {
    errors.nombre = 'El nombre debe tener al menos 2 caracteres.';
  }
const enviarCopia = req.body.enviarCopia === 'si';

  if (enviarCopia && (!correo || correo.trim() === '')) {
    errors.correo = 'El correo es obligatorio si deseas recibir una copia.';
  } else if (correo && correo.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo.trim())) {
      errors.correo = 'El correo electrónico no tiene un formato válido.';
    }
  }
  if (!mensaje || mensaje.trim().length < 10) {
    errors.mensaje = 'El mensaje debe tener al menos 10 caracteres.';
  }

  if (Object.keys(errors).length > 0) {
    return res.render('contacto', {
      title: 'Contacto',
      errors,
      formData: req.body
    });
  }

  // Enviar correo
  try {
  const htmlMensaje = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #d4edda; border-radius: 8px;">
        <h2 style="color: #2d6a3f; border-bottom: 2px solid #2d6a3f; padding-bottom: 10px;">
          🌿 Nuevo mensaje desde Arte Bonsái
        </h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #5a3e1b; width: 30%;">Nombre:</td>
            <td style="padding: 10px; color: #333;">${nombre.trim()}</td>
          </tr>
          <tr style="background: #f5f0e8;">
            <td style="padding: 10px; font-weight: bold; color: #5a3e1b;">Correo:</td>
            <td style="padding: 10px; color: #333;">${correo && correo.trim() !== '' ? correo.trim() : 'No proporcionado'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #5a3e1b; vertical-align: top;">Mensaje:</td>
            <td style="padding: 10px; color: #333; line-height: 1.6;">${mensaje.trim().replace(/\n/g, '<br>')}</td>
          </tr>
        </table>
        <p style="margin-top: 20px; font-size: 0.85rem; color: #999; text-align: center;">
          © 2026 Carlos Mauricio Martínez Sarmiento – Arte Bonsái
        </p>
      </div>
    `;

    // Enviar al administrador
    await transporter.sendMail({
      from: `"Arte Bonsái 🌿" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: correo && correo.trim() !== '' ? correo.trim() : process.env.EMAIL_USER,
      subject: `Nuevo mensaje de ${nombre.trim()} – Arte Bonsái`,
      html: htmlMensaje
    });

    // Enviar copia al usuario si marcó el checkbox
    if (enviarCopia && correo && correo.trim() !== '') {
      await transporter.sendMail({
        from: `"Arte Bonsái 🌿" <${process.env.EMAIL_USER}>`,
        to: correo.trim(),
        subject: `Copia de tu mensaje – Arte Bonsái`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #d4edda; border-radius: 8px;">
            <h2 style="color: #2d6a3f; border-bottom: 2px solid #2d6a3f; padding-bottom: 10px;">
              🌿 Copia de tu mensaje en Arte Bonsái
            </h2>
            <p style="color: #5a3e1b;">Hola <strong>${nombre.trim()}</strong>, aquí tienes una copia del mensaje que nos enviaste:</p>
            ${htmlMensaje}
            <p style="margin-top: 20px; color: #2d6a3f; font-style: italic;">
              Gracias por contactarnos. Te responderemos pronto. 🌿
            </p>
          </div>
        `
      });
    }

    res.render('contacto', {
      title: 'Contacto',
      success: { nombre: nombre.trim() }
    });

  } catch (error) {
    console.error('Error enviando correo:', error);
    res.render('contacto', {
      title: 'Contacto',
      errors: { general: 'Hubo un error al enviar el mensaje. Intenta de nuevo.' },
      formData: req.body
    });
  }
});

module.exports = router;