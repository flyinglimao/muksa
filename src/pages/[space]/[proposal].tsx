import { BlitzPage } from "@blitzjs/next"
import Image from "next/image"
import Layout from "src/core/layouts/Layout"

const Proposal: BlitzPage = () => {
  const name = "Space"
  const icon = "https://cdn.stamp.fyi/space/stgdao.eth?s=164"
  const id = "1"
  return (
    <Layout title={`Proposal#1 | ${name}`}>
      <div className="max-w-screen-lg mx-auto flex flex-wrap justify-between gap-8 items-start">
        <div className="border rounded-xl p-8 w-[260px] text-center">
          <Image src={icon} width={82} height={82} className="rounded-full mx-auto" alt="icon" />
          <h3 className="my-4 font-medium text-lg">{name}</h3>
          <a
            href="https://testnet.venomscan.com/"
            className="block my-2 border rounded-full hover:border-current py-2 mx-4"
            target="_blank"
            rel="noreferrer"
          >
            View in Explorer
          </a>
          <p className="text-left">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </p>
        </div>
        <div className="flex-1 flex flex-col gap-4 p-8 rounded-xl border">
          <h4 className="font-medium text-ellipsis mb-2">
            Proposal#1 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
            nostrud exercitation ullamco laboris
          </h4>
          <div className="my-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </div>
          <div className="flex flex-col gap-4 my-2">
            <button className="w-full border rounded-full px-2 py-4 hover:border-current">
              Vote 1
            </button>
            <button className="w-full border rounded-full px-2 py-4 hover:border-current">
              Vote 1
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Proposal
