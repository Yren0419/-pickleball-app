"use client"
import { useState, useEffect } from "react"

export default function Admin() {
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")
  const [loading, setLoading] = useState(false)

  // 🔐 AUTO REDIRECT IF LOGGED IN
  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.loggedIn) {
          window.location.replace("/admin/dashboard")
        }
      })
  }, [])

  const login = async () => {
    if (loading) return
    setLoading(true)

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ user, pass })
      })

      const data = await res.json()

      if (data.success) {
        window.location.replace("/admin/dashboard")
      } else {
        alert("Invalid login 😢")
      }

    } catch (err) {
      alert("Something went wrong 💥")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-6 rounded-xl shadow w-80">
        <h1 className="text-xl font-bold mb-4 text-center">
          Admin Login
        </h1>

        <input
          placeholder="Username"
          className="border p-2 w-full mb-2"
          onChange={(e) => setUser(e.target.value)}
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4"
          onChange={(e) => setPass(e.target.value)}
          disabled={loading}
        />

        <button
          onClick={login}
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-green-500"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <a href="/" className="text-green-600 font-semibold hover:underline">
            ← Home
          </a>
      </div>
    </div>
  )
}