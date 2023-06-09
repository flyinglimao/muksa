import db from "db"

type Props = {
  daoId: number
  serial: number
  address?: string
}
export default async function getProposal({ daoId, serial, address }: Props) {
  return await db.proposal.findUnique({
    where: {
      ProposalSerial: {
        daoId,
        serial,
      },
    },
    include: {
      option: {
        include: {
          vote: {
            where: {
              userAddress: address,
            },
          },
        },
      },
    },
  })
}
