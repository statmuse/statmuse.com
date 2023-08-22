import { createSessionBuilder } from 'sst/node/future/auth'
import type { sessions } from '@statmuse/functions/auth'
import type { APIContext } from 'astro'
import { fromRequest } from '@lib/visitor'
import type { Visitor } from '@statmuse/core/visitor'
import type { User } from '@statmuse/core/user'

const builder = createSessionBuilder<typeof sessions.$type>()
const SESSION_COOKIE = 'sm_session'

export type PublicSession = {
  type: 'public'
  properties: {}
}

export type VisitorSession = {
  type: 'visitor'
  properties: {
    visitor: Visitor
  }
}

export type UserSession = {
  type: 'user'
  properties: {
    user: User
    visitor: Visitor
  }
}

export type Session = PublicSession | VisitorSession | UserSession

export const get = ({ cookies }: APIContext): Session | undefined => {
  const cookie = cookies.get(SESSION_COOKIE)?.value
  if (!cookie) return undefined
  return builder.verify(cookie)
}

export const verify = (token: string): Session | undefined => {
  return builder.verify(token)
}

export const create = async (context: APIContext): Promise<Session> => {
  const visitor = await fromRequest(context)
  const token = builder.create('visitor', { visitor })
  set(context, token)
  return builder.verify(token)
}

export const set = (context: APIContext, token: string) => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const local = context.url.hostname === 'localhost'
  context.cookies.set(SESSION_COOKIE, token, {
    path: '/',
    domain: local ? undefined : `${context.url.hostname}`,
    expires: tomorrow,
    maxAge: 31536000,
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
  })
}

export const clear = async (context: APIContext) => {
  context.cookies.delete(SESSION_COOKIE, { path: '/' })
  // create a new visitor session (using existing visitor)
  await create(context)
}
