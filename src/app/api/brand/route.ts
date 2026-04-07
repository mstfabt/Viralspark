import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const brand = await req.json()
  const client = await clerkClient()

  const user = await client.users.getUser(userId)
  const existingMetadata = user.publicMetadata as Record<string, unknown>

  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      ...existingMetadata,
      brand: {
        name: brand.name || '',
        sector: brand.sector || '',
        audience: brand.audience || '',
        tone: brand.tone || '',
        notes: brand.notes || '',
      },
    },
  })

  return NextResponse.json({ success: true })
}
