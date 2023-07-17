import { InferResult } from "kysely"
import { db } from "./db"
import { GameraResponse } from "./gamera"

export const getQuestion = (id: string) =>
  db.selectFrom("questions").where("questions.id", "=", id).selectAll().limit(1)

const getQuestionQuery = getQuestion("")
export type Question = InferResult<typeof getQuestionQuery>[number]
export type Answer = Question["answer"]

export const getImageUrl = (question: { answer: Answer }) => {
  const answer = question.answer as GameraResponse
  const subject = answer.visual.summary.subject
  return subject.imageUrl
}
