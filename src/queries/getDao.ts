import db from "db"

export default async function getDao(id: number) {
  const dao = await db.dao.findUnique({
    where: {
      id: id,
    },
    select: { id: true, name: true, avatar: true, introduction: true, token: true },
  })

  return { dao }
}
