import { EventType } from './types'

export function shortenString(str: string, num: number): string {
  if (str.length <= num) {
    return str
  } else {
    return str.slice(0, num) + '...'
  }
}

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

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

export function decodedData(
  decodedDataJson: string | undefined
): Record<string, string> {
  if (!decodedDataJson) return {}
  const eventInfoArray = JSON.parse(decodedDataJson)

  return eventInfoArray.reduce((acc: any, curr: any) => {
    acc[curr.name] = curr.value.value
    return acc
  }, {})
}

export function timeAgo(time: number): string {
  const now = Math.floor(Date.now() / 1000)
  const diff = now - time

  if (diff < 60) {
    return 'just now'
  } else if (diff < 3600) {
    return `${Math.floor(diff / 60)}m ago`
  } else if (diff < 86400) {
    return `${Math.floor(diff / 3600)}h ago`
  } else {
    return `${Math.floor(diff / 86400)}d ago`
  }
}
