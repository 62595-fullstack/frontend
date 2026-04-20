import type { Metadata } from 'next'
import Signup from './Signup'

export const metadata: Metadata = {
  title: 'Sign up',
}

export default function Page() {
  return <Signup />
}
