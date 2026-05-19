import { useEffect, useRef, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Canvas, FabricImage, Group, IText, Line, Rect, Triangle } from 'fabric'
import useAppStore from '../store/useAppStore.js'

export default function FrameAnnotator() {
  const { t } = useTranslation()
  const tools = useMemo(() => [
    { id: 'select', label: t('frameAnnotator.select') },
    { id: 'arrow', label: t('frameAnnotator.arrow') },
    { id: 'rect', label: t('frameAnnotator.rect') },
    { id: 'text', label: t('frameAnnotator.text') },
  ], [t])

  const canvasRef = useRef()
  const fabricRef = useRef(null)
  const [tool, setTool] = useState('select')

  // Use refs to avoid stale closures in event handlers
  const toolRef = useRef('select')
  const isDrawingRef = useRef(false)
  const startPointRef = useRef(null)
  const activeObjRef = useRef(null)
  const selectedFrameIdRef = useRef(null)
  const suppressSaveRef = useRef(false)

  const selectedFrameId = useAppStore(s => s.selectedFrameId)
  const frames = useAppStore(s => s.frames)
  const updateFrameAnnotation = useAppStore(s => s.updateFrameAnnotation)
  const updateFrameImage = useAppStore(s => s.updateFrameImage)
  const updateFrameAnnotationRef = useRef(updateFrameAnnotation)
  const updateFrameImageRef = useRef(updateFrameImage)
  updateFrameAnnotationRef.current = updateFrameAnnotation
  updateFrameImageRef.current = updateFrameImage

  const selectedFrame = frames.find(f => f.frameId === selectedFrameId)

  // Keep refs in sync
  const changeTool = (tId) => {
    toolRef.current = tId
    setTool(tId)
  }

  useEffect(() => {
    selectedFrameIdRef.current = selectedFrameId
  }, [selectedFrameId])

  const saveAnnotation = () => {
    if (suppressSaveRef.current) return
    const canvas = fabricRef.current
    const frameId = selectedFrameIdRef.current
    if (!canvas || !frameId) return
    
    // Save annotation JSON
    const json = JSON.stringify(canvas.toJSON())
    updateFrameAnnotationRef.current(frameId, json)
    
    // Export annotated image and update thumbnail
    try {
      const dataUrl = canvas.toDataURL({
        format: 'jpeg',
        quality: 0.8,
        width: canvas.width,
        height: canvas.height
      })
      // Remove data URL prefix to get base64
      const base64 = dataUrl.replace(/^data:image\/jpeg;base64,/, '')
      updateFrameImageRef.current(frameId, base64)
      console.log('[FrameAnnotator] Updated thumbnail with annotation')
    } catch (err) {
      console.error('[FrameAnnotator] Failed to export annotated image:', err)
    }
  }

  // Init fabric canvas once
  useEffect(() => {
    if (!canvasRef.current) return
    
    console.log('[FrameAnnotator] Initializing canvas')

    const canvas = new Canvas(canvasRef.current, {
      width: 640,
      height: 360,
      backgroundColor: '#F5F0E8',
    })
    fabricRef.current = canvas

    canvas.on('object:modified', saveAnnotation)

    canvas.on('object:added', ({ target }) => {
      if (!target) return
      const isSelect = toolRef.current === 'select'
      target.selectable = isSelect
      target.evented = isSelect
    })

    canvas.on('mouse:down', (opt) => {
      if (toolRef.current === 'select') return
      const pointer = canvas.getPointer(opt.e)
      startPointRef.current = pointer
      isDrawingRef.current = true

      if (toolRef.current === 'text') {
        const text = new IText(t('frameAnnotator.defaultText'), {
          left: pointer.x,
          top: pointer.y,
          fill: '#9A6B3F',
          fontSize: 18,
          fontWeight: 'bold',
        })
        canvas.add(text)
        canvas.setActiveObject(text)
        text.enterEditing()
        toolRef.current = 'select'
        setTool('select')
        isDrawingRef.current = false
        return
      }

      if (toolRef.current === 'arrow') {
        const line = new Line([pointer.x, pointer.y, pointer.x, pointer.y], {
          stroke: '#B87E6B',
          strokeWidth: 2.5,
          selectable: false,
          evented: false,
        })
        const head = new Triangle({
          width: 12, height: 14,
          fill: '#B87E6B',
          left: pointer.x, top: pointer.y,
          originX: 'center', originY: 'center',
          angle: 90,
          selectable: false,
          evented: false,
        })
        canvas.add(line, head)
        activeObjRef.current = { type: 'arrow', line, head }
      }

      if (toolRef.current === 'rect') {
        const rect = new Rect({
          left: pointer.x,
          top: pointer.y,
          width: 1,
          height: 1,
          stroke: '#9A6B3F',
          strokeWidth: 2,
          fill: 'transparent',
          selectable: true,
        })
        canvas.add(rect)
        activeObjRef.current = rect
      }
    })

    canvas.on('mouse:move', (opt) => {
      if (!isDrawingRef.current || !activeObjRef.current) return
      const pointer = canvas.getPointer(opt.e)
      const obj = activeObjRef.current

      if (obj.type === 'arrow') {
        const { line, head } = obj
        line.set({ x2: pointer.x, y2: pointer.y })
        const angle = Math.atan2(pointer.y - line.y1, pointer.x - line.x1) * 180 / Math.PI
        head.set({ left: pointer.x, top: pointer.y, angle: angle + 90 })
      } else if (obj instanceof Rect) {
        const s = startPointRef.current
        obj.set({
          width: Math.abs(pointer.x - s.x),
          height: Math.abs(pointer.y - s.y),
          left: Math.min(pointer.x, s.x),
          top: Math.min(pointer.y, s.y),
        })
      }
      canvas.renderAll()
    })

    canvas.on('mouse:up', () => {
      if (!isDrawingRef.current) return
      isDrawingRef.current = false
      const obj = activeObjRef.current
      activeObjRef.current = null

      if (obj && obj.type === 'arrow') {
        suppressSaveRef.current = true
        const { line, head } = obj
        canvas.remove(line)
        canvas.remove(head)
        const group = new Group([line, head], { selectable: true })
        canvas.add(group)
        suppressSaveRef.current = false
      }
      saveAnnotation()
    })

    return () => canvas.dispose()
  }, [t])

  // Load frame image when selection changes
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas || !selectedFrame || !selectedFrameId) {
      console.log('[FrameAnnotator] No canvas or selected frame:', { canvas: !!canvas, selectedFrame: !!selectedFrame, selectedFrameId })
      return
    }

    console.log('[FrameAnnotator] Loading frame:', selectedFrameId, 'has image:', !!selectedFrame.base64Image)

    suppressSaveRef.current = true
    canvas.clear()
    suppressSaveRef.current = false

    canvas.backgroundImage = undefined
    canvas.requestRenderAll()

    if (!selectedFrame.base64Image) {
      console.error('[FrameAnnotator] No base64 image data for frame:', selectedFrameId)
      return
    }

    const imageUrl = `data:image/jpeg;base64,${selectedFrame.base64Image}`
    
    FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' })
      .then((img) => {
        img.set({ selectable: false, evented: false })
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height)
        img.set({
          scaleX: scale, scaleY: scale,
          originX: 'center', originY: 'center',
          left: canvas.width / 2, top: canvas.height / 2,
        })
        canvas.backgroundImage = img
        canvas.requestRenderAll()
        console.log('[FrameAnnotator] Image loaded successfully, scale:', scale)

        if (selectedFrame.annotationJson) {
          try {
            const data = JSON.parse(selectedFrame.annotationJson)
            canvas.loadFromJSON(data).then(() => {
              const isSelect = toolRef.current === 'select'
              canvas.forEachObject(obj => {
                obj.selectable = isSelect
                obj.evented = isSelect
              })
              canvas.requestRenderAll()
            })
          } catch (err) {
            console.error('[FrameAnnotator] Failed to load annotations:', err)
          }
        }
      })
      .catch((err) => {
        console.error('[FrameAnnotator] Failed to load image:', err)
      })
  }, [selectedFrame, selectedFrameId])

  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return
    const isSelect = tool === 'select'
    canvas.selection = isSelect
    canvas.skipTargetFind = !isSelect
    canvas.discardActiveObject()
    canvas.forEachObject(obj => {
      obj.selectable = isSelect
      obj.evented = isSelect
    })
    canvas.renderAll()
  }, [tool])

  const clearAnnotations = () => {
    const canvas = fabricRef.current
    if (!canvas) return
    const bg = canvas.backgroundImage
    suppressSaveRef.current = true
    canvas.clear()
    suppressSaveRef.current = false
    if (bg) {
      canvas.backgroundImage = bg
      canvas.requestRenderAll()
    }
    saveAnnotation()
  }

  return (
    <div className='flex h-full min-h-0 flex-col gap-3'>
      <div className='flex flex-wrap items-center gap-2 rounded-2xl border border-ink-900/8 bg-paper-100/70 p-2'>
        {tools.map(toolItem => (
          <button
            key={toolItem.id}
            onClick={() => changeTool(toolItem.id)}
            disabled={!selectedFrame}
            className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition-all
              ${tool === toolItem.id ? 'bg-ink-900 text-paper-50 shadow-soft' : 'text-ink-500 hover:bg-paper-200 hover:text-ink-900'}
              ${!selectedFrame ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {toolItem.label}
          </button>
        ))}
        <button
          onClick={clearAnnotations}
          disabled={!selectedFrame}
          className={`ml-auto rounded-full px-3 py-1.5 text-[13px] font-medium text-ink-500 transition-all hover:bg-clay-500/10 hover:text-clay-700
            ${!selectedFrame ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {t('frameAnnotator.clear')}
        </button>
      </div>

      <div className='relative flex-1 overflow-hidden rounded-2xl border border-ink-900/10 bg-paper-100 shadow-inset-hair'>
        <div className='flex h-full min-h-[360px] items-center justify-center p-3'>
          <canvas ref={canvasRef} className='max-w-full rounded-xl shadow-soft' />
        </div>
        {!selectedFrame && (
          <div className='absolute inset-0 flex items-center justify-center bg-paper-100/85 text-sm text-ink-400 backdrop-blur-sm'>
            {t('frameAnnotator.pickFrame')}
          </div>
        )}
      </div>
    </div>
  )
}
