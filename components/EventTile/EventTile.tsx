import getIPFSLink from '@/utils/getIPFSLink'
import getStampFyiURL from '@/utils/getStampFyiURL'
import { shortenString } from '@/utils/helpers'
import { EventType } from '@/utils/types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { HiLocationMarker } from 'react-icons/hi'

const EventTile = ({
  id,
  eventInfo,
  hostedByAddr,
  dateTimeToShow
}: {
  id: string
  eventInfo: EventType
  hostedByAddr: string
  dateTimeToShow: number
}) => {
  // beutify the data from the epoch timestamp
  const date = new Date(dateTimeToShow * 1000)

  return (
    <Link className="no-underline" href={`/signup/${id}`} passHref>
      <div className="flex flex-row justify-between space-x-20 my-6">
        <div className="font-bold shrink-0 pt-1">
          <div className="text-p-text text-lg">
            {`${date.toLocaleDateString('default', {
              month: 'short'
            })} ${date.getDate()} ${date.getFullYear()}`}
          </div>

          {/* local time with am pm */}
          <div className="text-p-text text-md pb-2">
            {date.toLocaleTimeString('default', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            })}
          </div>

          {/* // day of the week */}
          <div className="text-s-text text-md">
            {date.toLocaleDateString('default', { weekday: 'long' })}
          </div>
        </div>

        {/* event card */}
        <div className="break-all w-full space-x-4 flex flex-row justify-between bg-s-text/10 backdrop-opacity-10  backdrop-blur-sm rounded-lg p-4 hover:shadow-2xl cursor-pointer">
          <div className="space-y-2">
            <div className="text-p-text text-xl font-bold pb-4">
              {eventInfo.name}
            </div>

            {/* hosted by */}
            <div className="text-s-text font-semibold text-sm flex flex-row items-center">
              <Image
                src={getStampFyiURL(hostedByAddr)}
                width={20}
                height={20}
                alt={'hosted by image'}
              />
              <span className="pl-2">By {shortenString(hostedByAddr, 6)}</span>
            </div>

            {eventInfo.location && (
              <div className="text-s-text font-bold flex flex-row items-center">
                <HiLocationMarker />
                <span className="pl-2">{eventInfo.location}</span>
              </div>
            )}
          </div>

          {/* banner */}
          <img
            src={getIPFSLink(eventInfo.banner)}
            className="w-[200px] h-[100px] rounded-xl shadow-2xl object-cover"
          />
        </div>
      </div>
    </Link>
  )
}

export default EventTile
