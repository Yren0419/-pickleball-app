
"use client";
import { useEffect, useState } from "react";

export default function Home() {
const [images, setImages] = useState([]); // 👈 from DB
  const [index, setIndex] = useState(null);
   const [selectedImage, setSelectedImage] = useState(null);


  // 📡 FETCH FROM DATABASE
  useEffect(() => {
    fetch("/api/gallery")
      .then(res => res.json())
      .then(data => {
        console.log("GALLERY:", data);
        setImages(data);
      });
  }, []);

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

  {/* Logo */}
  <div className="flex items-center gap-3 justify-center md:justify-start">
    <img src="/logo.png" className="w-10" alt="Logo" />
    <h1 className="font-bold text-lg">D'bckyrd</h1>
  </div>

  {/* Links */}
  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 text-sm md:text-base w-full md:w-auto">

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
      rel="noopener noreferrer"
      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center"
    >
      Follow us on Facebook
    </a>

  </div>
</div>
      {/* HERO */}
      <div className="text-center py-16 px-6">
        <h1 className="text-lime-200  text-4xl font-bold mb-4">
          Book Your Pickleball Court 🎾
        </h1>
        <p className="text-gray-700 mb-6">
          Fast. Easy. Hassle-free booking at D'bckyrd.
        </p>
          
        <a
          href="/book"
          className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg"
        >
          Book Now
        </a>
      </div>

      {/* ANNOUNCEMENTS */}
<div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow mb-10">
  <h2 className="text-xl text-black font-bold mb-4">📢 Announcements</h2>

  <ul className="space-y-2 text-gray-700">
    <li>✔ Open Monday - Saturday</li>
    <li>✔ Morning: 7AM - 10AM</li>
    <li>✔ Evening: 4PM - 8PM</li>
    <li>✔ Rate: ₱100 per hour</li>
  </ul>
</div>

{/* LOCATION */}
<div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow mb-10">
  <h2 className="text-xl text-black font-bold mb-4">📍 Location</h2>

  <p className="text-gray-700 mb-1">
    044 Mabini Street, Mangatarem, Pangasinan, Philippines
  </p>

  <p className="text-gray-500 text-sm mb-3">
    Visit us or book your schedule in advance
  </p>

  {/* BUTTONS */}
  <div className="flex flex-col md:flex-row gap-3 mb-5">
    
    {/* Open in Google Maps */}
    <a
      href="https://www.google.com/maps/search/?api=1&query=044+Mabini+Street+Mangatarem+Pangasinan"
      target="_blank"
      rel="noopener noreferrer"
      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-700 transition"
    >
      Open in Google Maps
    </a>

    {/* Start Navigation */}
    <a
      href="https://www.google.com/maps/dir/?api=1&destination=044+Mabini+Street+Mangatarem+Pangasinan"
      target="_blank"
      rel="noopener noreferrer"
      className="bg-green-600 text-white px-4 py-2 rounded-lg text-center hover:bg-green-700 transition"
    >
      Start Navigation
    </a>
  </div>

  {/* MAP PREVIEW */}
  <div className="rounded-xl overflow-hidden border">
    <iframe
      title="Location Map"
      src="https://www.google.com/maps?q=044+Mabini+Street+Mangatarem+Pangasinan&output=embed"
      width="100%"
      height="250"
      loading="lazy"
      className="w-full"
    ></iframe>
  </div>
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

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-end">
        <p className="text-white p-2 text-sm font-semibold">
          {img.caption}
        </p>
      </div>
    </div>
  ))}
</div>

      {/* MODAL */}
      {index !== null && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">

       <img src={images[index].imageUrl} />
      <p className="text-white mt-2">{images[index].caption}</p>

          {/* CLOSE */}
          <button
            onClick={() => setIndex(null)}
            className="absolute top-6 right-6 text-white text-3xl"
          >
            ✕
          </button>

          {/* LEFT */}
          <button
            onClick={prev}
            className="absolute left-4 text-white text-4xl"
          >
            ‹
          </button>

          {/* RIGHT */}
          <button
            onClick={next}
            className="absolute right-4 text-white text-4xl"
          >
            ›
          </button>

        </div>
      )}

      {/* FOOTER */}
      <div className="text-center text-sm text-gray-600 pb-6">
        © 2026 D'bckyrd Pickleball Court
      </div>

      
    </div>
  );
}