import jwt from "jsonwebtoken"

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value

    if (!token) {
      return Response.json({ loggedIn: false })
    }

    const user = jwt.verify(token, process.env.JWT_SECRET)

    return Response.json({
      loggedIn: true,
      user
    })

  } catch (err) {
    return Response.json({ loggedIn: false })
  }
}