import express from 'express'
import nodemailer from 'nodemailer'

const router = express.Router()

// Configurar transporter de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// Escapar HTML para que los datos del formulario no se interpreten en el email
const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

router.post('/', async (req, res) => {
  const nombre = String(req.body.nombre || '').trim()
  const email = String(req.body.email || '').trim()
  const telefono = String(req.body.telefono || '').trim()
  const mensaje = String(req.body.mensaje || '').trim()

  if (!nombre || !telefono) {
    return res.status(400).json({
      message: 'Nombre y teléfono son obligatorios'
    })
  }

  if (nombre.length > 100 || email.length > 150 || telefono.length > 30 || mensaje.length > 3000) {
    return res.status(400).json({
      message: 'Alguno de los campos es demasiado largo'
    })
  }

  if (email && !EMAIL_REGEX.test(email)) {
    return res.status(400).json({
      message: 'El email no es válido'
    })
  }

  // Configurar email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    replyTo: email || undefined,
    subject: `Nuevo contacto de ${nombre.replace(/[\r\n]+/g, ' ')} - Centro Naín`,
    html: `
      <h2>Nuevo contacto desde la web</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>
      <p><strong>Email:</strong> ${email ? escapeHtml(email) : 'No proporcionado'}</p>
      <p><strong>Teléfono:</strong> ${escapeHtml(telefono)}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${mensaje ? escapeHtml(mensaje).replace(/\n/g, '<br>') : 'Sin mensaje'}</p>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    res.json({
      message: 'Mensaje enviado correctamente. Te contactaremos pronto.'
    })
  } catch (error) {
    console.error('Error al enviar email:', error)
    res.status(500).json({
      message: 'Error al enviar el mensaje. Por favor, llámanos directamente.'
    })
  }
})

export default router
