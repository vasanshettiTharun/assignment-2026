import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import usePageMeta from '../usePageMeta.js'
import { WHATSAPP_NUMBER } from '../constants.js'

export default function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState('')

  usePageMeta(
    product ? `${product.name} | Tribe Green` : 'Product | Tribe Green',
    product ? product.description : 'Corporate gifts from Tribe Green.'
  )

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((data) => setProduct(data))
      .catch(() => setError('Sorry, we could not find this product.'))
  }, [slug])

  if (error) {
    return (
      <>
        <p className="text-red-700">{error}</p>
        <Link to="/" className="mt-4 inline-block text-brand underline">Back to catalogue</Link>
      </>
    )
  }

  if (!product) return <p className="text-gray-600">Loading product...</p>

  const whatsappMessage = `Hi Tribe Green, I am interested in the ${product.name} for corporate gifting. Please share more details.`
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <>
      <Link to="/" className="text-sm text-brand underline">Back to catalogue</Link>

      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <img src={product.image} alt={product.name} className="w-full rounded-xl border border-gray-200" />

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">{product.category}</p>
          <h1 className="mt-1 text-3xl font-bold">{product.name}</h1>
          <p className="mt-2 text-xl font-semibold">
            ₹{product.priceMin.toLocaleString('en-IN')} to ₹{product.priceMax.toLocaleString('en-IN')}
            <span className="text-base font-normal text-gray-600"> per unit</span>
          </p>
          <p className="mt-4 text-gray-700">{product.description}</p>

          <h2 className="mt-6 font-semibold">Suits these occasions</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {product.occasions.map((item) => (
              <li key={item} className="rounded-full bg-brand-light px-3 py-1 text-sm text-brand-dark">{item}</li>
            ))}
          </ul>

          <h2 className="mt-6 font-semibold">Customisation available</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {product.customisation.map((item) => (
              <li key={item} className="rounded-full border border-gray-300 px-3 py-1 text-sm">{item}</li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to={`/enquiry?product=${encodeURIComponent(product.name)}`}
              className="rounded-lg bg-brand px-5 py-3 text-center font-semibold text-white hover:bg-brand-dark"
            >
              Enquire now
            </Link>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-[#25D366] px-5 py-3 text-center font-semibold text-[#0b2e1c] hover:brightness-95"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
