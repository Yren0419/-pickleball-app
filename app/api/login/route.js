export async function POST(req) {
  const { user, pass } = await req.json()

  // TEMP HARDCODE (TEST ONLY)
  if (user === "admin" && pass === "1234") {
    return Response.json({
      success: true,
      user: {
        email: "admin",
        role: "admin"
      }
    })
  }

  return Response.json({ success: false })
}