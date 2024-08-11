'use client'

import AutoResizeTextarea from '@/components/reusable/AutoResizeTextarea'
import ToggleButton from '@/components/reusable/ToggleButton'
import uploadToIPFS from '@/utils/uploadToIPFS'
import clsx from 'clsx'
import { useRef, useState } from 'react'
import { FaSignature } from 'react-icons/fa'

import { HiOutlineLocationMarker } from 'react-icons/hi'
import { FaRegImage } from 'react-icons/fa'
import {
  ATTENDING_EVENT_SCHEMA,
  CREATING_EVENT_SCHEMA,
  DEFAULT_BANNER
} from '@/utils/config'
import getIPFSLink from '@/utils/getIPFSLink'
import {
  EAS,
  SchemaEncoder,
  SchemaRegistry,
  ZERO_ADDRESS
} from '@ethereum-attestation-service/eas-sdk'
import toast from 'react-hot-toast'
import { EventType } from '../../utils/types'
import { useEthersSigner } from '../../utils/hooks/useEthersSigner'
import { ethers } from 'ethers'
import useInfoBasedOnChain from '../../utils/hooks/useInfoBasedOnChain'
import { useRouter } from 'next/navigation'
import { sleep } from '../../utils/helpers'
import { EventResolverAbi } from '../../utils/contracts/eventResolverAbi'
import { EventResolverByteCode } from '../../utils/contracts/EventResolverByteCode'

