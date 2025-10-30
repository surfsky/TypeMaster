import { ActionIcon, Box, Button, Grid, Group, Modal, Paper, Slider, Stack, Switch, Text, Title, Transition } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { IconArrowBack, IconRotateClockwise, IconSettings } from '@tabler/icons-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Keyboard from '../components/Keyboard'
import { levels } from '../config/levels'
import type { Level } from '../config/levels'
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



/*********************************************************
 * 打字页
 ************************************************************/
export default function TypePage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const lv = levels.find((o: Level) => o.id === id)!

  const [idx, setIdx] = useState(0)
  const [fontSize, setFontSize] = useState(36)
  const [startTime, setStartTime] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [backspace, setBackspace] = useState(0)
  const [errors, setErrors] = useState(new Set<number>())
  const [pressedKey, setPressedKey] = useState<string | undefined>()
  const [debugInfo, setDebugInfo] = useState('')
  const [showKeyboard, setShowKeyboard] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [settingsOpened, { open: openSettings, close: closeSettings }] = useDisclosure(false)

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

  /**
   * 前往下一关
   */
  const goToNextLevel = useCallback(() => {
    const i = levels.findIndex((o: Level) => o.id === id)
    if (i < levels.length - 1) {
      const next = levels[i + 1]
      navigate(`/type/${next.id}`)
      reset()
    } else {
      modals.open({
        title: '恭喜！',
        children: (
          <>
            <Text>您已完成所有训练！</Text>
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
  }, [id, navigate, reset])

  /**
   * 处理按键
   */
  const handleKeyPress = useCallback((key: string) => {
    if (idx >= lv.text.length) {
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
    const expected = lv.text[idx];
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
    if (idx === lv.text.length - 1) {
      if (soundEnabled) {
        levelPassSound.play();
      }
    }
  }, [lv.text, reset, startTime, idx, mistakes, errors, backspace, goToNextLevel, soundEnabled])

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
    if (idx === lv.text.length && lv.text.length > 0) {
      const duration = (Date.now() - startTime) / 1000
      const wpm = Math.round(lv.text.length / 5 / (duration / 60))
      const accuracy = Math.round((lv.text.length - mistakes) / lv.text.length * 100)
      const score = Math.max(0, accuracy - backspace * 2)

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
                  <Text fz={64} fw={700} c="red" fs="italic">{score}</Text>
                  <Text fz="sm" c="red">分</Text>
                </Stack>
              </Paper>
            </Group>
            <Group justify="flex-end" mt="md">
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
  }, [idx, lv.text.length, startTime, mistakes, backspace, goToNextLevel, reset, errors])

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
            {lv.text.split('').map((ch, i) => {
              const isTyped = i < idx
              const isError = errors.has(i)
              const isCurrent = i === idx

              let color = ''
              if (isTyped && !isError) color = 'green'
              if (isError) color = 'red'

              return (
                <Text
                  key={i}
                  component="span"
                  c={color}
                  style={{
                    fontSize,
                    textDecoration: isCurrent ? 'underline' : 'none',
                    backgroundColor: isError ? 'var(--mantine-color-red-light-hover)' : 'transparent'
                  }}>{ch === '\n' ? '⏎\n' : ch}</Text>
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
                defaultValue={fontSize}
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
            <Keyboard neededKey={lv.text[idx]} pressedKey={pressedKey} onKeyPress={handleKeyPress} />
          </Box>
        )}
      </Transition>
    </Stack>
  )
}