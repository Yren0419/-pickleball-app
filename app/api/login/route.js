import jwt from "jsonwebtoken"

export async function POST(req) {
  try {
    const { user, pass } = await req.json()

    // check admin credentials from env
    const isAdmin =
      user === process.env.ADMIN_USER &&
      pass === process.env.ADMIN_PASS

    if (!isAdmin) {
      return Response.json(
        { success: false, message: "Invalid login" },
        { status: 401 }
      )
    }

    // create JWT token
    const token = jwt.sign(
      {
        email: user,
        role: "admin"
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    // return response with secure cookie
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          email: user,
          role: "admin"
        }
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": `token=${token}; Path=/; HttpOnly; SameSite=Strict`
        }
      }
    )
  } catch (error) {
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}