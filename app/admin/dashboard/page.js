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
      .then((res) => res.json())
      .then((data) => {
        if (!data.loggedIn) {
          window.location.replace("/admin");
        }
      });

    loadBookings();
    loadImages();
  }, []);

  // 📡 LOAD BOOKINGS
  const loadBookings = async () => {
    const res = await fetch("/api/book");
    const result = await res.json();
    setData(result);
  };

  // 📡 LOAD IMAGES
  const loadImages = () => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then(setImages);
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

    await fetch(`/api/book/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });

    loadBookings();
  };

  // 🚫 NO SHOW
  const markNoShow = async (id) => {
    if (!confirm("Mark as no-show?")) return;

    await fetch(`/api/book/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "no-show" }),
    });

    loadBookings();
  };

  // 📸 UPLOAD IMAGE
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

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "Upload failed");
        return;
      }

      await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: result.imageUrl,
          caption,
        }),
      });

      setFile(null);
      setCaption("");
      loadImages();
      alert("Uploaded!");
    } catch (err) {
      alert("Upload error");
    } finally {
      setLoading(false);
    }
  };

  // ❌ DELETE IMAGE
  const deleteImage = async (id) => {
    if (!confirm("Delete this image?")) return;
    await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    loadImages();
  };

  // 🚪 LOGOUT
  const logout = async () => {
    await fetch("/api/logout");
    window.location.replace("/admin");
  };

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          Admin Dashboard
        </h1>

        <div className="flex gap-2">
          <a
            href="/"
            className="bg-blue-500 text-white px-4 py-2 rounded font-semibold"
          >
            Home
          </a>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      {/* UPLOAD */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 text-gray-900">
        <h2 className="font-bold mb-2">Upload Image</h2>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0])}
          className="mb-2 text-gray-700"
        />

        <input
          placeholder="Caption"
          value={caption}
          className="border p-2 w-full mb-2 rounded text-gray-900 placeholder:text-gray-500"
          onChange={(e) => setCaption(e.target.value)}
        />

        <button
          onClick={uploadImage}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded font-semibold w-full"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* GALLERY */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">

        {images.map((img) => (
          <div
            key={img._id}
            className="bg-white p-2 rounded-xl shadow text-gray-900"
          >
            <img
              src={img.imageUrl}
              className="w-full h-40 object-cover rounded"
            />

            <p className="text-sm mt-2 text-gray-800">
              {img.caption}
            </p>

            <button
              onClick={() => deleteImage(img._id)}
              className="bg-red-500 text-white w-full mt-2 py-1 rounded font-semibold"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* BOOKINGS */}
      <div className="bg-white p-4 rounded-xl shadow text-gray-900">

        <h2 className="font-bold mb-4">Bookings</h2>

        {data.length === 0 ? (
          <p className="text-gray-700">No bookings yet</p>
        ) : (
          data.map((b) => (
            <div
              key={b._id}
              className="border p-3 mb-3 rounded-lg text-gray-900"
            >
              <p><b>{b.name}</b></p>
              <p>{b.date}</p>
              <p>{b.start}:00 - {b.end}:00</p>

              <p className="text-sm mt-1 text-gray-800 font-medium">
                Status: {b.status || "active"}
              </p>

              <div className="flex gap-2 mt-2">

                <button
                  onClick={() => cancelBooking(b._id)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded font-semibold"
                >
                  Cancel
                </button>

                <button
                  onClick={() => markNoShow(b._id)}
                  className="bg-gray-600 text-white px-3 py-1 rounded font-semibold"
                >
                  No Show
                </button>

                <button
                  onClick={() => deleteBooking(b._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded font-semibold"
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