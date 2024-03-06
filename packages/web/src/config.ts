export const ANSWER_CARDS_ENABLED =
  process.env.NODE_ENV === 'development' ||
  process.env.ANSWER_CARDS_ENABLED === 'true'
