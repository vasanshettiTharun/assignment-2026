import { Router } from 'express'
import Product from '../models/Product.js'
import { BUDGETS } from '../constants.js'

const router = Router()

router.get('/', async (req, res) => {
  const { category, occasion, budget } = req.query
  const filter = {}

  if (category) filter.category = String(category)
  if (occasion) filter.occasions = String(occasion)

  const band = BUDGETS.find((b) => b.label === budget)
  if (band) {
    filter.priceMin = { $lte: band.max }
    filter.priceMax = { $gte: band.min }
  }

  const products = await Product.find(filter).sort({ priceMin: 1 })
  res.json(products)
})

router.get('/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
  if (!product) return res.status(404).json({ message: 'Product not found' })
  res.json(product)
})

export default router
