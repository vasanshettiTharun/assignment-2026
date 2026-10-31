import mongoose from 'mongoose'
import { BUDGETS, CUSTOMISATIONS, OCCASIONS, SOURCES, STATUSES } from '../constants.js'

// All the enquiry validation is in this file.
// The messages below are shown to the user on the website and in the app.
const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Enter your name'], trim: true },
    company: { type: String, required: [true, 'Enter your company name'], trim: true },
    phone: {
      type: String,
      required: [true, 'Enter your phone number'],
      trim: true,
      match: [/^\d{10}$/, 'Enter a 10-digit phone number'],
    },
    email: {
      type: String,
      required: [true, 'Enter your email'],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email address'],
    },
    occasion: {
      type: String,
      required: [true, 'Choose an occasion'],
      enum: { values: OCCASIONS, message: 'Choose an occasion from the list' },
    },
    units: {
      type: Number,
      required: [true, 'Enter the number of units'],
      min: [1, 'Units must be at least 1'],
      validate: { validator: Number.isInteger, message: 'Units must be a whole number' },
    },
    budget: {
      type: String,
      required: [true, 'Choose a budget per unit'],
      enum: { values: BUDGETS.map((b) => b.label), message: 'Choose a budget from the list' },
    },
    deliveryDate: {
      type: Date,
      required: [true, 'Choose a delivery date'],
      validate: {
        validator: (date) => date >= new Date(new Date().toDateString()),
        message: 'Delivery date cannot be in the past',
      },
    },
    productsSelected: {
      type: [String],
      validate: {
        validator: (products) => products.length > 0,
        message: 'Select at least one product',
      },
    },
    customisation: [{ type: String, enum: CUSTOMISATIONS }],
    message: { type: String, trim: true, default: '' },
    source: { type: String, required: true, enum: SOURCES },
    status: { type: String, enum: STATUSES, default: 'New' },
  },
  { timestamps: true } // adds createdAt and updatedAt
)

export default mongoose.model('Enquiry', enquirySchema)
