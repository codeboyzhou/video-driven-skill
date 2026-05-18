const REGENERATE_TEMPLATE_KEYS = [
  'errorHandling',
  'waitLogic',
  'logging',
  'simplify',
  'retry',
  'selectors',
  'fixBugs',
  'performance',
]

export function getRegenerateTemplates(t) {
  return REGENERATE_TEMPLATE_KEYS.map((key) => ({
    label: t(`regenerate.templates.${key}.label`),
    value: t(`regenerate.templates.${key}.value`),
  }))
}

export function getPartialRegenerateModes(t) {
  return ['auto', 'text', 'multimodal'].map((id) => ({
    id,
    label: t(`partialRegenerate.modes.${id}.label`),
    description: t(`partialRegenerate.modes.${id}.description`),
  }))
}
