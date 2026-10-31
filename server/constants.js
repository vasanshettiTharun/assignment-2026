// All the fixed values from the assignment brief live here.

export const CATEGORIES = ['Drinkware', 'Apparel', 'Work Essentials', 'Wellness']

export const OCCASIONS = [
  'Employee Onboarding',
  'Corporate Diwali Gifting',
  'New Year Gifts',
  'Client and Vendor Gifting',
  'Events and Trade Shows',
  'Employee Recognition',
]

export const CUSTOMISATIONS = ['Logo printing', 'Laser engraving', 'Name personalisation']

// min and max are used by the budget filter on the catalogue
export const BUDGETS = [
  { label: 'Under ₹500', min: 0, max: 499 },
  { label: '₹500 to ₹1,500', min: 500, max: 1500 },
  { label: '₹1,500 to ₹3,000', min: 1501, max: 3000 },
  { label: 'Above ₹3,000', min: 3001, max: 10000000 },
]

export const STATUSES = ['New', 'Contacted', 'Converted', 'Lost']

export const SOURCES = ['website', 'app']
