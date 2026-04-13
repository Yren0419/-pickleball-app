"use client"
import { useState, useEffect } from "react"

export default function Book() {
  const [date, setDate] = useState("")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [bookings, setBookings] = useState([])

  const rate = 100

  const today = new Date().toISOString().split("T")[0]

  const maxDate = new Date()
  maxDate.setMonth(maxDate.getMonth() + 3)
  const max = maxDate.toISOString().split("T")[0]

  // 📡 LOAD BOOKINGS
  useEffect(() => {
    fetch("/api/book")
      .then(res => res.json())
      .then(data => setBookings(data))
  }, [])

  // 💰 PRICE CALC
  const calculatePrice = () => {
    if (!start || !end) return 0
    return (Number(end) - Number(start)) * rate
  }

  // 🚫 CHECK BOOKED SLOT
  const isBooked = (time) => {
    return bookings.some(b =>
      b.date === date &&
      Number(time) >= Number(b.start) &&
      Number(time) < Number(b.end) &&
      b.status !== "cancelled"
    )
  }

  // 🚫 CHECK FULL DATE
  const isDateFullyBooked = (selectedDate) => {
    const dayBookings = bookings.filter(
      b => b.date === selectedDate && b.status !== "cancelled"
    )
    return dayBookings.length >= 7
  }

  // 🚀 SUBMIT BOOKING
  const submit = async () => {
    if (!name || !contact || !date || !start || !end) {
      alert("Please fill all fields")
      return
    }

    if (Number(end) <= Number(start)) {
      alert("End time must be after start time")
      return
    }

    const res = await fetch("/api/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        contact,
        date,
        start,
        end,
        price: calculatePrice()
      })
    })

    const data = await res.json()

    if (data.success) {
      alert("Booking confirmed 🎉")
      window.location.reload()
    } else {
      alert(data.error || "Booking failed")
    }
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center p-4 md:p-6"
      style={{ backgroundImage: "url('/logo.png')" }}
    >
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">

        {/* LEFT FORM */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <a href="/" className="text-green-600 font-semibold hover:underline">
            ← Home
          </a>

          <h1 className="text-2xl font-bold mb-4">Book a Court</h1>

          <input
            type="text"
            placeholder="Your Name"
            className="border p-3 w-full mb-3 rounded"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Contact Number"
            className="border p-3 w-full mb-3 rounded"
            onChange={(e) => setContact(e.target.value)}
          />

          <input
            type="date"
            min={today}
            max={max}
            className="border p-3 w-full mb-3 rounded"
            onChange={(e) => {
              const selected = e.target.value

              if (new Date(selected).getDay() === 0) {
                alert("Closed on Sundays")
                return
              }

              if (isDateFullyBooked(selected)) {
                alert("This date is fully booked")
                return
              }

              setDate(selected)
            }}
          />

          {/* TIME */}
          <div className="grid grid-cols-2 gap-2 mb-3">

            <select
              className="border p-3 w-full rounded"
              onChange={(e) => setStart(e.target.value)}
            >
              <option value="">Start</option>
              {[7, 8, 9, 16, 17, 18, 19].map(t => (
                <option key={t} value={t} disabled={isBooked(t)}>
                  {t < 12 ? `${t}:00 AM` : `${t - 12}:00 PM`}
                </option>
              ))}
            </select>

            <select
              className="border p-3 w-full rounded"
              onChange={(e) => setEnd(e.target.value)}
            >
              <option value="">End</option>
              {[8, 9, 10, 17, 18, 19, 20].map(t => (
                <option key={t} value={t} disabled={isBooked(t)}>
                  {t < 12 ? `${t}:00 AM` : `${t - 12}:00 PM`}
                </option>
              ))}
            </select>

          </div>

          <button
            onClick={submit}
            className="bg-green-500 text-white py-3 rounded-lg w-full"
          >
            Confirm Booking
          </button>

        </div>

        {/* RIGHT SUMMARY */}
        <div className="bg-white p-6 rounded-2xl shadow h-fit sticky top-6">

          <h2 className="text-xl font-bold mb-4">Booking Summary</h2>

          <p>Court: Court 1</p>
          <p>Date: {date || "-"}</p>
          <p>
            Time: {start && end ? `${start}:00 - ${end}:00` : "-"}
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
  )
}