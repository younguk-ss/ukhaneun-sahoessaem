import { Home, BookOpenText, GalleryHorizontalEnd } from 'lucide-react'

/** 네비게이션 메뉴 정의 — 메뉴 추가 시 여기만 수정 */
export const NAV_ITEMS = [
  { to: '/', label: '홈', desc: '아카이브 한눈에 보기', icon: Home, end: true },
  { to: '/projects', label: '수업 프로젝트 아카이브', desc: '교사용 학습 설계', icon: BookOpenText },
  { to: '/gallery', label: '학생 결과물 갤러리', desc: 'Student Results', icon: GalleryHorizontalEnd },
]
