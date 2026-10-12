import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, GalleryHorizontalEnd, Pencil, Trash2 } from 'lucide-react'
import Button, { buttonVariants } from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import MaterialItem from '@/components/projects/MaterialItem'
import { useArchiveStore } from '@/store/useArchiveStore'
import { subjectLabel } from '@/data/constants'
import { formatDate } from '@/lib/utils'

/** 수업 프로젝트 상세 */
export default function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = useArchiveStore((s) => s.projects.find((p) => p.id === id))
  const unit = useArchiveStore((s) => s.units.find((u) => u.id === project?.unitId))
  const resultCount = useArchiveStore((s) => s.results.filter((r) => r.projectId === id).length)
  const deleteProject = useArchiveStore((s) => s.deleteProject)
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (!project) {
    return (
      <EmptyState
        title="프로젝트를 찾을 수 없습니다"
        description="삭제되었거나 잘못된 주소입니다."
        action={<Link to="/projects" className={buttonVariants()}>목록으로</Link>}
      />
    )
  }

  return (
    <article>
      <Link to="/projects" className="mb-4 inline-flex items-center gap-1 text-sm text-stone-600 hover:text-navy-700">
        <ArrowLeft className="h-4 w-4" /> 수업 프로젝트 아카이브
      </Link>

      {/* 헤더 */}
      <header className="mb-8 rounded-2xl border border-sepia-300/60 bg-ivory-100 p-6 sm:p-8">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {unit && <Badge>{subjectLabel(unit.subject)} · {unit.title}</Badge>}
          {project.curriculum && <Badge tone="sepia">{project.curriculum}</Badge>}
        </div>
        <h1 className="text-2xl font-black leading-snug text-navy-900 sm:text-3xl">{project.title}</h1>
        {project.overview && <p className="mt-3 max-w-3xl whitespace-pre-wrap leading-relaxed text-stone-700">{project.overview}</p>}
        <p className="mt-4 text-xs text-stone-500">최종 수정 {formatDate(project.updatedAt)}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link to={`/gallery?project=${project.id}`} className={buttonVariants()}>
            <GalleryHorizontalEnd className="h-4 w-4" /> 학생 결과물 {resultCount}건 보기
          </Link>
          <Link to={`/projects/${project.id}/edit`} className={buttonVariants({ variant: 'outline' })}>
            <Pencil className="h-4 w-4" /> 수정
          </Link>
          <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => setConfirmOpen(true)}>
            <Trash2 className="h-4 w-4" /> 삭제
          </Button>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        {/* 차시 계획 타임라인 */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-navy-900">차시 계획</h2>
          {project.lessonPlan.length === 0 ? (
            <p className="text-sm text-stone-500">등록된 차시가 없습니다.</p>
          ) : (
            <ol className="relative space-y-5 border-l-2 border-sepia-300/70 pl-6">
              {project.lessonPlan.map((l) => (
                <li key={l.id} className="relative">
                  <span className="absolute -left-[35px] flex h-7 w-7 items-center justify-center rounded-full bg-navy-700 font-serif text-xs font-bold text-white ring-4 ring-ivory-50">
                    {l.session}
                  </span>
                  <p className="font-semibold text-navy-900">{l.title || `${l.session}차시`}</p>
                  {l.activity && <p className="mt-0.5 whitespace-pre-wrap text-sm text-stone-600">{l.activity}</p>}
                </li>
              ))}
            </ol>
          )}
        </section>

        {/* 수업 자료 */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-navy-900">수업 자료</h2>
          {project.materials.length === 0 ? (
            <p className="text-sm text-stone-500">등록된 자료가 없습니다.</p>
          ) : (
            <ul className="space-y-3">
              {project.materials.map((m) => (
                <li key={m.id}><MaterialItem material={m} /></li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="프로젝트를 삭제할까요?"
        description={`‘${project.title}’과 연결된 학생 결과물 ${resultCount}건도 함께 삭제됩니다.`}
        onConfirm={() => {
          deleteProject(project.id)
          navigate('/projects')
        }}
      />
    </article>
  )
}
