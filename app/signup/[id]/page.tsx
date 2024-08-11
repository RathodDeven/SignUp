'use client'

import {
  SortOrder,
  useAttestationsQuery,
  useGetAttestationLazyQuery,
  useGetAttestationQuery
} from '@/generated'
import getIPFSLink from '@/utils/getIPFSLink'
import getStampFyiURL from '@/utils/getStampFyiURL'
import {
  decodedDataToEvent,
  isValidURL,
  shortenString,
  sleep,
  timeAgo
} from '@/utils/helpers'
import Image from 'next/image'
import React from 'react'
import WalletAddress from '../../../components/reusable/WalletAddress'
import Markup from '../../../components/reusable/Lexical/Markup'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import { IoPricetagsOutline } from 'react-icons/io5'
import { IoTicketOutline } from 'react-icons/io5'
import { IoTimeOutline } from 'react-icons/io5'
import { ethers, toBigInt } from 'ethers'
import useInfoBasedOnChain from '../../../utils/hooks/useInfoBasedOnChain'
import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk'
import { useEthersSigner } from '../../../utils/hooks/useEthersSigner'
import { ATTENDING_EVENT_SCHEMA } from '../../../utils/config'
import toast from 'react-hot-toast'
import { useAccount } from 'wagmi'

const SignUpPage = ({ params }: { params: { id: string } }) => {
  const signer = useEthersSigner()
  const { address } = useAccount()

  const { EAS_CONTRACT_ADDRESS, EAS_EXPLORER_URL } = useInfoBasedOnChain()

  const { data, loading: eventInfoLoading } = useGetAttestationQuery({
    variables: {
      where: {
        id: params.id
      }
    }
  })

  const eventInfo = decodedDataToEvent(data?.getAttestation?.decodedDataJson)

  const {
    data: attendingAttestations,
    loading: attestersInfoLoading,
    refetch
  } = useAttestationsQuery({
    variables: {
      where: {
        schemaId: {
          equals: eventInfo?.schemaId
        },
        refUID: {
          equals: data?.getAttestation?.id
        }
      },
      orderBy: {
        timeCreated: SortOrder.Desc
      }
    },
    fetchPolicy: 'no-cache',
    skip: !data?.getAttestation?.id
  })

  const myAttestation = attendingAttestations?.attestations.find(
    (attestation) => attestation.attester === address
  )

  const isAttending = Boolean(myAttestation)

  if (!data || !eventInfo)
    return <div className="text-s-text font-bold">Loading...</div>

  const priceInEther = eventInfo?.price
    ? // @ts-ignore
      ethers.formatEther(toBigInt(eventInfo.price?.hex))
    : '0'

  const attestAttendingEvent = async () => {
    const eas = new EAS(EAS_CONTRACT_ADDRESS)
    // @ts-ignore
    eas.connect(signer)

    const schemaEncoder = new SchemaEncoder(ATTENDING_EVENT_SCHEMA)

    const encodedData = schemaEncoder.encodeData([
      {
        name: 'AttendingEventIpfsUrl',
        type: 'string',
        value: eventInfo.eventInfoUrl
      }
    ])

    // to what schema we are attesting is added to the event data as well, because schema may be different in case of prices, capacity and date ranges events
    const schemaUID = eventInfo.schemaId

    console.log(
      'toBigInt(eventInfo.price?.hex) !== BigInt(0)',
      // @ts-ignore
      toBigInt(eventInfo.price?.hex) !== BigInt(0)
    )

    const tx = await eas.attest({
      data: {
        recipient: data?.getAttestation?.attester!,
        data: encodedData,
        refUID: data?.getAttestation?.id,
        revocable: false,
        // @ts-ignore
        value:
          // @ts-ignore
          toBigInt(eventInfo.price?.hex) !== BigInt(0)
            ? // @ts-ignore
              toBigInt(eventInfo.price?.hex)
            : undefined
      },
      schema: schemaUID
    })

    await tx.wait()

    await sleep(5000)

    await refetch()
  }

  if (eventInfoLoading || attestersInfoLoading)
    return <div className="text-s-text font-semibold">Loading...</div>

  return (
    <div className="space-y-8">
      <div className="p-4 bg-p-bg/50 backdrop-opacity-10  backdrop-blur-xl rounded-xl shadow-2xl">
        <img
          alt="banner"
          className="w-full h-[370px] rounded-xl mb-4"
          src={getIPFSLink(eventInfo.banner)}
        />

        <div className="flex flex-col gap-y-2 p-4 space-y-2">
          <div className="text-2xl text-p-text font-bold">{eventInfo.name}</div>

          {eventInfo.description && eventInfo.description !== 'void' && (
            <Markup className="text-lg text-s-text">
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
          <div className="text-s-text  font-bold text-md flex flex-row items-center">
            <Image
              src={getStampFyiURL(String(data?.getAttestation?.attester))}
              width={30}
              height={30}
              className="rounded-full"
              alt={'hosted by image'}
            />
            <span className="pl-2">
              Created by{' '}
              <WalletAddress
                walletAdderss={String(data?.getAttestation?.attester)}
                showShort={false}
              />
            </span>
          </div>

          <div className="text-s-text gap-x-2 font-semibold start-center-row">
            <div>{'Event Proof :'}</div>
            <a
              href={`${EAS_EXPLORER_URL}/attestation/view/${data?.getAttestation?.id}`}
              target="_blank"
              className="text-s-text hover:text-p-text transition-all"
            >
              {' ' +
                data?.getAttestation?.id?.slice(0, 6) +
                '...' +
                data?.getAttestation?.id?.slice(-4)}
            </a>
          </div>

          {isAttending ? (
            <div className="bg-s-bg transition-all cursor-pointer rounded-xl px-4 py-3 center-row">
              <div className="-mb-1 mr-3">
                <img
                  src="/Logo_Without_Text.svg"
                  alt="logo"
                  className="w-8 h-8"
                />
              </div>
              <div className="text-p-text font-bold text-2xl">
                You are Signed Up for this 🎉
              </div>
            </div>
          ) : attendingAttestations &&
            !!eventInfo.capacity &&
            attendingAttestations?.attestations.length >= eventInfo.capacity ? (
            <div className="bg-s-bg transition-all cursor-pointer rounded-xl px-4 py-3 center-row">
              <div className="-mb-1 mr-3">
                <img
                  src="/Logo_Without_Text.svg"
                  alt="logo"
                  className="w-8 h-8"
                />
              </div>
              <div className="text-p-text font-bold text-2xl">
                Event capacity Reached
              </div>
            </div>
          ) : (
            <button
              onClick={async () => {
                await toast.promise(attestAttendingEvent(), {
                  loading: 'Attesting...',
                  success: 'Successfully signed up!',
                  error: 'Failed to sign up!'
                })
              }}
              className="bg-p-text/90 border-none disabled:bg-s-text hover:bg-p-text transition-all cursor-pointer rounded-xl px-4 py-3 center-row"
            >
              <div className="-mb-1 mr-3">
                <img
                  src="/Logo_Without_Text_Black.svg"
                  alt="logo"
                  className="w-8 h-8"
                />
              </div>
              <div className="text-black font-bold text-2xl">
                {eventInfo?.attestText}
              </div>
            </button>
          )}

          {isAttending && (
            <div className="text-s-text gap-x-2 font-semibold start-center-row">
              <div>{'Proof of sign up :'}</div>
              <a
                href={`${EAS_EXPLORER_URL}/attestation/view/${myAttestation?.id}`}
                target="_blank"
                className="text-s-text hover:text-p-text transition-all"
              >
                {myAttestation?.id?.slice(0, 6) +
                  '...' +
                  myAttestation?.id?.slice(-4)}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* list of attestors */}
      <div className="p-4 bg-p-bg/50 backdrop-opacity-10  backdrop-blur-xl rounded-xl shadow-2xl">
        <div className="text-2xl text-p-text/80 font-bold">Signed Up By</div>
        <div className="grid grid-cols-1 gap-4 mt-4">
          {attendingAttestations?.attestations.map((attestation) => (
            <div
              key={attestation.id}
              className="bg-s-bg/50 backdrop-opacity-10 rounded-xl p-4"
            >
              <div className="flex flex-row items-center gap-x-2">
                <Image
                  src={getStampFyiURL(attestation.attester)}
                  width={40}
                  height={40}
                  className="rounded-full"
                  alt={'hosted by image'}
                />
                <div>
                  <WalletAddress
                    walletAdderss={attestation.attester}
                    showShort={false}
                    className="text-md font-bold"
                  />
                  <div className="text-s-text font-semibold text-sm space-x-1 start-center-row">
                    <span>{timeAgo(attestation?.time)}</span>
                    <div className="bg-s-text rounded-full w-1 h-1" />
                    <span> Proof:</span>
                    <a
                      href={`${EAS_EXPLORER_URL}/attestation/view/${attestation.id}`}
                      target="_blank"
                      className="text-s-text hover:text-p-text transition-all"
                    >
                      {attestation.id?.slice(0, 6) +
                        '...' +
                        attestation.id?.slice(-4)}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
