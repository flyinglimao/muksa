import { BlitzPage, ErrorComponent, useParams } from "@blitzjs/next"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import Layout from "src/core/layouts/Layout"
import { VenomContext } from "src/core/services/venom"
import createProposal from "src/mutations/createProposal"
import getDao from "src/queries/getDao"

const CreateProposal: BlitzPage = () => {
  const router = useRouter()
  const params = useParams("number")
  const venom = useContext(VenomContext)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [options, setOptions] = useState<string[]>([])
  const [{ dao }] = useQuery(getDao, params.space || 0)
  const [createProposalMutation] = useMutation(createProposal)

  useEffect(() => {
    if (!venom.address) venom.connect()
  }, [venom])

  if (!params.space || !dao) {
    return <ErrorComponent statusCode={404} title={"DAO not found"} />
  }

  return (
    <Layout title={`Create a new Proposal to ${dao?.name}`}>
      <div className="max-w-screen-md mx-auto border rounded-xl p-8">
        <h2 className="font-medium text-xl mb-4">Create a new Proposal to {dao?.name}</h2>
        <label className="flex flex-col items-start mt-4">
          Title
          <input
            className="py-2 px-4 rounded-xl border hover:border-current focus:border-current mt-2 w-full"
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </label>
        <label className="flex flex-col items-start mt-4">
          Content
          <textarea
            className="py-2 px-4 rounded-xl border hover:border-current focus:border-current mt-2 w-full"
            placeholder="Write your proposal here"
            onChange={(e) => setContent(e.target.value)}
            value={content}
            rows={15}
          />
        </label>
        <label className="flex flex-col items-start mt-4">
          Options
          <textarea
            className="py-2 px-4 rounded-xl border hover:border-current focus:border-current mt-2 w-full"
            placeholder="Add options here, one option per line"
            onChange={(e) => setOptions(e.target.value.split("\n"))}
            value={options.join("\n")}
            rows={3}
          />
        </label>
        <button
          className="py-2 px-16 rounded-full border mt-8 mx-auto block hover:border-current"
          onClick={() => {
            createProposalMutation({
              title,
              content,
              daoId: params.space!,
              options,
              creatorAddress: venom.address!,
            })
              .then(({ serial }) => {
                return router.push(`/${params.space}/${serial}`)
              })
              .catch((err) => {
                console.error(err)
                alert("Unknow error happens, please try again or report to our team")
              })
          }}
        >
          Create
        </button>
      </div>
    </Layout>
  )
}

export default CreateProposal
