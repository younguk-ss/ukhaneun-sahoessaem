import * as AD from '@radix-ui/react-alert-dialog'
import Button from './Button'

/** 삭제 등 되돌릴 수 없는 작업을 확인하는 대화상자 */
export default function ConfirmDialog({ open, onOpenChange, title, description, confirmText = '삭제', onConfirm }) {
  return (
    <AD.Root open={open} onOpenChange={onOpenChange}>
      <AD.Portal>
        <AD.Overlay className="anim-overlay fixed inset-0 z-50 bg-navy-900/40" />
        <AD.Content className="anim-content fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-sepia-300/60 bg-ivory-50 p-6 shadow-2xl focus:outline-none">
          <AD.Title className="font-serif text-lg font-bold text-navy-900">{title}</AD.Title>
          <AD.Description className="mt-2 text-sm leading-relaxed text-stone-600">{description}</AD.Description>
          <div className="mt-6 flex justify-end gap-2">
            <AD.Cancel asChild>
              <Button variant="secondary">취소</Button>
            </AD.Cancel>
            <AD.Action asChild>
              <Button variant="danger" onClick={onConfirm}>
                {confirmText}
              </Button>
            </AD.Action>
          </div>
        </AD.Content>
      </AD.Portal>
    </AD.Root>
  )
}
