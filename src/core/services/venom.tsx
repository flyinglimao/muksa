import { Provider, ProviderRpcClient } from "everscale-inpage-provider"
import { EverscaleStandaloneClient } from "everscale-standalone-client"
import { ReactNode, createContext, useEffect, useState } from "react"
import { VenomConnect } from "venom-connect"

type Venom = {
  connect: () => void
  isConnected: boolean
  address: string | null
  publicKey: string | null
  client: ProviderRpcClient | null
}

export const VenomContext = createContext<Venom>({
  connect: () => {
    throw new Error("Provider not initialized")
  },
  isConnected: false,
  address: null,
  publicKey: null,
  client: null,
})

export function VenomProvider({ children }: { children: ReactNode }) {
  const [venom, setVenom] = useState<VenomConnect | null>(null)
  const [client, setClient] = useState<ProviderRpcClient | null>(null)
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  useEffect(() => {
    if (typeof window === "undefined") return
    const venom = new VenomConnect({
      theme: "light",
      checkNetworkId: 1000,
      checkNetworkName: "Venom Testnet",
      providersOptions: {
        venomwallet: {
          walletWaysToConnect: [
            {
              package: ProviderRpcClient,
              packageOptions: {
                fallback:
                  VenomConnect.getPromise("venomwallet", "extension") || (() => Promise.reject()),
                forceUseFallback: true,
              },
              packageOptionsStandalone: {
                fallback: () =>
                  EverscaleStandaloneClient.create({
                    connection: {
                      id: 1010,
                      group: "testnet",
                      type: "jrpc",
                      data: {
                        endpoint: "https://jrpc-testnet.venom.foundation/rpc",
                      },
                    },
                  }),
                forceUseFallback: true,
              },
              id: "extension",
              type: "extension",
            },
          ],
          defaultWalletWaysToConnect: ["mobile", "ios", "android"],
        },
      },
    })
    setVenom(venom)
    console.log(venom)
    venom.on("connect", (client: ProviderRpcClient) => {
      setClient(client)
      setConnected(true)
      console.log(client)
      client
        .getProviderState()
        .then((state) => {
          setAddress(state.permissions.accountInteraction?.address.toString() || null)
          setPublicKey(state.permissions.accountInteraction?.publicKey.toString() || null)
        })
        .catch(() => {})
    })
  }, [])

  return (
    <VenomContext.Provider
      value={{
        connect: () => venom?.connect(),
        isConnected: connected,
        address,
        publicKey,
        client,
      }}
    >
      {children}
    </VenomContext.Provider>
  )
}
