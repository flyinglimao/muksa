import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateDao } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateDao),
  async ({ name, avatar, introduction, token }, ctx) => {
    const dao = await db.dao.create({
      data: { name, avatar, introduction, token },
      select: { id: true, name: true },
    })

    return dao
  }
)
