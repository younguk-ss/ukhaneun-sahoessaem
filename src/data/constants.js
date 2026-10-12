/** 교과 정의 */
export const SUBJECTS = [
  { id: 'social', label: '사회' },
  { id: 'history', label: '역사' },
]
export const subjectLabel = (id) => SUBJECTS.find((s) => s.id === id)?.label ?? id

/** 수업 자료 유형 */
export const MATERIAL_TYPES = [
  { id: 'text', label: '텍스트' },
  { id: 'image', label: '이미지 링크' },
  { id: 'link', label: '웹 링크' },
  { id: 'file', label: '첨부파일' },
]

/** 학생 결과물 유형 (자유 입력도 가능) */
export const RESULT_TYPES = [
  '모의재판 대본',
  '네모퉁이 토론 요약',
  '캔바 인포그래픽',
  '역사 신문',
  '카드뉴스',
  '보고서',
  '기타',
]
