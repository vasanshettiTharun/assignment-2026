import { Router } from 'express'
import jwt from 'jsonwebtoken'
import Enquiry from '../models/Enquiry.js'
import requireAdmin from '../middleware/requireAdmin.js'
import { STATUSES } from '../constants.js'

const router = Router()

router.post('/login', (req, res) => {
  const { username, password } = req.body

  if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Wrong username or password' })
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1d' })

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
  })
  res.json({ message: 'Logged in' })
})

router.post('/logout', (req, res) => {
  res.clearCookie('token')
  res.json({ message: 'Logged out' })
})

router.use(requireAdmin)

router.get('/enquiries', async (req, res) => {
  const enquiries = await Enquiry.find().sort({ createdAt: -1 })
  res.json(enquiries)
})

router.patch('/enquiries/:id', async (req, res) => {
  if (!STATUSES.includes(req.body.status)) {
    return res.status(400).json({ message: 'Invalid status' })
  }

  const enquiry = await Enquiry.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { returnDocument: 'after' }
  )
  if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' })
  res.json(enquiry)
})

function csvCell(value) {
  let text = String(value ?? '')
  if (/^[=+\-@]/.test(text)) text = "'" + text
  return `"${text.replaceAll('"', '""')}"`
}

router.get('/enquiries.csv', async (req, res) => {
  const enquiries = await Enquiry.find().sort({ createdAt: -1 })

  const header = [
    'Date', 'Source', 'Status', 'Name', 'Company', 'Phone', 'Email', 'Occasion', 'Units',
    'Budget per unit', 'Delivery date', 'Products', 'Customisation', 'Message',
  ]

  const rows = enquiries.map((e) => [
    e.createdAt.toISOString().slice(0, 10),
    e.source,
    e.status,
    e.name,
    e.company,
    e.phone,
    e.email,
    e.occasion,
    e.units,
    e.budget,
    e.deliveryDate.toISOString().slice(0, 10),
    e.productsSelected.join(', '),
    e.customisation.join(', '),
    e.message,
  ])

  const lines = [header, ...rows].map((row) => row.map(csvCell).join(','))

  res.attachment('enquiries.csv').type('text/csv').send('﻿' + lines.join('\r\n'))
})

export default router
