import db from "db"

type Props = {
  id: number
  cursor?: number
}
export default async function getProposals(props: Props) {
  const cursor = props?.cursor
  const id = props.id
  console.log(cursor, await db.proposal.findMany({ where: { daoId: id }, take: 10 }))
  const proposals =
    cursor === undefined
      ? await db.proposal.findMany({ where: { daoId: id }, take: 10 })
      : await db.proposal.findMany({
          where: { daoId: id },
          take: 11,
          skip: 1,
          cursor: { ProposalSerial: { daoId: id, serial: cursor } },
        })

  return { proposals, cursor: proposals.length == 11 ? proposals.pop()?.serial : null }
}
