import 'dotenv/config'
import mongoose from 'mongoose'
import Product from './models/Product.js'
import products from './data/products.js'

await mongoose.connect(process.env.MONGODB_URI)

await Product.deleteMany({})
await Product.insertMany(products)

console.log(`Added ${products.length} products`)
await mongoose.disconnect()
