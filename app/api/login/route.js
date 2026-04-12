export async function POST(req) {
  const { user, pass } = await req.json()

  if (user === "admin" && pass === "1234") {
    return Response.json({
      success: true,
      user: { role: "admin" }
    })
  }

  return Response.json(
    { success: false },
    { status: 401 }
  )
}