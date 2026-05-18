import { useTranslation, Trans } from 'react-i18next'
import AppDialog from './AppDialog.jsx'

const INSTALL_HINTS = [
  { platform: 'macOS', command: 'brew install ffmpeg' },
  { platform: 'Ubuntu / Debian', command: 'sudo apt-get install ffmpeg' },
  { platform: 'Windows', command: 'winget install ffmpeg' },
]

function FFmpegIcon() {
  return (
    <svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' aria-hidden>
      <polygon points='23 7 16 12 23 17 23 7' />
      <rect x='1' y='5' width='15' height='14' rx='2' ry='2' />
    </svg>
  )
}

export default function FFmpegMissingDialog({ open, message, onClose }) {
  const { t } = useTranslation()

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      eyebrow={t('ffmpeg.eyebrow')}
      title={t('ffmpeg.title')}
      icon={<FFmpegIcon />}
    >
      <p className='text-ink-700'>{message}</p>

      <div className='mt-5 rounded-xl border border-ink-900/8 bg-paper-100/80 px-4 py-3'>
        <div className='eyebrow mb-3'>Quick install</div>
        <ul className='space-y-2.5'>
          {INSTALL_HINTS.map(({ platform, command }) => (
            <li key={platform} className='flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3'>
              <span className='shrink-0 font-mono text-[10.5px] uppercase tracking-wider text-ink-400 w-28'>
                {platform}
              </span>
              <code className='font-mono text-[12px] text-umber-700 break-all'>{command}</code>
            </li>
          ))}
        </ul>
        <p className='mt-3 text-[11.5px] leading-relaxed text-ink-400'>
          <Trans
            i18nKey='ffmpeg.pathHint'
            components={{
              mono: <span className='font-mono text-ink-500' />,
            }}
          />
        </p>
      </div>
    </AppDialog>
  )
}
