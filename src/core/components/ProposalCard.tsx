export function ProposalCard({
  serial,
  title,
  introduction,
}: {
  serial: number
  title: string
  introduction: string
}) {
  return (
    <a className="block p-8 rounded-xl border hover:border-current" href={"/1/1"}>
      <h4 className="font-medium mb-2 line-clamp-1">
        Proposal#{serial} {title}
      </h4>
      <p className="line-clamp-2">{introduction}</p>
    </a>
  )
}
