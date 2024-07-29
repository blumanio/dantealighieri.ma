// clerk.js
import { ClerkProvider } from '@clerk/nextjs'

const ClerkWrapper = ({ children }) => {
  return <ClerkProvider>{children}</ClerkProvider>
}

export default ClerkWrapper
