import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import Button, { buttonVariants } from '@/components/ui/Button'
import { Field, Input, Textarea } from '@/components/ui/Field'
import Select from '@/components/ui/Select'
import EmptyState from '@/components/ui/EmptyState'
import LessonPlanEditor from '@/components/projects/LessonPlanEditor'
import MaterialsEditor from '@/components/projects/MaterialsEditor'
import { useArchiveStore, getUnitsBySubject } from '@/store/useArchiveStore'
import { SUBJECTS } from '@/data/constants'
import { uid } from '@/lib/utils'

const CURRICULUM_PRESETS = ['개념기반 탐구학습', 'UbD (이해 중심 교육과정)', '프로젝트 기반 학습(PBL)', '하브루타', '거꾸로 수업']

/** 수업 프로젝트 생성/수정 폼 — /projects/new?unit=ID 또는 /projects/:id/edit */
export default function ProjectFormPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const units = useArchiveStore((s) => s.units)
  const existing = useArchiveStore((s) => (id ? s.projects.find((p) => p.id === id) : null))
  const addProject = useArchiveStore((s) => s.addProject)
  const updateProject = useArchiveStore((s) => s.updateProject)
  const setSelectedSubject = useArchiveStore((s) => s.setSelectedSubject)
  const setSelectedUnitId = useArchiveStore((s) => s.setSelectedUnitId)

  const isEdit = Boolean(id)

  // 폼 상태 (수정 모드면 기존 값으로 초기화)
  const [form, setForm] = useState(() => ({
    unitId: existing?.unitId ?? searchParams.get('unit') ?? '',
    title: existing?.title ?? '',
    overview: existing?.overview ?? '',
    curriculum: existing?.curriculum ?? '',
    lessonPlan: existing?.lessonPlan ?? [{ id: uid('l'), session: 1, title: '', activity: '' }],
    materials: existing?.materials ?? [],
  }))
  const [touched, setTouched] = useState(false)
  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  // 단원 선택 드롭다운: 교과별 그룹
  const unitGroups = useMemo(
    () =>
      SUBJECTS.map((s) => ({
        label: s.label,
        options: getUnitsBySubject(units, s.id).map((u) => ({ value: u.id, label: u.title })),
      })).filter((g) => g.options.length),
    [units],
  )

  if (isEdit && !existing) {
    return (
      <EmptyState
        title="프로젝트를 찾을 수 없습니다"
        description="삭제되었거나 잘못된 주소입니다."
        action={<Link to="/projects" className={buttonVariants()}>목록으로</Link>}
      />
    )
  }

  const errors = {
    unitId: !units.some((u) => u.id === form.unitId) && '단원을 선택하세요.',
    title: !form.title.trim() && '프로젝트명을 입력하세요.',
  }
  const hasError = Object.values(errors).some(Boolean)

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (hasError) return

    const payload = {
      ...form,
      title: form.title.trim(),
      overview: form.overview.trim(),
      curriculum: form.curriculum.trim(),
      // 내용이 모두 빈 차시는 저장하지 않음
      lessonPlan: form.lessonPlan
        .filter((l) => l.title.trim() || l.activity.trim())
        .map((l, i) => ({ ...l, session: i + 1 })),
    }

    let projectId = id
    if (isEdit) updateProject(id, payload)
    else projectId = addProject(payload).id

    // 섹션 1 목록에서 해당 단원이 선택되도록 동기화
    const unit = units.find((u) => u.id === payload.unitId)
    setSelectedSubject(unit.subject)
    setSelectedUnitId(unit.id)
    navigate(`/projects/${projectId}`)
  }

  const backTo = isEdit ? `/projects/${id}` : '/projects'

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Link to={backTo} className="mb-4 inline-flex items-center gap-1 text-sm text-stone-600 hover:text-navy-700">
        <ArrowLeft className="h-4 w-4" /> 돌아가기
      </Link>
      <PageHeader
        eyebrow="Section 1 · Lesson Design"
        title={isEdit ? '수업 프로젝트 수정' : '새 수업 프로젝트'}
        description="프로젝트 개요와 차시 계획, 수업에 사용한 자료를 기록하세요."
      />

      <div className="space-y-6">
        {/* 1. 기본 정보 */}
        <FormSection step="1" title="기본 정보">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="단원" htmlFor="unit" required>
              <Select id="unit" value={form.unitId || undefined} onValueChange={(v) => set({ unitId: v })} groups={unitGroups} placeholder="단원을 선택하세요" />
              {touched && errors.unitId && <p className="text-xs text-red-600">{errors.unitId}</p>}
            </Field>
            <Field label="프로젝트명" htmlFor="title" required>
              <Input id="title" value={form.title} onChange={(e) => set({ title: e.target.value })} placeholder="예) 교실 속 모의재판: 우리가 판사라면?" />
              {touched && errors.title && <p className="text-xs text-red-600">{errors.title}</p>}
            </Field>
          </div>
          <Field label="수업 개요" htmlFor="overview" className="mt-4">
            <Textarea id="overview" rows={4} value={form.overview} onChange={(e) => set({ overview: e.target.value })} placeholder="수업의 목적, 탐구 질문, 핵심 활동을 간단히 서술하세요." />
          </Field>
          <Field label="적용 교육과정 / 수업 모형" htmlFor="curriculum" hint="자유롭게 입력하거나 아래 예시를 눌러 채우세요." className="mt-4">
            <Input id="curriculum" value={form.curriculum} onChange={(e) => set({ curriculum: e.target.value })} placeholder="예) 개념기반 탐구학습 (핵심 개념: 정의, 공정성)" />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {CURRICULUM_PRESETS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set({ curriculum: c })}
                  className="rounded-full border border-sepia-300/70 bg-ivory-100 px-2.5 py-1 text-xs text-sepia-700 hover:bg-ivory-200 cursor-pointer"
                >
                  {c}
                </button>
              ))}
            </div>
          </Field>
        </FormSection>

        {/* 2. 차시 계획 */}
        <FormSection step="2" title="차시 계획">
          <LessonPlanEditor value={form.lessonPlan} onChange={(lessonPlan) => set({ lessonPlan })} />
        </FormSection>

        {/* 3. 수업 자료 업로드 */}
        <FormSection step="3" title="수업 자료" description="텍스트, 이미지 링크, 웹 링크, 첨부파일을 추가할 수 있습니다.">
          <MaterialsEditor value={form.materials} onChange={(materials) => set({ materials })} />
        </FormSection>
      </div>

      {/* 하단 고정 저장 바 */}
      <div className="sticky bottom-0 -mx-4 mt-8 flex justify-end gap-2 border-t border-sepia-300/60 bg-ivory-50/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <Link to={backTo} className={buttonVariants({ variant: 'secondary' })}>취소</Link>
        <Button type="submit">
          <Save className="h-4 w-4" /> {isEdit ? '변경사항 저장' : '프로젝트 저장'}
        </Button>
      </div>
    </form>
  )
}

function FormSection({ step, title, description, children }) {
  return (
    <section className="rounded-2xl border border-sepia-300/60 bg-white/80 p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-baseline gap-3">
        <span className="font-serif text-2xl font-black text-sepia-300">{step}</span>
        <div>
          <h2 className="text-lg font-bold text-navy-900">{title}</h2>
          {description && <p className="text-sm text-stone-500">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}
