import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import contactRoutes from './routes/contact.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://nain-frontend.vercel.app",
    "https://naincentroescucha.com"
  ]
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✓ Conectado a MongoDB'))
  .catch(err => console.error('Error conectando a MongoDB:', err))

// Rutas
app.use('/api/contact', contactRoutes)

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API del Centro de Escucha Naín funcionando' })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
})
