// app/book/page.js
// UPDATED:
// ✅ Hours now 6AM–10AM and 4PM–8PM
// ✅ Shows available hours after selecting date
// ✅ Confirmation page still included

"use client";
import { useState, useEffect } from "react";

export default function Book() {
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [bookings, setBookings] = useState([]);
  const [agreed, setAgreed] = useState(false);

  const [confirmed, setConfirmed] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const rate = 100;

  const today = new Date().toISOString().split("T")[0];

  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const max = maxDate.toISOString().split("T")[0];

  // ✅ NEW HOURS
  const startSlots = [6, 7, 8, 9, 16, 17, 18, 19];
  const endSlots = [7, 8, 9, 10, 17, 18, 19, 20];

  const loadBookings = async (selectedDate = "") => {
    let url = "/api/book";
    if (selectedDate) url += `?date=${selectedDate}`;

    const res = await fetch(url);
    const data = await res.json();
    setBookings(data);
  };

  useEffect(() => {
    if (date) loadBookings(date);
    else setBookings([]);
  }, [date]);

  const calculatePrice = () => {
    if (!start || !end) return 0;
    return (Number(end) - Number(start)) * rate;
  };

  const isBooked = (time) => {
    return bookings.some(
      (b) =>
        b.status !== "cancelled" &&
        Number(time) >= Number(b.startNum) &&
        Number(time) < Number(b.endNum)
    );
  };

  // ✅ AVAILABLE SLOTS DISPLAY
  const availableSlots = startSlots.filter((t) => !isBooked(t));

  const formatTime = (t) => {
    if (t === 12) return "12:00 PM";
    if (t < 12) return `${t}:00 AM`;
    return `${t - 12}:00 PM`;
  };

  const handleBooking = async () => {
    if (!name || !contact || !date || !start || !end) {
      alert("Please fill all fields");
      return;
    }

    if (!agreed) {
      alert("Please agree to cancellation policy");
      return;
    }

    const total = calculatePrice();

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

    setReceipt({
      name,
      contact,
      date,
      start,
      end,
      total,
    });

    setConfirmed(true);

    setName("");
    setContact("");
    setDate("");
    setStart("");
    setEnd("");
    setAgreed(false);
  };

  // ✅ CONFIRMATION PAGE
  if (confirmed && receipt) {
    return (
      <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 md:p-6" style={{ backgroundImage: "url('/logo.png')" }}>
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-6">

          <h1 className="text-3xl font-bold text-green-600 mb-4 text-center">
            Booking Confirmed 🎉
          </h1>

          <div className="space-y-3 border rounded-xl p-4 mb-5 text-black">
            <p><strong>Name:</strong> {receipt.name}</p>
            <p><strong>Contact:</strong> {receipt.contact}</p>
            <p><strong>Date:</strong> {receipt.date}</p>
            <p>
              <strong>Time:</strong>{" "}
              {formatTime(Number(receipt.start))} - {formatTime(Number(receipt.end))}
            </p>
            <p><strong>Total:</strong> ₱{receipt.total}</p>
          </div>

          <button
            onClick={() => {
              setConfirmed(false);
              setReceipt(null);
            }}
            className="bg-green-500 text-white w-full py-3 rounded-xl"
          >
            Book Again
          </button>

          <a
            href="/"
            className="block text-center mt-3 text-green-600 font-semibold"
          >
            ← Back Home
          </a>

        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center p-4 md:p-6"
      style={{ backgroundImage: "url('/logo.png')" }}
    >
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">

        {/* LEFT */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <a href="/" className="text-green-600 font-semibold hover:underline">
            ← Home
          </a>

          <p className="text-sm text-red-500 mb-3">
            ⚠️ Please cancel at least 3 hours before schedule.
          </p>

          <h1 className="text-xl text-black font-bold mb-4">
            Book a Schedule
          </h1>

          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-3 w-full rounded mb-2 text-black"
          />

          <input
            type="text"
            placeholder="Contact Number"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="border p-3 w-full rounded mb-2 text-black"
          />

          <input
            type="date"
            value={date}
            min={today}
            max={max}
            onChange={(e) => {
              const selected = e.target.value;

              if (new Date(selected).getDay() === 0) {
                alert("Closed on Sundays");
                return;
              }

              setDate(selected);
              setStart("");
              setEnd("");
            }}
            className="border p-3 w-full rounded mb-2 text-black"
          />

          {/* AVAILABLE TODAY */}
          {date && (
            <div className="bg-green-50 border rounded-xl p-3 mb-3 text-sm text-black">
              <strong>Available Hours:</strong>
              <div className="mt-2 flex flex-wrap gap-2">
                {availableSlots.length > 0 ? (
                  availableSlots.map((t) => (
                    <span
                      key={t}
                      className="bg-white border px-2 py-1 rounded"
                    >
                      {formatTime(t)}
                    </span>
                  ))
                ) : (
                  <span className="text-red-500">Fully Booked</span>
                )}
              </div>
            </div>
          )}

          {/* TIME */}
          <div className="grid grid-cols-2 gap-2 mb-3">

            <select
              value={start}
              disabled={!date}
              onChange={(e) => {
                setStart(e.target.value);
                setEnd("");
              }}
              className="border p-3 rounded text-black"
            >
              <option value="">Start</option>

              {startSlots.map((t) => (
                <option key={t} value={t} disabled={isBooked(t)}>
                  {formatTime(t)}
                </option>
              ))}
            </select>

            <select
              value={end}
              disabled={!date || !start}
              onChange={(e) => setEnd(e.target.value)}
              className="border p-3 rounded text-black"
            >
              <option value="">End</option>

              {endSlots
                .filter((t) => t > Number(start))
                .map((t) => (
                  <option
                    key={t}
                    value={t}
                    disabled={isBooked(t - 1)}
                  >
                    {formatTime(t)}
                  </option>
                ))}
            </select>

          </div>

          <label className="flex gap-2 text-sm text-black mb-3">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            I understand the cancellation policy
          </label>

          <button
            onClick={handleBooking}
            className="bg-green-500 text-white py-3 rounded-lg w-full"
          >
            Book Now
          </button>

        </div>

        {/* RIGHT */}
        <div className="bg-white text-black p-6 rounded-2xl shadow h-fit sticky top-6">

          <h2 className="text-xl font-bold mb-4">Booking Summary</h2>

          <p>D'bckyrd</p>
          <p>Date: {date || "-"}</p>

          <p>
            Time:
            {start && end
              ? ` ${formatTime(Number(start))} - ${formatTime(Number(end))}`
              : " -"}
          </p>

          <hr className="my-4" />

          <p className="text-lg font-bold">
            Total: ₱{calculatePrice()}
          </p>

          <p className="text-sm text-gray-500">
            ₱100 per hour
          </p>

        </div>

      </div>
    </div>
  );
}