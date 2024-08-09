import type { CodegenConfig } from '@graphql-codegen/cli'
import { OpTestnet } from './utils/config'

const config: CodegenConfig = {
  overwrite: true,
  schema: OpTestnet.GRAPHQL_API,
  documents: './graphql/*.graphql',
  generates: {
    'generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
        'fragment-matcher'
      ]
    }
  },
  hooks: {
    afterAllFileWrite: ['eslint --fix']
  }
}

export default config
