import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(req, context) {
  try {
    const id = context.params?.id;

    if (!id) {
      return Response.json({ error: "Missing ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    await db.collection("gallery").deleteOne({
      _id: new ObjectId(id),
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
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