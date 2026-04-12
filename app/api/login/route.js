import jwt from "jsonwebtoken"

export async function POST(req) {
  const { user, pass } = await req.json()

  if (user === "admin" && pass === "1234") {
    const token = jwt.sign(
      {
        email: "admin",
        role: "admin"
      },
      process.env.JWT_SECRET || "testsecret",
      { expiresIn: "1d" }
    )

    return new Response(
      JSON.stringify({
        success: true,
        user: { email: "admin", role: "admin" }
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": `token=${token}; Path=/; HttpOnly; SameSite=Strict`
        }
      }
    )
  }

  return Response.json({ success: false })
}