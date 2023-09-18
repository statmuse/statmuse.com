import { AuthHandler, CodeAdapter } from 'sst/node/future/auth'
import * as User from '@statmuse/core/user'
import * as Visitor from '@statmuse/core/visitor'
import { createSessionBuilder } from 'sst/node/future/auth'
import sendgrid from '@sendgrid/mail'
import contacts from '@sendgrid/client'
import { Config } from 'sst/node/config'

sendgrid.setApiKey(Config.SENDGRID_API_KEY)
contacts.setApiKey(Config.SENDGRID_API_KEY)

export const sessions = createSessionBuilder<{
  visitor: { id: string }
  user: {
    id: string
    email: string
    visitorId: string
    upgrade?: boolean
  }
}>()

export const handler = AuthHandler({
  sessions,
  providers: {
    email: CodeAdapter({
      async onCodeRequest(code, claims) {
        console.log('sending email to', claims.email)
        console.log(claims)

        await sendgrid.send({
          to: claims.email,
          from: 'StatMuse <hello@statmuse.com>',
          subject: 'StatMuse Pin Code: ' + code,
          text: `Your pin code is ${code}`,
          html: `Your pin code is <strong>${code}</strong>`,
        })

        return {
          statusCode: 302,
          headers: {
            Location:
              process.env.AUTH_FRONTEND_URL +
              '/auth/code?' +
              new URLSearchParams({ email: claims.email }).toString(),
          },
        }
      },
      async onCodeInvalid() {
        return {
          statusCode: 302,
          headers: {
            Location:
              process.env.AUTH_FRONTEND_URL + '/auth/code?error=invalid_code',
          },
        }
      },
    }),
  },
  async clients() {
    return { web: '' }
  },
  onSuccess: async (input, response) => {
    const email: string = input.claims.email
    if (!email) throw new Error('No email found')

    const visitorId: string | undefined = input.claims.visitor
    if (!visitorId) throw new Error('No visitor id found')

    const visitor = await Visitor.get(visitorId)
    let user = await User.fromEmail(email)

    if (!user) {
      user = await User.create(email, visitorId)

      await contacts.request({
        url: '/v3/contactdb/recipients',
        method: 'POST',
        body: [{ email }],
      })
    }

    if (!user || !visitor) throw new Error('Unable to register new user')

    return response.session({
      type: 'user',
      properties: {
        id: user.id,
        email: user.email,
        visitorId: visitor.id,
        upgrade: input.claims.upgrade === 'true' || undefined,
      },
    })
  },
  onError: async () => ({
    statusCode: 401,
  }),
})
