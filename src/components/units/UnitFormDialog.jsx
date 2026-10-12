import { useEffect, useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import { Field, Input, Textarea } from '@/components/ui/Field'
import { subjectLabel } from '@/data/constants'

/** 단원 추가/수정 대화상자 — unit이 있으면 수정 모드 */
export default function UnitFormDialog({ open, onOpenChange, subject, unit, onSubmit }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  // 열릴 때마다 폼 초기화
  useEffect(() => {
    if (open) {
      setTitle(unit?.title ?? '')
      setDescription(unit?.description ?? '')
    }
  }, [open, unit])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({ title: title.trim(), description: description.trim() })
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={unit ? '단원 수정' : '새 단원 추가'}
      description={`${subjectLabel(subject)} 교과의 단원 정보를 입력하세요.`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="단원명" htmlFor="unit-title" required>
          <Input
            id="unit-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예) Ⅵ. 일상생활과 법"
            autoFocus
            required
          />
        </Field>
        <Field label="단원 설명" htmlFor="unit-desc">
          <Textarea
            id="unit-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="핵심 내용, 성취기준 등을 간단히 적어주세요"
          />
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button type="submit" disabled={!title.trim()}>
            {unit ? '저장' : '추가'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
