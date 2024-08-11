import Link from 'next/link'
import React from 'react'
import { FaRegCopy } from 'react-icons/fa'
import useInfoBasedOnChain from '../../utils/hooks/useInfoBasedOnChain'
import { Tooltip } from '@mui/material'
import toast from 'react-hot-toast'

const WalletAddress = ({
  walletAdderss,
  showShort = true,
  showLinkToExplorer = true,
  className = ''
}: {
  walletAdderss: string
  showShort?: boolean
  showLinkToExplorer?: boolean
  className?: string
}) => {
  const { EXPLORER_URL } = useInfoBasedOnChain()
  return (
    <span className={className}>
      {showLinkToExplorer ? (
        <Link
          href={`${EXPLORER_URL}/address/${walletAdderss}`}
          target="_blank"
          passHref
          className="group text-s-text hover:text-p-text no-underline transition-all space-x-1"
        >
          <span className="group-hover:underline underline-offset-4">
            {showShort
              ? walletAdderss.slice(0, 6) + '...' + walletAdderss.slice(-4)
              : walletAdderss}
          </span>

          <Tooltip
            title="Copy Wallet Address"
            className="opacity-0 group-hover:opacity-100 transition-all"
            onClick={(e) => {
              e.preventDefault()
              navigator.clipboard.writeText(walletAdderss)
              toast.success('Copied to clipboard')
            }}
          >
            <FaRegCopy className="" />
          </Tooltip>
        </Link>
      ) : (
        <span className="text-s-text hover:text-p-text transition-all space-x-1">
          <span>
            {showShort
              ? walletAdderss.slice(0, 6) + '...' + walletAdderss.slice(-4)
              : walletAdderss}
          </span>
          <Tooltip
            title="Copy Wallet Address"
            className="opacity-0 group-hover:opacity-100 transition-all"
            onClick={(e) => {
              e.preventDefault()
              navigator.clipboard.writeText(walletAdderss)
              toast.success('Copied to clipboard')
            }}
          >
            <FaRegCopy className="" />
          </Tooltip>
        </span>
      )}
    </span>
  )
}

export default WalletAddress
