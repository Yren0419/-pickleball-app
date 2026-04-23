import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// 🔥 CREATE BOOKING
export async function POST(req) {
  try {
    const data = await req.json();

    // ✅ FORCE CLEAN NUMBERS
    const startNum = parseInt(data.start, 10);
    const endNum = parseInt(data.end, 10);

    // ✅ STRICT VALIDATION
    if (
      !data.name ||
      !data.date ||
      !Number.isInteger(startNum) ||
      !Number.isInteger(endNum)
    ) {
      return Response.json(
        { error: "Invalid booking data" },
        { status: 400 }
      );
    }

    if (endNum <= startNum) {
      return Response.json(
        { error: "End must be after start" },
        { status: 400 }
      );
    }

    if (data.contact && !/^09\d{9}$/.test(data.contact)) {
      return Response.json(
        { error: "Invalid contact number" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    // 🔥 OVERLAP CHECK
    const overlap = await db.collection("bookings").findOne({
      date: data.date,
      status: { $ne: "cancelled" },
      $expr: {
        $and: [
          { $lt: ["$startNum", endNum] },
          { $gt: ["$endNum", startNum] },
        ],
      },
    });

    if (overlap) {
      return Response.json(
        { error: "Slot already booked" },
        { status: 400 }
      );
    }

    await db.collection("bookings").insertOne({
      name: data.name,
      contact: data.contact || "",
      date: data.date,
      startNum,
      endNum,
      price: data.price,
      status: "active",
      createdAt: new Date(),
    });

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

// 📅 GET BOOKINGS
export async function GET(req) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  const bookings = await db
    .collection("bookings")
    .find(date ? { date } : {})
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