"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [images, setImages] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const [index, setIndex] = useState(null);
  const [zoomed, setZoomed] = useState(false);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        const clean = (data || []).filter((img) => img?.imageUrl);
        setImages(clean);
      });
  }, []);

  useEffect(() => {
    fetch("/api/announcement")
      .then((res) => res.json())
      .then((data) => setAnnouncements(data || []));
  }, []);

  useEffect(() => setZoomed(false), [index]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* 🌿 BACKGROUND GLOW LAYERS */}
      <div className="absolute inset-0">
        <div className="absolute w-[500px] h-[500px] bg-green-500/20 blur-3xl rounded-full top-[-100px] left-[-100px] animate-pulse" />
        <div className="absolute w-[400px] h-[400px] bg-emerald-400/10 blur-3xl rounded-full bottom-[-100px] right-[-100px]" />
      </div>

      {/* NAVBAR */}
      <div className="relative z-10 flex justify-between items-center px-6 py-5 border-b border-green-900/30 backdrop-blur-md bg-black/40">
        <div className="flex items-center gap-3">
          <img src="/logo.png" className="w-10 h-10 rounded-full border border-green-500" />
          <h1 className="font-bold text-green-400 text-xl">D'bckyrd</h1>
        </div>

        <div className="flex gap-2">
          <a href="/book" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl font-semibold">
            Book
          </a>
          <a href="/admin" className="bg-zinc-800 px-4 py-2 rounded-xl">
            Admin
          </a>
        </div>
      </div>

      {/* HERO */}
      <div className="relative z-10 text-center py-20 px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-green-300">
          Play Pickleball <br /> in a Backyard Paradise 🌿
        </h1>

        <p className="text-zinc-300 mb-6">
          D'bckyrd — where night energy meets tropical court vibes.
        </p>

        <div className="flex justify-center gap-3">
          <a href="/book" className="bg-green-500 px-6 py-3 rounded-xl font-bold animate-pulse">
            Book Now
          </a>
          <a href="#gallery" className="bg-zinc-800 px-6 py-3 rounded-xl">
            See Court
          </a>
        </div>
      </div>

      {/* WHY SECTION */}
      <div className="relative z-10 max-w-5xl mx-auto grid md:grid-cols-4 gap-4 px-6 mb-10">
        {[
          ["🌴", "Backyard Vibe"],
          ["⏰", "6AM–10AM / 4PM–8PM"],
          ["💸", "₱100 per hour"],
          ["🎾", "Pickleball Court"]
        ].map((i, idx) => (
          <div key={idx} className="bg-zinc-900/60 border border-green-900 p-4 rounded-xl text-center hover:scale-105 transition">
            <div className="text-2xl">{i[0]}</div>
            <div className="text-green-400 font-bold">{i[1]}</div>
          </div>
        ))}
      </div>

      {/* ANNOUNCEMENTS */}
      <div className="relative z-10 max-w-4xl mx-auto bg-zinc-900/70 border border-green-900 rounded-2xl p-6 mb-10">
        <h2 className="text-green-400 font-bold mb-4">📢 Announcements</h2>

        {announcements.length === 0 && (
          <p className="text-zinc-400">No updates yet.</p>
        )}

        {announcements.map((a) => (
          <div key={a._id} className="bg-black/40 p-3 rounded-lg mb-2 border border-green-900/30">
            {a.text}
          </div>
        ))}
      </div>

      {/* LOCATION */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 mb-10">
        <h2 className="text-green-400 font-bold mb-2">📍 Location</h2>
        <p className="text-zinc-300 mb-3">
          044 Mabini Street, Mangatarem, Pangasinan
        </p>

        <iframe
          className="w-full h-60 rounded-xl border border-green-900"
          src="https://www.google.com/maps?q=044+Mabini+Street+Mangatarem+Pangasinan&output=embed"
        />
      </div>

      {/* GALLERY */}
      <div id="gallery" className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-3 px-6 mb-20">
        {images.map((img, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-green-900/30 hover:scale-105 transition">
            <img src={img.imageUrl} className="h-40 w-full object-cover" />
          </div>
        ))}
      </div>

      {/* FLOATING BUTTON */}
      <a
        href="/book"
        className="fixed bottom-6 right-6 bg-green-500 px-5 py-3 rounded-full font-bold shadow-lg animate-pulse"
      >
        Book Now
      </a>

      {/* FOOTER */}
      <div className="text-center text-zinc-500 text-sm pb-10">
        © 2026 D'bckyrd Pickleball Court
      </div>
    </div>
  );
}