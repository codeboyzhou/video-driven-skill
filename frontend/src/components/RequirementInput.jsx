import { useTranslation } from 'react-i18next'
import useAppStore from '../store/useAppStore.js'

export default function RequirementInput() {
  const { t } = useTranslation()
  const requirement = useAppStore(s => s.requirement)
  const setRequirement = useAppStore(s => s.setRequirement)

  return (
    <div className='space-y-2'>
      <label className='text-slate-300 text-sm font-medium'>{t('requirement.label')}</label>
      <textarea
        value={requirement}
        onChange={(e) => setRequirement(e.target.value)}
        placeholder={t('requirement.placeholder')}
        rows={3}
        className='w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm
          placeholder-slate-500 outline-none focus:border-blue-500 transition-colors resize-none'
      />
    </div>
  )
}
