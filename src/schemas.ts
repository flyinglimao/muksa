import { z } from "zod"

export const CreateDao = z.object({
  name: z.string(),
  avatar: z.string(),
  introduction: z.string(),
  token: z.string(),
})
