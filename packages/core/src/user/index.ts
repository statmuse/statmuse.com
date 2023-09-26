import { randomUUID } from 'crypto'
import { db } from '../db'

export const create = async (email: string, visitorId: string) => {
  const existing = await fromEmail(email)
  if (existing) return existing

  const user = await db.transaction().execute(async (trx) => {
    const user = await trx
      .insertInto('users')
      .values({
        id: randomUUID(),
        email,
        email_confirm_token: randomUUID(),
        username: email,
        has_completed_signup: false,
        inserted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .returningAll()
      .executeTakeFirst()

    await trx
      .insertInto('users_visitors')
      .values({
        id: randomUUID(),
        user_id: user!.id,
        visitor_id: visitorId,
        inserted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .returningAll()
      .executeTakeFirst()

    return user
  })

  console.log('user created', JSON.stringify(user, undefined, 2))
  return user
}

export const get = async (id: string) =>
  db
    .selectFrom('users')
    .where('users.id', '=', id)
    .selectAll()
    .executeTakeFirst()

export const fromEmail = async (email: string) =>
  db
    .selectFrom('users')
    .where('users.email', '=', email)
    .selectAll()
    .executeTakeFirst()

export async function deleteUser(id: string) {
  console.log('Deleting user asks with id: ' + id)

  const transaction = await db.transaction().execute(async (trx) => {
    const updateAskEvents = await trx
      .updateTable('ask_events')
      .where('user_id', '=', id)
      .set({ user_id: null })
      .executeTakeFirst()

    console.log(
      'updateAskEvents',
      JSON.stringify(updateAskEvents, undefined, 2)
    )

    const deleteAsksResponse = await trx
      .deleteFrom('asks_users')
      .where('user_id', '=', id)
      .executeTakeFirst()

    console.log(
      'deleteAsksResponse',
      JSON.stringify(deleteAsksResponse, undefined, 2)
    )

    console.log('Deleting user with id: ' + id)
    return await trx.deleteFrom('users').where('id', '=', id).executeTakeFirst()
  })

  console.log('transaction', JSON.stringify(transaction, undefined, 2))
}

export async function updateEmail(id: string, email: string) {
  console.log(`Updating email address to ${email} for user with id: ${id}`)

  return db
    .updateTable('users')
    .set({ email })
    .where('users.id', '=', id)
    .returningAll()
    .executeTakeFirst()
}
