import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import fs from "fs";
import path from "path";

export async function DELETE(req, context) {
  try {
    const { id } = await context.params;

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    // 🔍 find image first
    const image = await db.collection("gallery").findOne({
      _id: new ObjectId(id),
    });

    if (!image) {
      return Response.json({ error: "Image not found" }, { status: 404 });
    }

    // 🗑️ delete from DB
    await db.collection("gallery").deleteOne({
      _id: new ObjectId(id),
    });

    // 🧹 delete file
    if (image.imageUrl) {
      const filePath = path.join(process.cwd(), "public", image.imageUrl);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("✅ File deleted:", filePath);
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}