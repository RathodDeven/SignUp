'use client'

import EventTile from '@/components/EventTile/EventTile'
import { useAttestationsQuery } from '@/generated'
import { decodedDataToEvent } from '@/utils/helpers'
import React from 'react'
import { useAccount } from 'wagmi'
import useInfoBasedOnChain from '../../utils/hooks/useInfoBasedOnChain'

const CreatePage = () => {
  const { address } = useAccount()
  const { CREATING_EVENT_SCHEMA_UID } = useInfoBasedOnChain()

  const { data } = useAttestationsQuery({
    variables: {
      where: {
        attester: {
          equals: address
        },
        schemaId: {
          equals: CREATING_EVENT_SCHEMA_UID
        }
      }
    },
    skip: !address
  })

  return (
    <div>
      <div className="text-p-text text-2xl font-bold">Created SignUps</div>

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

export default CreatePage
