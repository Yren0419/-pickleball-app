import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  const data = await db.collection("gallery").find().toArray();
  return Response.json(data);
}

export async function POST(req) {
  const { imageUrl, caption } = await req.json();

  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  await db.collection("gallery").insertOne({
    imageUrl,
    caption,
    createdAt: new Date()
  });

  return Response.json({ success: true });
}