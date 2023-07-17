import { db } from "./db"

export async function deleteUser(id: string) {
  console.log("Deleting user asks with id: " + id)

  const transaction = await db.transaction().execute(async (trx) => {
    const updateAskEvents = await trx
      .updateTable("ask_events")
      .where("user_id", "=", id)
      .set({ user_id: null })
      .executeTakeFirst()

    console.log(
      "updateAskEvents",
      JSON.stringify(updateAskEvents, undefined, 2)
    )

    const deleteAsksResponse = await trx
      .deleteFrom("asks_users")
      .where("user_id", "=", id)
      .executeTakeFirst()

    console.log(
      "deleteAsksResponse",
      JSON.stringify(deleteAsksResponse, undefined, 2)
    )

    console.log("Deleting user with id: " + id)
    return await trx.deleteFrom("users").where("id", "=", id).executeTakeFirst()
  })

  console.log("transaction", JSON.stringify(transaction, undefined, 2))
}