export default function CreateEventPage() {
  const signer = useEthersSigner()
  const {
    SIMPLE_ATTENDING_EVENT_SCHEMA_UID,
    CREATING_EVENT_SCHEMA_UID,
    EAS_CONTRACT_ADDRESS,
    SCHEMA_REGISTRY
  } = useInfoBasedOnChain()

  const { push } = useRouter()
  const [isTimeLimited, setIsTimeLimited] = useState(false)
  const startDateInputRef = useRef<HTMLInputElement>(null)
  const startTimeInputRef = useRef<HTMLInputElement>(null)
  const endDateInputRef = useRef<HTMLInputElement>(null)
  const endTimeInputRef = useRef<HTMLInputElement>(null)

  const [isCapacityLimited, setIsCapacityLimited] = useState(false)
  const [capacity, setCapacity] = useState(10)

  const [isPaid, setIsPaid] = useState(false)
  const [price, setPrice] = useState('0.001')

  const [eventName, setEventName] = useState('')
  const [eventLocation, setEventLocation] = useState('')
  const [eventDisplayText, setEventDisplayText] = useState('Sign Up!')
  const [aboutEvent, setAboutEvent] = useState('')

  const DEFAUL_BANNER_URL = getIPFSLink(DEFAULT_BANNER)

  const [localBannerLink, setLocalBannerLink] = useState(DEFAUL_BANNER_URL)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [bannerIpfsUrl, setBannerIpfsUrl] = useState(DEFAULT_BANNER)

  const [creatingEvent, setCreatingEvent] = useState(false)

  const isCreateEventButtonDisabled =
    uploadingBanner ||
    eventName === '' ||
    eventLocation === '' ||
    eventDisplayText === '' ||
    creatingEvent

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    try {
      setUploadingBanner(true)
      const { files } = e.target
      const file = files?.[0]

      if (!file) return

      // local image preview link
      const localImageUrl = URL.createObjectURL(file)
      setLocalBannerLink(localImageUrl)

      // upload image to ipfs
      const response = await uploadToIPFS(file)
      const ipfsUrl = response?.url
      if (response && ipfsUrl) {
        setBannerIpfsUrl(ipfsUrl)
      }
    } catch (error) {
      setUploadingBanner(false)
      console.log(error)
    } finally {
      setUploadingBanner(false)
    }
  }

  const getResolverAddress = async (eventInfo: EventType): Promise<string> => {
    const initialMaxTickerCount = eventInfo.capacity || 0
    const initialPrice = eventInfo.price || '0'
    const initialStart = eventInfo.start || 0
    const initialEnd = eventInfo.end || 0
    const factory = new ethers.ContractFactory(
      EventResolverAbi,
      EventResolverByteCode,
      signer
    )

    const contract = await factory.deploy(
      EAS_CONTRACT_ADDRESS,
      initialMaxTickerCount,
      initialPrice,
      initialStart,
      initialEnd
    )

    const tx = await contract.waitForDeployment()

    return String(tx.target)
  }

  const registerAndGetSchemaId = async (
    resolverAddress: string
  ): Promise<string> => {
    const schemaRegistry = new SchemaRegistry(SCHEMA_REGISTRY)
    // @ts-ignore
    schemaRegistry.connect(signer)

    const schema = ATTENDING_EVENT_SCHEMA
    const revocable = true

    const transaction = await schemaRegistry.register({
      schema,
      resolverAddress,
      revocable
    })

    const schemaUid = await transaction.wait()

    return schemaUid
  }

  const getSchemaId = async (eventInfo: EventType): Promise<string> => {
    try {
      if (
        !eventInfo.start &&
        !eventInfo.end &&
        !eventInfo.capacity &&
        eventInfo.price === 0
      ) {
        return SIMPLE_ATTENDING_EVENT_SCHEMA_UID
      }

      const resolverAddress = await toast.promise(
        getResolverAddress(eventInfo),
        {
          loading: 'Deploying Resolver Contract',
          success: 'Resolver Contract Deployed',
          error: 'Error deploying Resolver Contract'
        }
      )
      if (!resolverAddress) {
        throw new Error('Resolver address is required')
      }

      const schemaUid = await toast.promise(
        registerAndGetSchemaId(resolverAddress),
        {
          loading: 'Registering Schema',
          success: 'Schema Registered',
          error: 'Error registering Schema'
        }
      )
      return schemaUid
    } catch (error) {
      toast.error(String(error))
      console.log(error)
    }
    return SIMPLE_ATTENDING_EVENT_SCHEMA_UID
  }

  const getIpfsUrlOfEvent = async (eventInfo: EventType): Promise<string> => {
    try {
      // convert eventInfo to json string and then to file
      const eventInfoJsonString = JSON.stringify(eventInfo)
      const eventInfoFile = new File([eventInfoJsonString], 'eventInfo.json')

      const response = await uploadToIPFS(eventInfoFile)
      const ipfsUrl = response?.url

      console.log('ipfsUrl', ipfsUrl)

      if (response && ipfsUrl) {
        return ipfsUrl
      }
    } catch (error) {
      console.log(error)
    }
    return ''
  }

  const attestEventCreation = async (eventInfo: EventType) => {
    const eas = new EAS(EAS_CONTRACT_ADDRESS)
    // @ts-ignore
    eas.connect(signer)

    const schemaEncoder = new SchemaEncoder(CREATING_EVENT_SCHEMA)
    const encodedData = schemaEncoder.encodeData([
      {
        name: 'name',
        type: 'string',
        value: eventInfo.name
      },

      {
        name: 'location',
        type: 'string',
        value: eventInfo.location
      },
      {
        name: 'description',
        type: 'string',
        value: eventInfo.description || 'void'
      },
      {
        name: 'banner',
        type: 'string',
        value: eventInfo.banner
      },
      {
        name: 'eventInfoUrl',
        type: 'string',
        value: eventInfo.eventInfoUrl
      },
      {
        name: 'attestText',
        type: 'string',
        value: eventInfo.attestText
      },
      {
        name: 'start',
        type: 'uint32',
        value: eventInfo.start
      },
      {
        name: 'end',
        type: 'uint32',
        value: eventInfo.end
      },
      {
        name: 'capacity',
        type: 'uint16',
        value: eventInfo.capacity
      },
      {
        name: 'price',
        type: 'uint256',
        value: eventInfo.price
      },
      {
        name: 'schemaId',
        type: 'string',
        value: eventInfo.schemaId
      }
    ])

    const schemaUID = CREATING_EVENT_SCHEMA_UID

    const tx = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: ZERO_ADDRESS,
        data: encodedData,
        revocable: true
      }
    })

    const newAttestationUID = await tx.wait()

    console.log('New attestation UID:', newAttestationUID)

    return newAttestationUID
  }

  const handleCreateButtonClick = async () => {
    try {
      if (creatingEvent) return
      setCreatingEvent(true)

      const eventInfo: EventType = {
        name: eventName,
        location: eventLocation,
        attestText: eventDisplayText,
        banner: bannerIpfsUrl,
        schemaId: SIMPLE_ATTENDING_EVENT_SCHEMA_UID,
        description: aboutEvent,
        start: 0,
        capacity: 0,
        end: 0,
        eventInfoUrl: '0',
        price: 0
      }

      // get start and end inputs
      const startDate = startDateInputRef.current?.value
      let startTime = startTimeInputRef.current?.value
      const endDate = endDateInputRef.current?.value
      let endTime = endTimeInputRef.current?.value

      if (isTimeLimited && (startDate || endDate)) {
        if (!startTime) startTime = '00:00'
        if (!endTime) endTime = '00:00'

        let startEpoch
        let endEpoch

        if (startDate && startTime) {
          startEpoch = new Date(`${startDate} ${startTime}`).getTime()

          if (startEpoch < Date.now()) {
            throw new Error('Event must be starting in the future')
          }

          eventInfo.start = startEpoch
        }

        if (endDate && endTime) {
          endEpoch = new Date(`${endDate} ${endTime}`).getTime()

          if (endEpoch < Date.now()) {
            throw new Error('End date and time must be in the future')
          }

          if (startEpoch && endEpoch < startEpoch) {
            throw new Error(
              'End date and time must be after start date and time'
            )
          }

          eventInfo.end = endEpoch
        }
      }

      if (isCapacityLimited && capacity > 0) {
        eventInfo.capacity = capacity
      }

      if (isPaid && parseFloat(price) > 0) {
        // convert price which is in eth to uint256
        const priceInUint = ethers.parseEther(price).toString()
        console.log('priceInUint', priceInUint)
        eventInfo.price = Number(priceInUint)
      }

      console.log('eventInfo', eventInfo)

      const schemaId = await getSchemaId(eventInfo)

      console.log('schemaId', schemaId)

      eventInfo.schemaId = schemaId

      // const ipfsUrl = await getIpfsUrlOfEvent(eventInfo);

      const ipfsUrl = await toast.promise(getIpfsUrlOfEvent(eventInfo), {
        loading: 'Uploading event info to IPFS',
        success: 'Event info uploaded to IPFS',
        error: 'Error uploading event info to IPFS'
      })

      eventInfo.eventInfoUrl = ipfsUrl

      // attest of creating event using CREATING_EVENT_SCHEMA_UID

      const newAttestationUID = await toast.promise(
        attestEventCreation(eventInfo),
        {
          loading: 'Attesting event creation',
          success: 'Event created',
          error: 'Error attesting event creation'
        }
      )

      console.log('newAttestationUID', newAttestationUID)

      await sleep(5000)

      // redirect to event page with attestation uid
      push(`/signup/${newAttestationUID}`)
    } catch (error) {
      toast.error(String(error).replace('Error:', ''))

      console.log('error', error)
    } finally {
      setCreatingEvent(false)
    }
  }

  return (
    <>
      <div className="p-5 mt-5 transition-all duration-300 flex flex-row justify-between bg-p-bg/40 backdrop-opacity-10  backdrop-blur-xl rounded-xl shadow-2xl">
        <div className="w-[370px]">
          {/* choose banner */}

          <label htmlFor="banner" className="cursor-pointer relative">
            <div className="relative">
              <img
                src={
                  localBannerLink !== ''
                    ? localBannerLink
                    : '/invited_image_0.png'
                }
                className="rounded-xl bg-white object-cover h-52 w-full"
                alt="invited"
              />
              <div className="absolute top-2 left-2 pt-1.5 px-2 rounded-lg bg-black/50 backdrop-opacity-10  backdrop-blur-sm">
                {uploadingBanner ? (
                  <div className="spinner border-white " />
                ) : (
                  <FaRegImage className="text-white text-lg" />
                )}
              </div>
            </div>

            <input
              id="banner"
              type="file"
              multiple={false}
              accept="image/*"
              className="hidden"
              onChange={handleBannerChange}
              disabled={uploadingBanner || creatingEvent}
            />
          </label>

          {/* event name input */}
          <input
            placeholder="Event Name"
            className="w-full border-none bg-transparent mt-6 mb-3 text-3xl font-bold outline-none placeholder:text-s-text text-p-text"
            value={eventName}
            disabled={creatingEvent}
            onChange={(e) => setEventName(e.target.value)}
          />

          {/* event location input */}

          <div className="flex flex-row items-center my-4">
            <div className="border border-s-text/30 rounded-xl p-2 mr-2">
              <HiOutlineLocationMarker className="text-s-text/40 text-2xl " />
            </div>

            <input
              placeholder="Location link or virtual link"
              className="w-full border-none bg-s-text/10 backdrop-opacity-10  backdrop-blur-sm  rounded-md py-3 px-3  text-lg font-bold outline-none placeholder:text-s-text text-p-text "
              value={eventLocation}
              disabled={creatingEvent}
              onChange={(e) => setEventLocation(e.target.value)}
            />
          </div>

          {/* attest display text input */}

          <div className="flex flex-row items-center my-4">
            <div className="border border-s-text/30 rounded-xl p-2 mr-2">
              <FaSignature className="text-s-text/40 text-2xl " />
            </div>

            <input
              placeholder="Text on attend button"
              className="w-full border-none bg-s-text/10 backdrop-opacity-10  backdrop-blur-sm  rounded-md py-3 px-3  text-lg font-bold outline-none placeholder:text-s-text text-p-text"
              value={eventDisplayText}
              disabled={creatingEvent}
              onChange={(e) => setEventDisplayText(e.target.value)}
            />
          </div>

          {/* create event button */}
          <button
            onClick={handleCreateButtonClick}
            disabled={isCreateEventButtonDisabled}
            className={clsx(
              'w-full mt-4 backdrop-opacity-10  backdrop-blur-sm  rounded-md py-3 px-3  text-lg text-black font-bold outline-none ',
              isCreateEventButtonDisabled ? 'bg-p-text/50' : 'bg-p-text/90'
            )}
          >
            {creatingEvent ? 'Creating...' : 'Create Event'}
          </button>
        </div>
        <div className="w-[370px] ">
          <div className="text-sm font-semibold text-s-text/40 ">Optional</div>
          {/* event options controls */}

          {/* about event textarea */}
          <AutoResizeTextarea
            placeholder="About Event"
            className="w-full border-none resize-none bg-s-text/10 backdrop-opacity-10  backdrop-blur-sm  rounded-md mt-4 p-3 font-bold outline-none placeholder:text-s-text text-p-text"
            value={aboutEvent}
            disabled={creatingEvent}
            onChange={(e) => setAboutEvent(e.target.value)}
          />

          {/* text and toggle button to show or hide start / end date and time inputs */}
          <>
            <div className="flex items-center gap-3 my-1 mt-4">
              <ToggleButton
                isOn={isTimeLimited}
                setIsOn={setIsTimeLimited}
                sizeInPixels={34}
                disabled={creatingEvent}
              />
              <div
                className={clsx(
                  'font-bold text-lg transition-all duration-300',
                  isTimeLimited ? 'text-p-text' : 'text-s-text'
                )}
              >
                Time limited
              </div>
            </div>

            <div
              className={clsx(
                isTimeLimited ? 'h-auto' : 'h-0 overflow-hidden',
                'transition-all duration-300'
              )}
            >
              {/* event start date and time input */}
              <div className="flex items-center gap-3 my-4">
                <div className="text-lg font-semibold text-s-text ">Start</div>
                {/* event start date input */}
                <input
                  type="date"
                  placeholder="Start Date"
                  className="w-full border-none bg-s-text/10 backdrop-opacity-10  backdrop-blur-sm  rounded-md p-2 text-lg font-medium outline-none text-p-text"
                  ref={startDateInputRef}
                  disabled={creatingEvent}
                />

                {/* event start time input */}
                <input
                  type="time"
                  ref={startTimeInputRef}
                  disabled={creatingEvent}
                  placeholder="Start Time"
                  className="w-full border-none bg-s-text/10 backdrop-opacity-10  backdrop-blur-sm  rounded-md p-2 text-lg font-medium outline-none text-p-text"
                />
              </div>

              {/* event end date and time input */}
              <div className="flex items-center gap-3 my-4">
                <div className="text-lg font-semibold text-s-text ">End</div>
                {/* event end date input */}
                <input
                  type="date"
                  ref={endDateInputRef}
                  disabled={creatingEvent}
                  placeholder="End Date"
                  className="w-full border-none bg-s-text/10 backdrop-opacity-10  backdrop-blur-sm  rounded-md p-2 text-lg font-medium outline-none text-p-text"
                />

                {/* event end time input */}
                <input
                  type="time"
                  ref={endTimeInputRef}
                  disabled={creatingEvent}
                  placeholder="End Time"
                  className="w-full border-none bg-s-text/10 backdrop-opacity-10  backdrop-blur-sm  rounded-md p-2 text-lg font-medium outline-none text-p-text"
                />
              </div>
            </div>
          </>

          {/* text and toggle button to show or hide capacity input */}
          <>
            <div className="flex items-center gap-3 my-1">
              <ToggleButton
                isOn={isCapacityLimited}
                setIsOn={setIsCapacityLimited}
                sizeInPixels={34}
                disabled={creatingEvent}
              />
              <div
                className={clsx(
                  'font-bold text-lg transition-all duration-300',
                  isCapacityLimited ? 'text-p-text' : 'text-s-text'
                )}
              >
                Capacity
              </div>
            </div>

            <div
              className={clsx(
                isCapacityLimited ? 'h-auto' : 'h-0 overflow-hidden',
                'transition-all duration-300'
              )}
            >
              {/* event capacity input */}
              <div className="flex items-center gap-3 my-4">
                <input
                  disabled={creatingEvent}
                  type="number"
                  placeholder="Capacity"
                  className="w-full border-none bg-s-text/10 backdrop-opacity-10  backdrop-blur-sm  rounded-md p-2 text-lg font-medium outline-none text-p-text"
                  value={capacity}
                  min={10}
                  onChange={(e) => setCapacity(parseInt(e.target.value))}
                />
              </div>
            </div>
          </>

          {/* text and toggle button to show or hide paid event input */}
          <>
            <div className="flex items-center gap-3 my-1">
              <ToggleButton
                disabled={creatingEvent}
                isOn={isPaid}
                setIsOn={setIsPaid}
                sizeInPixels={34}
              />
              <div
                className={clsx(
                  'font-bold text-lg transition-all duration-300',
                  isPaid ? 'text-p-text' : 'text-s-text'
                )}
              >
                Paid Event
              </div>
            </div>

            <div
              className={clsx(
                isPaid ? 'h-auto' : 'h-0 overflow-hidden',
                'transition-all duration-300'
              )}
            >
              {/* event price input */}
              <div className="flex items-center gap-3 my-4 bg-s-text/10 backdrop-opacity-10  backdrop-blur-sm  rounded-md p-2">
                <input
                  disabled={creatingEvent}
                  type="string"
                  placeholder="Price"
                  className="w-full border-none bg-transparent placeholder:text-s-text text-lg font-medium outline-none text-p-text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <div className="text-lg font-semibold text-s-text ">ETH</div>
              </div>
            </div>
          </>
        </div>
      </div>
    </>
  )
}
