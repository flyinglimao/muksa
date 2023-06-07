import { BlitzPage, ErrorComponent, useParams } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import Image from "next/image"
import { Fragment } from "react"
import Layout from "src/core/layouts/Layout"
import getDao from "src/queries/getDao"
import getProposal from "src/queries/getProposal"

const Proposal: BlitzPage = () => {
  const params = useParams("number")
  const [{ dao }] = useQuery(getDao, params.space || 0)
  const [proposal] = useQuery(getProposal, {
    daoId: params.space || 0,
    serial: params.proposal || 0,
  })

  if (!dao) {
    return <ErrorComponent statusCode={404} title={"DAO not found"} />
  }

  return (
    <Layout title={`Proposal#${params.proposal} | ${dao.name}`}>
      <div className="max-w-screen-lg mx-auto flex flex-wrap justify-between gap-8 items-start">
        <div className="border rounded-xl p-8 w-[260px] text-center">
          <Image
            src={dao.avatar}
            width={82}
            height={82}
            className="rounded-full mx-auto  object-cover w-[82px] h-[82px]"
            alt="icon"
          />
          <h3 className="my-4 font-medium text-lg">{dao.name}</h3>
          <a
            href={`/${params.space}`}
            className="block my-2 border rounded-full hover:border-current py-2 mx-4"
          >
            Back to DAO
          </a>
          <a
            href={`https://testnet.venomscan.com/accounts/${dao.token}/holders`}
            className="block my-2 border rounded-full hover:border-current py-2 mx-4"
            target="_blank"
            rel="noreferrer"
          >
            View in Explorer
          </a>
          <p className="text-left">{dao.introduction}</p>
        </div>
        <div className="flex-1 flex flex-col gap-4 p-8 rounded-xl border">
          <h4 className="font-medium text-ellipsis mb-2">
            Proposal#{params.proposal} {proposal?.title}
          </h4>
          <div className="my-2">
            {proposal?.content.split("\n").map((block, idx, ary) => {
              if (idx === ary.length - 1) return block
              else
                return (
                  <Fragment key={"block-" + idx}>
                    {block}
                    <br />
                  </Fragment>
                )
            })}
          </div>
          <div className="flex flex-col gap-4 my-2">
            {proposal?.option?.map((option, idx) => (
              <button
                className="w-full border rounded-full px-2 py-4 hover:border-current"
                key={"option-" + option.id}
              >
                {option.content}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Proposal
