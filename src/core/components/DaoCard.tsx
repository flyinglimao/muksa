import Image from "next/image"

type Props = {
  name: string
  icon: string
  id: string
}

export function DaoCard({ name, icon, id }: Props) {
  return (
    <a
      className="block border rounded-xl p-8 w-[223px] text-center cursor-pointer hover:border-current"
      href={`/${id}`}
    >
      <Image src={icon} width={82} height={82} className="rounded-full mx-auto" alt="icon" />
      <h3 className="py-4 font-medium text-lg">{name}</h3>
      <button className="py-2 w-[100px] rounded-full border hover:border-current">Join</button>
    </a>
  )
}
