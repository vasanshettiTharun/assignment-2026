import { Link, useLocation } from 'react-router-dom'
import usePageMeta from '../usePageMeta.js'

export default function ThankYou() {
  usePageMeta('Thank You | Tribe Green', 'We have received your enquiry and will be in touch soon.')

  const { state } = useLocation()

  return (
    <div className="mx-auto max-w-lg py-12 text-center">
      <h1 className="text-3xl font-bold">Thank you{state?.name ? `, ${state.name}` : ''}!</h1>
      <p className="mt-3 text-gray-600">
        We have received your enquiry. Our sales team will contact you soon.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-dark"
      >
        Back to catalogue
      </Link>
    </div>
  )
}
