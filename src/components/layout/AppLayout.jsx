import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import * as RD from '@radix-ui/react-dialog'
import { Menu, X, AlertTriangle } from 'lucide-react'
import Sidebar from './Sidebar'
import Logo from './Logo'

/**
 * 메인 레이아웃
 * - lg 이상: 왼쪽 고정 사이드바
 * - 모바일/태블릿: 상단 바 + 햄버거 메뉴(드로어)
 */
export default function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [storageFull, setStorageFull] = useState(false)
  const { pathname } = useLocation()

  // 페이지 이동 시 스크롤을 맨 위로
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // 저장 공간 초과 이벤트 수신 → 경고 배너 표시
  useEffect(() => {
    const onFull = () => setStorageFull(true)
    window.addEventListener('archive:storage-full', onFull)
    return () => window.removeEventListener('archive:storage-full', onFull)
  }, [])

  return (
    <div className="paper min-h-dvh">
      {/* 데스크톱 사이드바 */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 lg:block">
        <Sidebar />
      </aside>

      {/* 모바일 상단 바 */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-navy-800 px-4 py-3 lg:hidden">
        <Logo />
        <RD.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
          <RD.Trigger className="rounded-lg p-2 text-white hover:bg-white/10 cursor-pointer" aria-label="메뉴 열기">
            <Menu className="h-6 w-6" />
          </RD.Trigger>
          <RD.Portal>
            <RD.Overlay className="anim-overlay fixed inset-0 z-40 bg-navy-900/50" />
            <RD.Content className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] shadow-2xl focus:outline-none">
              <RD.Title className="sr-only">메뉴</RD.Title>
              <RD.Description className="sr-only">주요 섹션으로 이동합니다</RD.Description>
              <Sidebar onNavigate={() => setDrawerOpen(false)} />
              <RD.Close className="absolute right-3 top-3 rounded-lg p-2 text-white hover:bg-white/10 cursor-pointer" aria-label="메뉴 닫기">
                <X className="h-5 w-5" />
              </RD.Close>
            </RD.Content>
          </RD.Portal>
        </RD.Root>
      </header>

      <main className="lg:pl-72">
        {storageFull && (
          <div role="alert" className="flex items-start gap-2 border-b border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="flex-1">
              브라우저 저장 공간이 가득 찼습니다. 직접 올린 이미지 대신 이미지 링크(URL)를 사용하거나 일부 결과물을 정리해 주세요.
            </p>
            <button className="font-semibold underline cursor-pointer" onClick={() => setStorageFull(false)}>
              닫기
            </button>
          </div>
        )}
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
