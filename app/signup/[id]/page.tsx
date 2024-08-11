'use client'

import { useGetAttestationLazyQuery, useGetAttestationQuery } from '@/generated'
import getIPFSLink from '@/utils/getIPFSLink'
import getStampFyiURL from '@/utils/getStampFyiURL'
import { decodedDataToEvent, isValidURL, shortenString } from '@/utils/helpers'
import Image from 'next/image'
import React from 'react'
import WalletAddress from '../../../components/reusable/WalletAddress'
import Markup from '../../../components/reusable/Lexical/Markup'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import { IoPricetagsOutline } from 'react-icons/io5'
import { IoTicketOutline } from 'react-icons/io5'
import { IoTimeOutline } from 'react-icons/io5'
import { ethers, toBigInt } from 'ethers'

const SignUpPage = ({ params }: { params: { id: string } }) => {
  const { data } = useGetAttestationQuery({
    variables: {
      where: {
        id: params.id
      }
    }
  })

  const eventInfo = decodedDataToEvent(data?.getAttestation?.decodedDataJson)

  console.log('eventInfo', eventInfo)
  // @ts-ignore
  console.log('eventInfo?.price', eventInfo?.price?.hex)

  if (!data || !eventInfo)
    return <div className="text-s-text font-bold">Loading...</div>

  const priceInEther = eventInfo?.price
    ? // @ts-ignore
      ethers.formatEther(toBigInt(eventInfo.price?.hex))
    : '0'

  console.log('priceInEther', priceInEther)

  return (
    <div>
      <div className="p-4 bg-p-bg/50 backdrop-opacity-10  backdrop-blur-xl rounded-xl shadow-2xl">
        <img
          className="w-full h-[370px] rounded-xl mb-4"
          src={getIPFSLink(eventInfo.banner)}
        />

        <div className="flex flex-col gap-y-2 p-4 space-y-2">
          <div className="text-2xl text-p-text font-bold">{eventInfo.name}</div>

          {eventInfo.description && (
            <Markup className="text-xl text-s-text font-semibold">
              {eventInfo.description}
            </Markup>
          )}
          {eventInfo?.location && (
            <div className="bg-s-bg rounded-xl px-4 py-3 start-center-row">
              <div className="-mb-1 mr-3">
                <HiOutlineLocationMarker className="text-s-text/40 text-2xl " />
              </div>
              <div className="text-s-text font-semibold">
                {isValidURL(eventInfo.location) ? (
                  <a
                    href={eventInfo.location}
                    target="_blank"
                    className="no-underline text-s-text hover:text-p-text transition-all"
                  >
                    {eventInfo.location}
                  </a>
                ) : (
                  shortenString(eventInfo.location, 50)
                )}
              </div>
            </div>
          )}
          {priceInEther != '0.0' && (
            <div className="bg-s-bg rounded-xl px-4 py-3 start-center-row">
              <div className="-mb-1 mr-3">
                <IoPricetagsOutline className="text-s-text/40 text-2xl " />
              </div>
              <div className="text-s-text font-semibold">
                {priceInEther} ETH
              </div>
            </div>
          )}
          {!!eventInfo.capacity && (
            <div className="bg-s-bg rounded-xl px-4 py-3 start-center-row">
              <div className="-mb-1 mr-3">
                <IoTicketOutline className="text-s-text/40 text-2xl " />
              </div>
              <div className="text-s-text font-semibold">
                {eventInfo.capacity} total capacity
              </div>
            </div>
          )}
          {Boolean(eventInfo?.end || eventInfo?.start) && (
            <div className="bg-s-bg rounded-xl px-4 py-3 start-center-row">
              <div className="-mb-1 mr-3">
                <IoTimeOutline className="text-s-text/40 text-2xl " />
              </div>
              <div className="text-s-text font-semibold">
                {eventInfo.start && (
                  <div className="flex flex-row items-center">
                    <span>
                      Start: {new Date(eventInfo.start * 1000).toLocaleString()}
                    </span>
                  </div>
                )}
                {eventInfo.end && (
                  <div className="flex flex-row items-center">
                    <span>
                      End: {new Date(eventInfo.end * 1000).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* hosted by */}
          <div className="text-s-text font-bold text-md flex flex-row items-center">
            <Image
              src={getStampFyiURL(String(data?.getAttestation?.attester))}
              width={30}
              height={30}
              className="rounded-full"
              alt={'hosted by image'}
            />
            <span className="pl-2">
              Create by{' '}
              <WalletAddress
                walletAdderss={String(data?.getAttestation?.attester)}
                showShort={false}
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
