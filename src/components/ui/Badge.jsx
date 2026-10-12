import { cn } from '@/lib/utils'

const tones = {
  navy: 'bg-navy-50 text-navy-700 border-navy-100',
  sepia: 'bg-ivory-200 text-sepia-700 border-sepia-300/60',
}

export default function Badge({ tone = 'navy', className, children }) {
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium', tones[tone], className)}>
      {children}
    </span>
  )
}
