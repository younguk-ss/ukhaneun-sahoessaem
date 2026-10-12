import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import HomePage from '@/pages/HomePage'
import ProjectsPage from '@/pages/ProjectsPage'
import ProjectFormPage from '@/pages/ProjectFormPage'
import ProjectDetailPage from '@/pages/ProjectDetailPage'
import GalleryPage from '@/pages/GalleryPage'

/**
 * 메인 라우팅
 *  /                      대시보드(홈)
 *  /projects              섹션 1: 수업 프로젝트 아카이브 (교과 탭 + 단원 CRUD)
 *  /projects/new?unit=ID  수업 프로젝트 생성
 *  /projects/:id          프로젝트 상세 (자료 목록)
 *  /projects/:id/edit     프로젝트 수정
 *  /gallery               섹션 2: 학생 활동 결과물 갤러리
 */
export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/new" element={<ProjectFormPage />} />
        <Route path="projects/:id" element={<ProjectDetailPage />} />
        <Route path="projects/:id/edit" element={<ProjectFormPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
