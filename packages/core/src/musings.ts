import { db } from "./db"
import { InferResult } from "kysely"

export const getMusing = (musing?: string) =>
  db
    .selectFrom("musings")
    .innerJoin("questions", "questions.id", "musings.question_id")
    .innerJoin("leagues", "leagues.id", "musings.league_id")
    .where("musings.friendly_id", "=", musing || null)
    .selectAll()
    .limit(1)

const getMusingQuery = getMusing()
export type Musing = InferResult<typeof getMusingQuery>[number]

export const listLatestMusings = db
  .selectFrom("musings")
  .where("musings.content_type", "=", "latest-stats")
  .where((eb) =>
    eb.or([
      eb.cmpr("musings.publish_at", "=", null),
      eb.cmpr("musings.publish_at", "<=", new Date()),
    ])
  )
  .limit(20)
  .orderBy("musings.publish_at", "desc")
  .selectAll()

export type LatestMusing = InferResult<typeof listLatestMusings>[number]
