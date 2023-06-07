import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateProposal } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateProposal),
  async ({ daoId, title, content, creatorAddress, options }) => {
    const prevProposal = await db.proposal.findFirst({
      where: {
        daoId,
      },
      orderBy: {
        serial: "desc",
      },
      select: {
        serial: true,
      },
    })
    const proposal = await db.proposal.create({
      data: {
        daoId,
        creatorAddress,
        serial: prevProposal ? prevProposal.serial + 1 : 1,
        title,
        content,
        option: {
          create: options.map((option) => ({
            content: option,
            votes: 0,
          })),
        },
      },
      select: { serial: true },
    })

    return proposal
  }
)
