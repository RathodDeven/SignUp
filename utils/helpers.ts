import { EventType } from './types'

export function shortenString(str: string, num: number): string {
  if (str.length <= num) {
    return str
  } else {
    return str.slice(0, num) + '...'
  }
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
