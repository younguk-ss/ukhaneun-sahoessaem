import * as RD from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Radix Dialog 래퍼 — 포커스 트랩, ESC 닫기, 스크린리더 지원이 기본 제공됩니다.
 */
export default function Dialog({ open, onOpenChange, title, description, children, className }) {
  return (
    <RD.Root open={open} onOpenChange={onOpenChange}>
      <RD.Portal>
        <RD.Overlay className="anim-overlay fixed inset-0 z-50 bg-navy-900/40 backdrop-blur-[2px]" />
        <RD.Content
          className={cn(
            'anim-content fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2',
            'max-h-[90vh] overflow-y-auto rounded-2xl border border-sepia-300/60 bg-ivory-50 p-6 shadow-2xl focus:outline-none',
            className,
          )}
        >
          <div className="mb-5 pr-8">
            <RD.Title className="font-serif text-xl font-bold text-navy-900">{title}</RD.Title>
            {description ? (
              <RD.Description className="mt-1 text-sm text-stone-600">{description}</RD.Description>
            ) : (
              <RD.Description className="sr-only">{title}</RD.Description>
            )}
          </div>
          {children}
          <RD.Close
            className="absolute right-4 top-4 rounded-md p-1.5 text-stone-500 hover:bg-ivory-200 hover:text-navy-800 cursor-pointer"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </RD.Close>
        </RD.Content>
      </RD.Portal>
    </RD.Root>
  )
}
