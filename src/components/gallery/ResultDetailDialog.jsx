import { ExternalLink, Pencil, Trash2, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

/** 결과물 상세 보기 (크게 보기 + 수정/삭제) */
export default function ResultDetailDialog({ result, project, onOpenChange, onEdit, onDelete }) {
  return (
    <Dialog open={!!result} onOpenChange={onOpenChange} title={result?.title ?? ''} className="max-w-3xl">
      {result && (
        <div className="space-y-4">
          {result.thumbnail && (
            <img src={result.thumbnail} alt={result.title} className="max-h-[50vh] w-full rounded-xl border border-sepia-300/60 bg-ivory-100 object-contain" />
          )}
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{result.type}</Badge>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-sepia-700">
              <Users className="h-4 w-4" /> {result.author}
            </span>
            <span className="text-xs text-stone-400">· {formatDate(result.createdAt)}</span>
          </div>
          {result.description && <p className="whitespace-pre-wrap leading-relaxed text-stone-700">{result.description}</p>}
          {project && (
            <p className="text-sm text-stone-500">
              수업 프로젝트:{' '}
              <Link to={`/projects/${project.id}`} className="font-semibold text-navy-700 underline underline-offset-2">
                {project.title}
              </Link>
            </p>
          )}
          <div className="flex flex-wrap justify-between gap-2 border-t border-sepia-300/60 pt-4">
            {result.link ? (
              <a href={result.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-navy-700 hover:underline">
                원본 결과물 열기 <ExternalLink className="h-4 w-4" />
              </a>
            ) : <span />}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onEdit}><Pencil className="h-4 w-4" /> 수정</Button>
              <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={onDelete}><Trash2 className="h-4 w-4" /> 삭제</Button>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  )
}
