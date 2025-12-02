import { ActionIcon, Box, Button, Grid, Group, Modal, Paper, Slider, Stack, Switch, Text, Title, Transition } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { IconArrowBack, IconRotateClockwise, IconSettings } from '@tabler/icons-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Keyboard from '../components/Keyboard'
import { levels } from '../config/levels'
import type { Level } from '../config/levels'
import { setCompleted, getCompleted, setScore } from '../config/progress'
import { Howl } from 'howler'

// sound
import keySoundFile from '../assets/sounds/click-light.mp3';
import errorSoundFile from '../assets/sounds/click-wrong.wav';
import backSoundFile from '../assets/sounds/click-back.wav';
import levelPassSoundFile from '../assets/sounds/success.mp3';
const keySound = new Howl({src: [keySoundFile]});
const errorSound = new Howl({src: [errorSoundFile]});
const levelPassSound = new Howl({src: [levelPassSoundFile]});
const backSound = new Howl({src: [backSoundFile]});



/** 将含 // 注释的文本拆成正文+注释（行末\n归入注释） */
function parseTextWithComment(raw: string) {
  const lines = raw.split('\n')
  return lines.map((line, i) => {
    const idx = line.indexOf('//')
    const hasComment = idx !== -1
    // 正文：不含 // 的部分，且去掉尾部空格
    const text = hasComment ? line.slice(0, idx).replace(/\s+$/, '') : line.replace(/\s+$/, '')
    // 注释：含 // 到行尾，再加上本行后的 \n（最后一行除外）
    let comment = hasComment ? line.slice(idx) : undefined
    if (i < lines.length - 1 && comment !== undefined) {
      comment += '\n'
    }
    return { text, comment }
  })
}

/** 渲染一行正文+注释 */
function LineWithComment({
  line,
  startIdx,
  idx,
  errors,
  fontSize,
}: {
  line: { text: string; comment?: string }
  startIdx: number
  idx: number
  errors: Set<number>
  fontSize: number
}) {
  const chars: React.ReactNode[] = []
  // 正文部分
  for (let i = 0; i < line.text.length; i++) {
    const globalI = startIdx + i
    const isTyped = globalI < idx
    const isError = errors.has(globalI)
    const isCurrent = globalI === idx
    let color = ''
    if (isTyped && !isError) color = 'green'
    if (isError) color = 'red'
    const ch = line.text[i] === '\n' ? '⏎\n' : line.text[i]
    chars.push(
      <Text
        key={globalI}
        component="span"
        c={color}
        style={{
          fontSize,
          textDecoration: isCurrent ? 'underline' : 'none',
          backgroundColor: isError ? 'var(--mantine-color-red-light-hover)' : 'transparent',
        }}
      >
        {ch}
      </Text>
    )
  }
  // 注释部分（暗绿色，不参与打字）
  if (line.comment) {
    const commentText = line.comment.replace(/\n$/, '')
    chars.push(
      <Text key="comment" component="span" c="yellow.6" style={{ fontSize, opacity: 0.75 }}>
        {commentText}
      </Text>
    )
  }
  {
    const globalI = startIdx + line.text.length
    const isTyped = globalI < idx
    const isError = errors.has(globalI)
    const isCurrent = globalI === idx
    let color = ''
    if (isTyped && !isError) color = 'green'
    if (isError) color = 'red'
    chars.push(
      <Text
        key={`nl-${globalI}`}
        component="span"
        c={color}
        style={{
          fontSize,
          textDecoration: isCurrent ? 'underline' : 'none',
          backgroundColor: isError ? 'var(--mantine-color-red-light-hover)' : 'transparent',
        }}
      >
        {'⏎'}
      </Text>
    )
  }
  return <>{chars}</>
}

/************************************************************
 * 打字页：展示关卡文本，接收用户输入，计算成绩
 ************************************************************/
