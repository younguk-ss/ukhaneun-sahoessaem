import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const variants = {
  primary: 'bg-navy-700 text-white hover:bg-navy-800 shadow-sm',
  secondary: 'bg-ivory-100 text-navy-800 border border-sepia-300/70 hover:bg-ivory-200',
  ghost: 'text-navy-800 hover:bg-navy-50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  outline: 'border border-navy-200 text-navy-700 bg-white hover:bg-navy-50',
}
const sizes = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-5 text-base gap-2',
  icon: 'h-9 w-9 justify-center',
}

/** 버튼 스타일 클래스 — <Link> 등을 버튼처럼 꾸밀 때도 사용 */
export const buttonVariants = ({ variant = 'primary', size = 'md', className } = {}) =>
  cn(
    'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
    variants[variant],
    sizes[size],
    className,
  )

/** 공통 버튼 (shadcn/ui 스타일) */
const Button = forwardRef(({ className, variant, size, type = 'button', ...props }, ref) => (
  <button ref={ref} type={type} className={buttonVariants({ variant, size, className })} {...props} />
))
Button.displayName = 'Button'
export default Button
