import { InferResult } from "kysely"
import { db } from "./db"

export const getQuestion = (id: string) =>
  db.selectFrom("questions").where("questions.id", "=", id).selectAll().limit(1)

const getQuestionQuery = getQuestion("")
export type Question = InferResult<typeof getQuestionQuery>[number]
export type Answer = Question["answer"]
