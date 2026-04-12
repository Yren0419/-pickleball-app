import jwt from "jsonwebtoken"

export async function POST(req) {
  const { user, pass } = await req.json()

  if (
    user === process.env.ADMIN_USER &&
    pass === process.env.ADMIN_PASS
  ) {
    const token = jwt.sign(
      { role: "admin", user },
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

  return Response.json(
    { success: false },
    { status: 401 }
  )
}