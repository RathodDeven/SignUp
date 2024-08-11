'use client'
import React from 'react'
import { useGetAttestationQuery } from '../../generated'
import { decodedDataToEvent } from '../../utils/helpers'
import EventTile from '../EventTile/EventTile'

const EventTileFromAttestationID = ({
  attestationID
}: {
  attestationID: string
}) => {
  const { data } = useGetAttestationQuery({
    variables: {
      where: {
        id: attestationID
      }
    }
  })
  const eventInfo = decodedDataToEvent(data?.getAttestation?.decodedDataJson)

  const attestation = data?.getAttestation

  if (!attestation || !eventInfo) return null

  return (
    <EventTile
      key={attestation.id}
      id={attestation.id}
      eventInfo={eventInfo!}
      hostedByAddr={attestation.attester}
      dateTimeToShow={attestation.time}
    />
  )
}

export default EventTileFromAttestationID
