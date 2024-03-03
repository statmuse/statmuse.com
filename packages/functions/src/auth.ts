import { AuthHandler, CodeAdapter } from 'sst/node/future/auth'
import * as User from '@statmuse/core/user'
import * as Visitor from '@statmuse/core/visitor'
import sendgrid from '@sendgrid/mail'
import contacts from '@sendgrid/client'
import { Config } from 'sst/node/config'
import { sessions } from './session'

sendgrid.setApiKey(Config.SENDGRID_TRANSACTIONAL_API_KEY)
contacts.setApiKey(Config.SENDGRID_API_KEY)

export const handler = AuthHandler({
  sessions,
  providers: {
    email: CodeAdapter({
      async onCodeRequest(code, claims) {
        console.log('sending email to', claims.email)

        await sendgrid.send({
          templateId: 'd-dcd901efab0544ed841ce254e900832a',
          dynamicTemplateData: {
            pin_code: code,
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
              '/auth/code?' +
              new URLSearchParams({
                email: claims.email,
                update: claims.update,
              }).toString(),
            'Access-Control-Allow-Origin': '*',
          },
        }
      },
      async onCodeInvalid() {
        return {
          statusCode: 302,
          headers: {
            Location:
              process.env.AUTH_FRONTEND_URL + '/auth/code?error=invalid_code',
            'Access-Control-Allow-Origin': '*',
          },
        }
      },
    }),
  },
  callbacks: {
    auth: {
      async allowClient(_clientID, _redirect) {
        return true
      },
      success: async (input, response) => {
        const email: string = input.claims.email
        if (!email) throw new Error('No email found')

        const visitorId: string | undefined = input.claims.visitor
        if (!visitorId) throw new Error('No visitor id found')

        const updating: string | undefined = input.claims.update

        const visitor = await Visitor.get(visitorId)
        let user = updating
          ? await User.get(updating)
          : await User.fromEmail(email)

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
            upgrade: input.claims.upgrade === 'true' || undefined,
            updated: !!updating,
            cookieStatus: visitor.cookie_status,
            origin: visitor.origin_name,
            subscriptionStatus: user.stripe_subscription_status || undefined,
          },
        })
      },
      error: async () => ({
        statusCode: 401,
      }),
    },
  },
})
