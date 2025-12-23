import { SimpleGrid, Card, Group, Badge, Title, Text, Button, Stack } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { getLevels } from '../config/levels'
import type { Level } from '../config/levels'
import { useMemo, useState, useEffect } from 'react'
import { ProgressManager } from '../config/progress'

/**关卡页面：展示关卡列表 */
function Levels() {
  const nav = useNavigate()
  const [levels, setLevels] = useState<Level[]>([])

  useEffect(() => {
    getLevels().then(setLevels)
  }, [])

  const groupedLevels = useMemo(() => {
    return levels.reduce((acc, level) => {
      if (!acc[level.cat]) {
        acc[level.cat] = []
      }
      acc[level.cat].push(level)
      return acc
    }, {} as Record<string, Level[]>)
  }, [levels])

  /**进入打字页面 */
  function go(id: string) {
    nav(`/type/${id}`)
  }

  return (
    <Stack
      style={{
        background: 'linear-gradient(to right, #8360c3, #4748b3ff)',
      }}
      mih={'100vh'}
    >
      <Title order={1} ta="center" my="xl" c="white" style={{ fontFamily: 'Montserrat, sans-serif', textShadow: '0 0 20px rgba(0, 0, 0, 0.8)' }}>Type Master 打字达人</Title>
      {Object.entries(groupedLevels).map(([cat, lvs]) => (
        <Stack key={cat} px={'md'}>
          <Title order={3} c="white">{cat}</Title>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {lvs.map((lv) => (
              <Card key={lv.id} padding="md" radius="md"
                style={{
                  transition: 'transform 0.2s ease-in-out',
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }}
                styles={{ root: { ':hover': { transform: 'scale(1.02)' } } }}>
                <Group justify="space-between" mb="xs">
                  <Title order={4} c="white">{lv.title}</Title>
                  <Group gap="xs">
                    <Badge variant="light">{lv.cat}</Badge>
                    {(() => {
                      const s = ProgressManager.getScore(lv.id)
                      return s ? <Badge color="orange" variant="filled">{s.score}分</Badge> : null
                    })()}
                  </Group>
                </Group>
                <Text size="sm" c="gray.4" lineClamp={2}>{lv.text}</Text>
                <Group justify="flex-end" mt="md">
                  <Button onClick={() => go(lv.id)} id={`btn-${lv.id}`}>开始</Button>
                </Group>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>
      ))}
      <Stack ta="center" mt="xl" pb="md" gap={0}>
        <Text size="sm">version 1.1.0</Text>
        <Text size="sm">CopyRight 2025 All Rights Reserved</Text>
        <Text size="sm">定制请联系：surfsky@189.cn 或微信 surfsky</Text>
      </Stack>
    </Stack>
  )
}

export default Levels
