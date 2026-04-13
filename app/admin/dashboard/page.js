"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
   const router = useRouter()
   const [loggingOut, setLoggingOut] = useState(false)
   const [showConfirm, setShowConfirm] = useState(false)
   const [data, setData] = useState([]);
   const [images, setImages] = useState([]);
   const [file, setFile] = useState(null);
   const [caption, setCaption] = useState("");


     useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (!data.loggedIn) {
          router.push("/login")
        }
      })
  }, [router])
}
   
   // 📡 LOAD BOOKINGS
  const loadBookings = async () => {
    const res = await fetch("/api/book");
    const result = await res.json();
    setData(result);
  };

  useEffect(() => {
    loadBookings();
  }, []);

const logout = async () => {
    setLoggingOut(true)

    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include"
      })

      setTimeout(() => {
        window.location.replace("/login")
      }, 500)

    } catch (err) {
      alert("Logout failed 💥")
      setLoggingOut(false)
    }
  }

  // ❌ DELETE
  const deleteBooking = async (id) => {
    const ok = confirm("Delete this booking permanently?");
    if (!ok) return;

    await fetch(`/api/book/${id}`, { method: "DELETE" });
    loadBookings();
  };

  // ⚠️ CANCEL
  const cancelBooking = async (id) => {
    const ok = confirm("Cancel this booking?");
    if (!ok) return;

    await fetch(`/api/book/${id}`, { method: "PUT" });
    loadBookings();
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

  // 📤 UPLOAD IMAGE
  const upload = async () => {
    if (!file) return alert("Select a file first");

    const formData = new FormData();
    formData.append("file", file);

    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadRes.json();

    if (!uploadData.imageUrl) {
      return alert("Upload failed");
    }

    await fetch("/api/gallery", {
      method: "POST",
      body: JSON.stringify({
        imageUrl: uploadData.imageUrl,
        caption,
      }),
    });

    alert("Uploaded!");

    setFile(null);
    setCaption("");

    loadImages(); // 🔄 refresh gallery
  };

  // ❌ DELETE IMAGE
  const deleteImage = async (id) => {
    const confirmDelete = confirm("Delete this image?");
    if (!confirmDelete) return;

    await fetch(`/api/gallery/${id}`, {
      method: "DELETE",
    });

    loadImages(); // 🔄 refresh
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        
       <button
  onClick={() => setShowConfirm(true)}
  className="bg-red-500 hover:bg-red-600 active:scale-95 transition text-white px-4 py-2 rounded-lg shadow-md"
       >
        Logout
      </button>

      {showConfirm && (
        <div>
          <p>Are you sure?</p>

          <button onClick={() => setShowConfirm(false)}>
            Cancel
          </button>

          <button onClick={logout} disabled={loggingOut}>
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      )}
    </div>

      {/* UPLOAD */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="font-bold mb-2">Upload Image</h2>

        <input
          type="file"
          className="mb-2"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <input
          placeholder="Caption"
          className="border p-2 w-full mb-2"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <button
          onClick={upload}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Upload
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
              <p>{b.contact}</p>
              <p>{b.date}</p>
              <p>{b.start}:00 - {b.end}:00</p>

              <p className="text-sm text-gray-500">
                Status: {b.status}
              </p>

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

    

      {/* BACK HOME */}
      <a href="/" className="block mt-6 text-blue-500 underline">
        ← Back to Home
      </a>

    </div>
  );
