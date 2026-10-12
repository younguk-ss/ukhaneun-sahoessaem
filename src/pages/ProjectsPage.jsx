import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BookMarked, FolderPlus, Plus } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import SubjectTabs from '@/components/ui/SubjectTabs'
import { buttonVariants } from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import UnitList from '@/components/units/UnitList'
import ProjectCard from '@/components/projects/ProjectCard'
import { useArchiveStore, getUnitsBySubject, getProjectsByUnit } from '@/store/useArchiveStore'
import { subjectLabel } from '@/data/constants'

/** 섹션 1: 수업 프로젝트 아카이브 */
export default function ProjectsPage() {
  const units = useArchiveStore((s) => s.units)
  const projects = useArchiveStore((s) => s.projects)
  const results = useArchiveStore((s) => s.results)
  const subject = useArchiveStore((s) => s.selectedSubject)
  const selectedUnitId = useArchiveStore((s) => s.selectedUnitId)
  const setSubject = useArchiveStore((s) => s.setSelectedSubject)
  const setSelectedUnitId = useArchiveStore((s) => s.setSelectedUnitId)

  // 현재 교과의 단원 목록
  const subjectUnits = useMemo(() => getUnitsBySubject(units, subject), [units, subject])

  // 선택된 단원이 현재 교과에 없으면 첫 번째 단원을 기본 선택
  const activeUnit = subjectUnits.find((u) => u.id === selectedUnitId) ?? subjectUnits[0] ?? null

  // 단원별 프로젝트 수, 프로젝트별 결과물 수 (카운트 표시용)
  const projectCountByUnit = useMemo(
    () => projects.reduce((acc, p) => ({ ...acc, [p.unitId]: (acc[p.unitId] ?? 0) + 1 }), {}),
    [projects],
  )
  const resultCountByProject = useMemo(
    () => results.reduce((acc, r) => ({ ...acc, [r.projectId]: (acc[r.projectId] ?? 0) + 1 }), {}),
    [results],
  )
  const subjectCounts = useMemo(
    () => ({
      social: units.filter((u) => u.subject === 'social').length,
      history: units.filter((u) => u.subject === 'history').length,
    }),
    [units],
  )

  const unitProjects = activeUnit ? getProjectsByUnit(projects, activeUnit.id) : []

  return (
    <>
      <PageHeader
        eyebrow="Section 1 · Lesson Design"
        title="수업 프로젝트 아카이브"
        description="교과와 단원을 선택하고, 단원별 수업 프로젝트를 기획·기록하세요."
        actions={<SubjectTabs value={subject} onChange={setSubject} counts={subjectCounts} />}
      />

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* 좌측: 단원 목록 (CRUD) */}
        <UnitList
          subject={subject}
          units={subjectUnits}
          selectedUnitId={activeUnit?.id}
          onSelect={setSelectedUnitId}
          projectCountByUnit={projectCountByUnit}
        />

        {/* 우측: 선택 단원의 수업 프로젝트 */}
        <section aria-live="polite">
          {!activeUnit ? (
            <EmptyState
              icon={FolderPlus}
              title={`${subjectLabel(subject)} 단원이 없습니다`}
              description="왼쪽의 ‘단원 추가’ 버튼으로 단원을 먼저 만들어 주세요."
            />
          ) : (
            <>
              <div className="mb-5 flex flex-col items-start gap-3 rounded-2xl bg-navy-700 p-5 text-white shadow-sm xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0">
                  <p className="text-xs text-navy-200">{subjectLabel(subject)} · 선택한 단원</p>
                  <h2 className="mt-0.5 text-xl font-bold">{activeUnit.title}</h2>
                  {activeUnit.description && <p className="mt-1 text-sm text-navy-100">{activeUnit.description}</p>}
                </div>
                <Link
                  to={`/projects/new?unit=${activeUnit.id}`}
                  className={buttonVariants({ variant: 'secondary', className: 'shrink-0' })}
                >
                  <Plus className="h-4 w-4" /> 수업 프로젝트 만들기
                </Link>
              </div>

              {unitProjects.length === 0 ? (
                <EmptyState
                  icon={BookMarked}
                  title="아직 수업 프로젝트가 없습니다"
                  description="이 단원에서 진행한 수업을 프로젝트로 기록해 보세요."
                  action={
                    <Link to={`/projects/new?unit=${activeUnit.id}`} className={buttonVariants()}>
                      <Plus className="h-4 w-4" /> 첫 프로젝트 만들기
                    </Link>
                  }
                />
              ) : (
                <div className="grid gap-4 xl:grid-cols-2">
                  {unitProjects.map((p) => (
                    <ProjectCard key={p.id} project={p} resultCount={resultCountByProject[p.id]} />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </>
  )
}
