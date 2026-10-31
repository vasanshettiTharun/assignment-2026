import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-md"
    >
      <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">{product.category}</p>
        <h2 className="mt-1 font-semibold">{product.name}</h2>
        <p className="mt-1 text-sm text-gray-600">
          ₹{product.priceMin.toLocaleString('en-IN')} to ₹{product.priceMax.toLocaleString('en-IN')} per unit
        </p>
      </div>
    </Link>
  )
}
