import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { generateRandomDraw, generateAlgorithmicDraw, countMatches, getMatchType, calculatePrizePools } from '@/lib/draw-engine'
import { SUBSCRIPTION_PRICES } from '@/types'

export async function POST(req: NextRequest) {
  const { action, drawId, drawType } = await req.json()
  const supabase = await createAdminClient()

  if (action === 'create') {
    const { data } = await supabase.from('draws').insert({
      draw_date: new Date().toISOString().split('T')[0],
      draw_type: drawType || 'random',
      status: 'pending',
    }).select().single()
    return NextResponse.json({ draw: data })
  }

  if (action === 'simulate' || action === 'publish') {
    const { data: draw } = await supabase.from('draws').select('*').eq('id', drawId).single()
    if (!draw) return NextResponse.json({ error: 'Draw not found' }, { status: 404 })

    // Generate numbers
    let drawnNumbers: number[]
    if (draw.draw_type === 'algorithmic') {
      const { data: allScores } = await supabase.from('golf_scores').select('score')
      const scores = allScores?.map(s => s.score) || []
      drawnNumbers = generateAlgorithmicDraw(scores)
    } else {
      drawnNumbers = generateRandomDraw()
    }

    // Calculate prize pool from active subscribers
    const { data: subscribers } = await supabase.from('profiles').select('subscription_plan').eq('subscription_status', 'active')
    const totalPool = subscribers?.reduce((sum, s) => {
      const base = s.subscription_plan === 'yearly' ? SUBSCRIPTION_PRICES.yearly / 12 : SUBSCRIPTION_PRICES.monthly
      return sum + base * 0.5 // 50% of subscription to prize pool
    }, 0) || 0

    const pools = calculatePrizePools(totalPool)

    if (action === 'simulate') {
      await supabase.from('draws').update({ drawn_numbers: drawnNumbers, status: 'simulated', prize_pool_total: totalPool }).eq('id', drawId)
      return NextResponse.json({ drawnNumbers, pools })
    }

    // Publish: match users and create winners
    const { data: userScores } = await supabase
      .from('golf_scores')
      .select('user_id, score')
      .in('user_id', subscribers?.map(s => (s as any).id) || [])

    // Group scores by user
    const userScoreMap: Record<string, number[]> = {}
    for (const row of userScores || []) {
      if (!userScoreMap[row.user_id]) userScoreMap[row.user_id] = []
      userScoreMap[row.user_id].push(row.score)
    }

    const winnersByType: Record<string, string[]> = { '5-match': [], '4-match': [], '3-match': [] }
    for (const [userId, scores] of Object.entries(userScoreMap)) {
      const matches = countMatches(scores, drawnNumbers)
      const matchType = getMatchType(matches)
      if (matchType) winnersByType[matchType].push(userId)
    }

    // Insert winners with split prizes
    const winnerInserts = []
    for (const [matchType, userIds] of Object.entries(winnersByType)) {
      if (userIds.length === 0) continue
      const prizePerWinner = pools[matchType as keyof typeof pools] / userIds.length
      for (const userId of userIds) {
        winnerInserts.push({ draw_id: drawId, user_id: userId, match_type: matchType, prize_amount: prizePerWinner })
      }
    }

    if (winnerInserts.length > 0) {
      await supabase.from('winners').insert(winnerInserts)
    }

    // Jackpot rollover if no 5-match winner
    const jackpotRollover = winnersByType['5-match'].length === 0 ? pools['5-match'] : 0

    await supabase.from('draws').update({
      drawn_numbers: drawnNumbers,
      status: 'published',
      prize_pool_total: totalPool,
      jackpot_amount: jackpotRollover,
    }).eq('id', drawId)

    return NextResponse.json({ ok: true, winners: winnerInserts.length })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
