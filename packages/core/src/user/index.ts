import { randomUUID } from 'crypto'
import { db } from '../db'
export * from './user.sql'
export * from './indentity.sql'
export * from './session.sql'
export * from './story.sql'
export * from './follow.sql'

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
  console.log('Deleting user with id: ' + id)

  const transaction = await db.transaction().execute(async (trx) => {
    const updateMusings = trx
      .updateTable('musings')
      .where('author_id', '=', id)
      .set({ author_id: null })
      .execute()

    const updateQuestions = trx
      .updateTable('questions')
      .where('user_id', '=', id)
      .set({ user_id: null })
      .execute()

    const updateReferredUsers = trx
      .updateTable('users')
      .where('referrer_id', '=', id)
      .set({ referrer_id: null })
      .execute()

    const updateReferredVisitors = trx
      .updateTable('visitors')
      .where('last_referrer_id', '=', id)
      .set({ last_referrer_id: null })
      .execute()

    await Promise.all([
      updateMusings,
      updateQuestions,
      updateReferredUsers,
      updateReferredVisitors,
    ])

    const deleteAskEvents = trx
      .deleteFrom('ask_events')
      .where('user_id', '=', id)
      .execute()

    const deleteAsksUsers = trx
      .deleteFrom('asks_users')
      .where('user_id', '=', id)
      .execute()

    const deleteFinanceAskEvents = trx
      .deleteFrom('finance_ask_events')
      .where('user_id', '=', id)
      .execute()

    const deleteFinanceAsksUsers = trx
      .deleteFrom('finance_asks_users')
      .where('user_id', '=', id)
      .execute()

    const deleteIdentities = trx
      .deleteFrom('identities')
      .where('user_id', '=', id)
      .execute()

    const deleteUsersVisitors = trx
      .deleteFrom('users_visitors')
      .where('user_id', '=', id)
      .execute()

    const deleteSessions = trx
      .deleteFrom('sessions')
      .where('user_id', '=', id)
      .execute()

    const deleteStories = trx
      .deleteFrom('stories')
      .where('user_id', '=', id)
      .execute()

    const deleteFollowers = trx
      .deleteFrom('follows')
      .where('follower_id', '=', id)
      .execute()

    const deleteFollowed = trx
      .deleteFrom('follows')
      .where('followed_id', '=', id)
      .execute()

    await Promise.all([
      deleteAskEvents,
      deleteAsksUsers,
      deleteFinanceAskEvents,
      deleteFinanceAsksUsers,
      deleteIdentities,
      deleteUsersVisitors,
      deleteStories,
      deleteSessions,
      deleteFollowers,
      deleteFollowed,
    ])

    return await trx.deleteFrom('users').where('id', '=', id).executeTakeFirst()
  })

  console.log('transaction', JSON.stringify(transaction, undefined, 2))
}

export async function updateEmail(id: string, email: string) {
  console.log(`Updating email address to ${email} for user with id: ${id}`)

  return db
    .updateTable('users')
    .set({ email, username: email })
    .where('users.id', '=', id)
    .returningAll()
    .executeTakeFirst()
}
