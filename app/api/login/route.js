import clientPromise from "@/lib/mongodb"

export async function POST(req) {
  const { user, pass } = await req.json()

  const client = await clientPromise
  const db = client.db(process.env.DB_NAME)

  const foundUser = await db.collection("users").findOne({
    username: user,
    password: pass
  })

  if (foundUser) {
    return Response.json({ success: true })
  }

  return Response.json({ success: false })
}
