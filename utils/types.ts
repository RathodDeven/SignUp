import { BigNumberish } from 'ethers'

export type EventType = {
  name: string
  location: string
  attestText: string
  schemaId: string
  description: string
  banner: string
  start: number
  end: number
  capacity: number
  price: number
  eventInfoUrl: string
}
