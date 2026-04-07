export type PlanType = 'free' | 'starter' | 'pro'

export type PlanLimits = {
  label: string
  singlePostsPerMonth: number
  multiPlatformPerMonth: number
  calendarPerMonth: number
  maxCalendarDays: number
  brandProfiles: number
  csvExport: boolean
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    label: 'Ücretsiz',
    singlePostsPerMonth: 5,
    multiPlatformPerMonth: 0,
    calendarPerMonth: 0,
    maxCalendarDays: 0,
    brandProfiles: 0,
    csvExport: false,
  },
  starter: {
    label: 'Başlangıç',
    singlePostsPerMonth: 50,
    multiPlatformPerMonth: 20,
    calendarPerMonth: 2,
    maxCalendarDays: 7,
    brandProfiles: 1,
    csvExport: false,
  },
  pro: {
    label: 'Pro',
    singlePostsPerMonth: Infinity,
    multiPlatformPerMonth: Infinity,
    calendarPerMonth: Infinity,
    maxCalendarDays: 30,
    brandProfiles: 3,
    csvExport: true,
  },
}

export function getUserPlan(publicMetadata: Record<string, unknown>): PlanType {
  const plan = publicMetadata?.plan as PlanType | undefined
  const status = publicMetadata?.subscriptionStatus as string | undefined

  // cancelled = user cancelled but period not ended yet, keep their plan
  if (plan && (status === 'active' || status === 'on_trial' || status === 'cancelled')) {
    return plan
  }
  return 'free'
}
