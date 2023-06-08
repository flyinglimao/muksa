import { BlitzPage } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { DaoCard } from "src/core/components/DaoCard"
import Layout from "src/core/layouts/Layout"
import getDaos from "src/queries/getDaos"

export const dynamic = "force-dynamic"

const Home: BlitzPage = () => {
  const router = useRouter()
  const offset = parseInt(router.query.offset as string) || 0
  const [keyword, setKeyword] = useState("")
  const [{ daos, total }] = useQuery(getDaos, { keyword, offset })

  return (
    <Layout title="Home">
      <div className="max-w-screen-lg mx-auto flex items-center justify-between">
        <h2 className="font-medium text-xl">Discover</h2>
        <input
          type="text"
          placeholder="Search..."
          className="border rounded-full px-4 py-2 w-full max-w-sm"
          onBlur={(e) => setKeyword(e.target.value)}
        />
      </div>
      <div className="max-w-screen-lg mx-auto mt-8 grid grid-cols-[repeat(auto-fill,_223px)] gap-4 justify-between">
        {daos.map((dao) => (
          <DaoCard name={dao.name} avatar={dao.avatar} id={dao.id} key={"dao-" + dao.id} />
        ))}
      </div>
      <div className="max-w-screen-lg mx-auto mt-8 text-center">
        {offset !== 0 ? <a href={`?offset=${Math.max(0, offset - 24)}`}>&lt;</a> : null}
        {offset + 24 < total ? <a href={`?offset=${Math.max(0, offset + 24)}`}>&gt;</a> : null}
      </div>
    </Layout>
  )
}

export default Home
