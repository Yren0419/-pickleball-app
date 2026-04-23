"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [images, setImages] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const [index, setIndex] = useState(null);
  const [zoomed, setZoomed] = useState(false);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // 📸 LOAD GALLERY
  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        const clean = (data || []).filter((img) => img?.imageUrl);
        setImages(clean);
      })
      .catch(() => {});
  }, []);

  // 📢 LOAD ANNOUNCEMENTS
  useEffect(() => {
    fetch("/api/announcement")
      .then((res) => res.json())
      .then((data) => {
        setAnnouncements(data || []);
      })
      .catch(() => {});
  }, []);

  // 🔄 RESET ZOOM
  useEffect(() => {
    setZoomed(false);
  }, [index]);

  // ⌨️ KEYBOARD NAVIGATION
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (index === null) return;

      if (e.key === "Escape") setIndex(null);

      if (e.key === "ArrowRight") {
        setIndex((prev) => (prev + 1) % images.length);
      }

      if (e.key === "ArrowLeft") {
        setIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index, images.length]);

  // 📱 SWIPE
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;

    if (distance > 50) {
      setIndex((prev) => (prev + 1) % images.length);
    }

    if (distance < -50) {
      setIndex((prev) => (prev - 1 + images.length) % images.length);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const next = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-black p-4 md:p-6">

      {/* NAVBAR */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-white shadow rounded-2xl p-4 gap-4">

        <div className="flex items-center gap-3 justify-center md:justify-start">
          <img src="/logo.png" className="w-10 h-10" alt="Logo" />
          <h1 className="font-bold text-lg text-black">D'bckyrd</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <a
            href="/book"
            className="bg-green-500 text-white px-4 py-2 rounded-lg text-center"
          >
            Book Now
          </a>

          <a
            href="/admin"
            className="bg-gray-800 text-white px-4 py-2 rounded-lg text-center"
          >
            Admin
          </a>

          <a
            href="https://facebook.com/share/1RpaNtPa9A"
            target="_blank"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center"
          >
            Facebook
          </a>
        </div>
      </div>

      {/* HERO */}
      <div className="text-center py-14">
        <h1 className="text-4xl font-bold text-lime-200 mb-4">
          Book Your Pickleball Court 🎾
        </h1>

        <p className="text-gray-200 mb-6">
          Fast. Easy. Hassle-free booking at D'bckyrd.
        </p>

        <a
          href="/book"
          className="bg-green-500 text-white px-6 py-3 rounded-xl"
        >
          Book Now
        </a>
      </div>

      {/* 📢 ANNOUNCEMENTS */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6 mb-8">

        <h2 className="text-xl font-bold text-black mb-4">
          📢 Announcements
        </h2>

        {/* DEFAULT INFO */}
        <ul className="space-y-2 text-gray-700 mb-4">
          <li>✔ Open Monday - Saturday</li>
          <li>✔ Morning: 6AM - 10AM</li>
          <li>✔ Evening: 4PM - 8PM</li>
          <li>✔ Rate: ₱100 per hour</li>
        </ul>

        {/* ADMIN POSTS */}
        {announcements.length > 0 && (
          <div className="space-y-3 border-t pt-4">
            {announcements.map((item) => (
              <div
                key={item._id}
                className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded"
              >
                <p className="text-gray-800">{item.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LOCATION */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6 mb-8">

        <h2 className="text-xl font-bold text-black mb-4">
          📍 Location
        </h2>

        <p className="text-gray-700">
          044 Mabini Street, Mangatarem, Pangasinan, Philippines
        </p>

        <div className="flex flex-col md:flex-row gap-3 mt-4">

          <a
            href="https://www.google.com/maps/search/?api=1&query=044+Mabini+Street+Mangatarem+Pangasinan"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center"
          >
            Open Maps
          </a>

          <a
            href="https://www.google.com/maps/dir/?api=1&destination=044+Mabini+Street+Mangatarem+Pangasinan"
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-center"
          >
            Navigate
          </a>

        </div>

        <iframe
          title="map"
          src="https://www.google.com/maps?q=044+Mabini+Street+Mangatarem+Pangasinan&output=embed"
          className="w-full h-60 rounded-xl mt-4"
        />
      </div>

      {/* GALLERY */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className="cursor-pointer relative group"
          >
            <img
              src={img.imageUrl}
              className="w-full h-40 object-cover rounded-xl"
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-end">
              <p className="text-white text-sm p-2">
                {img.caption}
              </p>
            </div>
          </div>
        ))}

      </div>

      {/* MODAL */}
      {index !== null && images[index] && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center px-4"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button
            onClick={() => setIndex(null)}
            className="absolute top-5 right-5 text-white text-3xl"
          >
            ✕
          </button>

          <button
            onClick={prev}
            className="absolute left-4 text-white text-5xl"
          >
            ‹
          </button>

          <div className="flex flex-col items-center">
            <img
              src={images[index].imageUrl}
              onClick={() => setZoomed(!zoomed)}
              className={`max-h-[75vh] rounded-xl transition ${
                zoomed ? "scale-150" : "scale-100"
              }`}
            />

            <p className="text-white mt-3">
              {images[index].caption}
            </p>
          </div>

          <button
            onClick={next}
            className="absolute right-4 text-white text-5xl"
          >
            ›
          </button>
        </div>
      )}

      {/* FLOATING BUTTON */}
      <a
        href="/book"
        className="fixed bottom-5 right-5 bg-green-500 text-white px-5 py-3 rounded-full shadow-lg"
      >
        Book Now
      </a>

      {/* FOOTER */}
      <div className="text-center text-sm text-gray-300 mt-10">
        © 2026 D'bckyrd Pickleball Court
      </div>

    </div>
  );
}