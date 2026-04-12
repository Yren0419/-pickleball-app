import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET COMMENTS PER IMAGE
export async function GET(req) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  const { searchParams } = new URL(req.url);
  const imageId = searchParams.get("imageId");

  const comments = await db.collection("comments")
    .find({ imageId })
    .sort({ createdAt: -1 })
    .toArray();

  return Response.json(comments);
}

// POST COMMENT
export async function POST(req) {
  const { imageId, name, message } = await req.json();

  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  await db.collection("comments").insertOne({
    imageId,
    name,
    message,
    createdAt: new Date()
  });

  return Response.json({ success: true });
}