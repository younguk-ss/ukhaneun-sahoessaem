/** 데이터가 없을 때 보여주는 안내 영역 */
export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sepia-300/70 bg-ivory-100/50 px-6 py-14 text-center">
      {Icon && <Icon className="mb-3 h-10 w-10 text-sepia-500" strokeWidth={1.5} />}
      <p className="font-serif text-lg font-bold text-navy-900">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-stone-600">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
