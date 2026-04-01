'use client'
import { useState } from 'react'
import { login } from '@/lib/actions/auth'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const fd = new FormData(e.currentTarget)
    const result = await login(fd.get('email') as string, fd.get('password') as string)
    if (result?.error) { setError(result.error); setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 to-brand-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">E</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Evenser</h1>
          <p className="text-gray-500 text-sm mt-1">Eventos y Servicios Sociales</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Correo electrónico</label>
            <input name="email" type="email" required className="input" placeholder="usuario@evenser.com" />
          </div>
          <div>
            <label className="label">Contraseña</label>
            <input name="password" type="password" required className="input" placeholder="••••••••" />
          </div>
          {error && <p className="error-text text-center">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          TikTok: @evenser_ · Instagram: @evenser_Baldo
        </p>
      </div>
    </div>
  )
}
