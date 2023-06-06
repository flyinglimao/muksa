import { BlitzPage } from "@blitzjs/next"
import { DaoCard } from "src/core/components/DaoCard"
import Layout from "src/core/layouts/Layout"

const Home: BlitzPage = () => {
  return (
    <Layout title="Home">
      <div className="max-w-screen-lg mx-auto flex items-center justify-between">
        <h2 className="font-medium text-xl">Discover</h2>
        <input
          type="text"
          placeholder="Search..."
          className="border rounded-full px-4 py-2 w-full max-w-sm"
        />
      </div>
      <div className="max-w-screen-lg mx-auto mt-8 grid grid-cols-[repeat(auto-fill,_223px)] gap-4 justify-between">
        <DaoCard name="Space" icon="https://cdn.stamp.fyi/space/stgdao.eth?s=164" id="1" />
        <DaoCard name="Space" icon="https://cdn.stamp.fyi/space/stgdao.eth?s=164" id="1" />
        <DaoCard name="Space" icon="https://cdn.stamp.fyi/space/stgdao.eth?s=164" id="1" />
        <DaoCard name="Space" icon="https://cdn.stamp.fyi/space/stgdao.eth?s=164" id="1" />
        <DaoCard name="Space" icon="https://cdn.stamp.fyi/space/stgdao.eth?s=164" id="1" />
      </div>
    </Layout>
  )
}

export default Home
