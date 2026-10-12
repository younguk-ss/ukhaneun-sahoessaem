import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { uid } from '@/lib/utils'
import { seedUnits, seedProjects, seedResults } from '@/data/seed'

/**
 * 아카이브 전역 상태 (Zustand)
 *
 * - 현재는 persist 미들웨어로 브라우저 localStorage에 저장합니다.
 * - Firebase로 옮길 때는 각 액션 내부에서 Firestore 호출(addDoc/updateDoc/deleteDoc)을
 *   먼저 수행한 뒤 set()으로 로컬 상태를 갱신하면, 컴포넌트 코드는 그대로 둘 수 있습니다.
 */
const now = () => new Date().toISOString()

// localStorage 용량 초과 시 앱이 멈추지 않도록 감싼 저장소
const safeLocalStorage = {
  getItem: (key) => localStorage.getItem(key),
  removeItem: (key) => localStorage.removeItem(key),
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value)
    } catch {
      window.dispatchEvent(new CustomEvent('archive:storage-full'))
    }
  },
}

export const useArchiveStore = create(
  persist(
    (set, get) => ({
      units: seedUnits,
      projects: seedProjects,
      results: seedResults,

      // UI 상태: 마지막으로 선택한 교과/단원 (새로고침해도 유지)
      selectedSubject: 'social',
      selectedUnitId: null,

      setSelectedSubject: (subject) => set({ selectedSubject: subject, selectedUnitId: null }),
      setSelectedUnitId: (unitId) => set({ selectedUnitId: unitId }),

      /* ───────── 단원(Unit) CRUD ───────── */
      addUnit: ({ subject, title, description = '' }) => {
        const siblings = get().units.filter((u) => u.subject === subject)
        const unit = {
          id: uid('u'),
          subject,
          title: title.trim(),
          description: description.trim(),
          order: siblings.length ? Math.max(...siblings.map((u) => u.order)) + 1 : 1,
          createdAt: now(),
        }
        set((s) => ({ units: [...s.units, unit], selectedUnitId: unit.id }))
        return unit
      },

      updateUnit: (id, patch) =>
        set((s) => ({ units: s.units.map((u) => (u.id === id ? { ...u, ...patch } : u)) })),

      // 단원 삭제 시 하위 프로젝트와 그 결과물까지 함께 삭제 (연쇄 삭제)
      deleteUnit: (id) =>
        set((s) => {
          const projectIds = new Set(s.projects.filter((p) => p.unitId === id).map((p) => p.id))
          return {
            units: s.units.filter((u) => u.id !== id),
            projects: s.projects.filter((p) => p.unitId !== id),
            results: s.results.filter((r) => !projectIds.has(r.projectId)),
            selectedUnitId: s.selectedUnitId === id ? null : s.selectedUnitId,
          }
        }),

      // 같은 교과 안에서 단원 순서 이동 (direction: -1 위로, 1 아래로)
      moveUnit: (id, direction) =>
        set((s) => {
          const target = s.units.find((u) => u.id === id)
          if (!target) return s
          const list = s.units.filter((u) => u.subject === target.subject).sort((a, b) => a.order - b.order)
          const idx = list.findIndex((u) => u.id === id)
          const swap = list[idx + direction]
          if (!swap) return s
          return {
            units: s.units.map((u) => {
              if (u.id === target.id) return { ...u, order: swap.order }
              if (u.id === swap.id) return { ...u, order: target.order }
              return u
            }),
          }
        }),

      /* ───────── 수업 프로젝트 CRUD ───────── */
      addProject: (data) => {
        const project = { ...data, id: uid('p'), createdAt: now(), updatedAt: now() }
        set((s) => ({ projects: [...s.projects, project] }))
        return project
      },

      updateProject: (id, patch) =>
        set((s) => ({
          projects: s.projects.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: now() } : p)),
        })),

      // 프로젝트 삭제 시 연결된 학생 결과물도 함께 삭제
      deleteProject: (id) =>
        set((s) => ({
          projects: s.projects.filter((p) => p.id !== id),
          results: s.results.filter((r) => r.projectId !== id),
        })),

      /* ───────── 학생 결과물 CRUD ───────── */
      addResult: (data) => {
        const result = { ...data, id: uid('r'), createdAt: now() }
        set((s) => ({ results: [result, ...s.results] }))
        return result
      },

      updateResult: (id, patch) =>
        set((s) => ({ results: s.results.map((r) => (r.id === id ? { ...r, ...patch } : r)) })),

      deleteResult: (id) => set((s) => ({ results: s.results.filter((r) => r.id !== id) })),

      /* ───────── 유틸 ───────── */
      // 모든 데이터를 초기 가안 상태로 되돌리기
      resetToSeed: () =>
        set({ units: seedUnits, projects: seedProjects, results: seedResults, selectedUnitId: null }),
    }),
    {
      name: 'ukhaneun-archive-v1',
      storage: createJSONStorage(() => safeLocalStorage),
      version: 1,
    },
  ),
)

/* ───────── 셀렉터 (파생 데이터) ─────────
   컴포넌트에서 useArchiveStore(selector)와 함께 사용하거나 useMemo 안에서 사용합니다. */
export const getUnitsBySubject = (units, subject) =>
  units.filter((u) => u.subject === subject).sort((a, b) => a.order - b.order)

export const getProjectsByUnit = (projects, unitId) =>
  projects.filter((p) => p.unitId === unitId).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
