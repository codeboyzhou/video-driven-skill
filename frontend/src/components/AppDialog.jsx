import { useEffect } from 'react'

export default function AppDialog({
  open,
  onClose,
  title,
  eyebrow,
  children,
  confirmLabel = '知道了',
  icon,
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6'>
      <button
        type='button'
        aria-label='关闭'
        className='absolute inset-0 bg-ink-900/35 backdrop-blur-[3px] animate-fade-in'
        onClick={onClose}
      />
      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby='app-dialog-title'
        className='relative z-10 w-full max-w-[440px] card-paper corner-mark shadow-lift animate-fade-up overflow-hidden'
      >
        <div className='pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-umber-400/12 blur-2xl' />
        <div className='pointer-events-none absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-sage-300/20 blur-2xl' />

        <div className='relative px-6 pt-6 pb-5'>
          <div className='flex items-start gap-4'>
            {icon && (
              <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-umber-50 ring-1 ring-umber-300/45 text-umber-600'>
                {icon}
              </div>
            )}
            <div className='min-w-0 flex-1 pt-0.5'>
              {eyebrow && <div className='eyebrow mb-2'>{eyebrow}</div>}
              <h2
                id='app-dialog-title'
                className='font-display text-[22px] leading-snug text-ink-900'
                style={{ fontVariationSettings: "'opsz' 96" }}
              >
                {title}
              </h2>
            </div>
          </div>

          <div className='mt-4 text-[13.5px] leading-relaxed text-ink-600'>{children}</div>

          <div className='mt-6 flex justify-end'>
            <button type='button' onClick={onClose} className='btn-primary min-w-[108px] justify-center'>
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
