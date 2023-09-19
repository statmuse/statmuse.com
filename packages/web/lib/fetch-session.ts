import type { Session } from '@lib/session'

type SessionEvent = CustomEvent<Session>
const isSessionEvent = (e: Event): e is SessionEvent => 'detail' in e

const target = new EventTarget()
let session: Session
let inFlight = false

export const fetchSession = async () => {
  if (session) return session
  if (inFlight)
    return new Promise<Session>((resolve) => {
      const listener = (e: Event) => {
        if (isSessionEvent(e)) {
          resolve(e.detail)
          target.removeEventListener('success', listener)
        }
      }
      target.addEventListener('success', listener)
    })
  inFlight = true
  session = await fetch('/auth/session').then((r) => r.json())
  target.dispatchEvent(new CustomEvent('success', { detail: session }))
  return session
}
