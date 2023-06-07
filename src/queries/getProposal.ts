import db from "db"

type Props = {
  daoId: number
  serial: number
}
export default async function getProposal({ daoId, serial }: Props) {
  return await db.proposal.findUnique({
    where: {
      ProposalSerial: {
        daoId,
        serial,
      },
    },
    include: {
      option: true,
    },
  })
}
