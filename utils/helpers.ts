import { EventType } from './types'

export function shortenString(str: string, num: number): string {
  if (str.length <= num) {
    return str
  } else {
    return str.slice(0, num) + '...'
  }
}

export const isValidURL = (text: string): boolean => {
  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-zA-Z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-zA-Z\\d_]*)?$',
    'i' // fragment locator
  )
  return !!urlPattern.test(text)
}

export function decodedDataToEvent(
  decodedDataJson: string | undefined
): EventType | null {
  if (!decodedDataJson) return null
  const eventInfoArray = JSON.parse(decodedDataJson)

  const eventInfo = eventInfoArray.reduce((acc: any, curr: any) => {
    acc[curr.name] = curr.value.value
    return acc
  }, {})

  return eventInfo
}
