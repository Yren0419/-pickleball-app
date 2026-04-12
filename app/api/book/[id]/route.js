import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// ❌ DELETE
export async function DELETE(req, { params }) {
  const id = params?.id

  if (!id) {
    return Response.json({ error: "Missing id" }, { status: 400 })
  }

  const client = await clientPromise
  const db = client.db(process.env.DB_NAME)

  await db.collection("bookings").deleteOne({
    _id: new ObjectId(id),
  })

  return Response.json({ success: true })
}

// ⚠️ CANCEL
export async function PUT(req, { params }) {
  const id = params?.id

  if (!id) {
    return Response.json({ error: "Missing id" }, { status: 400 })
  }

  const client = await clientPromise
  const db = client.db(process.env.DB_NAME)

  await db.collection("bookings").updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: "cancelled" } }
  )

  return Response.json({ success: true })
}