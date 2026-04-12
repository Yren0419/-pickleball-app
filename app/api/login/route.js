import jwt from "jsonwebtoken"

export async function POST(req) {
  const { user, pass } = await req.json()

  const isAdmin =
    user === process.env.ADMIN_USER &&
    pass === process.env.ADMIN_PASS

  if (!isAdmin) {
    return Response.json(
      { success: false },
      { status: 401 }
    )
  }

  const token = jwt.sign(
    { email: user, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  )

  return new Response(
    JSON.stringify({ success: true }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": `token=${token}; Path=/; HttpOnly; SameSite=Lax`
      }
    }
  )
}