import { BlitzPage } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"

const CreateProposal: BlitzPage = () => {
  const name = "Space"
  const icon = "https://cdn.stamp.fyi/space/stgdao.eth?s=164"
  const id = "1"
  return (
    <Layout title={name}>
      <div className="max-w-screen-lg mx-auto flex flex-wrap justify-between gap-8 items-start"></div>
    </Layout>
  )
}

export default CreateProposal
