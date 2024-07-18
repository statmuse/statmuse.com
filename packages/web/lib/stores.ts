import { atom } from 'nanostores'
import type { Session } from '@lib/session'

export const session = atom<Session | undefined>()

export const isShareModalOpen = atom(false)
export const isNativeMobile = atom(false)
