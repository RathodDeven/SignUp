'use client'

import EventTile from '@/components/EventTile/EventTile'
import { useAttestationsQuery } from '@/generated'
import { ATTENDING_EVENT_SCHEMA } from '@/utils/config'
import { decodedDataToEvent } from '@/utils/helpers'
import React from 'react'
import { useAccount } from 'wagmi'

const SignedUpEventPage = () => {
  const { address } = useAccount()

  const { data } = useAttestationsQuery({
    variables: {
      where: {
        schema: {
          is: {
            schema: {
              equals: ATTENDING_EVENT_SCHEMA
            }
          }
        }
      }
    }
  })
  return (
    <div>
      <div className="text-p-text text-2xl font-bold">Signed Up</div>

      {data?.attestations.map((attestation) => {
        const eventInfo = decodedDataToEvent(attestation.decodedDataJson)

        return (
          <EventTile
            key={attestation.id}
            id={attestation.id}
            eventInfo={eventInfo!}
            hostedByAddr={attestation.attester}
            dateTimeToShow={attestation.time}
          />
        )
      })}
    </div>
  )
}

export default SignedUpEventPage
