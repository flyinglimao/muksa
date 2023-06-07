import { BlitzPage } from "@blitzjs/next"
import { useContext, useEffect, useState } from "react"
import Layout from "src/core/layouts/Layout"
import { deployTip3 } from "src/core/services/deployTip3"
import { VenomContext } from "src/core/services/venom"
import Image from "next/image"
import { useMutation } from "@blitzjs/rpc"
import createDao from "src/mutations/createDao"
import { useRouter } from "next/router"

const Create: BlitzPage = () => {
  const [name, setName] = useState("")
  const [introduction, setIntroduction] = useState("")
  const [avatar, setAvatar] = useState("/default-dao-avatar.png")
  const [token, setToken] = useState("")
  const [tokenName, setTokenName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [supply, setSupply] = useState<number | null>(null)
  const [deploying, setDeploying] = useState(false)
  const venom = useContext(VenomContext)
  const [createDaoMutation] = useMutation(createDao)
  const router = useRouter()

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setAvatar(reader.result as string)
    }
  }

  useEffect(() => {
    if (!venom.address) venom.connect()
  }, [venom])

  useEffect(() => {
    setTokenName(`${name} Token`)
    setTokenSymbol(
      (
        name
          .split(" ")
          .map((e) => e?.[0])
          .join("")
          .toUpperCase() + "T"
      ).slice(0, 3)
    )
  }, [name])

  return (
    <Layout title="Create a new Space">
      <div className="max-w-screen-md mx-auto border rounded-xl p-8">
        <h2 className="font-medium text-xl mb-4">Create a new Space</h2>
        <label className="flex flex-col items-start mt-4">
          Name
          <input
            className="py-2 px-4 rounded-xl border hover:border-current focus:border-current mt-2 w-full"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </label>
        <label className="flex flex-col items-start mt-4">
          Avatar
          <div className="mt-2">
            <div className="mr-8 inline-block align-middle">
              <Image
                src={avatar}
                width={128}
                height={128}
                alt={"Avatar"}
                className="border rounded-full object-cover w-[128px] h-[128px]"
              />
            </div>
            <input
              onChange={handleAvatarChange}
              type="file"
              className="align-middle"
              accept="image/*"
            />
          </div>
        </label>
        <label className="flex flex-col items-start mt-4">
          Introduction
          <textarea
            className="py-2 px-4 rounded-xl border hover:border-current focus:border-current mt-2 w-full"
            placeholder="Write a short introduction"
            onChange={(e) => setIntroduction(e.target.value)}
            value={introduction}
          />
        </label>
        <label className="flex flex-col items-start mt-4">
          Token
          {token ? (
            <input
              className="py-2 px-4 rounded-xl border hover:border-current focus:border-current mt-2 w-full"
              value={token}
              disabled
            />
          ) : (
            <div className="border rounded-xl p-8 mt-2 w-full">
              <label className="flex flex-col items-start">
                Name
                <input
                  className="py-2 px-4 rounded-xl border hover:border-current focus:border-current mt-2 w-full"
                  placeholder="A clear name, e.g. Muksa Gov Token"
                  onChange={(e) => setTokenName(e.target.value)}
                  value={tokenName}
                />
              </label>
              <label className="flex flex-col items-start mt-4">
                Symbol
                <input
                  className="py-2 px-4 rounded-xl border hover:border-current focus:border-current mt-2 w-full"
                  placeholder="A simple symbol, e.g. MGT"
                  onChange={(e) => setTokenSymbol(e.target.value)}
                  value={tokenSymbol}
                />
              </label>
              <label className="flex flex-col items-start mt-4">
                Initial Supply
                <input
                  className="py-2 px-4 rounded-xl border hover:border-current focus:border-current mt-2 w-full"
                  placeholder="e.g. 10000, all the token will be allocated to you"
                  onChange={(e) => setSupply(parseFloat(e.target.value) || null)}
                  type="number"
                  value={supply === null ? "" : supply.toString()}
                />
              </label>
              <p className="mt-2 text-sm text-slate-500">
                * It will execute 2 transactions, first for creating space, second for deployment.
              </p>
              <button
                className="py-2 px-4 rounded-xl border hover:border-current focus:border-current mt-2 w-full"
                onClick={() => {
                  if (!venom.publicKey || !venom.address || !venom.client) return
                  if (
                    !tokenName ||
                    !tokenSymbol ||
                    !supply ||
                    !Number.isFinite(supply) ||
                    supply <= 0
                  ) {
                    return alert("Please fill in all the fields in correct format")
                  }
                  setDeploying(true)

                  deployTip3({
                    publicKey: venom.publicKey,
                    address: venom.address,
                    name: tokenName,
                    symbol: tokenSymbol,
                    client: venom.client,
                    initialSupply: supply,
                  })
                    .then(({ contract }) => {
                      setDeploying(false)
                      setToken(contract.address.toString())
                    })
                    .catch((err) => {
                      setDeploying(false)
                      console.error(err)
                      alert("Unknow error happens, please try again or report to our team")
                    })
                }}
              >
                {deploying ? "Deploy......" : "Deploy"}
              </button>
            </div>
          )}
        </label>

        <button
          className={
            "py-2 px-16 rounded-full border mt-8 mx-auto block " +
            (token ? "hover:border-current" : "")
          }
          onClick={() => {
            createDaoMutation({
              name,
              avatar,
              introduction,
              token,
            })
              .then(({ id }) => {
                return router.push(`/${id}`)
              })
              .catch((err) => {
                console.error(err)
                alert("Unknow error happens, please try again or report to our team")
              })
          }}
          disabled={!token}
        >
          {token ? "Create" : "You have to deploy a token first"}
        </button>
      </div>
    </Layout>
  )
}

export default Create
