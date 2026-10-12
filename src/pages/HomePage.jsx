import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpenText, FolderTree, GalleryHorizontalEnd, RotateCcw, Users } from 'lucide-react'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import ResultCard from '@/components/gallery/ResultCard'
import { useArchiveStore } from '@/store/useArchiveStore'

/** 홈: 아카이브 현황 + 섹션 바로가기 + 최근 결과물 */
export default function HomePage() {
  const units = useArchiveStore((s) => s.units)
  const projects = useArchiveStore((s) => s.projects)
  const results = useArchiveStore((s) => s.results)
  const resetToSeed = useArchiveStore((s) => s.resetToSeed)
  const [resetOpen, setResetOpen] = useState(false)

  const recent = [...results].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3)
  const stats = [
    { label: '단원', value: units.length, icon: FolderTree },
    { label: '수업 프로젝트', value: projects.length, icon: BookOpenText },
    { label: '학생 결과물', value: results.length, icon: Users },
  ]

  return (
    <div className="space-y-10">
      {/* 히어로 */}
      <section className="relative overflow-hidden rounded-3xl bg-navy-800 px-6 py-10 text-white shadow-lg sm:px-10 sm:py-14">
        <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-sepia-300/10" aria-hidden />
        <div className="absolute -bottom-16 right-24 h-40 w-40 rounded-full bg-white/5" aria-hidden />
        <p className="text-xs font-semibold tracking-[0.25em] text-sepia-300">SOCIAL STUDIES · HISTORY ARCHIVE</p>
        <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
          수업은 흘러가도,
          <br />
          기록은 남는다.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-navy-100 sm:text-base">
          욱하는 사회쌤의 수업 설계와 학생들의 빛나는 결과물을 한곳에 모아 둡니다.
        </p>
        <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur">
              <Icon className="h-4 w-4 text-sepia-300" />
              <p className="mt-1 font-serif text-2xl font-black">{value}</p>
              <p className="text-xs text-navy-100">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 섹션 바로가기 */}
      <section className="grid gap-4 md:grid-cols-2">
        <SectionLink
          to="/projects"
          icon={BookOpenText}
          eyebrow="Section 1"
          title="수업 프로젝트 아카이브"
          desc="사회·역사 단원별로 수업 프로젝트를 설계하고 차시 계획과 수업 자료를 기록합니다."
        />
        <SectionLink
          to="/gallery"
          icon={GalleryHorizontalEnd}
          eyebrow="Section 2"
          title="학생 결과물 갤러리"
          desc="모의재판 대본, 토론 요약, 인포그래픽 등 학생 결과물을 프로젝트별로 전시합니다."
        />
      </section>

      {/* 최근 결과물 */}
      {recent.length > 0 && (
        <section>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-xl font-bold text-navy-900">최근 올라온 결과물</h2>
            <Link to="/gallery" className="text-sm font-semibold text-navy-700 hover:underline">전체 보기 →</Link>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((r) => (
              <li key={r.id}>
                <ResultCard result={r} to={`/gallery?project=${r.projectId}`} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex justify-end">
        <Button variant="ghost" size="sm" className="text-stone-500" onClick={() => setResetOpen(true)}>
          <RotateCcw className="h-3.5 w-3.5" /> 예시 데이터로 초기화
        </Button>
      </div>
      <ConfirmDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title="예시 데이터로 초기화할까요?"
        description="지금까지 입력한 단원·프로젝트·결과물이 모두 지워지고 초기 가안 데이터로 돌아갑니다."
        confirmText="초기화"
        onConfirm={resetToSeed}
      />
    </div>
  )
}

function SectionLink({ to, icon: Icon, eyebrow, title, desc }) {
  return (
    <Link to={to} className="group flex gap-4 rounded-2xl border border-sepia-300/60 bg-white/80 p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-navy-200 hover:shadow-md">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ivory-200 text-navy-700">
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-sepia-500">{eyebrow}</p>
        <h3 className="mt-0.5 text-lg font-bold text-navy-900">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-stone-600">{desc}</p>
      </div>
      <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-stone-400 transition group-hover:translate-x-1 group-hover:text-navy-700" />
    </Link>
  )
}
