import { Router } from 'express'
import Enquiry from '../models/Enquiry.js'

const router = Router()

// POST /api/enquiries
// We pick each field by hand so nobody can set "status" from the form.
router.post('/', async (req, res) => {
  const enquiry = await Enquiry.create({
    name: req.body.name,
    company: req.body.company,
    phone: req.body.phone,
    email: req.body.email,
    occasion: req.body.occasion,
    units: req.body.units,
    budget: req.body.budget,
    deliveryDate: req.body.deliveryDate,
    productsSelected: req.body.productsSelected,
    customisation: req.body.customisation,
    message: req.body.message,
    source: req.body.source,
  })

  res.status(201).json(enquiry)
})

export default router
