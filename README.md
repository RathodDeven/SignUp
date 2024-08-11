# Sign UP

### Easily Create sign-ups for events, voting, IRL proofs, early access sign-ups—literally anything—with the ability to limit how many can sign up, add a price, and set start and end times.

This project is built with careful attention to the UI and provides proof for each step. No custom backend APIs are involved; everything is handled on EAS and accessed via corresponding GraphQL APIs. This means it cannot be taken down, and every step is open for anyone to verify.

This project is currently deployed on both the `Optimism Sepolia` and `Base Sepolia` testnets, and it works seamlessly when switching between chain networks.

```
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
```

## How it works ?

![image](https://github.com/user-attachments/assets/561c8e5a-05bc-40e0-917e-ac1f3073c0f6)

