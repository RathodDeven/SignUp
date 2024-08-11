'use client'

import { useAttestationsQuery } from '@/generated'
import { ATTENDING_EVENT_SCHEMA } from '@/utils/config'
import React from 'react'
import { useAccount } from 'wagmi'
import EventTileFromAttestationID from '../../components/SignedUpPage/EventTileFromIpfsUrl'

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
        },
        attester: {
          equals: address
        }
      }
    }
  })

  return (
    <div>
      <div className="text-p-text text-2xl font-bold">Signed Up</div>

      {data?.attestations.map((attestation) => {
        return (
          <EventTileFromAttestationID
            key={attestation?.id}
            attestationID={attestation?.refUID}
          />
        )
      })}
    </div>
  )
}

export default SignedUpEventPage
