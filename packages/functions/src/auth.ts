import { AuthHandler, CodeAdapter, LinkAdapter } from 'sst/node/future/auth'
import * as User from '@statmuse/core/user'
import * as Visitor from '@statmuse/core/visitor'
import type { Visitor as VisitorT } from '@statmuse/core/visitor/visitor.sql'
import { createSessionBuilder } from 'sst/node/future/auth'
import sendgrid from '@sendgrid/mail'
import contacts from '@sendgrid/client'
import { Config } from 'sst/node/config'

sendgrid.setApiKey(Config.SENDGRID_API_KEY)
sendgrid.setSubstitutionWrappers('%', '%')
contacts.setApiKey(Config.SENDGRID_API_KEY)

export const sessions = createSessionBuilder<{
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

export const handler = AuthHandler({
  sessions,
  providers: {
    email: LinkAdapter({
      async onLink(link, claims) {
        console.log('sending email to', claims.email)

        await sendgrid.send({
          templateId: 'b70dbadb-e0c9-47a1-a521-69ccf93f02d7',
          substitutions: {
            sign_in_token_url: link,
            sign_in_token_expires_in_minutes: '30',
          },
          to: claims.email,
          from: 'StatMuse <hello@statmuse.com>',
          subject: 'Sign in to StatMuse',
        })

        return {
          statusCode: 302,
          headers: {
            Location:
              process.env.AUTH_FRONTEND_URL +
              '/auth/confirm?' +
              new URLSearchParams({ email: claims.email }).toString(),
          },
        }
      },
    }),
  },
  async allowClient(clientID, redirect) {
    return true
  },
  onSuccess: async (input, response) => {
    const email: string = input.email
    if (!email) throw new Error('No email found')

    const visitorId: string | undefined = input.visitor
    if (!visitorId) throw new Error('No visitor id found')

    const updating: string | undefined = input.update

    const visitor = await Visitor.get(visitorId)
    let user = updating ? await User.get(updating) : await User.fromEmail(email)

    if (!user) {
      user = await User.create(email, visitorId)

      await contacts.request({
        url: '/v3/contactdb/recipients',
        method: 'POST',
        body: [{ email }],
      })
    }

    if (!user || !visitor) throw new Error('Unable to register new user')

    if (updating) {
      const updated = await User.updateEmail(user.id, email)
      if (updated) user = updated

      await contacts.request({
        url: '/v3/contactdb/recipients',
        method: 'POST',
        body: [{ email }],
      })
    }

    return response.session({
      type: 'user',
      properties: {
        id: user.id,
        email,
        visitorId: visitor.id,
        upgrade: input.upgrade === 'true' || undefined,
        updated: !!updating,
        cookieStatus: visitor.cookie_status,
        origin: visitor.origin_name,
        subscriptionStatus: user.stripe_subscription_status || undefined,
      },
    })
  },
  onError: async () => ({
    statusCode: 401,
  }),
})
