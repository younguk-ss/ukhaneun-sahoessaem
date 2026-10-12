import { Link } from 'react-router-dom'

export default function Logo({ onClick }) {
  return (
    <Link to="/" onClick={onClick} className="flex items-center gap-3">
      <img src="/favicon.svg" alt="" className="h-10 w-10 rounded-xl shadow-sm" />
      <div className="leading-tight">
        <p className="font-serif text-lg font-black tracking-tight text-white">욱하는 사회쌤</p>
        <p className="text-[11px] tracking-wide text-navy-200">수업 · 학생 결과물 아카이브</p>
      </div>
    </Link>
  )
}
