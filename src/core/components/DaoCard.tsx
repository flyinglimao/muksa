import Image from "next/image"
import { LocalDataContext } from "../services/localData"
import { useContext } from "react"

type Props = {
  name: string
  avatar: string
  id: number
}

export function DaoCard({ name, avatar, id }: Props) {
  const { joinedDaos, addJoinedDao } = useContext(LocalDataContext)
  const joined = joinedDaos.find((e) => e.id === id)
  return (
    <a
      className={"block border rounded-xl p-8 w-[223px] text-center hover:border-current"}
      href={`/${id}`}
    >
      <Image
        src={avatar}
        width={82}
        height={82}
        className="rounded-full mx-auto object-cover w-[82px] h-[82px]"
        alt="icon"
      />
      <h3 className="py-4 font-medium text-lg">{name}</h3>
      {joined ? (
        <button className="py-2 w-[100px] rounded-full border" disabled>
          Joined
        </button>
      ) : (
        <button
          className="py-2 w-[100px] rounded-full border hover:border-current"
          onClick={(evt) => {
            addJoinedDao({ name, avatar, id })
          }}
        >
          Join
        </button>
      )}
    </a>
  )
}
