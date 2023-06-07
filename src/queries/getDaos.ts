import db from "db"

export default async function getDaos(props?: { offset: number; keyword: string }) {
  const offset = props?.offset || 0
  const keyword = props?.keyword
  const total = await db.dao.count({
    where: keyword
      ? {
          OR: [
            {
              name: {
                contains: keyword,
              },
            },
            {
              introduction: {
                contains: keyword,
              },
            },
          ],
        }
      : undefined,
  })
  const daos = await db.dao.findMany({
    take: 24,
    skip: offset,
    where: keyword
      ? {
          OR: [
            {
              name: {
                contains: keyword,
              },
            },
            {
              introduction: {
                contains: keyword,
              },
            },
          ],
        }
      : undefined,
    select: { id: true, name: true, avatar: true, introduction: true },
  })

  return { daos, total }
}
