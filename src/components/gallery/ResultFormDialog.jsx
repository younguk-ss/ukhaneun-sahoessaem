import { useEffect, useRef, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Field, Input, Textarea } from '@/components/ui/Field'
import { RESULT_TYPES } from '@/data/constants'
import { imageFileToDataUrl } from '@/lib/utils'

const empty = { projectId: '', author: '', type: RESULT_TYPES[0], title: '', description: '', thumbnail: '', link: '' }

/** 학생 결과물 업로드/수정 대화상자 */
export default function ResultFormDialog({ open, onOpenChange, projectGroups, defaultProjectId, result, onSubmit }) {
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')
  const fileRef = useRef(null)
  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  // 열릴 때 초기화 (수정 모드면 기존 값)
  useEffect(() => {
    if (!open) return
    setError('')
    setForm(result ? { ...empty, ...result } : { ...empty, projectId: defaultProjectId ?? '' })
  }, [open, result, defaultProjectId])

  const onPickImage = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      set({ thumbnail: await imageFileToDataUrl(file) })
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.projectId) return setError('수업 프로젝트를 선택하세요.')
    if (!form.author.trim() || !form.title.trim()) return setError('학생/모둠명과 제목을 입력하세요.')
    const { id, createdAt, ...data } = form // eslint-disable-line no-unused-vars
    onSubmit({
      ...data,
      author: data.author.trim(),
      title: data.title.trim(),
      description: data.description.trim(),
      type: data.type.trim() || '기타',
      link: data.link.trim(),
    })
    onOpenChange(false)
  }

  const isPreset = RESULT_TYPES.includes(form.type)

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={result ? '결과물 수정' : '학생 결과물 업로드'}
      description="학생들의 활동 결과물을 프로젝트에 연결해 전시합니다."
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="수업 프로젝트" htmlFor="r-project" required>
          <Select id="r-project" value={form.projectId || undefined} onValueChange={(v) => set({ projectId: v })} groups={projectGroups} placeholder="프로젝트 선택" />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="학생 / 모둠명" htmlFor="r-author" required>
            <Input id="r-author" value={form.author} onChange={(e) => set({ author: e.target.value })} placeholder="예) 3모둠, 김○○ 외 2명" />
          </Field>
          <Field label="결과물 유형" htmlFor="r-type">
            <Select
              id="r-type"
              value={isPreset ? form.type : '기타'}
              onValueChange={(v) => set({ type: v })}
              options={RESULT_TYPES.map((t) => ({ value: t, label: t }))}
            />
            {(form.type === '기타' || !isPreset) && (
              <Input
                aria-label="유형 직접 입력"
                value={form.type === '기타' ? '' : form.type}
                onChange={(e) => set({ type: e.target.value || '기타' })}
                placeholder="유형 직접 입력 (선택)"
                className="mt-2"
              />
            )}
          </Field>
        </div>

        <Field label="제목" htmlFor="r-title" required>
          <Input id="r-title" value={form.title} onChange={(e) => set({ title: e.target.value })} placeholder="예) 층간소음 손해배상 청구 사건" />
        </Field>

        <Field label="간단한 설명" htmlFor="r-desc">
          <Textarea id="r-desc" rows={3} value={form.description} onChange={(e) => set({ description: e.target.value })} placeholder="결과물의 특징, 교사 코멘트 등" />
        </Field>

        {/* 썸네일: 파일 업로드 또는 이미지 URL */}
        <Field label="썸네일 이미지" hint="이미지 파일을 선택하면 자동으로 축소되어 저장됩니다. URL을 직접 입력해도 됩니다.">
          <div className="flex gap-3">
            <div className="relative flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-sepia-300/70 bg-ivory-100">
              {form.thumbnail ? (
                <>
                  <img src={form.thumbnail} alt="썸네일 미리보기" className="h-full w-full object-cover" />
                  <button type="button" aria-label="썸네일 제거" onClick={() => set({ thumbnail: '' })} className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white cursor-pointer">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </>
              ) : (
                <ImagePlus className="h-6 w-6 text-sepia-500" />
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Button variant="secondary" onClick={() => fileRef.current?.click()} className="self-start">
                <ImagePlus className="h-4 w-4" /> 이미지 파일 선택
              </Button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickImage} />
              <Input
                aria-label="썸네일 이미지 URL"
                value={form.thumbnail.startsWith('data:') ? '' : form.thumbnail}
                onChange={(e) => set({ thumbnail: e.target.value })}
                placeholder={form.thumbnail.startsWith('data:') ? '(파일에서 선택됨)' : 'https:// 이미지 주소'}
              />
            </div>
          </div>
        </Field>

        <Field label="원본 링크" htmlFor="r-link" hint="캔바, 구글 문서, 패들렛 등 원본 결과물 주소 (선택)">
          <Input id="r-link" value={form.link} onChange={(e) => set({ link: e.target.value })} placeholder="https://" />
        </Field>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>취소</Button>
          <Button type="submit">{result ? '저장' : '업로드'}</Button>
        </div>
      </form>
    </Dialog>
  )
}
