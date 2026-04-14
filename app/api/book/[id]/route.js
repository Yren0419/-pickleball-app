import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// ❌ DELETE
export async function DELETE(req, context) {
  const { id } = await context.params; // ✅ FIX

  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  await db.collection("bookings").deleteOne({
    _id: new ObjectId(id),
  });

  return Response.json({ success: true });
}

// ✏️ UPDATE (cancel / no-show)
export async function PUT(req, context) {
  const { id } = await context.params; // ✅ FIX

  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const collection = db.collection("bookings");

  let body = {};

  try {
    body = await req.json(); // ✅ safe parse
  } catch {
    body = {}; // 👈 prevents crash if no body
  }

  // ✅ default fallback (for old cancel button)
  if (!body.status) {
    body.status = "cancelled";
  }

  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: body }
  );

  return Response.json({ success: true });
}
/*import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// DELETE BOOKING
export async function DELETE(req, { params }) {
  const id = params.id

  const client = await clientPromise
  const db = client.db(process.env.DB_NAME)

  await db.collection("bookings").deleteOne({
    _id: new ObjectId(id)
  })

  return Response.json({ success: true })
}

// CANCEL BOOKING
export async function PUT(req, { params }) {
  const id = params.id

  const client = await clientPromise
  const db = client.db(process.env.DB_NAME)

  await db.collection("bookings").updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: "cancelled" } }
  )

  return Response.json({ success: true })
} */