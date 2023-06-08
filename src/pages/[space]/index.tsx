import { BlitzPage, ErrorComponent, useParams } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import Image from "next/image"
import { ProposalCard } from "src/core/components/ProposalCard"
import { useInfiniteQuery, useQuery } from "@blitzjs/rpc"
import getDao from "src/queries/getDao"
import getProposal from "src/queries/getProposals"

const Space: BlitzPage = () => {
  const params = useParams("number")
  const [{ dao }] = useQuery(getDao, params.space || 0)
  const [pages, { isFetching, isFetchingNextPage, fetchNextPage, hasNextPage }] = useInfiniteQuery(
    getProposal,
    (page = { id: params.space }) => page,
    {
      getNextPageParam: (lastPage) => ({
        id: params.space,
        cursor: lastPage.cursor,
      }),
    }
  )
  if (!dao) {
    return <ErrorComponent statusCode={404} title={"DAO not found"} />
  }

  console.log(pages)
  const proposals = pages.map((page) => page.proposals).flat()

  return (
    <Layout title={dao.name}>
      <div className="max-w-screen-lg mx-auto flex flex-wrap justify-between gap-8 items-start">
        <div className="border rounded-xl p-8 w-[260px] text-center">
          <Image
            src={dao.avatar}
            width={82}
            height={82}
            className="rounded-full mx-auto object-cover w-[82px] h-[82px]"
            alt="icon"
          />
          <h3 className="my-4 font-medium text-lg">{dao.name}</h3>
          <a
            href={`/${params.space}/create`}
            className="block my-2 border rounded-full hover:border-current py-2 mx-4"
          >
            Create a Proposal
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
        <div className="flex-1 flex flex-col gap-4">
          {proposals.length === 0 ? (
            <div className="p-8 rounded-xl border">
              <p>
                There are no proposals, would you like to{" "}
                <a href={`/${params.space}/create`} className="decoration-1 underline text-sky-600">
                  be the first
                </a>
                ?
              </p>
            </div>
          ) : (
            proposals.map((proposal) => (
              <ProposalCard
                daoId={proposal.daoId}
                serial={proposal.serial}
                title={proposal.title}
                introduction={proposal.content}
                key={"proposal-" + proposal.id}
              />
            ))
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Space
