import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import usePageMeta from '../usePageMeta.js'
import { BUDGETS, CUSTOMISATIONS, OCCASIONS } from '../constants.js'

const inputClass = 'mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2'

export default function Enquiry() {
  usePageMeta(
    'Send an Enquiry | Tribe Green',
    'Tell us what you need and the Tribe Green team will get back to you with a quote.'
  )

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const productFromUrl = searchParams.get('product')

  const [products, setProducts] = useState([])
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    occasion: '',
    units: '',
    budget: '',
    deliveryDate: '',
    productsSelected: productFromUrl ? [productFromUrl] : [],
    customisation: [],
    message: '',
  })

  useEffect(() => {
    fetch('/api/products')
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((data) => setProducts(data))
      .catch(() => setFormError('Could not load the product list. Please refresh the page.'))
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Adds or removes a value from a checkbox list
  function toggleItem(field, value) {
    const list = form[field]
    const newList = list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
    setForm({ ...form, [field]: newList })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setErrors({})
    setFormError('')

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'website' }),
      })
      const data = await res.json()

      if (res.ok) {
        navigate('/thank-you', { state: { name: data.name } })
      } else {
        setErrors(data.errors || {})
        setFormError(data.message)
      }
    } catch {
      setFormError('Could not send your enquiry. Please check your internet and try again.')
    }

    setSubmitting(false)
  }

  function FieldError({ name }) {
    if (!errors[name]) return null
    return <p className="mt-1 text-sm text-red-700">{errors[name]}</p>
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold">Send an enquiry</h1>
      <p className="mt-2 text-gray-600">Tell us what you need and we will get back to you with a quote.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block font-medium">
            Name
            <input name="name" value={form.name} onChange={handleChange} className={inputClass} />
            <FieldError name="name" />
          </label>
          <label className="block font-medium">
            Company
            <input name="company" value={form.company} onChange={handleChange} className={inputClass} />
            <FieldError name="company" />
          </label>
          <label className="block font-medium">
            Phone
            <input type="tel" name="phone" maxLength={10} placeholder="10-digit mobile number" value={form.phone} onChange={handleChange} className={inputClass} />
            <FieldError name="phone" />
          </label>
          <label className="block font-medium">
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} />
            <FieldError name="email" />
          </label>
          <label className="block font-medium">
            Occasion
            <select name="occasion" value={form.occasion} onChange={handleChange} className={inputClass}>
              <option value="">Choose an occasion</option>
              {OCCASIONS.map((item) => <option key={item}>{item}</option>)}
            </select>
            <FieldError name="occasion" />
          </label>
          <label className="block font-medium">
            Number of units
            <input type="number" min="1" name="units" value={form.units} onChange={handleChange} className={inputClass} />
            <FieldError name="units" />
          </label>
          <label className="block font-medium">
            Budget per unit
            <select name="budget" value={form.budget} onChange={handleChange} className={inputClass}>
              <option value="">Choose a budget</option>
              {BUDGETS.map((item) => <option key={item}>{item}</option>)}
            </select>
            <FieldError name="budget" />
          </label>
          <label className="block font-medium">
            Delivery date
            <input type="date" name="deliveryDate" value={form.deliveryDate} onChange={handleChange} className={inputClass} />
            <FieldError name="deliveryDate" />
          </label>
        </div>

        <fieldset>
          <legend className="font-medium">Products</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {products.map((product) => (
              <label key={product._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.productsSelected.includes(product.name)}
                  onChange={() => toggleItem('productsSelected', product.name)}
                  className="accent-brand"
                />
                {product.name}
              </label>
            ))}
          </div>
          <FieldError name="productsSelected" />
        </fieldset>

        <fieldset>
          <legend className="font-medium">Customisation needed</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {CUSTOMISATIONS.map((item) => (
              <label key={item} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.customisation.includes(item)}
                  onChange={() => toggleItem('customisation', item)}
                  className="accent-brand"
                />
                {item}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="block font-medium">
          Message (optional)
          <textarea name="message" rows="4" value={form.message} onChange={handleChange} className={inputClass} />
        </label>

        {formError && <p className="text-red-700">{formError}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {submitting ? 'Sending...' : 'Send enquiry'}
        </button>
      </form>
    </div>
  )
}
