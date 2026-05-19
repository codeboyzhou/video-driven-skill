import { Check, ImageOff, Clock } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function FrameGridSelector({ frames, selectedIds, onToggle, maxSelection = 2, readOnly = false }) {
  const { t } = useTranslation()
  const [previewFrame, setPreviewFrame] = useState(null)
  
  if (frames.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-slate-500">
        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
          <ImageOff className="w-8 h-8 text-slate-600" />
        </div>
        <p className="text-sm font-medium text-slate-400 mb-1">{t('frameGrid.noFrames')}</p>
        <p className="text-xs text-center text-slate-600 leading-relaxed">
          {t('frameGrid.noFramesHint')}
        </p>
      </div>
    )
  }
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className={`${selectedIds.length >= maxSelection ? 'text-amber-400' : 'text-slate-500'}`}>
          {selectedIds.length >= maxSelection
            ? t('frameGrid.maxSelected', { max: maxSelection })
            : t('frameGrid.canSelect', { max: maxSelection })
          }
        </span>
        <span className="text-slate-600">{t('frameGrid.available', { count: frames.length })}</span>
      </div>
      
      <div className={`grid gap-2 ${readOnly ? 'grid-cols-2' : 'grid-cols-2'}`}>
        {frames.map((frame, index) => {
          const isSelected = selectedIds.includes(frame.frameId)
          const isDisabled = !isSelected && selectedIds.length >= maxSelection && !readOnly
          
          return (
            <div
              key={frame.frameId}
              className={`
                relative aspect-video rounded-lg overflow-hidden
                border-2 transition-all group
                ${readOnly 
                  ? 'border-slate-800 cursor-default' 
                  : isSelected 
                    ? 'border-blue-500 ring-2 ring-blue-500/30 cursor-pointer' 
                    : isDisabled
                      ? 'border-slate-800 opacity-50 cursor-not-allowed'
                      : 'border-slate-700 hover:border-slate-500 hover:opacity-90 cursor-pointer'
                }
              `}
              onClick={() => !readOnly && !isDisabled && onToggle(frame.frameId)}
              onMouseEnter={() => setPreviewFrame(frame)}
              onMouseLeave={() => setPreviewFrame(null)}
            >
              {frame.base64Image ? (
                <img
                  src={`data:image/jpeg;base64,${frame.base64Image}`}
                  alt={`Frame ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                  <ImageOff className="w-6 h-6 text-slate-600" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-white/90 text-[10px]">
                  <Clock className="w-3 h-3" />
                  {formatTime(frame.timestamp)}
                </div>
              </div>
              
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              
              {isSelected && selectedIds.length > 1 && (
                <div className="absolute top-1.5 left-1.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-[10px] text-white font-medium shadow-lg">
                  {selectedIds.indexOf(frame.frameId) + 1}
                </div>
              )}
              
              {!readOnly && !isDisabled && !isSelected && (
                <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors flex items-center justify-center">
                  <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity font-medium drop-shadow-lg">
                    {t('frameGrid.clickToSelect')}
                  </span>
                </div>
              )}
              
              {!readOnly && isDisabled && (
                <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                  <span className="text-slate-500 text-[10px]">{t('frameGrid.maxReached')}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      {!readOnly && previewFrame && previewFrame.description && (
        <div className="bg-slate-800/80 rounded-lg p-2 text-xs">
          <p className="text-slate-400 mb-1">{t('frameGrid.frameDescription')}</p>
          <p className="text-slate-200 line-clamp-2">{previewFrame.description}</p>
        </div>
      )}
      
      {!readOnly && selectedIds.length > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2.5">
          <p className="text-xs text-blue-400 font-medium mb-1">{t('frameGrid.selectedCount', { count: selectedIds.length })}</p>
          <p className="text-[10px] text-blue-300/70">
            {selectedIds.length === maxSelection
              ? t('frameGrid.maxSelectionReached')
              : t('frameGrid.canSelectMore', { count: maxSelection - selectedIds.length })
            }
          </p>
        </div>
      )}
    </div>
  )
}
