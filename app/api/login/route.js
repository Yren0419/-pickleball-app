import clientPromise from "@/lib/mongodb"
import jwt from "jsonwebtoken"

export async function POST(req) {
  const { user, pass } = await req.json()

  const client = await clientPromise
  const db = client.db(process.env.DB_NAME)

  const foundUser = await db.collection("users").findOne({
    username: user,
    password: pass
  })

  if (!foundUser) {
    return Response.json({ success: false })
  }

  // 🔐 CREATE TOKEN
  const token = jwt.sign(
    { username: foundUser.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  )

  // 🍪 SAVE COOKIE
  
  return new Response(
    JSON.stringify({ success: true }),
    {
      headers: {
  "Set-Cookie": `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`
}
    }
  )
}

