// app/actions/updateMetadata.ts
'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'

export async function updatePublicMetadata(data: Record<string, any>) {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('User not authenticated')
  }

  try {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    console.log('Current user data:', user)
    // const client = await clerkClient()
    await client.users.updateUser(userId, {
      publicMetadata: { ...user.publicMetadata, ...data }
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to update metadata:', error)
    throw new Error('Failed to update metadata')
  }
}