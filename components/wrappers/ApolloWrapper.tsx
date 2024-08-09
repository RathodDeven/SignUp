import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import React from 'react'
import useInfoBasedOnChain from '../../utils/hooks/useInfoBasedOnChain'

const ApolloWrapper = ({ children }: { children: React.ReactNode }) => {
  const { GRAPHQL_API } = useInfoBasedOnChain()
  const client = new ApolloClient({
    uri: GRAPHQL_API,
    cache: new InMemoryCache()
  })
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

export default ApolloWrapper
