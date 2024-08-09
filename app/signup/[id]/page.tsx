'use client'

import { useGetAttestationLazyQuery, useGetAttestationQuery } from '@/generated'
import getIPFSLink from '@/utils/getIPFSLink'
import getStampFyiURL from '@/utils/getStampFyiURL'
import { decodedDataToEvent, shortenString } from '@/utils/helpers'
import Image from 'next/image'
import React from 'react'

const SignUpPage = ({ params }: { params: { id: string } }) => {
  const { data } = useGetAttestationQuery({
    variables: {
      where: {
        id: params.id
      }
    }
  })

  console.log('data', data)

  const eventInfo = decodedDataToEvent(data?.getAttestation?.decodedDataJson)

  if (!data || !eventInfo)
    return <div className="text-s-text font-bold">Loading...</div>

  return (
    <div>
      <div className="p-4 bg-p-bg/50 backdrop-opacity-10  backdrop-blur-xl rounded-xl shadow-2xl">
        <img
          className="w-full h-[370px] rounded-xl mb-4"
          src={getIPFSLink(eventInfo.banner)}
        />
        <div className="flex flex-col gap-y-2 p-4">
          <div className="text-2xl text-p-text font-bold">{eventInfo.name}</div>
          {/* hosted by */}
          <div className="text-s-text font-bold text-md flex flex-row items-center">
            <Image
              src={getStampFyiURL(String(data?.getAttestation?.attester))}
              width={20}
              height={20}
              alt={'hosted by image'}
            />
            <span className="pl-2">
              Create by{' '}
              {shortenString(String(data?.getAttestation?.attester), 6)}
            </span>
          </div>

          {/* todo more info */}
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
