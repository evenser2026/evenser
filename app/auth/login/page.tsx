'use client'
import { useState } from 'react'
import { login } from '@/lib/actions/auth'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passFocused, setPassFocused] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const fd = new FormData(e.currentTarget)
    const result = await login(fd.get('email') as string, fd.get('password') as string)
    if (result?.error) { setError(result.error); setLoading(false) }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: '#008080',
        fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif',
        fontSize: '11px',
      }}
    >
      {/* Window chrome */}
      <div
        style={{
          width: '340px',
          background: '#d4d0c8',
          border: '1px solid #808080',
          boxShadow: '2px 2px 0 #000, inset 1px 1px 0 #fff, inset -1px -1px 0 #808080',
        }}
      >
        {/* Title bar */}
        <div
          style={{
            background: 'linear-gradient(to right, #000080, #1084d0)',
            padding: '3px 4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Window icon */}
            <div style={{
              width: '14px', height: '14px',
              background: '#fff',
              border: '1px solid #000',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '9px', fontWeight: 'bold', color: '#000080',
            }}>E</div>
            <span style={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}>
              Evenser — Iniciar Sesión
            </span>
          </div>
          {/* Window controls */}
          <div style={{ display: 'flex', gap: '2px' }}>
            {['_', '□', '✕'].map((btn, i) => (
              <button
                key={i}
                aria-hidden="true"
                style={{
                  width: '16px', height: '14px',
                  background: '#d4d0c8',
                  border: '1px solid',
                  borderColor: '#fff #808080 #808080 #fff',
                  fontSize: '9px', fontWeight: 'bold',
                  cursor: 'default', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  color: '#000',
                  lineHeight: 1,
                }}
              >{btn}</button>
            ))}
          </div>
        </div>

        {/* Window body */}
        <div style={{ padding: '16px' }}>
          {/* Logo area */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            marginBottom: '14px',
            padding: '10px',
            background: '#fff',
            border: '1px solid',
            borderColor: '#808080 #fff #fff #808080',
            boxShadow: 'inset 1px 1px 2px #aaa',
          }}>
            <div style={{
              width: '40px', height: '40px',
              background: '#000080',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', fontFamily: 'serif' }}>E</span>
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#000080' }}>Evenser</div>
              <div style={{ fontSize: '10px', color: '#444' }}>Eventos y Servicios Sociales</div>
              <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>Versión 2.0 © 2024</div>
            </div>
          </div>

          {/* Separator */}
          <div style={{ height: '1px', background: '#808080', marginBottom: '12px', boxShadow: '0 1px 0 #fff' }} />

          <form onSubmit={handleSubmit}>
            {/* Email field */}
            <div style={{ marginBottom: '8px' }}>
              <label
                htmlFor="email"
                style={{ display: 'block', marginBottom: '3px', fontWeight: 'bold', color: '#000' }}
              >
                Correo electrónico:
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="usuario@evenser.com"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                style={{
                  width: '100%',
                  padding: '3px 4px',
                  background: '#fff',
                  border: '2px solid',
                  borderColor: emailFocused ? '#000080' : '#808080 #fff #fff #808080',
                  outline: 'none',
                  fontSize: '11px',
                  fontFamily: 'Tahoma, Arial, sans-serif',
                  boxSizing: 'border-box',
                  color: '#000',
                }}
              />
            </div>

            {/* Password field */}
            <div style={{ marginBottom: '12px' }}>
              <label
                htmlFor="password"
                style={{ display: 'block', marginBottom: '3px', fontWeight: 'bold', color: '#000' }}
              >
                Contraseña:
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                onFocus={() => setPassFocused(true)}
                onBlur={() => setPassFocused(false)}
                style={{
                  width: '100%',
                  padding: '3px 4px',
                  background: '#fff',
                  border: '2px solid',
                  borderColor: passFocused ? '#000080' : '#808080 #fff #fff #808080',
                  outline: 'none',
                  fontSize: '11px',
                  fontFamily: 'Tahoma, Arial, sans-serif',
                  boxSizing: 'border-box',
                  color: '#000',
                }}
              />
            </div>

            {/* Error message */}
            {error && (
              <div style={{
                background: '#fff',
                border: '1px solid #808080',
                padding: '4px 6px',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <span style={{ color: '#c00', fontWeight: 'bold', fontSize: '14px' }}>⚠</span>
                <span style={{ color: '#c00', fontSize: '11px' }}>{error}</span>
              </div>
            )}

            {/* Separator */}
            <div style={{ height: '1px', background: '#808080', marginBottom: '10px', boxShadow: '0 1px 0 #fff' }} />

            {/* Buttons row */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '4px 20px',
                  background: '#d4d0c8',
                  border: '1px solid',
                  borderColor: loading ? '#808080' : '#fff #808080 #808080 #fff',
                  boxShadow: loading ? 'none' : 'inset 1px 1px 0 #fff',
                  fontSize: '11px',
                  fontFamily: 'Tahoma, Arial, sans-serif',
                  fontWeight: 'bold',
                  cursor: loading ? 'default' : 'pointer',
                  color: '#000',
                  minWidth: '75px',
                  outline: '1px dotted transparent',
                }}
                onMouseDown={e => {
                  if (!loading) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#808080 #fff #fff #808080'
                    ;(e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'
                  }
                }}
                onMouseUp={e => {
                  if (!loading) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#fff #808080 #808080 #fff'
                    ;(e.currentTarget as HTMLButtonElement).style.boxShadow = 'inset 1px 1px 0 #fff'
                  }
                }}
              >
                {loading ? 'Ingresando...' : 'Aceptar'}
              </button>
              <button
                type="button"
                onClick={() => { setError('') }}
                style={{
                  padding: '4px 20px',
                  background: '#d4d0c8',
                  border: '1px solid',
                  borderColor: '#fff #808080 #808080 #fff',
                  boxShadow: 'inset 1px 1px 0 #fff',
                  fontSize: '11px',
                  fontFamily: 'Tahoma, Arial, sans-serif',
                  cursor: 'pointer',
                  color: '#000',
                  minWidth: '75px',
                }}
                onMouseDown={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#808080 #fff #fff #808080'
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'
                }}
                onMouseUp={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#fff #808080 #808080 #fff'
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow = 'inset 1px 1px 0 #fff'
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>

        {/* Status bar */}
        <div style={{
          borderTop: '1px solid #808080',
          padding: '2px 6px',
          background: '#d4d0c8',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          boxShadow: 'inset 0 1px 0 #fff',
        }}>
          <div style={{
            width: '8px', height: '8px',
            borderRadius: '50%',
            background: '#00aa00',
            border: '1px solid #006600',
            flexShrink: 0,
          }} />
          <span style={{ fontSize: '10px', color: '#444' }}>
            TikTok: @evenser_ · Instagram: @evenser_Baldo
          </span>
        </div>
      </div>

      {/* Taskbar */}
      <div style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        height: '28px',
        background: '#d4d0c8',
        borderTop: '2px solid #fff',
        display: 'flex',
        alignItems: 'center',
        padding: '0 4px',
        gap: '4px',
        boxShadow: '0 -1px 0 #808080',
        zIndex: 10,
      }}>
        {/* Start button */}
        <button style={{
          background: '#d4d0c8',
          border: '1px solid',
          borderColor: '#fff #808080 #808080 #fff',
          boxShadow: 'inset 1px 1px 0 #fff',
          padding: '2px 8px',
          fontSize: '11px',
          fontWeight: 'bold',
          fontFamily: 'Tahoma, Arial, sans-serif',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          height: '22px',
          color: '#000',
        }}>
          <span style={{ fontSize: '13px' }}>⊞</span> Inicio
        </button>

        {/* Separator */}
        <div style={{ width: '1px', height: '20px', background: '#808080', boxShadow: '1px 0 0 #fff', margin: '0 2px' }} />

        {/* Active window button */}
        <button style={{
          background: '#c0bdb5',
          border: '1px solid',
          borderColor: '#808080 #fff #fff #808080',
          boxShadow: 'inset 1px 1px 0 #888',
          padding: '2px 8px',
          fontSize: '11px',
          fontFamily: 'Tahoma, Arial, sans-serif',
          cursor: 'default',
          height: '22px',
          color: '#000',
          minWidth: '120px',
          textAlign: 'left',
        }}>
          Evenser — Iniciar Sesión
        </button>

        {/* Clock */}
        <div style={{
          marginLeft: 'auto',
          padding: '2px 8px',
          border: '1px solid',
          borderColor: '#808080 #fff #fff #808080',
          fontSize: '11px',
          fontFamily: 'Tahoma, Arial, sans-serif',
          color: '#000',
          background: '#d4d0c8',
        }}>
          {new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  )
}
