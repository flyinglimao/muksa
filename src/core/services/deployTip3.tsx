import { Address, Contract, ProviderRpcClient, Transaction } from "everscale-inpage-provider"
import TokenRootAbi from "./TokenRoot.abi.json"
import TokenRootCode from "./TokenRoot.tvc.base64.json"
import TokenWalletCode from "./TokenWallet.tvc.base64.json"
import BigNumber from "bignumber.js"

const value = new BigNumber(5).shiftedBy(9).toFixed(0)

export async function deployTip3({
  publicKey,
  address,
  name,
  symbol,
  client,
  initialSupply,
}: {
  publicKey: string
  address: string
  name: string
  symbol: string
  client: ProviderRpcClient
  initialSupply: number
}): Promise<{ contract: Contract<typeof TokenRootAbi>; tx: Transaction }> {
  const walletCode = await client.splitTvc(TokenWalletCode)
  const deployParams = {
    tvc: TokenRootCode,
    publicKey: publicKey,
    initParams: {
      deployer_: new Address("0:0000000000000000000000000000000000000000000000000000000000000000"), // this field should be zero address if deploying with public key (see source code)
      randomNonce_: (Math.random() * 64000) | 0,
      rootOwner_: address,
      name_: name,
      symbol_: symbol,
      decimals_: 9,
      walletCode_: walletCode.code,
    },
  }
  const expectedAddress = await client.getExpectedAddress(TokenRootAbi, deployParams as any)
  await client.sendMessage({
    bounce: false,
    amount: value,
    sender: new Address(address),
    recipient: expectedAddress,
  })
  const contract = new client.Contract(TokenRootAbi, expectedAddress)
  const stateInit = await client.getStateInit(TokenRootAbi, deployParams as any)
  const tx = await contract.methods
    .constructor({
      initialSupplyTo: address,
      initialSupply: new BigNumber(initialSupply).shiftedBy(9).toFixed(),
      deployWalletValue: new BigNumber(1).shiftedBy(9).toFixed(0),
      mintDisabled: false,
      burnByRootDisabled: false,
      burnPaused: false,
      remainingGasTo: address,
    })
    .sendExternal({
      stateInit: stateInit.stateInit,
      publicKey: deployParams.publicKey,
    })

  return { contract, tx }
}
