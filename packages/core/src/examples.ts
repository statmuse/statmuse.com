import { Database, db } from "./db"
import { OperandValueExpressionOrList, sql } from "kysely"

export const listLatestIdsPerLeague = async (
  type: OperandValueExpressionOrList<Database, "examples", "examples.type">,
  league?: string,
  n = 1
) => {
  const records = await db
    .selectFrom((eb) => {
      let query = eb
        .selectFrom("examples")
        .innerJoin("leagues", "leagues.id", "examples.league_id")
        .selectAll('examples')
        .select(
          sql<number>`ROW_NUMBER() OVER (PARTITION BY examples.type, examples.league_id ORDER BY examples.position ASC, examples.inserted_at DESC)`.as(
            "row"
          )
        )

        if (league) {
          query = query.where('leagues.name', '=', league)
        }

        return query.as('e')
  }

    )
    .where("e.type", "=", type)
    .where("e.row", "<=", n)
    .select("e.id")
    .execute()

  return records.map((r) => r.id)
}

export const listOnboarding = async (league?: string, n: number = 2) => db
  .selectFrom("examples")
  .innerJoin("questions", "questions.id", "examples.question_id")
  .innerJoin("leagues", "leagues.id", "examples.league_id")
  .where("examples.type", "=", "onboarding")
  .where("examples.is_published", "=", true)
  .where("examples.id", "in", await listLatestIdsPerLeague("onboarding", league, n))
  .orderBy("examples.type", "asc")
  .orderBy("leagues.name", "asc")
  .orderBy("examples.position", "asc")
  .orderBy("examples.inserted_at", "desc")
  .limit(12)
  .selectAll("examples")
  .selectAll("questions")
  .execute()

export type Example = Awaited<ReturnType<typeof listOnboarding>>[number]