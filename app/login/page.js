"use client"
import { useState } from "react"

export default function Login() {
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")

const login = async () => {
  console.log("LOGIN CLICKED")

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, pass })
  })

  const data = await res.json()

  console.log("LOGIN RESPONSE:", data)

  alert(JSON.stringify(data))
}
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500 via-emerald-900 to-black">


      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-80">

        <h1 className="text-2xl font-bold text-center mb-6 text-green-600">
          Admin Login
        </h1>

        <input
          placeholder="Username"
          className="border p-2 w-full mb-3 rounded"
          onChange={(e) => setUser(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-5 rounded"
          onChange={(e) => setPass(e.target.value)}
        />

        <button
          onClick={login}
          className="bg-green-500 hover:bg-green-600 text-white w-full py-2 rounded transition"
        >
          Login
        </button>
        
        <a
    href="/"
    className="text-green-600 font-semibold hover:underline"
  >
    ← Home
  </a>


      </div>
    </div>
  )
}