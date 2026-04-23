"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [images, setImages] = useState([]);
  const [data, setData] = useState([]);

  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const [announcement, setAnnouncement] = useState("");
  const [announcements, setAnnouncements] = useState([]);

  // ===============================
  // LOAD PAGE
  // ===============================
  useEffect(() => {
    checkAuth();
    loadBookings();
    loadImages();
    loadAnnouncements();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const user = await res.json();

      if (!user.loggedIn) {
        window.location.replace("/admin");
      }
    } catch {
      window.location.replace("/admin");
    }
  };

  // ===============================
  // BOOKINGS
  // ===============================
  const loadBookings = async () => {
    try {
      const res = await fetch("/api/book");
      const result = await res.json();
      setData(Array.isArray(result) ? result : []);
    } catch {
      setData([]);
    }
  };

  const deleteBooking = async (id) => {
    if (!confirm("Delete booking?")) return;

    await fetch(`/api/book/${id}`, {
      method: "DELETE",
    });

    loadBookings();
  };

  const cancelBooking = async (id) => {
    if (!confirm("Cancel booking?")) return;

    await fetch(`/api/book/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "cancelled",
      }),
    });

    loadBookings();
  };

  const markNoShow = async (id) => {
    if (!confirm("Mark as no-show?")) return;

    await fetch(`/api/book/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "no-show",
      }),
    });

    loadBookings();
  };

  // ===============================
  // GALLERY
  // ===============================
  const loadImages = async () => {
    try {
      const res = await fetch("/api/gallery");
      const result = await res.json();
      setImages(Array.isArray(result) ? result : []);
    } catch {
      setImages([]);
    }
  };

  const uploadImage = async () => {
    if (!file) return alert("Select image first");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        alert(uploadData.error || "Upload failed");
        return;
      }

      await fetch("/api/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: uploadData.imageUrl,
          caption,
        }),
      });

      setFile(null);
      setCaption("");
      loadImages();
      alert("Uploaded!");
    } catch {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (id) => {
    if (!confirm("Delete image?")) return;

    await fetch(`/api/gallery/${id}`, {
      method: "DELETE",
    });

    loadImages();
  };

  // ===============================
  // ANNOUNCEMENTS
  // ===============================
  const loadAnnouncements = async () => {
    try {
      const res = await fetch("/api/announcement");
      const result = await res.json();
      setAnnouncements(Array.isArray(result) ? result : []);
    } catch {
      setAnnouncements([]);
    }
  };

  const postAnnouncement = async () => {
    if (!announcement.trim()) return;

    await fetch("/api/announcement", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: announcement,
      }),
    });

    setAnnouncement("");
    loadAnnouncements();
  };

  const deleteAnnouncement = async (id) => {
    if (!confirm("Delete announcement?")) return;

    await fetch("/api/announcement", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    });

    loadAnnouncements();
  };

  // ===============================
  // LOGOUT
  // ===============================
  const logout = async () => {
    await fetch("/api/logout");
    window.location.replace("/admin");
  };

  // ===============================
  // SORT BOOKINGS
  // ===============================
  const today = new Date().toISOString().split("T")[0];

  const groupedBookings = Object.entries(
    data.reduce((acc, item) => {
      if (!acc[item.date]) acc[item.date] = [];
      acc[item.date].push(item);
      return acc;
    }, {})
  ).sort((a, b) => new Date(a[0]) - new Date(b[0]));
  
  const getHour = (b, keyNum, keyStr) => {
  const val = b?.[keyNum] ?? b?.[keyStr];

  if (val === null || val === undefined || val === "") return null;

  const match = String(val).match(/\d{1,2}/);
  return match ? Number(match[0]) : null;
};

