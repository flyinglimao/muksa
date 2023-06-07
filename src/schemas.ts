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
