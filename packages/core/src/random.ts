const alphaNumericCharacters =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

/**
 * Random alphanumeric string of n length
 */
export const randomAlphanumericString = (length: number = 8): string => {
  if (length === 1) {
    return alphaNumericCharacters.charAt(
      Math.floor(Math.random() * alphaNumericCharacters.length)
    )
  }

  return Array.from({ length })
    .map((_) => randomAlphanumericString(1))
    .join('')
}

/**
 * Random numeric string
 */
export const randomNumericString = (length: number = 8): string => {
  return Array.from({ length })
    .map((_) => Math.floor(Math.random() * 9 + 1).toString())
    .join('')
}
