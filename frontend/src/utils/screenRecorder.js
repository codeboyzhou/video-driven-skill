import i18n from '../i18n/index.js'

export function isScreenRecordingSupported() {
  return (
    typeof window !== 'undefined' &&
    window.isSecureContext &&
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices?.getDisplayMedia &&
    typeof MediaRecorder !== 'undefined'
  )
}

export function pickRecorderMimeType() {
  const candidates = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
    'video/mp4',
  ]
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || ''
}

export function blobToRecordingFile(blob, mimeType) {
  const ext = mimeType.includes('mp4') ? 'mp4' : 'webm'
  const name = `screen-recording-${new Date().toISOString().replace(/[:.]/g, '-')}.${ext}`
  return new File([blob], name, { type: blob.type || mimeType || 'video/webm' })
}

export function stopMediaStream(stream) {
  stream?.getTracks().forEach((track) => track.stop())
}

export function formatRecordingDuration(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds))
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function formatRecordingSize(bytes) {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let i = 0
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024
    i += 1
  }
  return `${size.toFixed(1)} ${units[i]}`
}

export function recordingErrorMessage(error) {
  if (!error) return i18n.t('recorder.errors.generic')
  if (error.name === 'NotAllowedError') return i18n.t('recorder.errors.NotAllowedError')
  if (error.name === 'NotFoundError') return i18n.t('recorder.errors.NotFoundError')
  if (error.name === 'NotSupportedError') return i18n.t('recorder.errors.NotSupportedError')
  return error.message || i18n.t('recorder.errors.generic')
}
