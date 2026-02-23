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

router.post('/', async (req, res) => {
  const { nombre, email, telefono, mensaje } = req.body

  if (!nombre || !telefono) {
    return res.status(400).json({ 
      message: 'Nombre y teléfono son obligatorios' 
    })
  }

  // Configurar email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: `Nuevo contacto de ${nombre} - Centro Naín`,
    html: `
      <h2>Nuevo contacto desde la web</h2>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Email:</strong> ${email || 'No proporcionado'}</p>
      <p><strong>Teléfono:</strong> ${telefono}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${mensaje || 'Sin mensaje'}</p>
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
