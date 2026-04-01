import { MatchType, PRIZE_POOL_SHARES } from '@/types'

export function generateRandomDraw(count = 5): number[] {
  const numbers = new Set<number>()
  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * 45) + 1)
  }
  return Array.from(numbers).sort((a, b) => a - b)
}

export function generateAlgorithmicDraw(
  allScores: number[],
  count = 5,
  mode: 'most' | 'least' = 'most'
): number[] {
  const freq: Record<number, number> = {}
  for (const s of allScores) freq[s] = (freq[s] || 0) + 1

  const sorted = Object.entries(freq)
    .sort((a, b) => mode === 'most' ? Number(b[1]) - Number(a[1]) : Number(a[1]) - Number(b[1]))
    .map(([num]) => Number(num))

  const picked = sorted.slice(0, count)
  while (picked.length < count) {
    const n = Math.floor(Math.random() * 45) + 1
    if (!picked.includes(n)) picked.push(n)
  }
  return picked.sort((a, b) => a - b)
}

export function countMatches(userScores: number[], drawnNumbers: number[]): number {
  return userScores.filter(s => drawnNumbers.includes(s)).length
}

export function getMatchType(matchCount: number): MatchType | null {
  if (matchCount >= 5) return '5-match'
  if (matchCount === 4) return '4-match'
  if (matchCount === 3) return '3-match'
  return null
}

export function calculatePrizePools(totalPool: number): Record<MatchType, number> {
  return {
    '5-match': totalPool * PRIZE_POOL_SHARES['5-match'],
    '4-match': totalPool * PRIZE_POOL_SHARES['4-match'],
    '3-match': totalPool * PRIZE_POOL_SHARES['3-match'],
  }
}
