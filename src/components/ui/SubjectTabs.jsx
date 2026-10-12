import * as Tabs from '@radix-ui/react-tabs'
import { Landmark, Scale } from 'lucide-react'
import { SUBJECTS } from '@/data/constants'
import { cn } from '@/lib/utils'

const icons = { social: Scale, history: Landmark }

/** 교과 선택 탭 (사회 / 역사) — 키보드 방향키 이동 지원 */
export default function SubjectTabs({ value, onChange, counts = {} }) {
  return (
    <Tabs.Root value={value} onValueChange={onChange}>
      <Tabs.List aria-label="교과 선택" className="inline-flex rounded-xl border border-sepia-300/60 bg-ivory-100 p-1">
        {SUBJECTS.map((s) => {
          const Icon = icons[s.id]
          return (
            <Tabs.Trigger
              key={s.id}
              value={s.id}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-stone-600 transition cursor-pointer',
                'data-[state=active]:bg-navy-700 data-[state=active]:text-white data-[state=active]:shadow',
                'hover:text-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500',
              )}
            >
              <Icon className="h-4 w-4" />
              {s.label}
              {counts[s.id] != null && (
                <span className="rounded-full bg-black/10 px-1.5 text-xs">{counts[s.id]}</span>
              )}
            </Tabs.Trigger>
          )
        })}
      </Tabs.List>
    </Tabs.Root>
  )
}
