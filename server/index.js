import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import productRoutes from './routes/products.js'
import enquiryRoutes from './routes/enquiries.js'
import adminRoutes from './routes/admin.js'
import { addMetaTags } from './meta.js'

const app = express()
const webFolder = path.join(import.meta.dirname, '../web/dist')

app.set('trust proxy', 1) // Render sits in front of our app
app.use(express.json())
app.use(cookieParser())

// API
app.use('/api/products', productRoutes)
app.use('/api/enquiries', enquiryRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api', (req, res) => res.status(404).json({ message: 'Not found' }))

// Website: serves images and JS files. Pages are handled below.
app.use(express.static(webFolder, { index: false }))

app.get(/.*/, async (req, res) => {
  const indexFile = path.join(webFolder, 'index.html')
  if (!fs.existsSync(indexFile)) {
    return res.send('API is running. Start the website with "npm run dev" in the web folder.')
  }

  const html = fs.readFileSync(indexFile, 'utf8')
  const siteUrl = `${req.protocol}://${req.get('host')}`
  res.send(await addMetaTags(html, req.path, siteUrl))
})

// Turns form mistakes into { errors: { phone: "Enter a valid..." } }
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const errors = {}
    for (const field in err.errors) {
      const fieldError = err.errors[field]
      errors[field] = fieldError.name === 'CastError' ? 'Enter a valid value' : fieldError.message
    }
    return res.status(400).json({ message: 'Please check the form', errors })
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid id' })
  }

  console.error(err)
  res.status(500).json({ message: 'Something went wrong' })
})

const PORT = process.env.PORT || 5000

await mongoose.connect(process.env.MONGODB_URI)
console.log('Connected to MongoDB')

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
