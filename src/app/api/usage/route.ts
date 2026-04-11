import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { checkUsage } from '@/lib/usage'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [singlePosts, multiPlatform, calendar] = await Promise.all([
    checkUsage(userId, 'singlePosts'),
    checkUsage(userId, 'multiPlatform'),
    checkUsage(userId, 'calendar'),
  ])

  // Infinity is not valid JSON — serialize it as null so clients can handle "unlimited".
  const safeLimit = (n: number) => (n === Infinity ? null : n)

  return NextResponse.json({
    // Backwards-compatible top-level fields (singlePosts)
    used: singlePosts.used,
    limit: safeLimit(singlePosts.limit),
    plan: singlePosts.plan,
    // Full per-feature breakdown
    singlePosts: { used: singlePosts.used, limit: safeLimit(singlePosts.limit) },
    multiPlatform: { used: multiPlatform.used, limit: safeLimit(multiPlatform.limit) },
    calendar: { used: calendar.used, limit: safeLimit(calendar.limit) },
  })
}
