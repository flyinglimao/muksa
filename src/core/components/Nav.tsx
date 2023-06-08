import homeIcon from "../../../public/home-icon.png"
import plusIcon from "../../../public/plus-icon.png"
import { useRouter } from "next/router"

import NavModule from "../../styles/Nav.module.css"
import Image from "next/image"
import { useContext } from "react"
import { LocalDataContext } from "../services/localData"
import { useParam } from "@blitzjs/next"

function NavItem({
  avatar,
  activeAvatar,
  path,
  active,
  name,
  className,
}: {
  avatar: string
  activeAvatar?: string
  path: string
  active: boolean
  name: string
  className?: string
}) {
  return (
    <a
      href={path}
      className={
        className +
        " border-2 w-[44px] h-[44px] rounded-full block relative mx-[auto] my-[8px] p-[2px] " +
        (active ? "border-[#60053b] " + NavModule["active"] : "border-slate-300")
      }
    >
      <Image
        src={active && activeAvatar ? activeAvatar : avatar}
        alt={name}
        width={36}
        height={36}
        className="w-[36px] h-[36px] object-cover rounded-full overflow-hidden"
      />
    </a>
  )
}

export function Nav() {
  const { joinedDaos } = useContext(LocalDataContext)
  const router = useRouter()
  const pathStructure = router.asPath.split("/")
  return (
    <nav className="w-[60px] h-[100vh] fixed top-0 left-0 bg-white border-r-2 pt-[16px] overflow-y-auto scrollbar-none">
      <NavItem avatar={homeIcon.src} path="/" active={router.pathname === "/"} name="Home Page" />
      {joinedDaos.map((dao) => (
        <NavItem
          avatar={dao.avatar}
          path={"/" + dao.id}
          active={pathStructure[1] === dao.id.toString()}
          name={dao.name}
          key={"space-" + dao.id}
        />
      ))}
      <NavItem
        avatar={plusIcon.src}
        path="/create"
        active={pathStructure[1] === "create"}
        name="Create new DAO"
        className="mt-[16px]"
      />
    </nav>
  )
}
