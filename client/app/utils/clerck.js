// clerk.js
import { ClerkProvider } from '@clerk/nextjs'

const ClerkWrapper = ({ children }) => {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      {children}
    </ClerkProvider>
  )
}

export default ClerkWrapper
