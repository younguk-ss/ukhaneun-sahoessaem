import { useRef, useState } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { Plus, Trash2, Upload } from 'lucide-react'
import Button from '@/components/ui/Button'
import { Field, Input, Textarea } from '@/components/ui/Field'
import MaterialItem, { MATERIAL_ICONS } from './MaterialItem'
import { MATERIAL_TYPES } from '@/data/constants'
import { cn, formatBytes, imageFileToDataUrl, uid } from '@/lib/utils'

const emptyDraft = { title: '', content: '', url: '' }

/**
 * 수업 자료 업로드 편집기
 * - 텍스트 / 이미지 링크(또는 이미지 파일) / 웹 링크 / 첨부파일
 * - 첨부파일은 현재 '파일명·크기' 메타데이터만 저장합니다.
 *   (Firebase Storage 연동 시 업로드 후 받은 URL을 material.url에 저장하면 됩니다.)
 */
export default function MaterialsEditor({ value, onChange }) {
  const [type, setType] = useState('text')
  const [draft, setDraft] = useState(emptyDraft)
  const [error, setError] = useState('')
  const fileRef = useRef(null)
  const imageRef = useRef(null)

  const push = (items) => onChange([...value, ...items])
  const remove = (id) => onChange(value.filter((m) => m.id !== id))
  const reset = () => {
    setDraft(emptyDraft)
    setError('')
  }

  // 텍스트/이미지 링크/웹 링크 추가
  const addDraft = () => {
    if (type === 'text' && !draft.content.trim()) return setError('내용을 입력하세요.')
    if ((type === 'image' || type === 'link') && !/^(https?:\/\/|data:image\/)/.test(draft.url.trim()))
      return setError('http(s)://로 시작하는 주소를 입력하세요.')
    push([
      {
        id: uid('m'),
        type,
        title: draft.title.trim() || MATERIAL_TYPES.find((t) => t.id === type).label,
        ...(type === 'text' ? { content: draft.content.trim() } : { url: draft.url.trim() }),
      },
    ])
    reset()
  }

  // 첨부파일 선택 → 메타데이터로 추가
  const onPickFiles = (e) => {
    const files = Array.from(e.target.files ?? [])
    push(files.map((f) => ({ id: uid('m'), type: 'file', title: f.name, fileName: f.name, fileSize: f.size })))
    e.target.value = ''
  }

  // 이미지 파일 선택 → 리사이즈된 dataURL을 url 칸에 채움
  const onPickImage = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const dataUrl = await imageFileToDataUrl(file)
      setDraft((d) => ({ ...d, url: dataUrl, title: d.title || file.name }))
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-4">
      {/* 이미 추가된 자료 목록 */}
      {value.length > 0 && (
        <ul className="space-y-2">
          {value.map((m) => (
            <li key={m.id}>
              <MaterialItem
                material={m}
                actions={
                  <Button size="icon" variant="ghost" aria-label="자료 삭제" className="hover:text-red-600" onClick={() => remove(m.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                }
              />
            </li>
          ))}
        </ul>
      )}

      {/* 새 자료 입력 */}
      <div className="rounded-xl border border-dashed border-sepia-300 bg-ivory-100/60 p-4">
        <Tabs.Root value={type} onValueChange={(v) => { setType(v); reset() }}>
          <Tabs.List aria-label="자료 유형" className="mb-4 flex flex-wrap gap-1.5">
            {MATERIAL_TYPES.map((t) => {
              const Icon = MATERIAL_ICONS[t.id]
              return (
                <Tabs.Trigger
                  key={t.id}
                  value={t.id}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border border-sepia-300/70 bg-white px-3 py-1.5 text-xs font-semibold text-stone-600 cursor-pointer',
                    'data-[state=active]:border-navy-700 data-[state=active]:bg-navy-700 data-[state=active]:text-white',
                  )}
                >
                  <Icon className="h-3.5 w-3.5" /> {t.label}
                </Tabs.Trigger>
              )
            })}
          </Tabs.List>

          {type !== 'file' && (
            <div className="space-y-3">
              <Field label="자료 제목" htmlFor="mat-title">
                <Input id="mat-title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="예) 탐구 질문, 활동지 예시" />
              </Field>

              {type === 'text' ? (
                <Field label="내용" htmlFor="mat-content" required>
                  <Textarea id="mat-content" rows={4} value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} placeholder="발문, 읽기 자료, 수업 메모 등" />
                </Field>
              ) : (
                <Field
                  label={type === 'image' ? '이미지 주소' : '웹 주소'}
                  htmlFor="mat-url"
                  required
                  hint={type === 'image' ? '이미지 URL을 붙여넣거나, 내 컴퓨터의 이미지를 선택하세요.' : '패들렛, 구글 문서, 유튜브 등 링크'}
                >
                  <div className="flex gap-2">
                    <Input
                      id="mat-url"
                      value={draft.url.startsWith('data:') ? '(내 컴퓨터에서 선택한 이미지)' : draft.url}
                      readOnly={draft.url.startsWith('data:')}
                      onChange={(e) => setDraft({ ...draft, url: e.target.value })}
                      placeholder="https://"
                    />
                    {type === 'image' && (
                      <>
                        <Button variant="secondary" onClick={() => imageRef.current?.click()} className="shrink-0">
                          <Upload className="h-4 w-4" /> 파일
                        </Button>
                        <input ref={imageRef} type="file" accept="image/*" hidden onChange={onPickImage} />
                      </>
                    )}
                  </div>
                  {type === 'image' && draft.url && (
                    <img src={draft.url} alt="미리보기" className="mt-2 max-h-40 rounded-lg border border-sepia-300/60" onError={() => setError('이미지를 불러올 수 없습니다. 주소를 확인하세요.')} />
                  )}
                </Field>
              )}

              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button onClick={addDraft}>
                <Plus className="h-4 w-4" /> 자료 추가
              </Button>
            </div>
          )}

          {type === 'file' && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-navy-200 bg-white px-4 py-8 text-center transition hover:border-navy-500 hover:bg-navy-50 cursor-pointer"
            >
              <Upload className="h-8 w-8 text-navy-500" />
              <span className="text-sm font-semibold text-navy-800">클릭하여 첨부파일 선택 (여러 개 가능)</span>
              <span className="text-xs text-stone-500">한글(hwp), PDF, PPT 등 · 현재는 파일 정보만 기록됩니다</span>
              <input ref={fileRef} type="file" multiple hidden onChange={onPickFiles} />
            </button>
          )}
        </Tabs.Root>
      </div>
      {value.length > 0 && (
        <p className="text-right text-xs text-stone-500">
          자료 {value.length}건 · 첨부파일 {formatBytes(value.filter((m) => m.type === 'file').reduce((a, m) => a + (m.fileSize ?? 0), 0))}
        </p>
      )}
    </div>
  )
}
