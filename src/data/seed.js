/**
 * 초기 가안(임시) 데이터
 * ─ 데이터 모델 ─────────────────────────────
 * Unit     { id, subject: 'social'|'history', title, description, order, createdAt }
 * Project  { id, unitId, title, overview, curriculum, lessonPlan: Lesson[], materials: Material[], createdAt, updatedAt }
 * Lesson   { id, session(차시 번호), title, activity }
 * Material { id, type: 'text'|'image'|'link'|'file', title, content?, url?, fileName?, fileSize? }
 * Result   { id, projectId, author(학생/모둠명), type, title, description, thumbnail, link, createdAt }
 * ────────────────────────────────────────
 * Firebase 연동 시 각 배열이 Firestore 컬렉션(units / projects / results)에 1:1 대응됩니다.
 */
const t = '2026-03-02T09:00:00.000Z'

export const seedUnits = [
  { id: 'u_s1', subject: 'social', title: 'Ⅰ. 내가 사는 세계', description: '위치와 지리 정보, 다양한 지도 읽기', order: 1, createdAt: t },
  { id: 'u_s2', subject: 'social', title: 'Ⅴ. 정치 생활과 민주주의', description: '민주 정치의 원리와 시민 참여', order: 2, createdAt: t },
  { id: 'u_s3', subject: 'social', title: 'Ⅵ. 일상생활과 법', description: '법의 의미와 재판의 종류', order: 3, createdAt: t },
  { id: 'u_s4', subject: 'social', title: 'Ⅸ. 사회 변동과 사회 문제', description: '저출산·고령화, 다문화 사회', order: 4, createdAt: t },
  { id: 'u_h1', subject: 'history', title: 'Ⅰ. 문명의 발생과 고대 세계', description: '4대 문명과 고대 제국', order: 1, createdAt: t },
  { id: 'u_h2', subject: 'history', title: 'Ⅳ. 제국주의와 두 차례 세계 대전', description: '제국주의 침략과 민족 운동', order: 2, createdAt: t },
  { id: 'u_h3', subject: 'history', title: 'Ⅵ. 조선 사회의 변동', description: '양난 이후 사회 변화와 실학', order: 3, createdAt: t },
]

export const seedProjects = [
  {
    id: 'p_1',
    unitId: 'u_s3',
    title: '교실 속 모의재판: 우리가 판사라면?',
    overview: '민사·형사 재판의 절차를 이해하고, 실제 사례를 각색한 모의재판을 통해 공정한 판결의 기준을 탐구한다.',
    curriculum: '개념기반 탐구학습 (핵심 개념: 정의, 공정성, 권리)',
    lessonPlan: [
      { id: 'l_1', session: 1, title: '재판의 종류와 절차', activity: '민사·형사 재판 비교 표 작성' },
      { id: 'l_2', session: 2, title: '사건 분석과 역할 배정', activity: '모둠별 사건 자료 분석, 판사·검사·변호인 역할 배정' },
      { id: 'l_3', session: 3, title: '대본 작성', activity: '쟁점 정리 및 모의재판 대본 작성' },
      { id: 'l_4', session: 4, title: '모의재판 실연 및 성찰', activity: '실연 후 배심원 평결과 성찰 일지' },
    ],
    materials: [
      { id: 'm_1', type: 'text', title: '탐구 질문', content: '공정한 재판을 위해 꼭 지켜져야 할 원칙은 무엇일까?' },
      { id: 'm_2', type: 'link', title: '법원 견학 프로그램 안내', url: 'https://www.scourt.go.kr' },
      { id: 'm_3', type: 'file', title: '모의재판 대본 양식', fileName: '모의재판_대본양식.hwp', fileSize: 48230 },
    ],
    createdAt: t,
    updatedAt: t,
  },
  {
    id: 'p_2',
    unitId: 'u_s4',
    title: '네모퉁이 토론: 고령화 사회의 해법',
    overview: '저출산·고령화 문제에 대한 네 가지 입장을 네모퉁이 토론으로 탐색하고 정책 제안서를 작성한다.',
    curriculum: 'UbD (이해 중심 교육과정)',
    lessonPlan: [
      { id: 'l_5', session: 1, title: '통계로 보는 인구 변화', activity: '인구 피라미드 해석' },
      { id: 'l_6', session: 2, title: '네모퉁이 토론', activity: '입장별 근거 정리 및 토론' },
      { id: 'l_7', session: 3, title: '정책 제안', activity: '모둠별 정책 제안 인포그래픽 제작' },
    ],
    materials: [
      { id: 'm_4', type: 'image', title: '인구 피라미드 예시', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800' },
    ],
    createdAt: t,
    updatedAt: t,
  },
  {
    id: 'p_3',
    unitId: 'u_h3',
    title: '실학자 SNS 만들기',
    overview: '조선 후기 실학자들의 주장을 SNS 게시물 형식으로 재구성해 개혁 사상의 핵심을 이해한다.',
    curriculum: '개념기반 (핵심 개념: 변화, 개혁)',
    lessonPlan: [
      { id: 'l_8', session: 1, title: '실학의 등장 배경', activity: '양난 이후 사회 변화 마인드맵' },
      { id: 'l_9', session: 2, title: '실학자 SNS 제작', activity: '캔바로 SNS 게시물 디자인' },
    ],
    materials: [],
    createdAt: t,
    updatedAt: t,
  },
]

export const seedResults = [
  {
    id: 'r_1', projectId: 'p_1', author: '3모둠 (정의의 저울)', type: '모의재판 대본',
    title: '층간소음 손해배상 청구 사건', description: '원고·피고의 주장을 균형 있게 담아낸 대본. 배심원 평결 과정이 인상적.',
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600', link: '', createdAt: t,
  },
  {
    id: 'r_2', projectId: 'p_2', author: '1모둠', type: '네모퉁이 토론 요약',
    title: '"정년 연장" 코너 토론 정리', description: '찬반 근거를 통계 자료와 함께 정리함.',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600', link: '', createdAt: t,
  },
  {
    id: 'r_3', projectId: 'p_2', author: '김○○ 외 3명', type: '캔바 인포그래픽',
    title: '모두가 행복한 100세 사회', description: '세대 공존형 주거 정책을 제안한 인포그래픽.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600', link: '', createdAt: t,
  },
  {
    id: 'r_4', projectId: 'p_3', author: '2모둠', type: '캔바 인포그래픽',
    title: '@정약용_목민심서', description: '정약용의 SNS 피드를 구성하여 거중기와 목민심서를 소개.',
    thumbnail: '', link: '', createdAt: t,
  },
]
