import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import usePageMeta from '../usePageMeta.js'

const inputClass = 'mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2'

export default function AdminLogin() {
  usePageMeta('Admin Login | Tribe Green', 'Tribe Green admin login.')

  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (res.ok) {
        navigate('/admin')
      } else {
        const data = await res.json()
        setError(data.message)
      }
    } catch {
      setError('Could not reach the server. Please try again.')
    }
  }

  return (
    <div className="mx-auto max-w-sm py-8">
      <h1 className="text-2xl font-bold">Admin login</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block font-medium">
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} className={inputClass} />
        </label>
        <label className="block font-medium">
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
        </label>
        {error && <p className="text-red-700">{error}</p>}
        <button type="submit" className="w-full rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-dark">
          Log in
        </button>
      </form>
    </div>
  )
}
