"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(null);
  const [zoomed, setZoomed] = useState(false);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // 📡 FETCH GALLERY
  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        const clean = (data || []).filter((img) => img && img.imageUrl);
        setImages(clean);
      });
  }, []);

  /*// 📅 DATE
  const today = new Date().toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });*/

  // 🔄 RESET ZOOM WHEN IMAGE CHANGES
  useEffect(() => {
    setZoomed(false);
  }, [index]);

  // ⌨️ KEYBOARD NAVIGATION
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (index === null) return;

      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight")
        setIndex((prev) => (prev + 1) % images.length);
      if (e.key === "ArrowLeft")
        setIndex((prev) => (prev - 1 + images.length) % images.length);
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
      <div className="flex flex-col md:flex-row md:justify-between md:items-center p-4 md:p-6 bg-white shadow gap-4">

        <div className="flex items-center gap-3 justify-center md:justify-start">
          <img src="/logo.png" className="w-10" alt="Logo" />
          <h1 className="font-bold text-lg">D'bckyrd</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 text-sm md:text-base">

          <a href="/book" className="bg-green-500 text-white px-4 py-2 rounded-lg text-center">
            Book Now
          </a>

          <a href="/admin" className="bg-gray-800 text-white px-4 py-2 rounded-lg text-center">
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
      <div className="text-center py-16 px-6">
        <h1 className="text-lime-200 text-4xl font-bold mb-4">
          Book Your Pickleball Court 🎾
        </h1>
        <p className="text-gray-700 mb-6">
          Fast. Easy. Hassle-free booking at D'bckyrd.
        </p>

        <a href="/book" className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg">
          Book Now
        </a>
      </div>

      {/* ANNOUNCEMENTS */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow mb-10">
        <h2 className="text-xl font-bold mb-4">📢 Announcements</h2>
        <ul className="space-y-2 text-gray-700">
          <li>✔ Open Monday - Saturday</li>
          <li>✔ Morning: 7AM - 10AM</li>
          <li>✔ Evening: 4PM - 8PM</li>
          <li>✔ Rate: ₱100 per hour</li>
        </ul>
      </div>

      {/* LOCATION */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow mb-10">
        <h2 className="text-xl font-bold mb-4">📍 Location</h2>

        <p className="text-gray-700">
          044 Mabini Street, Mangatarem, Pangasinan, Philippines
        </p>

        <div className="flex flex-col md:flex-row gap-3 mt-3">
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
          className="w-full h-60 mt-4 rounded-xl"
        />
      </div>

      {/* GALLERY */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className="relative cursor-pointer group"
          >
            <img
              src={img.imageUrl}
              className="rounded-xl w-full h-40 object-cover"
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-end">
              <p className="text-white p-2 text-sm">{img.caption}</p>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {index !== null && images[index] && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 px-4"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >

          {/* CLOSE */}
          <button
            onClick={() => setIndex(null)}
            className="absolute top-6 right-6 text-white text-3xl"
          >
            ✕
          </button>

          {/* LEFT */}
          <button onClick={prev} className="absolute left-4 text-white text-5xl">
            ‹
          </button>

          {/* IMAGE */}
          <div className="flex flex-col items-center">
            <img
              src={images[index].imageUrl}
              onClick={() => setZoomed(!zoomed)}
              className={`max-h-[75vh] rounded-xl transition-transform duration-300 cursor-zoom-in ${
                zoomed ? "scale-150 cursor-zoom-out" : "scale-100"
              }`}
            />

            <p className="text-white mt-3 text-center">
              {images[index].caption}
            </p>
          </div>

          {/* RIGHT */}
          <button onClick={next} className="absolute right-4 text-white text-5xl">
            ›
          </button>
        </div>
      )}

      {/* FLOATING BOOK BUTTON */}
      <a
        href="/book"
        className="fixed bottom-5 right-5 bg-green-500 text-white px-5 py-3 rounded-full shadow-lg"
      >
         Book Now
      </a>

      {/* FOOTER */}
      <div className="text-center text-sm text-gray-600 mt-10">
        © 2026 D'bckyrd Pickleball Court
      </div>

    </div>
  );
}