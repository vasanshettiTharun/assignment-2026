import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard.jsx'
import usePageMeta from '../usePageMeta.js'
import { BUDGETS, CATEGORIES, OCCASIONS } from '../constants.js'

const selectClass = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm'

export default function Catalogue() {
  usePageMeta(
    'Corporate Gift Catalogue | Tribe Green',
    'Corporate gifts for welcome kits, festive gifting, client gifts and branded merchandise.'
  )

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [category, setCategory] = useState('')
  const [occasion, setOccasion] = useState('')
  const [budget, setBudget] = useState('')
  const [search, setSearch] = useState('')

  // Load the products again whenever a filter changes
  useEffect(() => {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (occasion) params.set('occasion', occasion)
    if (budget) params.set('budget', budget)

    setLoading(true)
    setError('')
    fetch(`/api/products?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((data) => setProducts(data))
      .catch(() => setError('Could not load products. Please refresh the page.'))
      .finally(() => setLoading(false))
  }, [category, occasion, budget])

  // Search only looks at the products already loaded
  const visibleProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.trim().toLowerCase())
  )

  return (
    <>
      <h1 className="text-3xl font-bold">Corporate gifts your team will actually keep</h1>
      <p className="mt-2 text-gray-600">
        Welcome kits, festive gifts and branded merchandise, customised with your logo.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input
          type="search"
          placeholder="Search products"
          aria-label="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={selectClass}
        />
        <select aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
          <option value="">All categories</option>
          {CATEGORIES.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select aria-label="Occasion" value={occasion} onChange={(e) => setOccasion(e.target.value)} className={selectClass}>
          <option value="">All occasions</option>
          {OCCASIONS.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select aria-label="Budget" value={budget} onChange={(e) => setBudget(e.target.value)} className={selectClass}>
          <option value="">All budgets</option>
          {BUDGETS.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>

      {loading && <p className="mt-8 text-gray-600">Loading products...</p>}
      {error && <p className="mt-8 text-red-700">{error}</p>}
      {!loading && !error && visibleProducts.length === 0 && (
        <p className="mt-8 text-gray-600">No products match these filters.</p>
      )}

      {!loading && (
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {visibleProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </>
  )
}
