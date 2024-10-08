export const EventResolverAbi = [
  {
    inputs: [
      {
        internalType: 'contract IEAS',
        name: 'eas',
        type: 'address'
      },
      {
        internalType: 'uint32',
        name: '_initialMaxTicketCount',
        type: 'uint32'
      },
      {
        internalType: 'uint256',
        name: '_ticketPrice',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_validFrom',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_validTo',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [],
    name: 'AccessDenied',
    type: 'error'
  },
  {
    inputs: [],
    name: 'InsufficientValue',
    type: 'error'
  },
  {
    inputs: [],
    name: 'InvalidEAS',
    type: 'error'
  },
  {
    inputs: [],
    name: 'InvalidLength',
    type: 'error'
  },
  {
    inputs: [],
    name: 'NotPayable',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: 'moreTickets',
        type: 'uint32'
      }
    ],
    name: 'addTickets',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'uid',
            type: 'bytes32'
          },
          {
            internalType: 'bytes32',
            name: 'schema',
            type: 'bytes32'
          },
          {
            internalType: 'uint64',
            name: 'time',
            type: 'uint64'
          },
          {
            internalType: 'uint64',
            name: 'expirationTime',
            type: 'uint64'
          },
          {
            internalType: 'uint64',
            name: 'revocationTime',
            type: 'uint64'
          },
          {
            internalType: 'bytes32',
            name: 'refUID',
            type: 'bytes32'
          },
          {
            internalType: 'address',
            name: 'recipient',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'attester',
            type: 'address'
          },
          {
            internalType: 'bool',
            name: 'revocable',
            type: 'bool'
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes'
          }
        ],
        internalType: 'struct Attestation',
        name: 'attestation',
        type: 'tuple'
      }
    ],
    name: 'attest',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'initialMaxTicketCount',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'isPayable',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'uid',
            type: 'bytes32'
          },
          {
            internalType: 'bytes32',
            name: 'schema',
            type: 'bytes32'
          },
          {
            internalType: 'uint64',
            name: 'time',
            type: 'uint64'
          },
          {
            internalType: 'uint64',
            name: 'expirationTime',
            type: 'uint64'
          },
          {
            internalType: 'uint64',
            name: 'revocationTime',
            type: 'uint64'
          },
          {
            internalType: 'bytes32',
            name: 'refUID',
            type: 'bytes32'
          },
          {
            internalType: 'address',
            name: 'recipient',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'attester',
            type: 'address'
          },
          {
            internalType: 'bool',
            name: 'revocable',
            type: 'bool'
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes'
          }
        ],
        internalType: 'struct Attestation[]',
        name: 'attestations',
        type: 'tuple[]'
      },
      {
        internalType: 'uint256[]',
        name: 'values',
        type: 'uint256[]'
      }
    ],
    name: 'multiAttest',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'uid',
            type: 'bytes32'
          },
          {
            internalType: 'bytes32',
            name: 'schema',
            type: 'bytes32'
          },
          {
            internalType: 'uint64',
            name: 'time',
            type: 'uint64'
          },
          {
            internalType: 'uint64',
            name: 'expirationTime',
            type: 'uint64'
          },
          {
            internalType: 'uint64',
            name: 'revocationTime',
            type: 'uint64'
          },
          {
            internalType: 'bytes32',
            name: 'refUID',
            type: 'bytes32'
          },
          {
            internalType: 'address',
            name: 'recipient',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'attester',
            type: 'address'
          },
          {
            internalType: 'bool',
            name: 'revocable',
            type: 'bool'
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes'
          }
        ],
        internalType: 'struct Attestation[]',
        name: 'attestations',
        type: 'tuple[]'
      },
      {
        internalType: 'uint256[]',
        name: 'values',
        type: 'uint256[]'
      }
    ],
    name: 'multiRevoke',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'uid',
            type: 'bytes32'
          },
          {
            internalType: 'bytes32',
            name: 'schema',
            type: 'bytes32'
          },
          {
            internalType: 'uint64',
            name: 'time',
            type: 'uint64'
          },
          {
            internalType: 'uint64',
            name: 'expirationTime',
            type: 'uint64'
          },
          {
            internalType: 'uint64',
            name: 'revocationTime',
            type: 'uint64'
          },
          {
            internalType: 'bytes32',
            name: 'refUID',
            type: 'bytes32'
          },
          {
            internalType: 'address',
            name: 'recipient',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'attester',
            type: 'address'
          },
          {
            internalType: 'bool',
            name: 'revocable',
            type: 'bool'
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes'
          }
        ],
        internalType: 'struct Attestation',
        name: 'attestation',
        type: 'tuple'
      }
    ],
    name: 'revoke',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_ticketPrice',
        type: 'uint256'
      }
    ],
    name: 'setTicketPric',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_validFrom',
        type: 'uint256'
      }
    ],
    name: 'setValidFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_validTo',
        type: 'uint256'
      }
    ],
    name: 'setValidTo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'ticketPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'ticketsSold',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'validFrom',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'validTo',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'version',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    stateMutability: 'payable',
    type: 'receive'
  }
]
