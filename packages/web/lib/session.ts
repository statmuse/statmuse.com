import { createSessionBuilder } from 'sst/node/future/auth'
import type { sessions } from '@statmuse/functions/session'
import type { APIContext, AstroGlobal } from 'astro'
import { fromRequest } from '@lib/visitor'
import type { AstroComponentFactory } from 'astro/runtime/server/index.js'

const builder = createSessionBuilder<typeof sessions.$type>()
const SESSION_COOKIE = 'sm_session'

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

export const set = (context: Context, token: string) => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const local = context.url.hostname === 'localhost'
  context.cookies.set(SESSION_COOKIE, token, {
    path: '/',
    domain: local ? undefined : 'statmuse.com',
    expires: tomorrow,
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
