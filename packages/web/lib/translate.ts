import {
  TranslateClient,
  TranslateTextCommand,
  type TranslateTextCommandInput,
} from '@aws-sdk/client-translate'

const client = new TranslateClient({
  region: 'us-east-1',
})

export async function translate(props: {
  text: string
  from?: string
  to?: string
}) {
  const input: TranslateTextCommandInput = {
    Text: props.text,
    SourceLanguageCode: props.from || 'auto',
    TargetLanguageCode: props.to || 'en',
  }

  const command = new TranslateTextCommand(input)
  const response = await client.send(command)

  return {
    text: response.TranslatedText ?? props.text,
    from: response.SourceLanguageCode,
    to: response.TargetLanguageCode,
  }
}

async function translateBatch(
  texts: string[],
  from: string = 'auto',
  to: string = 'en',
): Promise<Map<string, string>> {
  const batchSize = 10
  const translationsMap = new Map<string, string>()

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize)
    const translationPromises = batch.map((text) =>
      translate({ text, from, to }),
    )
    const results = await Promise.all(translationPromises)
    for (let i = 0; i < results.length; i++) {
      const result = results[i]
      const text = batch[i]
      translationsMap.set(text, result.text)
    }
  }

  return translationsMap
}

function matchesPattern(path: string[], pattern: string): boolean {
  const regexPattern = pattern.replace(/\./g, '\\.').replace(/\*/g, '[^\\.]+')
  const regex = new RegExp(`^${regexPattern}$`)
  return regex.test(path.join('.'))
}

export async function translateObject(
  obj: any,
  fromLang: string,
  toLang: string,
  keysToTranslate: (string | { key: string; excluded?: string[] })[],
): Promise<any> {
  const stringsToTranslate = new Set<string>()

  function collectStrings(obj: any, path: string[] = []): void {
    if (typeof obj === 'string') {
      if (
        keysToTranslate.some((k) => {
          if (typeof k === 'string') return matchesPattern(path, k)
          return matchesPattern(path, k.key) && !k.excluded?.includes(obj)
        })
      ) {
        stringsToTranslate.add(obj)
      }
    } else if (Array.isArray(obj)) {
      obj.forEach((item, index) => collectStrings(item, [...path, `${index}`]))
    } else if (obj && typeof obj === 'object') {
      Object.entries(obj).forEach(([key, value]) =>
        collectStrings(value, [...path, key]),
      )
    }
  }

  async function applyTranslations(
    obj: any,
    path: string[] = [],
    translationsMap: Map<string, string>,
  ): Promise<any> {
    if (typeof obj === 'string') {
      if (
        keysToTranslate.some((k) => {
          if (typeof k === 'string') return matchesPattern(path, k)
          return matchesPattern(path, k.key) && !k.excluded?.includes(obj)
        })
      ) {
        return translationsMap.get(obj) ?? obj
      }
      return obj
    } else if (Array.isArray(obj)) {
      return Promise.all(
        obj.map((item, index) =>
          applyTranslations(item, [...path, `${index}`], translationsMap),
        ),
      )
    } else if (obj && typeof obj === 'object') {
      const result: Record<string, any> = {}
      for (const [key, value] of Object.entries(obj)) {
        result[key] = await applyTranslations(
          value,
          [...path, key],
          translationsMap,
        )
      }
      return result
    }
    return obj
  }

  collectStrings(obj)

  const translationsMap = await translateBatch(
    Array.from(stringsToTranslate),
    fromLang,
    toLang,
  )

  return applyTranslations(obj, [], translationsMap)
}
