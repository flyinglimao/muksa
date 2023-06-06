import { useContext } from "react"
import { VenomContext } from "../services/venom"

function trimAddr(addr: string) {
  return addr.slice(0, 8) + "..." + addr.slice(-6)
}

export function Header() {
  const venom = useContext(VenomContext)!

  return (
    <div className="border-b-2 h-[60px] sticky top-0 bg-white">
      <div className="max-w-screen-lg mx-auto flex h-[100%] items-center justify-between">
        <h1 className="text-xl font-bold">Muksa</h1>
        <div>
          {venom.isConnected ? (
            <p>{trimAddr(venom.address!)}</p>
          ) : (
            <button
              onClick={() => venom.connect()}
              className="float-right rounded-full border py-2 px-4 hover:border-current"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
