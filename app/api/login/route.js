export async function POST(req) {
  const { user, pass } = await req.json()

  console.log("INPUT RECEIVED:", { user, pass })

  if (user === "admin" && pass === "1234") {
    return Response.json({ success: true })
  }

  return Response.json({ success: false })
}