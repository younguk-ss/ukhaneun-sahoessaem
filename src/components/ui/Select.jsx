import * as RS from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Radix Select 래퍼
 * groups: [{ label, options: [{ value, label }] }]  또는  options: [{ value, label }]
 * (Radix Select는 빈 문자열 value를 허용하지 않으므로 '전체'는 'all' 같은 값을 사용합니다.)
 */
export default function Select({ value, onValueChange, placeholder = '선택하세요', options, groups, className, id }) {
  const renderItem = (o) => (
    <RS.Item
      key={o.value}
      value={o.value}
      className="relative flex cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-3 text-sm text-ink outline-none data-[highlighted]:bg-navy-50 data-[highlighted]:text-navy-800"
    >
      <RS.ItemIndicator className="absolute left-2">
        <Check className="h-4 w-4 text-navy-700" />
      </RS.ItemIndicator>
      <RS.ItemText>{o.label}</RS.ItemText>
    </RS.Item>
  )

  return (
    <RS.Root value={value} onValueChange={onValueChange}>
      <RS.Trigger
        id={id}
        className={cn(
          'flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-sepia-300/70 bg-white px-3 text-left text-sm cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-navy-500/40 data-[placeholder]:text-stone-400',
          className,
        )}
      >
        <span className="truncate">
          <RS.Value placeholder={placeholder} />
        </span>
        <RS.Icon>
          <ChevronDown className="h-4 w-4 shrink-0 text-stone-500" />
        </RS.Icon>
      </RS.Trigger>
      <RS.Portal>
        <RS.Content
          position="popper"
          sideOffset={4}
          className="z-[60] max-h-80 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-sepia-300/60 bg-white shadow-xl"
        >
          <RS.Viewport className="p-1">
            {options?.map(renderItem)}
            {groups?.map((g) => (
              <RS.Group key={g.label}>
                <RS.Label className="px-3 pb-1 pt-2 text-xs font-semibold text-sepia-700">{g.label}</RS.Label>
                {g.options.map(renderItem)}
              </RS.Group>
            ))}
          </RS.Viewport>
        </RS.Content>
      </RS.Portal>
    </RS.Root>
  )
}
