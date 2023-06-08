import { z } from "zod"

export const CreateDao = z.object({
  name: z.string(),
  avatar: z.string(),
  introduction: z.string(),
  token: z.string(),
})
export const CreateProposal = z.object({
  daoId: z.number(),
  title: z.string(),
  content: z.string(),
  options: z.array(z.string()),
  creatorAddress: z.string(),
})
export const Vote = z.object({
  daoId: z.number(),
  serial: z.number(),
  publicKey: z.string(),
  sig: z.string(),
  optionId: z.number(),
  address: z.string(),
  tokenBalace: z.bigint(),
})
