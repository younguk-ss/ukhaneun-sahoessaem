import { Link } from 'react-router-dom'
import { ImageOff, Users } from 'lucide-react'
import Badge from '@/components/ui/Badge'

/**
 * 학생 결과물 카드: 썸네일 + 학생/모둠명 + 간단한 설명
 * to가 있으면 링크로, 없으면 버튼(onClick)으로 렌더링합니다.
 */
export default function ResultCard({ result, projectTitle, onClick, to }) {
  const Root = to ? Link : 'button'
  const rootProps = to ? { to } : { type: 'button', onClick }
  return (
    <Root
      {...rootProps}
      className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-sepia-300/60 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 cursor-pointer"
    >
      {/* 썸네일 (4:3) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ivory-200">
        {result.thumbnail ? (
          <img
            src={result.thumbnail}
            alt={`${result.title} 썸네일`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-sepia-500">
            <ImageOff className="h-8 w-8" strokeWidth={1.5} />
            <span className="font-serif text-sm">{result.type}</span>
          </div>
        )}
        {result.type && (
          <Badge className="absolute left-3 top-3 border-white/60 bg-white/90 shadow-sm backdrop-blur">{result.type}</Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-base font-bold text-navy-900">{result.title}</h3>
        <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-sepia-700">
          <Users className="h-3.5 w-3.5" /> {result.author}
        </p>
        {result.description && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-600">{result.description}</p>}
        {projectTitle && <p className="mt-auto truncate pt-3 text-[11px] text-stone-400">{projectTitle}</p>}
      </div>
    </Root>
  )
}
