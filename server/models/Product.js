import mongoose from 'mongoose'
import { CATEGORIES, CUSTOMISATIONS, OCCASIONS } from '../constants.js'

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // used in the page URL
  image: { type: String, required: true },
  category: { type: String, required: true, enum: CATEGORIES },
  description: { type: String, required: true },
  priceMin: { type: Number, required: true },
  priceMax: { type: Number, required: true },
  occasions: [{ type: String, enum: OCCASIONS }],
  customisation: [{ type: String, enum: CUSTOMISATIONS }],
})

export default mongoose.model('Product', productSchema)
