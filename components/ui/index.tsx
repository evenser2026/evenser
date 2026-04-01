import { cn } from '@/lib/utils'

// StatCard
export function StatCard({
  title, value, subtitle, icon, color = 'gray'
}: {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  color?: 'gray' | 'green' | 'red' | 'blue' | 'amber'
}) {
  const colors = {
    gray: 'bg-gray-100 text-gray-600',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700',
    amber: 'bg-amber-100 text-amber-700',
  }
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colors[color])}>
          {icon}
        </div>
      </div>
    </div>
  )
}

// Badge
type BadgeVariant = 'green' | 'red' | 'amber' | 'blue' | 'gray' | 'purple'
export function Badge({ children, variant = 'gray' }: { children: React.ReactNode; variant?: BadgeVariant }) {
  const v: Record<BadgeVariant, string> = {
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    amber: 'bg-amber-100 text-amber-800',
    blue: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-700',
    purple: 'bg-purple-100 text-purple-800',
  }
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', v[variant])}>
      {children}
    </span>
  )
}

// EmptyState
export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="text-center py-12">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-gray-400 text-2xl">—</span>
      </div>
      <p className="text-gray-600 font-medium">{title}</p>
      {description && <p className="text-gray-400 text-sm mt-1">{description}</p>}
    </div>
  )
}

// LoadingSpinner
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className="flex justify-center py-8">
      <div className={cn('animate-spin rounded-full border-2 border-gray-200 border-t-brand-700', s[size])} />
    </div>
  )
}

// Modal
export function Modal({
  open, onClose, title, children
}: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// FormField
export function FormField({
  label, error, children, required
}: {
  label: string; error?: string; children: React.ReactNode; required?: boolean
}) {
  return (
    <div>
      <label className="label">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="error-text">{error}</p>}
    </div>
  )
}

// Select
export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn('input', className)} {...props}>
      {children}
    </select>
  )
}

// Confirm dialog
export function ConfirmDialog({
  open, onClose, onConfirm, title, message, loading
}: {
  open: boolean; onClose: () => void; onConfirm: () => void
  title: string; message: string; loading?: boolean
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Eliminando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  )
}
