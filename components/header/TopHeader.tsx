import React from 'react'
import { usePathname } from 'next/navigation'
import { useAccount } from 'wagmi'
import Link from 'next/link'
import clsx from 'clsx'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { FaGithub } from 'react-icons/fa'
import { APP_NAME } from '../../utils/config'

const TopHeader = () => {
  const path = usePathname()
  const { isConnected } = useAccount()
  return (
    <div className="flex flex-row items-center justify-between p-6">
      <div className="flex flex-row items-center justify-center gap-x-4 ">
        <Link href={`/`} className="no-underline" passHref>
          <div className="flex flex-row items-center gap-x-2 text-p-text">
            <img src="/Logo_Without_Text.svg" alt="logo" className="w-5 h-5" />
            <div className="font-bold text-p-text">{APP_NAME}</div>
          </div>
        </Link>

        {/* github link */}
        <a
          href="https://github.com/RathodDeven/SignUp"
          target="_blank"
          rel="noopener noreferrer"
          className="text-s-text mt-1 font-bold hover:text-p-text no-underline"
        >
          <FaGithub className="text-xl" />
        </a>
      </div>

      {isConnected && path !== '/create' && (
        <div className="flex flex-row items-center gap-x-4 -mr-32">
          <Link href={`/`} className="no-underline" passHref>
            <div
              className={clsx(
                path === '/' ? 'text-p-text' : 'text-s-text',
                'font-bold hover:text-p-text'
              )}
            >
              Home
            </div>
          </Link>

          <Link href={`/created`} className="no-underline" passHref>
            <div
              className={clsx(
                path === '/created' ? 'text-p-text' : 'text-s-text',
                'font-bold hover:text-p-text'
              )}
            >
              Created
            </div>
          </Link>

          <Link href={`/signedup`} className="no-underline" passHref>
            <div
              className={clsx(
                path === '/created' ? 'text-p-text' : 'text-s-text',
                'text-s-text font-bold hover:text-p-text'
              )}
            >
              Signed Up
            </div>
          </Link>
        </div>
      )}
      <div className="flex flex-row items-center gap-x-4">
        {isConnected && (
          <Link href={`/create`} className="no-underline" passHref>
            <div className="text-s-text font-bold hover:text-p-text">
              Create
            </div>
          </Link>
        )}
        <ConnectButton showBalance={false} chainStatus={'icon'} />
      </div>
    </div>
  )
}

export default TopHeader
