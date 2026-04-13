"use client"
import { useState } from "react"

export default function Login() {
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")

const login = async () => {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, pass })
  })

  const data = await res.json()

  console.log("LOGIN RESULT:", data)

  if (data.success) {
    window.location.href = "/admin/dashboard"
  } else {
    alert("Invalid login")
  }
}
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500 via-emerald-900 to-black">


      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-80">

        <h1 className="text-2xl font-bold text-center mb-6 text-green-600">
          Admin Login
        </h1>

        <input
        placeholder="Username"
          value={user}
        onChange={(e) => setUser(e.target.value.trim())}
            />

      <input
     type="password"
     placeholder="Password"
     value={pass}
     onChange={(e) => setPass(e.target.value.trim())}
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