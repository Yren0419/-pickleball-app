"use client"
import { useState, useEffect } from "react"

export default function Admin() {
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")
  const [showPass, setShowPass] = useState(false)
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

      <div className="bg-white p-6 rounded-2xl shadow w-full max-w-sm">

        <h1 className="text-xl font-bold mb-5 text-center text-gray-900">
          Admin Login
        </h1>

        {/* USERNAME */}
        <input
          placeholder="Username"
          className="w-full p-3 mb-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={(e) => setUser(e.target.value)}
          disabled={loading}
        />

        {/* PASSWORD WITH EYE */}
        <div className="relative mb-4">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 pr-12 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={(e) => setPass(e.target.value)}
            disabled={loading}
          />

          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
          >
            {showPass ? "🙈" : "👁️"}
          </button>
        </div>

        {/* BUTTON */}
        <button
          onClick={login}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition ${
            loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* HOME LINK */}
        <a
          href="/"
          className="block text-center mt-4 text-green-600 font-semibold hover:underline"
        >
          ← Home
        </a>

      </div>
    </div>
  )
}