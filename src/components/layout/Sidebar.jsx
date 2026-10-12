import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from './navItems'
import Logo from './Logo'
import { cn } from '@/lib/utils'

/** 사이드바 내용 (데스크톱 고정 / 모바일 드로어 공용) */
export default function Sidebar({ onNavigate }) {
  return (
    <div className="flex h-full flex-col bg-navy-800 text-navy-100">
      <div className="px-5 py-6">
        <Logo onClick={onNavigate} />
      </div>

      <nav aria-label="주 메뉴" className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ to, label, desc, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-xl px-3 py-3 transition',
                isActive ? 'bg-ivory-50 text-navy-900 shadow' : 'hover:bg-white/10 text-navy-100',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn('h-5 w-5 shrink-0', isActive ? 'text-navy-700' : 'text-navy-200')} />
                <span className="leading-tight">
                  <span className="block text-sm font-semibold">{label}</span>
                  <span className={cn('block text-[11px]', isActive ? 'text-sepia-700' : 'text-navy-200/80')}>
                    {desc}
                  </span>
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="m-3 rounded-xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-navy-200">
        <p className="font-serif text-sm font-bold text-ivory-100">“기록은 수업을 기억한다”</p>
        <p className="mt-1">데이터는 현재 이 브라우저에 저장됩니다.</p>
      </div>
    </div>
  )
}
