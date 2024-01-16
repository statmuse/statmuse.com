import { type StackContext, Config } from 'sst/constructs'

export function Secrets({ stack }: StackContext) {
  const secrets = Config.Secret.create(
    stack,
    'STRIPE_SECRET',
    'STRIPE_WEBHOOK_SECRET',
    'STRIPE_PRICE_ID',
    'ELASTICSEARCH_CREDENTIALS',
    'SEGMENT_WRITE_KEY',
    'SENDGRID_API_KEY',
    'HONEYBADGER_API_KEY',
    'GAMERA_API_KEY',
  )

  return secrets
}
