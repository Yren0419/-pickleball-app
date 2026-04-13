"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
   const [images, setImages] = useState([]);
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 PROTECT PAGE
  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (!data.loggedIn) {
          window.location.replace("/admin");
        }
      });

    loadBookings();
  }, []);

  const loadBookings = async () => {
    const res = await fetch("/api/book");
    const result = await res.json();
    setData(result);
  };

  // ❌ DELETE BOOKING
  const deleteBooking = async (id) => {
    if (!confirm("Delete booking?")) return;

    await fetch(`/api/book/${id}`, { method: "DELETE" });
    loadBookings();
  };

  // ⚠️ CANCEL BOOKING
  const cancelBooking = async (id) => {
    if (!confirm("Cancel booking?")) return;

    await fetch(`/api/book/${id}`, { method: "PUT" });
    loadBookings();
  };

  const uploadImage = async () => {
  if (!file) return alert("Select image");

  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Upload failed");
      return;
    }

    await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageUrl: data.imageUrl,
        caption,
      }),
    });

    alert("Uploaded!");
    setFile(null);
    setCaption("");
    loadImages();

  } catch (err) {
    alert("Upload error");
  } finally {
    setLoading(false);
  }
};
   
    // 📡 LOAD IMAGES
  const loadImages = () => {
    fetch("/api/gallery")
      .then(res => res.json())
      .then(setImages);
  };

  useEffect(() => {
    loadImages();
  }, []);


   // ❌ DELETE IMAGE
  const deleteImage = async (id) => {
    const confirmDelete = confirm("Delete this image?");
    if (!confirmDelete) return;

    await fetch(`/api/gallery/${id}`, {
      method: "DELETE",
    });

    loadImages(); // 🔄 refresh
  };

  // 🚪 LOGOUT
  const logout = async () => {
    await fetch("/api/logout"); // 👈 important
    window.location.replace("/admin");
  };

  return (
    <div className="p-4 md:p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>

        <div className="flex gap-2">
          <a href="/" className="bg-blue-500 text-white px-4 py-2 rounded">
            Home
          </a>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* UPLOAD */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="font-bold mb-2">Upload Image</h2>

        <input
           type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-2"
        />

        <input
          placeholder="Caption"
          value={caption}
          className="border p-2 w-full mb-2"
          onChange={(e) => setCaption(e.target.value)}
        />

        <button
  onClick={uploadImage}
  disabled={loading}
  className="bg-green-500 text-white px-4 py-2 rounded"
>
  {loading ? "Uploading..." : "Upload"}
</button>
      </div>

      {/* GALLERY LIST */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img) => (
          <div key={img._id} className="bg-white p-2 rounded-xl shadow">

            <img
              src={img.imageUrl}
              className="w-full h-40 object-cover rounded"
            />

            <p className="text-sm mt-2">{img.caption}</p>

            <button
              onClick={() => deleteImage(img._id)}
              className="bg-red-500 text-white w-full mt-2 py-1 rounded"
            >
              Delete
            </button>

          </div>
        ))}
      </div>
        

      {/* BOOKINGS */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-bold mb-4">Bookings</h2>

        {data.length === 0 ? (
          <p>No bookings yet</p>
        ) : (
          data.map((b) => (
            <div key={b._id} className="border p-3 mb-3 rounded-lg">
              <p><b>{b.name}</b></p>
              <p>{b.date}</p>
              <p>{b.start}:00 - {b.end}:00</p>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => cancelBooking(b._id)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={() => deleteBooking(b._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}