import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import usePageMeta from '../usePageMeta.js'
import { STATUSES } from '../constants.js'

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Admin() {
  usePageMeta('Enquiries | Tribe Green Admin', 'Tribe Green admin page.')

  const navigate = useNavigate()
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/enquiries')
      .then((res) => {
        if (res.status === 401) {
          navigate('/admin/login')
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (data) setEnquiries(data)
      })
      .catch(() => setError('Could not load enquiries. Please refresh the page.'))
      .finally(() => setLoading(false))
  }, [navigate])

  async function changeStatus(id, status) {
    setError('')
    const res = await fetch(`/api/admin/enquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    if (res.ok) {
      setEnquiries(enquiries.map((e) => (e._id === id ? { ...e, status } : e)))
    } else {
      setError('Could not change the status. Please try again.')
    }
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    navigate('/admin/login')
  }

  if (loading) return <p className="text-gray-600">Loading enquiries...</p>

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Enquiries ({enquiries.length})</h1>
        <div className="flex gap-2">
          <a href="/api/admin/enquiries.csv" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
            Download CSV
          </a>
          <button onClick={logout} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold">
            Log out
          </button>
        </div>
      </div>

      {error && <p className="mt-4 text-red-700">{error}</p>}
      {!error && enquiries.length === 0 && <p className="mt-6 text-gray-600">No enquiries yet.</p>}

      {enquiries.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Source</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Occasion</th>
                <th className="p-3">Order</th>
                <th className="p-3">Products</th>
                <th className="p-3">Message</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((e) => (
                <tr key={e._id} className="border-t border-gray-200 align-top">
                  <td className="whitespace-nowrap p-3">{formatDate(e.createdAt)}</td>
                  <td className="p-3">
                    <span className="rounded-full bg-brand-light px-2 py-1 text-xs font-semibold capitalize text-brand-dark">
                      {e.source}
                    </span>
                  </td>
                  <td className="p-3">
                    <p className="font-semibold">{e.name}</p>
                    <p>{e.company}</p>
                    <p>{e.phone}</p>
                    <p className="break-all">{e.email}</p>
                  </td>
                  <td className="p-3">{e.occasion}</td>
                  <td className="p-3">
                    <p>{e.units} units</p>
                    <p>{e.budget}</p>
                    <p>By {formatDate(e.deliveryDate)}</p>
                  </td>
                  <td className="p-3">
                    <p>{e.productsSelected.join(', ')}</p>
                    <p className="mt-1 text-gray-600">{e.customisation.join(', ')}</p>
                  </td>
                  <td className="max-w-48 p-3">{e.message}</td>
                  <td className="p-3">
                    <select
                      aria-label={`Status for ${e.name}`}
                      value={e.status}
                      onChange={(event) => changeStatus(e._id, event.target.value)}
                      className="rounded-lg border border-gray-300 bg-white px-2 py-1"
                    >
                      {STATUSES.map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
