import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// ✅ CREATE BOOKING
export async function POST(req) {
  const data = await req.json();

  if (!data.name || !data.date || !data.start || !data.end) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  // 🚫 Prevent overlap
  const existing = await db.collection("bookings").findOne({
  date: data.date,
  $or: [
    {
      start: { $lt: data.end },
      end: { $gt: data.start }
    }
  ]
});
  if (existing) {
    return Response.json(
      { error: "Time slot already booked" },
      { status: 400 }
    );
  }

  await db.collection("bookings").insertOne({
    name: data.name,
    contact: data.contact,
    date: data.date,
    start: data.start,
    end: data.end,
    price: data.price,
    court: "Court 1",
    status: "confirmed",
    createdAt: new Date()
  });

  return Response.json({ success: true });
}

// ✅ GET BOOKINGS (WITH FILTER)
export async function GET(req) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  let query = {};
  if (date) query.date = date;

  const bookings = await db
    .collection("bookings")
    .find(query)
    .sort({ start: 1 })
    .toArray();

  return Response.json(bookings);
}

// ❌ DELETE BOOKING
export async function DELETE(req) {
  const { id } = await req.json();

  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  await db.collection("bookings").deleteOne({
    _id: new ObjectId(id)
  });

  return Response.json({ success: true });
}