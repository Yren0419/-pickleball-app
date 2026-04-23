"use client";
import { useState, useEffect } from "react";

export default function BookPage() {
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");

  const [today, setToday] = useState("");
  const [max, setMax] = useState("");

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const [bookings, setBookings] = useState([]);
  const [confirmed, setConfirmed] = useState(false);

  const rate = 100;

  const allSlots = [6, 7, 8, 9, 10, 16, 17, 18, 19, 20];
  const startSlots = [6, 7, 8, 9, 16, 17, 18, 19];

  // ✅ safe date init (no hydration issues)
  useEffect(() => {
    const now = new Date();
    const future = new Date();
    future.setMonth(now.getMonth() + 3);

    setToday(now.toISOString().split("T")[0]);
    setMax(future.toISOString().split("T")[0]);
  }, []);

  const formatTime = (t) => {
    if (t < 12) return `${t}:00 AM`;
    if (t === 12) return `12:00 PM`;
    return `${t - 12}:00 PM`;
  };

  // 🔥 LIVE SYNC BOOKINGS (single source of truth)
  useEffect(() => {
    if (!date) return;

    const fetchBookings = async () => {
      const res = await fetch(`/api/book?date=${date}`);
      const data = await res.json();
      setBookings(data);
    };

    fetchBookings();
    const interval = setInterval(fetchBookings, 3000);

    return () => clearInterval(interval);
  }, [date]);

  // 🔥 BLOCK ENGINE (Airbnb logic)
  const getBlocked = () => {
    const blocked = new Set();

    bookings
      .filter(b => b.status !== "cancelled")
      .forEach(b => {
        for (let t = b.startNum; t < b.endNum; t++) {
          blocked.add(t);
        }
      });

    return blocked;
  };

  const blocked = getBlocked();

  const isBlocked = (t) => blocked.has(Number(t));

  // 🔥 END SLOT LOGIC (Airbnb boundary-safe)
  const validEndSlots = () => {
    if (!start) return [];

    const startNum = Number(start);
    const result = [];

    for (let t of allSlots) {
      if (t <= startNum) continue;

      // stop only on real conflict
      if (blocked.has(t) && t !== startNum + 1) break;

      result.push(t);
    }

    return result;
  };

  const duration =
    start && end ? Number(end) - Number(start) : 0;

  const total = duration * rate;

  // 🔥 BOOKING
  const handleBooking = async () => {
    if (!name || !date || !start || !end) {
  alert("Complete all required fields");
  return;
}

if (contact && !/^09\d{9}$/.test(contact)) {
  alert("Enter valid contact number");
  return;
}

    const res = await fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        contact,
        date,
        start,
        end,
        price: total,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Booking failed");
      return;
    }

    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="bg-zinc-900 p-10 rounded-3xl border border-green-500 text-center">
          <h1 className="text-4xl font-bold text-green-400 mb-4">
            Confirmed 🎉
          </h1>

          <p>{date}</p>
          <p>
            {formatTime(Number(start))} → {formatTime(Number(end))}
          </p>

          <p className="mt-3 text-green-400 font-bold">
            ₱{total}
          </p>

          <a
            href="/book"
            className="block mt-6 bg-green-500 py-3 rounded-xl font-bold"
          >
            Book Again
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">

           {/* NAVBAR */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <img src="/logo.png" className="w-12 h-12 rounded-full" />
          <div>
            <h1 className="text-2xl font-bold text-green-400">
              D'bckyrd
            </h1>
            <p className="text-sm text-zinc-400">
              Pickleball Court Booking
            </p>
          </div>
        </div>

        <a
          href="/"
          className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-xl font-semibold"
        >
          Home
        </a>
      </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
  {/* FORM */}
  <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">

    {/* NAME */}
    <input
      type="text"
      placeholder="Name"
      className="w-full p-3 mb-3 bg-black border border-zinc-700 rounded-xl text-white"
      onChange={(e) => setName(e.target.value)}
    />

    {/* CONTACT OPTIONAL */}
    <div className="mb-3">
      <input
        type="tel"
        inputMode="numeric"
        maxLength={11}
        value={contact}
        placeholder="Contact Number (Optional)"
        className="w-full p-3 bg-black border border-zinc-700 rounded-xl text-white"
        onChange={(e) => {
          const numbersOnly = e.target.value.replace(/\D/g, "");

          if (numbersOnly.length <= 11) {
            setContact(numbersOnly);
          }
        }}
      />

      <p className="text-xs text-zinc-400 mt-1 px-1">
        Optional • Numbers only • Format: 09XXXXXXXXX
      </p>
    </div>

          {/* DATE */}
          <div className="mb-5">
            <label className="text-sm text-zinc-400 mb-2 block">
              Select Date
            </label>

            <input
              type="date"
              value={date}
              min={today}
              max={max}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-4 bg-zinc-950 text-white border border-zinc-800 rounded-2xl cursor-pointer"
            />
          </div>

          {/* START */}
          <select
            value={start}
            onChange={(e) => {
              setStart(e.target.value);
              setEnd("");
            }}
            className="w-full p-3 mb-3 bg-black border border-zinc-700 rounded-xl"
          >
            <option value="">Start Time</option>

            {startSlots.map((t) => (
              <option key={t} value={t} disabled={isBlocked(t)}>
                {formatTime(t)}
              </option>
            ))}
          </select>

          {/* END */}
          <select
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full p-3 mb-4 bg-black border border-zinc-700 rounded-xl"
          >
            <option value="">End Time</option>

            {validEndSlots().map((t) => (
              <option key={t} value={t}>
                {formatTime(t)}
              </option>
            ))}
          </select>

          <div className="mb-4 text-green-400 font-bold">
            Total: ₱{total}
          </div>

          <button
            onClick={handleBooking}
            className="w-full bg-green-500 py-3 rounded-xl font-bold"
          >
            Confirm Booking
          </button>
        </div>

        {/* SCHEDULE */}
        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
          <h2 className="text-xl font-bold text-green-400 mb-4">
            Court Schedule
          </h2>

          {allSlots.map((t) => (
            <div key={t} className="flex justify-between p-3 border-b border-zinc-800">
              <span>{formatTime(t)}</span>
              <span className={isBlocked(t) ? "text-red-400" : "text-green-400"}>
                {isBlocked(t) ? "BOOKED" : "OPEN"}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}