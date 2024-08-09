import { useAccount } from 'wagmi'
import { BaseTestnet, OpTestnet } from '../config'

const useInfoBasedOnChain = () => {
  const { chainId } = useAccount()

  if (chainId === 84532) return BaseTestnet

  return OpTestnet
}

export default useInfoBasedOnChain
