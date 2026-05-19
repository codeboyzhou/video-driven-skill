import { useTranslation } from 'react-i18next'
import { setLocale } from '../i18n/index.js'
import SegmentedControl from './SegmentedControl.jsx'

export default function LanguageSwitcher({ className = '' }) {
  const { i18n } = useTranslation()
  const current = i18n.language?.startsWith('zh') ? 'zh' : 'en'

  return (
    <SegmentedControl
      className={className}
      ariaLabel='Language'
      value={current}
      onChange={(lng) => { if (lng !== current) setLocale(lng) }}
      options={[
        { id: 'en', label: 'EN' },
        { id: 'zh', label: '中文' },
      ]}
    />
  )
}
