import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BookOpenText, ImagePlus, Search, Sparkles } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import Button, { buttonVariants } from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Input } from '@/components/ui/Field'
import EmptyState from '@/components/ui/EmptyState'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import ResultCard from '@/components/gallery/ResultCard'
import ResultFormDialog from '@/components/gallery/ResultFormDialog'
import ResultDetailDialog from '@/components/gallery/ResultDetailDialog'
import { useArchiveStore, getUnitsBySubject } from '@/store/useArchiveStore'
import { SUBJECTS } from '@/data/constants'
import { cn } from '@/lib/utils'

/** 섹션 2: 학생 활동 결과물 갤러리 */
export default function GalleryPage() {
  const units = useArchiveStore((s) => s.units)
  const projects = useArchiveStore((s) => s.projects)
  const results = useArchiveStore((s) => s.results)
  const addResult = useArchiveStore((s) => s.addResult)
  const updateResult = useArchiveStore((s) => s.updateResult)
  const deleteResult = useArchiveStore((s) => s.deleteResult)

  // 선택된 프로젝트는 URL(?project=ID)에 저장 → 공유/새로고침 시에도 유지
  const [searchParams, setSearchParams] = useSearchParams()
  const paramProject = searchParams.get('project')
  const projectFilter = projects.some((p) => p.id === paramProject) ? paramProject : 'all'
  const setProjectFilter = (v) => setSearchParams(v === 'all' ? {} : { project: v }, { replace: true })

  const [typeFilter, setTypeFilter] = useState('전체')
  const [query, setQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewingId, setViewingId] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const projectById = useMemo(() => Object.fromEntries(projects.map((p) => [p.id, p])), [projects])

  // 섹션 1의 프로젝트를 '교과 · 단원' 그룹으로 묶은 드롭다운 데이터
  const projectGroups = useMemo(
    () =>
      SUBJECTS.flatMap((s) =>
        getUnitsBySubject(units, s.id).map((u) => ({
          label: `${s.label} · ${u.title}`,
          options: projects.filter((p) => p.unitId === u.id).map((p) => ({ value: p.id, label: p.title })),
        })),
      ).filter((g) => g.options.length),
    [units, projects],
  )

  // 1차: 프로젝트 필터
  const byProject = useMemo(
    () => (projectFilter === 'all' ? results : results.filter((r) => r.projectId === projectFilter)),
    [results, projectFilter],
  )
  // 결과물 유형 칩 목록 (현재 프로젝트 기준)
  const types = useMemo(() => ['전체', ...new Set(byProject.map((r) => r.type).filter(Boolean))], [byProject])
  const activeType = types.includes(typeFilter) ? typeFilter : '전체'

  // 2차: 유형 + 검색어 필터
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return byProject.filter(
      (r) =>
        (activeType === '전체' || r.type === activeType) &&
        (!q || [r.title, r.author, r.description].some((v) => v?.toLowerCase().includes(q))),
    )
  }, [byProject, activeType, query])

  const viewing = results.find((r) => r.id === viewingId) ?? null
  const selectedProject = projectById[projectFilter]

  const openUpload = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const handleSubmit = (data) => {
    if (editing) updateResult(editing.id, data)
    else addResult(data)
  }

  return (
    <>
      <PageHeader
        eyebrow="Section 2 · Student Results"
        title="학생 결과물 갤러리"
        description="수업 프로젝트별로 학생들의 활동 결과물을 모아 전시합니다."
        actions={
          <Button onClick={openUpload} disabled={projects.length === 0}>
            <ImagePlus className="h-4 w-4" /> 결과물 업로드
          </Button>
        }
      />

      {projects.length === 0 ? (
        <EmptyState
          icon={BookOpenText}
          title="먼저 수업 프로젝트를 만들어 주세요"
          description="학생 결과물은 섹션 1의 수업 프로젝트와 연결되어 저장됩니다."
          action={<Link to="/projects" className={buttonVariants()}>수업 프로젝트 아카이브로 이동</Link>}
        />
      ) : (
        <>
          {/* 필터 영역 */}
          <div className="mb-6 space-y-4 rounded-2xl border border-sepia-300/60 bg-white/80 p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-[1fr_280px]">
              <Select
                value={projectFilter}
                onValueChange={setProjectFilter}
                options={[{ value: 'all', label: `전체 프로젝트 (${results.length})` }]}
                groups={projectGroups}
              />
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="제목, 학생/모둠명 검색" className="pl-9" aria-label="결과물 검색" />
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="결과물 유형 필터">
              {types.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={activeType === t}
                  onClick={() => setTypeFilter(t)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-xs font-semibold transition cursor-pointer',
                    activeType === t
                      ? 'border-navy-700 bg-navy-700 text-white'
                      : 'border-sepia-300/70 bg-ivory-100 text-stone-600 hover:bg-ivory-200',
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* 선택된 프로젝트 안내 */}
          {selectedProject && (
            <div className="mb-6 flex flex-col gap-2 rounded-xl border-l-4 border-navy-700 bg-navy-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate font-serif font-bold text-navy-900">{selectedProject.title}</p>
                {selectedProject.overview && <p className="line-clamp-1 text-sm text-stone-600">{selectedProject.overview}</p>}
              </div>
              <Link to={`/projects/${selectedProject.id}`} className="shrink-0 text-sm font-semibold text-navy-700 hover:underline">
                수업 설계 보기 →
              </Link>
            </div>
          )}

          {/* 갤러리 그리드 */}
          {visible.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title={byProject.length === 0 ? '아직 등록된 결과물이 없습니다' : '조건에 맞는 결과물이 없습니다'}
              description={byProject.length === 0 ? '학생들의 멋진 결과물을 업로드해 보세요.' : '필터나 검색어를 바꿔 보세요.'}
              action={byProject.length === 0 && <Button onClick={openUpload}><ImagePlus className="h-4 w-4" /> 결과물 업로드</Button>}
            />
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((r) => (
                <li key={r.id}>
                  <ResultCard
                    result={r}
                    projectTitle={projectFilter === 'all' ? projectById[r.projectId]?.title : null}
                    onClick={() => setViewingId(r.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <ResultFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        projectGroups={projectGroups}
        defaultProjectId={projectFilter === 'all' ? '' : projectFilter}
        result={editing}
        onSubmit={handleSubmit}
      />

      <ResultDetailDialog
        result={viewing}
        project={viewing ? projectById[viewing.projectId] : null}
        onOpenChange={(o) => !o && setViewingId(null)}
        onEdit={() => {
          setEditing(viewing)
          setViewingId(null)
          setFormOpen(true)
        }}
        onDelete={() => {
          setDeleting(viewing)
          setViewingId(null)
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="결과물을 삭제할까요?"
        description={`‘${deleting?.title ?? ''}’ (${deleting?.author ?? ''}) 결과물이 삭제됩니다.`}
        onConfirm={() => deleteResult(deleting.id)}
      />
    </>
  )
}
