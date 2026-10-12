import { useState } from 'react'
import { ArrowDown, ArrowUp, FolderOpen, Pencil, Plus, Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import UnitFormDialog from './UnitFormDialog'
import { useArchiveStore } from '@/store/useArchiveStore'
import { cn } from '@/lib/utils'

/** 선택된 교과의 단원 목록 + 단원 CRUD */
export default function UnitList({ subject, units, selectedUnitId, onSelect, projectCountByUnit }) {
  const addUnit = useArchiveStore((s) => s.addUnit)
  const updateUnit = useArchiveStore((s) => s.updateUnit)
  const deleteUnit = useArchiveStore((s) => s.deleteUnit)
  const moveUnit = useArchiveStore((s) => s.moveUnit)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null) // 수정 중인 단원 (null이면 추가 모드)
  const [deleting, setDeleting] = useState(null) // 삭제 확인 대상

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (unit) => {
    setEditing(unit)
    setFormOpen(true)
  }
  const handleSubmit = (data) => {
    if (editing) updateUnit(editing.id, data)
    else addUnit({ subject, ...data })
  }

  return (
    <section aria-labelledby="unit-heading" className="rounded-2xl border border-sepia-300/60 bg-white/80 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 id="unit-heading" className="text-lg font-bold text-navy-900">
          단원 목록
        </h2>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" /> 단원 추가
        </Button>
      </div>

      {units.length === 0 ? (
        <p className="rounded-xl bg-ivory-100 px-4 py-8 text-center text-sm text-stone-500">
          아직 단원이 없습니다.
          <br />
          ‘단원 추가’로 첫 단원을 만들어 보세요.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {units.map((unit, idx) => {
            const active = unit.id === selectedUnitId
            return (
              <li key={unit.id}>
                <div
                  className={cn(
                    'group flex items-stretch rounded-xl border transition',
                    active ? 'border-navy-700 bg-navy-50' : 'border-transparent hover:border-sepia-300/70 hover:bg-ivory-100',
                  )}
                >
                  {/* 단원 선택 버튼 */}
                  <button
                    type="button"
                    onClick={() => onSelect(unit.id)}
                    aria-current={active ? 'true' : undefined}
                    className="flex min-w-0 flex-1 items-start gap-2.5 px-3 py-2.5 text-left cursor-pointer"
                  >
                    <FolderOpen className={cn('mt-0.5 h-4 w-4 shrink-0', active ? 'text-navy-700' : 'text-sepia-500')} />
                    <span className="min-w-0">
                      <span className={cn('block text-sm font-semibold leading-snug', active ? 'text-navy-900' : 'text-ink')}>
                        {unit.title}
                      </span>
                      <span className="block text-xs text-stone-500">
                        프로젝트 {projectCountByUnit[unit.id] ?? 0}개
                      </span>
                    </span>
                  </button>

                  {/* 순서 이동 / 수정 / 삭제 */}
                  <div className="flex items-center gap-0.5 pr-1.5 lg:hidden lg:group-hover:flex lg:group-focus-within:flex">
                    <IconBtn label="위로 이동" disabled={idx === 0} onClick={() => moveUnit(unit.id, -1)}>
                      <ArrowUp className="h-3.5 w-3.5" />
                    </IconBtn>
                    <IconBtn label="아래로 이동" disabled={idx === units.length - 1} onClick={() => moveUnit(unit.id, 1)}>
                      <ArrowDown className="h-3.5 w-3.5" />
                    </IconBtn>
                    <IconBtn label="단원 수정" onClick={() => openEdit(unit)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </IconBtn>
                    <IconBtn label="단원 삭제" danger onClick={() => setDeleting(unit)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </IconBtn>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <UnitFormDialog open={formOpen} onOpenChange={setFormOpen} subject={subject} unit={editing} onSubmit={handleSubmit} />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="단원을 삭제할까요?"
        description={`‘${deleting?.title ?? ''}’ 단원과 그 안의 수업 프로젝트 ${
          projectCountByUnit[deleting?.id] ?? 0
        }개, 연결된 학생 결과물이 모두 삭제됩니다. 이 작업은 되돌릴 수 없습니다.`}
        onConfirm={() => deleteUnit(deleting.id)}
      />
    </section>
  )
}

function IconBtn({ label, danger, className, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'rounded-md p-1.5 text-stone-500 transition disabled:opacity-30 cursor-pointer disabled:cursor-default',
        danger ? 'hover:bg-red-50 hover:text-red-600' : 'hover:bg-white hover:text-navy-700',
        className,
      )}
      {...props}
    />
  )
}
