// app/api/book/route.js

import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// convert hour safely
function toHour(value) {
  return Number(String(value).split(":")[0]);
}

// ✅ CREATE BOOKING
export async function POST(req) {
  try {
    const data = await req.json();

    if (!data.name || !data.contact || !data.date || !data.start || !data.end) {
      return Response.json(
        { error: "Please fill all fields" },
        { status: 400 }
      );
    }

    const startNum = toHour(data.start);
    const endNum = toHour(data.end);

    if (endNum <= startNum) {
      return Response.json(
        { error: "Invalid time selection" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    // 🚫 prevent overlap
    const existing = await db.collection("bookings").findOne({
      date: data.date,
      court: "Court 1",
      status: { $ne: "cancelled" },
      startNum: { $lt: endNum },
      endNum: { $gt: startNum },
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
      start: String(data.start),
      end: String(data.end),
      startNum,
      endNum,
      price: data.price,
      court: "Court 1",
      status: "active",
      createdAt: new Date(),
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Booking failed" },
      { status: 500 }
    );
  }
}

// ✅ GET BOOKINGS
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
    .sort({ startNum: 1 })
    .toArray();

  return Response.json(bookings);
}

// ❌ DELETE
export async function DELETE(req) {
  const { id } = await req.json();

  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  await db.collection("bookings").deleteOne({
    _id: new ObjectId(id),
  });

  return Response.json({ success: true });
}