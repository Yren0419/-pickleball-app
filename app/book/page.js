"use client";
import { useState, useEffect } from "react";

export default function BookPage() {
  const [date, setDate] = useState("");
  const [today, setToday] = useState("");
  const [max, setMax] = useState("");

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");

  const [start, setStart] = useState("");
  const [duration, setDuration] = useState("");

  const [bookings, setBookings] = useState([]);
  const [confirmed, setConfirmed] = useState(false);

  const rate = 100;

  // BOOKABLE HOURS
  const slots = [6, 7, 8, 9, 16, 17, 18, 19];

  // DATE INIT
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

  // FETCH BOOKINGS
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

  // BLOCKED HOURS
  const getBlocked = () => {
    const blocked = new Set();

    bookings
      .filter((b) => b.status !== "cancelled")
      .forEach((b) => {
        for (let t = b.startNum; t < b.endNum; t++) {
          blocked.add(t);
        }
      });

    return blocked;
  };

  const blocked = getBlocked();

  const isBlocked = (t) => blocked.has(t);

  // AVAILABLE START TIMES
  const availableStarts = slots.filter((t) => !isBlocked(t));

  // MAX HOURS USER CAN BOOK
  const getValidDurations = () => {
    if (!start) return [];

    const startNum = Number(start);
    const result = [];

    for (let hrs = 1; hrs <= 4; hrs++) {
      let ok = true;

      for (let i = 0; i < hrs; i++) {
        const current = startNum + i;

        // morning cut
        if (startNum < 12 && current > 9) ok = false;

        // evening cut
        if (startNum >= 12 && current > 19) ok = false;

        if (blocked.has(current)) ok = false;
      }

      if (ok) result.push(hrs);
    }

    return result;
  };

  const validDurations = getValidDurations();

  const end =
    start && duration
      ? Number(start) + Number(duration)
      : "";

  const total =
    duration ? Number(duration) * rate : 0;

  const handleBooking = async () => {
    if (!name || !date || !start || !duration) {
      alert("Complete all required fields");
      return;
    }

    if (contact && !/^09\d{9}$/.test(contact)) {
      alert("Enter valid contact number");
      return;
    }

    const res = await fetch("/api/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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

  // SUCCESS PAGE
  if (confirmed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="bg-zinc-900 p-10 rounded-3xl border border-green-500 text-center">
          <h1 className="text-4xl font-bold text-green-400 mb-4">
            Confirmed 🎉
          </h1>

          <p>{date}</p>

          <p>
            {formatTime(Number(start))} →{" "}
            {formatTime(Number(end))}
          </p>

          <p className="mt-2">
            Duration: {duration} hour(s)
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
          <img
            src="/logo.png"
            className="w-12 h-12 rounded-full"
          />

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
          className="bg-green-500 px-5 py-2 rounded-xl font-semibold"
        >
          Home
        </a>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
        {/* FORM */}
        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
          <input
            type="text"
            placeholder="Name"
            className="w-full p-3 mb-3 bg-black border border-zinc-700 rounded-xl"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="tel"
            placeholder="Contact Number (Optional)"
            maxLength={11}
            value={contact}
            className="w-full p-3 mb-3 bg-black border border-zinc-700 rounded-xl"
            onChange={(e) =>
              setContact(
                e.target.value.replace(/\D/g, "")
              )
            }
          />

          <input
            type="date"
            value={date}
            min={today}
            max={max}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 mb-3 bg-black border border-zinc-700 rounded-xl"
          />

          {/* START */}
          <select
            value={start}
            onChange={(e) => {
              setStart(e.target.value);
              setDuration("");
            }}
            className="w-full p-3 mb-3 bg-black border border-zinc-700 rounded-xl"
          >
            <option value="">Start Time</option>

            {availableStarts.map((t) => (
              <option key={t} value={t}>
                {formatTime(t)}
              </option>
            ))}
          </select>

          {/* DURATION */}
          <select
            value={duration}
            onChange={(e) =>
              setDuration(e.target.value)
            }
            className="w-full p-3 mb-4 bg-black border border-zinc-700 rounded-xl"
          >
            <option value="">Duration</option>

            {validDurations.map((d) => (
              <option key={d} value={d}>
                {d} Hour{d > 1 ? "s" : ""}
              </option>
            ))}
          </select>

          {/* SUMMARY */}
          {start && duration && (
            <div className="mb-4 bg-black p-4 rounded-xl border border-zinc-700">
              <p>
                Booking: {formatTime(Number(start))} →{" "}
                {formatTime(Number(end))}
              </p>

              <p className="text-green-400 font-bold mt-2">
                Total: ₱{total}
              </p>
            </div>
          )}

          <button
            onClick={handleBooking}
            className="w-full bg-green-500 py-3 rounded-xl font-bold hover:bg-green-600"
          >
            Confirm Booking
          </button>
        </div>

        {/* SCHEDULE */}
        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
          <h2 className="text-xl font-bold text-green-400 mb-4">
            Live Schedule
          </h2>

          {slots.map((t) => (
            <div
              key={t}
              className="flex justify-between p-3 border-b border-zinc-800"
            >
              <span>
                {formatTime(t)} -{" "}
                {formatTime(t + 1)}
              </span>

              <span
                className={
                  isBlocked(t)
                    ? "text-red-400"
                    : "text-green-400"
                }
              >
                {isBlocked(t)
                  ? "BOOKED"
                  : "OPEN"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}