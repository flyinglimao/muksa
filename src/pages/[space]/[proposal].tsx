import { BlitzPage, ErrorComponent, useParams } from "@blitzjs/next"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { Address } from "everscale-inpage-provider"
import Image from "next/image"
import { Fragment, useContext, useEffect, useState } from "react"
import { Modal } from "src/core/components/Modal"
import Layout from "src/core/layouts/Layout"
import { TokenRootAbi, TokenWalletAbi } from "src/core/services/deployTip3"
import { VenomContext } from "src/core/services/venom"
import getDao from "src/queries/getDao"
import getProposal from "src/queries/getProposal"
import BigNumber from "bignumber.js"
import vote from "src/mutations/vote"

const Proposal: BlitzPage = () => {
  const params = useParams("number")
  const venom = useContext(VenomContext)
  const [{ dao }] = useQuery(getDao, params.space || 0)
  const [proposal, { refetch: refetchProposal }] = useQuery(getProposal, {
    daoId: params.space || 0,
    serial: params.proposal || 0,
  })
  const [voteMutation] = useMutation(vote)
  const [balance, setBalance] = useState("")
  const [votingFor, setVotingFor] = useState<{ id: number; content: string } | null>(null)
  const [loading, setLoading] = useState(false)

  if (!dao || !proposal) {
    return <ErrorComponent statusCode={404} title={"DAO not found"} />
  }

  async function voteFor(option: { id: number; content: string }) {
    if (!venom.address) {
      alert("Please connect your wallet first")
      return
    }
    setVotingFor(option)
    setLoading(true)
    try {
      const tokenAddress = new Address(dao!.token)
      const tokenContract = new venom.client!.Contract(TokenRootAbi, tokenAddress)
      const tokenWallet = (await tokenContract.methods
        ?.walletOf?.({
          answerId: 0,
          walletOwner: venom.address,
        } as never)
        .call()) as any
      if (!tokenWallet) return
      const walletAddress = tokenWallet.value0._address
      const contract = new venom.client!.Contract(TokenWalletAbi, new Address(walletAddress))
      const contractState = await venom.client!.rawApi.getFullContractState({
        address: walletAddress,
      })
      if (contractState.state) {
        const result = (await contract.methods?.balance?.({ answerId: 0 } as never).call()) as any
        const tokenBalance = result.value0
        setBalance(tokenBalance)
        setLoading(false)
      } else {
        setBalance("0")
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
      alert("Unknow error happens, please try again or report to our team")
      setLoading(false)
    }
  }

  async function confirmVote() {
    if (!venom.publicKey || !votingFor || !dao || !proposal || !venom.address) return
    const sig = await venom.client!.signData({
      publicKey: venom.publicKey,
      data: btoa(
        `${venom.address} is voting for ${votingFor.content} in proposal#${proposal.serial} of ${dao.name}`
      ),
    })
    voteMutation({
      daoId: dao.id,
      serial: proposal.serial,
      optionId: votingFor.id,
      address: venom.address,
      publicKey: venom.publicKey,
      sig: JSON.stringify(sig),
      tokenBalace: BigInt(balance),
    })
      .then(() => {
        return refetchProposal()
      })
      .catch((err) => {
        console.error(err)
        alert("Unknow error happens, please try again or report to our team")
      })
  }

  const totalVotes = proposal?.option?.reduce((acc, cur) => acc + cur.votes, BigInt(0))

  return (
    <Layout title={`Proposal#${params.proposal} | ${dao.name}`}>
      <div className="max-w-screen-lg mx-auto flex flex-wrap justify-between gap-8 items-start">
        <div className="border rounded-xl p-8 w-[260px] text-center">
          <Image
            src={dao.avatar}
            width={82}
            height={82}
            className="rounded-full mx-auto  object-cover w-[82px] h-[82px]"
            alt="icon"
          />
          <h3 className="my-4 font-medium text-lg">{dao.name}</h3>
          <a
            href={`/${params.space}`}
            className="block my-2 border rounded-full hover:border-current py-2 mx-4"
          >
            Back to DAO
          </a>
          <a
            href={`https://testnet.venomscan.com/accounts/${dao.token}/holders`}
            className="block my-2 border rounded-full hover:border-current py-2 mx-4"
            target="_blank"
            rel="noreferrer"
          >
            View in Explorer
          </a>
          <p className="text-left">{dao.introduction}</p>
        </div>
        <div className="flex-1 flex flex-col gap-4 p-8 rounded-xl border">
          <h4 className="font-medium text-ellipsis mb-2">
            Proposal#{params.proposal} {proposal?.title}
          </h4>
          <div className="my-2">
            {proposal?.content.split("\n").map((block, idx, ary) => {
              if (idx === ary.length - 1) return block
              else
                return (
                  <Fragment key={"block-" + idx}>
                    {block}
                    <br />
                  </Fragment>
                )
            })}
          </div>
          <div className="flex flex-col gap-4 my-2">
            {proposal?.option?.map((option, idx) => {
              const share =
                totalVotes > BigInt(0)
                  ? Number((option.votes * BigInt(10000)) / totalVotes) / 100
                  : 0

              return (
                <button
                  className="relative w-full border rounded-full px-2 py-4 hover:border-current overflow-hidden"
                  key={"option-" + option.id}
                  onClick={() => voteFor(option)}
                >
                  <div
                    className="block absolute bg-slate-200 h-full top-0 left-0 z-0"
                    style={{ width: `${share}%` }}
                  ></div>
                  <span className="relative z-10">
                    {option.content} ({share.toLocaleString("en", { maximumFractionDigits: 2 })}%)
                  </span>
                </button>
              )
            })}
            <p className="text-sm text-slate-500 text-right">
              Total Votes: {totalVotes.toString()}
            </p>
          </div>
        </div>
      </div>
      <Modal
        onClose={() => {
          setVotingFor(null)
        }}
        open={votingFor !== null && !loading}
        title={"Confrim Vote to " + votingFor?.content}
        content={`You have ${new BigNumber(balance).shiftedBy(
          -9
        )} tokens in your wallet, are you sure to vote for ${votingFor?.content}?`}
        buttons={[
          {
            text: "Confirm",
            onClick: () => {
              confirmVote()
                .then(() => {
                  setVotingFor(null)
                })
                .catch((err) => {
                  console.error(err)
                  alert("Unknow error happens, please try again or report to our team")
                })
            },
            className:
              "bg-blue-100 text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          },
          {
            text: "Cancel",
            onClick: () => {
              setVotingFor(null)
            },
            className: "border-black",
          },
        ]}
      />
    </Layout>
  )
}

export default Proposal
