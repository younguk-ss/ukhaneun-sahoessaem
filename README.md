# 욱하는 사회쌤 📚

중학교 사회·역사 **수업 프로젝트**와 **학생 활동 결과물**을 기록·전시하는 아카이브 웹앱입니다.

## 실행

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ 생성
```

## 기술 스택
React 19 (Vite) · Tailwind CSS v4 · Radix UI · Lucide React · Zustand(persist) · React Router

## 구조
```
src/
├─ App.jsx                  # 라우팅
├─ main.jsx / index.css     # 진입점, 디자인 토큰(네이비·아이보리·세피아)
├─ store/useArchiveStore.js # Zustand 전역 상태 + CRUD 액션 (localStorage 저장)
├─ data/seed.js             # 초기 가안 데이터 + 데이터 모델 정의
├─ data/constants.js        # 교과·자료 유형·결과물 유형
├─ lib/utils.js             # id 생성, 날짜, 이미지 리사이즈 등
├─ components/
│  ├─ layout/   # AppLayout, Sidebar, PageHeader
│  ├─ ui/       # Button, Field, Dialog, ConfirmDialog, Select, SubjectTabs ...
│  ├─ units/    # 단원 목록 + CRUD
│  ├─ projects/ # 프로젝트 카드, 차시 계획·수업 자료 편집기
│  └─ gallery/  # 결과물 카드, 업로드/상세 대화상자
└─ pages/       # Home, Projects(섹션1), ProjectForm, ProjectDetail, Gallery(섹션2)
```

## Firebase 연동 계획
`useArchiveStore`의 각 액션에서 Firestore(`units`, `projects`, `results` 컬렉션) 호출 후 `set()` 하도록 바꾸면
컴포넌트 수정 없이 서버 저장으로 전환됩니다. 이미지·첨부파일은 Firebase Storage 업로드 URL을 `url`/`thumbnail`에 저장합니다.
