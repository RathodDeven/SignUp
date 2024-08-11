'use client'

import EventTile from '@/components/EventTile/EventTile'
import { SortOrder, useAttestationsQuery } from '@/generated'
import { decodedDataToEvent } from '@/utils/helpers'
import useInfoBasedOnChain from '../utils/hooks/useInfoBasedOnChain'

export default function Home() {
  const { CREATING_EVENT_SCHEMA_UID } = useInfoBasedOnChain()
  const { data } = useAttestationsQuery({
    variables: {
      where: {
        schemaId: {
          equals: CREATING_EVENT_SCHEMA_UID
        }
      },
      orderBy: {
        timeCreated: SortOrder.Desc
      }
    }
  })

  return (
    <div>
      <div className="text-p-text text-2xl font-bold">Sign Ups</div>

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
