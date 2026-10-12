import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Field'
import { uid } from '@/lib/utils'

/**
 * 차시 계획 편집기
 * value: Lesson[]  ({ id, session, title, activity })
 * 차시 번호(session)는 순서에 따라 자동으로 다시 매겨집니다.
 */
export default function LessonPlanEditor({ value, onChange }) {
  const renumber = (list) => list.map((l, i) => ({ ...l, session: i + 1 }))

  const add = () => onChange(renumber([...value, { id: uid('l'), session: 0, title: '', activity: '' }]))
  const update = (id, patch) => onChange(value.map((l) => (l.id === id ? { ...l, ...patch } : l)))
  const remove = (id) => onChange(renumber(value.filter((l) => l.id !== id)))
  const move = (idx, dir) => {
    const next = [...value]
    ;[next[idx], next[idx + dir]] = [next[idx + dir], next[idx]]
    onChange(renumber(next))
  }

  return (
    <div className="space-y-3">
      {value.length === 0 && (
        <p className="rounded-lg bg-ivory-100 px-4 py-6 text-center text-sm text-stone-500">
          차시를 추가해 수업 흐름을 기록하세요.
        </p>
      )}

      <ol className="space-y-3">
        {value.map((lesson, idx) => (
          <li key={lesson.id} className="flex gap-3 rounded-xl border border-sepia-300/60 bg-white p-3">
            <div className="flex w-12 shrink-0 flex-col items-center gap-1">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-700 font-serif text-sm font-bold text-white">
                {lesson.session}
              </span>
              <span className="text-[11px] text-stone-500">차시</span>
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <Input
                aria-label={`${lesson.session}차시 주제`}
                value={lesson.title}
                onChange={(e) => update(lesson.id, { title: e.target.value })}
                placeholder="차시 주제 (예: 재판의 종류와 절차)"
              />
              <Textarea
                aria-label={`${lesson.session}차시 활동`}
                rows={2}
                value={lesson.activity}
                onChange={(e) => update(lesson.id, { activity: e.target.value })}
                placeholder="주요 활동, 평가 방법 등"
              />
            </div>
            <div className="flex shrink-0 flex-col gap-1">
              <Button size="icon" variant="ghost" aria-label="위로" disabled={idx === 0} onClick={() => move(idx, -1)}>
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" aria-label="아래로" disabled={idx === value.length - 1} onClick={() => move(idx, 1)}>
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" aria-label="차시 삭제" className="hover:text-red-600" onClick={() => remove(lesson.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </li>
        ))}
      </ol>

      <Button variant="outline" onClick={add} className="w-full justify-center border-dashed">
        <Plus className="h-4 w-4" /> 차시 추가
      </Button>
    </div>
  )
}
