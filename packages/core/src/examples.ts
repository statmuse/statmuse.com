import { Database, db } from "./db"
import { InferResult, OperandValueExpressionOrList, sql } from "kysely"

export const listLatestIdsPerLeague = async (
  type: OperandValueExpressionOrList<Database, "examples", "examples.type">,
  n = 1
) => {
  const records = await db
    .selectFrom((eb) =>
      eb
        .selectFrom("examples")
        .selectAll()
        .select(
          sql<number>`ROW_NUMBER() OVER (PARTITION BY examples.type, examples.league_id ORDER BY examples.position ASC, examples.inserted_at DESC)`.as(
            "row"
          )
        )
        .as("e")
    )
    .where("e.type", "=", type)
    .where("e.row", "<=", n)
    .select("e.id")
    .execute()

  return records.map((r) => r.id)
}

export const listOnboarding = db
  .selectFrom("examples")
  .innerJoin("questions", "questions.id", "examples.question_id")
  .innerJoin("leagues", "leagues.id", "examples.league_id")
  .where("examples.type", "=", "onboarding")
  .where("examples.is_published", "=", true)
  .where("examples.id", "in", await listLatestIdsPerLeague("onboarding", 2))
  .orderBy("examples.type", "asc")
  .orderBy("leagues.name", "asc")
  .orderBy("examples.position", "asc")
  .orderBy("examples.inserted_at", "desc")
  .limit(12)
  .selectAll("examples")
  .selectAll("questions")

export type Example = InferResult<typeof listOnboarding>[number]