export default function TypePage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const lv = levels.find((o: Level) => o.id === id)!

  const [idx, setIdx] = useState(0)
  const [fontSize, setFontSize] = useState(lv.fontSize || 36)
  const [startTime, setStartTime] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [backspace, setBackspace] = useState(0)
  const [errors, setErrors] = useState(new Set<number>())
  const [pressedKey, setPressedKey] = useState<string | undefined>()
  const [debugInfo, setDebugInfo] = useState('')
  const [showKeyboard, setShowKeyboard] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [settingsOpened, { open: openSettings, close: closeSettings }] = useDisclosure(false)

  useEffect(() => {
    setFontSize(lv.fontSize || 36)
  }, [id])

  // 解析正文与注释
  const parsedLines = useMemo(() => parseTextWithComment(lv.text), [lv.text])
  // 仅正文的连续字符串（用于打字判定）
  const plainText = parsedLines.map(l => l.text).join('\n')

  // 是否全部完成
  const allCompleted = levels.every(l => getCompleted().includes(l.id))

  const paperRef = useRef<HTMLDivElement>(null)

  /**
   * 重置
   */
  const reset = useCallback(() => {
    setIdx(0)
    setStartTime(0)
    setMistakes(0)
    setBackspace(0)
    setErrors(new Set())
  }, [])

  /**前往下一关（按顺序） */
  const goToNextLevel = useCallback(() => {
    if (!id) return
    
    const currentIndex = levels.findIndex(lv => lv.id === id)
    if (currentIndex === -1) return
    
    const nextIndex = currentIndex + 1
    
    if (nextIndex < levels.length) {
      // 跳到下一关
      navigate(`/type/${levels[nextIndex].id}`)
      reset()
    } else {
      // 已到达最后一关
      modals.open({
        title: '恭喜！',
        children: (
          <>
            <Text>您已完成所有关卡！</Text>
            <Group justify="flex-end" mt="md">
              <Button onClick={() => {
                navigate('/')
                modals.closeAll()
              }}>返回首页</Button>
            </Group>
          </>
        ),
      })
    }
  }, [id, navigate, reset, levels])

  /**
   * 处理按键
   */
  const handleKeyPress = useCallback((key: string) => {
    if (idx >= plainText.length) {
      if (key === 'Enter') {
        goToNextLevel()
        modals.closeAll()
      }
      return
    }

    if (key === 'Escape') {
      reset()
      return
    }

    if (key === 'Backspace') {
      setIdx(i => {
        const newIdx = Math.max(0, i - 1)
        setErrors(prevErrors => {
          const newErrors = new Set(prevErrors)
          newErrors.delete(i - 1)
          return newErrors
        })
        return newIdx
      })
      if (soundEnabled) {
        backSound.play();
      }
      setBackspace(c => c + 1)
      return
    }

    // 只处理单字符的键
    if (key.length !== 1 && key !== 'Enter') return;
    setPressedKey(key);
    const ch = key === 'Enter' ? '\n' : key;
    if (idx === 0 && startTime === 0) {
      setStartTime(Date.now())
    }

    // match
    const expected = plainText[idx];
    const isMatch = ch === expected;
    console.log(`Typed: '${ch}' (${ch.charCodeAt(0)}), Expected: '${expected}' (${expected.charCodeAt(0)})`);
    setDebugInfo(`Typed: '${ch}', Expected: '${expected}', Match: ${isMatch}`)
    if (isMatch) {
      if (soundEnabled) {
        keySound.play();
      }
    } else {
      if (soundEnabled) {
        errorSound.play();
      }
      setMistakes(m => m + 1)
      setErrors(prevErrors => {
        const newErrors = new Set(prevErrors)
        newErrors.add(idx)
        return newErrors
      })
    }

    // move to next
    setIdx(i => i + 1)
    if (idx === plainText.length - 1) {
      if (soundEnabled) {
        levelPassSound.play();
      }
    }
  }, [plainText, reset, startTime, idx, mistakes, errors, backspace, goToNextLevel, soundEnabled])

  /**
   * 监听键盘事件
   */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      handleKeyPress(e.key)
    }
    const onKeyUp = () => {
      setPressedKey(undefined)
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [handleKeyPress])

  /**
   * 显示统计信息
   */
  useEffect(() => {
    if (idx === plainText.length && plainText.length > 0) {
      setCompleted(lv.id)
      const duration = (Date.now() - startTime) / 1000
      const wpm = Math.round(plainText.length  / (duration / 60))   // 每分钟字符数
      const accuracy = Math.round((plainText.length - mistakes) / plainText.length * 100)
      const score = Math.round(wpm/2 * (accuracy / 100)) - backspace
      setScore(lv.id, { score, wpm, accuracy, backspace, duration, ts: Date.now() })

      modals.open({
        title: '统计',
        size: 'sm',
        centered: true,
        children: (
          <>
            <Group justify="space-around" align="center">
              <Stack gap="xs">
                <Text>用时：{duration.toFixed(2)}秒</Text>
                <Text>速度：{wpm} WPM</Text>
                <Text>正确率：{accuracy}%</Text>
                <Text>退格：{backspace}次</Text>
              </Stack>
              <Paper  p="md" radius="md" style={{ borderColor: 'red' }}>
                <Stack gap={0} align="flex-end">
                  <Text fz={64} fw={700} c="orange" fs="italic">{score}</Text>
                  <Text fz="sm" c="orange">分</Text>
                </Stack>
              </Paper>
            </Group>
            <Group justify="space-between" mt="md">
              <Text c={allCompleted ? 'green' : 'dimmed'} size="sm">
                {allCompleted ? '全部关卡已完成' : '可继续挑战未完成关卡'}
              </Text>
              <Button onClick={() => {
                reset()
                modals.closeAll()
              }}>重试</Button>
              <Button onClick={() => {
                goToNextLevel()
                modals.closeAll()
              }}>下一关</Button>
            </Group>
          </>
        ),
      })
    }
  }, [idx, lv.id, plainText.length, startTime, mistakes, backspace, goToNextLevel, reset, errors])

  return (
    <Stack p="md" style={{ height: '100vh' }}>
      <Group justify="space-between" mb="md" style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'var(--mantine-color-body)' }}>
        <ActionIcon variant="default" size="lg" aria-label="Settings">
          <IconArrowBack onClick={() => navigate('/')} />
        </ActionIcon>
        <Title order={3}>{lv.cat} · {lv.title}</Title>
        <Group>
          <ActionIcon variant="default" size="lg" onClick={reset}>
            <IconRotateClockwise />
          </ActionIcon>
          <ActionIcon variant="default" size="lg" onClick={openSettings}>
            <IconSettings />
          </ActionIcon>
        </Group>
      </Group>

      <Stack style={{ flex: 1, overflowY: 'auto', textAlign: 'center', padding:'0', margin:'0'}} px="md">
        <Paper ref={paperRef} radius="md" withBorder style={{
          userSelect: 'none',
          fontFamily: 'monospace',
          letterSpacing: 2,
          display: 'inline-block',
          textAlign: 'left',
          padding: '16px',
        }}>
          <Box style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {parsedLines.map((line, lineIdx) => {
              // 计算该行正文起始在 plainText 中的全局索引
              const startIdx = parsedLines
                .slice(0, lineIdx)
                .reduce((acc, l) => acc + l.text.length + 1, 0) // +1 for '\n'
              return (
                <Box key={lineIdx} style={{ minHeight: '1em' }}>
                  <LineWithComment
                    line={line}
                    startIdx={startIdx}
                    idx={idx}
                    errors={errors}
                    fontSize={fontSize}
                  />
                </Box>
              )
            })}
          </Box>
        </Paper>

        {debugInfo && <Text c="dimmed" size="sm" mt="md">{debugInfo}</Text>}
      </Stack>

      <Modal opened={settingsOpened} onClose={closeSettings} title="设置" size="sm" centered>
        <Stack>
          <Grid>
            <Grid.Col span={4}>
              <Text size="sm">字体大小</Text>
            </Grid.Col>
            <Grid.Col span={8}>
              <Slider
                value={fontSize}
                min={12}
                max={128}
                step={1}
                onChange={v => setFontSize(v)}
              />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={4}>
              <Text size="sm">显示键盘</Text>
            </Grid.Col>
            <Grid.Col span={8}>
              <Switch
                checked={showKeyboard}
                onChange={e => setShowKeyboard(e.currentTarget.checked)}
              />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={4}>
              <Text size="sm">声音</Text>
            </Grid.Col>
            <Grid.Col span={8}>
              <Switch
                checked={soundEnabled}
                onChange={e => setSoundEnabled(e.currentTarget.checked)}
              />
            </Grid.Col>
          </Grid>
        </Stack>
      </Modal>

      <Transition mounted={showKeyboard} transition="slide-up" duration={300} timingFunction="ease">
        {styles => (
          <Box style={styles} pb="xl">
            <Keyboard neededKey={plainText[idx]} pressedKey={pressedKey} onKeyPress={handleKeyPress} />
          </Box>
        )}
      </Transition>
    </Stack>
  )
}
