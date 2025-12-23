import { Badge, Stack, Text } from '@mantine/core'
import { useRef, useState } from 'react'

export default function ImeTest() {
  const [val, setVal] = useState('')
  const [lang, setLang] = useState<'en' | 'cn'>('en')
  const timerRef = useRef<number | null>(null)

  return (
    <Stack p="md">
      <Text size="sm">输入框</Text>
      <textarea
        rows={6}
        style={{ width: '100%' }}
        value={val}
        onChange={e => setVal(e.target.value)}
        onCompositionStart={() => {
          setLang('cn')
          if (timerRef.current) window.clearTimeout(timerRef.current)
        }}
        onCompositionEnd={() => {
          setLang('cn')
          if (timerRef.current) window.clearTimeout(timerRef.current)
          timerRef.current = window.setTimeout(() => {
            setLang('en')
          }, 800)
        }}
        onKeyDown={e => {
          const isComp = (e.nativeEvent as KeyboardEvent).isComposing
          if (!isComp) {
            const k = e.key
            if (k.length === 1 && k.charCodeAt(0) <= 127) setLang('en')
          }
        }}
        onInput={e => {
          const ne = e.nativeEvent as InputEvent
          const t = ne.inputType
          if (t && (t.includes('Composition') || t === 'insertFromComposition')) {
            setLang('cn')
          } else if (t === 'insertText') {
            setLang('en')
          }
        }}
      />
      <Text size="sm">输入法状态</Text>
      <Badge size="xs" variant="outline" color={lang === 'cn' ? 'red' : 'green'}>
        {lang === 'cn' ? '中' : 'En'}
      </Badge>
    </Stack>
  )
}
