import { resolver } from "@blitzjs/rpc"
import db from "db"
import { Vote } from "../schemas"
import { EverscaleStandaloneClient } from "everscale-standalone-client"
import { Address, ProviderRpcClient } from "everscale-inpage-provider"
import { TokenRootAbi, TokenWalletAbi } from "src/core/services/deployTip3"

export default resolver.pipe(
  resolver.zod(Vote),
  async ({ daoId, serial, optionId, address, publicKey, sig, tokenBalace: tokenBalance_ }) => {
    const dao = await db.dao.findUnique({
      where: {
        id: daoId,
      },
    })
    const proposal = await db.proposal.findUnique({
      where: {
        ProposalSerial: {
          daoId,
          serial,
        },
      },
    })
    const option = await db.option.findUnique({
      where: {
        id: optionId,
      },
    })
    const vote = await db.vote.findFirst({
      where: {
        optionId,
        userAddress: address,
      },
    })
    if (!dao || !proposal || !option) throw new Error("Not found")
    if (option.proposalId !== proposal.id) throw new Error("Invalid option")
    if (proposal.daoId !== dao.id) throw new Error("Invalid proposal")
    if (vote) throw new Error("Already voted")

    const client = new ProviderRpcClient({
      forceUseFallback: true,
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
    })

    // get voting power
    // TODO: had some problem when using the following code
    // let tokenBalance = 0
    // try {
    //   const tokenAddress = new Address(dao.token)
    //   const tokenContract = new client.Contract(TokenRootAbi, tokenAddress)
    //   const tokenWallet = (await tokenContract.methods
    //     ?.walletOf?.({
    //       answerId: 0,
    //       walletOwner: address,
    //     } as never)
    //     .call()) as any
    //   if (!tokenWallet) return
    //   const walletAddress = tokenWallet.value0._address
    //   const contract = new client.Contract(TokenWalletAbi, new Address(walletAddress))
    //   const contractState = await client.rawApi.getFullContractState({
    //     address: walletAddress,
    //   })
    //   if (contractState.state) {
    //     const result = (await contract.methods?.balance?.({ answerId: 0 } as never).call()) as any
    //     tokenBalance = parseInt(result.value0)
    //   } else {
    //     tokenBalance = 0
    //   }
    // } catch (err) {
    //   console.error(err)
    //   throw new Error("Unable to get balance")
    // }

    // assume user is honest
    const tokenBalance = tokenBalance_

    // verify signature
    // TODO: how to check if an address is bind to the public key?

    // add vote
    await db.vote.create({
      data: {
        optionId: optionId,
        userAddress: address,
      },
    })
    const updateOption = await db.option.update({
      where: {
        id: optionId,
      },
      data: {
        votes: (option.votes += tokenBalance),
      },
      select: {
        votes: true,
        id: true,
      },
    })

    return { updateOption }
  }
)
