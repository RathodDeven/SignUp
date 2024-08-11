export const APP_NAME = 'SignUP'
export const IPFS_ENDPOINT = 'https://4everland.io/ipfs/'
export const IMAGE_KIT_ENDPOINT = 'https://ik.imagekit.io/kopveel8c'
export const STS_TOKEN_URL = process.env.NEXT_PUBLIC_STS_TOKEN_URL
export const EVER_REGION = 'us-west-2'
export const EVER_ENDPOINT = 'https://endpoint.4everland.co'

export const DEFAULT_BANNER =
  'ipfs://bafkreid3bflo64cb6on425aypfbfglwwund34ahsu3xaskult7aryuaeci'

export const ATTENDING_EVENT_SCHEMA = 'string AttendingEventIpfsUrl'
export const CREATING_EVENT_SCHEMA =
  'string name, string location, string description, string banner, string eventInfoUrl, string attestText, uint32 start, uint32 end, uint16 capacity, uint256 price, string schemaId'

export const OpTestnet = {
  CREATING_EVENT_SCHEMA_UID:
    '0xea04ca817cd403d7ef3ff95541a85d10d4bcfa68498503f09696b698e5100114',
  EAS_CONTRACT_ADDRESS: '0x4200000000000000000000000000000000000021',
  SCHEMA_REGISTRY: '0x4200000000000000000000000000000000000020',
  SIMPLE_ATTENDING_EVENT_SCHEMA_UID:
    '0xa7435e2d17139baccfa4facc6ff1f2f4118f4edcd7818dd415f0aa80ffad51ee',
  GRAPHQL_API: 'https://optimism-sepolia.easscan.org/graphql',
  EXPLORER_URL: 'https://sepolia-optimism.etherscan.io',
  EAS_EXPLORER_URL: 'https://optimism-sepolia.easscan.org'
}

export const BaseTestnet = {
  CREATING_EVENT_SCHEMA_UID:
    '0xea04ca817cd403d7ef3ff95541a85d10d4bcfa68498503f09696b698e5100114',
  EAS_CONTRACT_ADDRESS: '0x4200000000000000000000000000000000000021',
  SCHEMA_REGISTRY: '0x4200000000000000000000000000000000000020',
  SIMPLE_ATTENDING_EVENT_SCHEMA_UID:
    '0xa7435e2d17139baccfa4facc6ff1f2f4118f4edcd7818dd415f0aa80ffad51ee',
  GRAPHQL_API: 'https://base-sepolia.easscan.org/graphql',
  EXPLORER_URL: 'https://sepolia.basescan.org',
  EAS_EXPLORER_URL: 'https://base-sepolia.easscan.org'
}
