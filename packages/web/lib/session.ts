import { createSessionBuilder } from '@lib/jwt-builder'
import type { Visitor as VisitorT } from '@statmuse/core/visitor/visitor.sql'
import type { APIContext, AstroGlobal } from 'astro'
import { fromRequest } from '@lib/visitor'
import type { AstroComponentFactory } from 'astro/runtime/server/index.js'
import type { User } from '@statmuse/core/user'

const builder = createSessionBuilder<{
  visitor: {
    id: string
    bot?: boolean
    cookieStatus: VisitorT['cookie_status']
    origin: VisitorT['origin_name']
  }
  user: {
    id: string
    email: string
    visitorId: string
    upgrade?: boolean
    updated?: boolean
    cookieStatus: VisitorT['cookie_status']
    origin: VisitorT['origin_name']
    subscriptionStatus?: string
  }
}>()
const SESSION_COOKIE =
  import.meta.env.PUBLIC_STAGE === 'production'
    ? 'sm_session'
    : `sm_session-${import.meta.env.PUBLIC_STAGE}`

export type Session = ReturnType<typeof builder.verify>

export type Context =
  | APIContext
  | Readonly<
      AstroGlobal<
        Record<string, any>,
        AstroComponentFactory,
        Record<string, string | undefined>
      >
    >

export const get = ({ cookies }: Context) => {
  const cookie = cookies.get(SESSION_COOKIE)?.value
  if (!cookie) return undefined
  const verified = builder.verify(cookie)
  return verified
}

export const verify = (token: string) => {
  return builder.verify(token)
}

export const create = async (context: Context) => {
  try {
    const visitor = await fromRequest(context)
    if (context.locals) context.locals.visitor = visitor
    const token = builder.create('visitor', {
      id: visitor.id,
      bot: visitor.is_bot,
      cookieStatus: visitor.cookie_status,
      origin: visitor.origin_name,
    })
    set(context, token)
    return builder.verify(token)
  } catch (error) {
    console.error(error)
    const publicSession = builder.create('public', {})
    return builder.verify(publicSession)
  }
}

export const createUserSession = (context: Context, user: User) => {
  try {
    const visitor = context.locals.visitor
    const token = builder.create('user', {
      id: user.id,
      email: user.email,
      visitorId: visitor.id,
      upgrade: undefined,
      updated: undefined,
      cookieStatus: visitor.cookie_status,
      origin: visitor.origin_name,
      subscriptionStatus: user.stripe_subscription_status || undefined,
    })
    set(context, token)
    return builder.verify(token)
  } catch (error) {
    console.error(error)
    const publicSession = builder.create('public', {})
    return builder.verify(publicSession)
  }
}

export const set = (context: Context, token: string) => {
  const expires = new Date()
  expires.setDate(expires.getDate() + 90)

  const isLocal = context.url.hostname === 'localhost'
  const isStaging = context.url.hostname.includes('v2.statmuse.com')
  context.cookies.set(SESSION_COOKIE, token, {
    path: '/',
    domain: isLocal
      ? undefined
      : isStaging
      ? context.url.hostname
      : 'statmuse.com',
    expires,
    maxAge: 31536000,
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
  })
}

export const update = (context: Context, props: Session['properties']) => {
  const session = context.locals.session
  if (session) {
    const updateProps = {
      ...session.properties,
      ...props,
    }
    const token = builder.create(session.type, updateProps)
    set(context, token)
    context.locals.session.properties = updateProps
  }
}

export const clear = async (context: Context) => {
  context.cookies.delete(SESSION_COOKIE, { path: '/' })
  // create a new visitor session (using existing visitor)
  await create(context)
}
