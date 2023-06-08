export function ProposalCard({
  daoId,
  serial,
  title,
  introduction,
}: {
  daoId: number
  serial: number
  title: string
  introduction: string
}) {
  return (
    <a className="block p-8 rounded-xl border hover:border-current" href={`/${daoId}/${serial}`}>
      <h4 className="font-medium mb-2 line-clamp-1">
        Proposal#{serial} {title}
      </h4>
      <p className="line-clamp-2">{introduction}</p>
    </a>
  )
}
