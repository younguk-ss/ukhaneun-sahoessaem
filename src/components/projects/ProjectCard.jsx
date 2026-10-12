import { Link } from 'react-router-dom'
import { CalendarDays, Layers, Paperclip, Users } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

/** 단원 패널 안의 수업 프로젝트 카드 */
export default function ProjectCard({ project, resultCount = 0 }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="group block rounded-xl border border-sepia-300/60 bg-ivory-50 p-5 transition hover:-translate-y-0.5 hover:border-navy-200 hover:shadow-md"
    >
      {project.curriculum && <Badge tone="sepia" className="mb-2">{project.curriculum}</Badge>}
      <h3 className="text-lg font-bold leading-snug text-navy-900 group-hover:text-navy-700">{project.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-600">{project.overview}</p>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500">
        <span className="inline-flex items-center gap-1"><Layers className="h-3.5 w-3.5" />{project.lessonPlan?.length ?? 0}차시</span>
        <span className="inline-flex items-center gap-1"><Paperclip className="h-3.5 w-3.5" />자료 {project.materials?.length ?? 0}</span>
        <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />결과물 {resultCount}</span>
        <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{formatDate(project.updatedAt)}</span>
      </div>
    </Link>
  )
}
