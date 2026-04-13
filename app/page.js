
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
      <div className="flex justify-between items-center p-6 bg-white shadow">
        <div className="flex items-center gap-3">
          <img src="/logo.png" className="w-10" />
          <h1 className="font-bold text-lg">D'bckyrd</h1>
        </div>

        <div className="flex gap-2">
          <a href="/book" className="bg-green-500 text-white px-4 py-2 rounded-lg">Book Now</a>
          <a href="/admin" className="bg-gray-800 text-white px-4 py-2 rounded-lg">Admin</a>
          <a
  href="https://facebook.com/YOUR_PAGE"
  target="_blank"
  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
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
        <h2 className="text-xl font-bold mb-4">📢 Announcements</h2>

        <ul className="space-y-2 text-gray-700">
          <li>✔ Open Monday - Saturday</li>
          <li>✔ Morning: 7AM - 10AM</li>
          <li>✔ Evening: 4PM - 8PM</li>
          <li>✔ Rate: ₱100 per hour</li>
        </ul>
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