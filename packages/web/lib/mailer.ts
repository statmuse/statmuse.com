import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'

const sesClient = new SESv2Client()

export const sendSigninEmail = (to: string, url: string) =>
  sesClient.send(
    new SendEmailCommand({
      FromEmailAddress: 'StatMuse<hello@auth.statmuse.com>',
      Destination: {
        ToAddresses: [to],
      },
      Content: {
        Template: {
          TemplateName: 'auth_magic_link',
          TemplateData: JSON.stringify({ url }),
        },
      },
      EmailTags: [
        {
          Name: 'email_type',
          Value: 'auth',
        },
      ],
    }),
  )
