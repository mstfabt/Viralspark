import { clerkClient } from '@clerk/nextjs/server'
import { getUserPlan, PLAN_LIMITS, type PlanType } from './plans'

function getCurrentMonthKey(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

type UsageData = {
  singlePosts: Record<string, number>
  multiPlatform: Record<string, number>
  calendar: Record<string, number>
}

type FeatureType = 'singlePosts' | 'multiPlatform' | 'calendar'

const LIMIT_MAP: Record<FeatureType, keyof typeof PLAN_LIMITS.free> = {
  singlePosts: 'singlePostsPerMonth',
  multiPlatform: 'multiPlatformPerMonth',
  calendar: 'calendarPerMonth',
}

export async function checkUsage(
  userId: string,
  feature: FeatureType
): Promise<{
  allowed: boolean
  used: number
  limit: number
  plan: PlanType
}> {
  const client = await clerkClient()
  const user = await client.users.getUser(userId)

  const plan = getUserPlan(user.publicMetadata as Record<string, unknown>)
  const limitKey = LIMIT_MAP[feature]
  const limit = PLAN_LIMITS[plan][limitKey] as number

  if (limit === 0) {
    return { allowed: false, used: 0, limit: 0, plan }
  }

  if (limit === Infinity) {
    return { allowed: true, used: 0, limit: Infinity, plan }
  }

  const monthKey = getCurrentMonthKey()
  const privateMetadata = user.privateMetadata as Record<string, unknown>
  const usageData = (privateMetadata?.usage as UsageData) || {
    singlePosts: {},
    multiPlatform: {},
    calendar: {},
  }

  const featureUsage = usageData[feature] || {}
  const currentUsage = featureUsage[monthKey] || 0

  if (currentUsage >= limit) {
    return { allowed: false, used: currentUsage, limit, plan }
  }

  return { allowed: true, used: currentUsage, limit, plan }
}

export async function incrementUsage(userId: string, feature: FeatureType): Promise<number> {
  const client = await clerkClient()
  const user = await client.users.getUser(userId)

  const monthKey = getCurrentMonthKey()
  const privateMetadata = user.privateMetadata as Record<string, unknown>
  const usageData = (privateMetadata?.usage as UsageData) || {
    singlePosts: {},
    multiPlatform: {},
    calendar: {},
  }

  const featureUsage = usageData[feature] || {}
  const newCount = (featureUsage[monthKey] || 0) + 1

  const updatedUsage = {
    ...usageData,
    [feature]: {
      ...featureUsage,
      [monthKey]: newCount,
    },
  }

  await client.users.updateUserMetadata(userId, {
    privateMetadata: { usage: updatedUsage },
  })

  return newCount
}

// Backward compat wrapper
export async function checkAndIncrementUsage(
  userId: string,
  feature: FeatureType
) {
  const result = await checkUsage(userId, feature)
  if (result.allowed && result.limit !== Infinity) {
    const newUsed = await incrementUsage(userId, feature)
    return { ...result, used: newUsed }
  }
  return result
}