const formatTime = (b, keyNum, keyStr) => {
  const t = getHour(b, keyNum, keyStr);

  if (t === null) return "--";

  if (t === 0) return "12:00 AM";
  if (t < 12) return `${t}:00 AM`;
  if (t === 12) return `12:00 PM`;
  return `${t - 12}:00 PM`;
};
  return (
    <div className="min-h-screen bg-gray-100 text-black">
      {/* HEADER */}
      <div className="sticky top-0 z-20 bg-white shadow px-4 md:px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-green-600">
            🏓 Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            D'bckyrd Pickleball Court
          </p>
        </div>

        <div className="flex gap-2">
          <a
            href="/"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
          >
            Home
          </a>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="p-4 md:p-6 grid md:grid-cols-2 gap-6">
        {/* LEFT SIDE */}
        <div className="space-y-6">
          {/* UPLOAD */}
          <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="font-bold text-lg mb-3">
              Upload Gallery Image
            </h2>

            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0])}
              className="w-full mb-3"
            />

            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Caption"
              className="border p-2 rounded-lg w-full mb-3"
            />

            <button
              onClick={uploadImage}
              disabled={loading}
              className="bg-green-500 text-white w-full py-2 rounded-lg"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {/* ANNOUNCEMENT */}
          <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="font-bold text-lg mb-3">
              📢 Announcements
            </h2>

            <textarea
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              placeholder="Write announcement..."
              className="border p-2 rounded-lg w-full mb-3"
            />

            <button
              onClick={postAnnouncement}
              className="bg-green-500 text-white w-full py-2 rounded-lg"
            >
              Post Announcement
            </button>

            <div className="mt-4 space-y-3">
              {announcements.map((item) => (
                <div
                  key={item._id}
                  className="border rounded-xl p-3 bg-gray-50"
                >
                  <p>{item.text}</p>

                  <button
                    onClick={() =>
                      deleteAnnouncement(item._id)
                    }
                    className="text-red-500 text-sm mt-2"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* GALLERY */}
          <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="font-bold text-lg mb-3">
              Gallery
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {images.map((img) => (
                <div
                  key={img._id}
                  className="border rounded-xl overflow-hidden"
                >
                  <img
                    src={img.imageUrl}
                    className="w-full h-28 object-cover"
                  />

                  <div className="p-2">
                    <p className="text-xs mb-2">
                      {img.caption}
                    </p>

                    <button
                      onClick={() => deleteImage(img._id)}
                      className="bg-red-500 text-white w-full py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white rounded-2xl shadow p-4 h-fit">
          <h2 className="font-bold text-lg mb-4">
            📅 Bookings
          </h2>

          {groupedBookings.length === 0 ? (
            <p>No bookings yet</p>
          ) : (
            <div className="space-y-5">
              {groupedBookings.map(([date, items]) => {
                const isToday = date === today;

                const dayName = new Date(date).toLocaleDateString(
                  "en-US",
                  { weekday: "long" }
                );

                return (
                  <div
                    key={date}
                    className={`rounded-2xl border p-4 ${
                      isToday
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h3 className="font-bold text-green-600">
                          {date}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {dayName}
                        </p>
                      </div>

                      {isToday && (
                        <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                          TODAY
                        </span>
                      )}
                    </div>

                    <div className="space-y-3">
                      {items
      .sort((a, b) => {
  const getTime = (item) => {
    const val = item?.startNum ?? item?.start ?? 0;

    const match = String(val).match(/\d{1,2}/);
    return match ? Number(match[0]) : 0;
  };

  return getTime(a) - getTime(b);
})
                        .map((b) => (
                          <div
                            key={b._id}
                            className="border rounded-xl p-3"
                          >
                            <p className="font-bold">
                              {b.name}
                            </p>

                            <p className="text-sm text-gray-500">
                              {b.contact}
                            </p>

                            <p className="text-sm mt-1">
                             {(() => {
  const get = (val) => {
    if (val === undefined || val === null) return null;
    const match = String(val).match(/\d{1,2}/);
    return match ? Number(match[0]) : null;
  };

  const start = get(b.startNum ?? b.start);
  const end = get(b.endNum ?? b.end);

  const format = (t) => {
    if (t === null) return "--";
    if (t === 0) return "12:00 AM";
    if (t < 12) return `${t}:00 AM`;
    if (t === 12) return `12:00 PM`;
    return `${t - 12}:00 PM`;
  };

  return `${format(start)} → ${format(end)}`;
})()}
                            </p>

                            <div className="grid grid-cols-3 gap-2 mt-3">
                              <button
                                onClick={() =>
                                  cancelBooking(b._id)
                                }
                                className="bg-yellow-500 text-white py-1 rounded text-xs"
                              >
                                Cancel
                              </button>

                              <button
                                onClick={() =>
                                  markNoShow(b._id)
                                }
                                className="bg-gray-600 text-white py-1 rounded text-xs"
                              >
                                No Show
                              </button>

                              <button
                                onClick={() =>
                                  deleteBooking(b._id)
                                }
                                className="bg-red-500 text-white py-1 rounded text-xs"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}