// app/api/announcement/route.js

import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// 📢 GET ALL ANNOUNCEMENTS
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const data = await db
      .collection("announcements")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: "Failed to load announcements" },
      { status: 500 }
    );
  }
}

// 📢 CREATE ANNOUNCEMENT
export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.text || !body.text.trim()) {
      return Response.json(
        { error: "Announcement text required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    await db.collection("announcements").insertOne({
      text: body.text.trim(),
      createdAt: new Date(),
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Failed to post announcement" },
      { status: 500 }
    );
  }
}

// 📢 DELETE ANNOUNCEMENT
export async function DELETE(req) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    await db.collection("announcements").deleteOne({
      _id: new ObjectId(body.id),
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Failed to delete announcement" },
      { status: 500 }
    );
  }
}