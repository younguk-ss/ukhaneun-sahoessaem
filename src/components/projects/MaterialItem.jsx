import { ExternalLink, FileText, Image as ImageIcon, Link2, Paperclip } from 'lucide-react'
import { formatBytes } from '@/lib/utils'

export const MATERIAL_ICONS = { text: FileText, image: ImageIcon, link: Link2, file: Paperclip }

/** 수업 자료 1건 표시 (상세 페이지·편집기 공용) */
export default function MaterialItem({ material, actions }) {
  const Icon = MATERIAL_ICONS[material.type] ?? FileText
  return (
    <div className="flex gap-3 rounded-xl border border-sepia-300/60 bg-white p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ivory-200 text-sepia-700">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-navy-900">{material.title || '(제목 없음)'}</p>

        {material.type === 'text' && (
          <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-stone-700">{material.content}</p>
        )}

        {material.type === 'image' && material.url && (
          <a href={material.url} target="_blank" rel="noreferrer" className="mt-2 block">
            <img
              src={material.url}
              alt={material.title}
              loading="lazy"
              className="max-h-64 rounded-lg border border-sepia-300/60 object-contain"
            />
          </a>
        )}

        {material.type === 'link' && material.url && (
          <a
            href={material.url}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex max-w-full items-center gap-1 break-all text-sm text-navy-700 underline underline-offset-2"
          >
            {material.url} <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          </a>
        )}

        {material.type === 'file' && (
          <p className="mt-1 text-sm text-stone-600">
            {material.fileName} <span className="text-stone-400">· {formatBytes(material.fileSize)}</span>
          </p>
        )}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  )
}
