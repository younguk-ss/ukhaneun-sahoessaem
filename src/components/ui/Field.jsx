import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const base =
  'w-full rounded-lg border border-sepia-300/70 bg-white px-3 text-sm text-ink placeholder:text-stone-400 ' +
  'focus:outline-none focus:ring-2 focus:ring-navy-500/40 focus:border-navy-500 transition'

export const Input = forwardRef(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(base, 'h-10', className)} {...props} />
))
Input.displayName = 'Input'

export const Textarea = forwardRef(({ className, rows = 4, ...props }, ref) => (
  <textarea ref={ref} rows={rows} className={cn(base, 'py-2 leading-relaxed resize-y', className)} {...props} />
))
Textarea.displayName = 'Textarea'

/** 라벨 + 입력 요소 + 도움말을 묶는 폼 필드 */
export function Field({ label, htmlFor, required, hint, children, className }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-semibold text-navy-900">
          {label}
          {required && <span className="ml-0.5 text-red-600">*</span>}
        </label>
      )}
      {children}
      {hint && <p className="text-xs text-stone-500">{hint}</p>}
    </div>
  )
}
