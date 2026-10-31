import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const { pathname } = useLocation()
  const isAdminPage = pathname.startsWith('/admin')

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-bold text-brand">
          Tribe Green
        </Link>
        {!isAdminPage && (
          <Link
            to="/enquiry"
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Send enquiry
          </Link>
        )}
      </div>
    </header>
  )
}
