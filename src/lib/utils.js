import { clsx } from 'clsx'

/** className 병합 헬퍼 */
export const cn = (...args) => clsx(...args)

/** 고유 ID 생성 (Firebase 문서 ID처럼 문자열로 사용) */
export const uid = (prefix = 'id') =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`

/** 날짜 포맷: 2026. 10. 12. */
export const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' }) : ''

/** 파일 크기 표기 */
export const formatBytes = (bytes = 0) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`
}

/**
 * 이미지 파일 → 리사이즈된 dataURL
 * localStorage 용량(약 5MB)을 아끼기 위해 최대 maxSize px, JPEG 압축으로 저장합니다.
 * (Firebase Storage 연동 시 이 함수 대신 업로드 후 다운로드 URL을 쓰면 됩니다.)
 */
export const imageFileToDataUrl = (file, maxSize = 800, quality = 0.78) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('이미지 형식이 올바르지 않습니다.'))
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
