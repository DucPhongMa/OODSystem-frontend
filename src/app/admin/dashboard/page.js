"use client"
import { useEffect, useState } from "react"
import { checkLogin } from "@/app/api/auth"
export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  useEffect(() => {
    const checkLoggedIn = checkLogin()
    console.log(checkLoggedIn)
    setIsLoggedIn(checkLoggedIn)
    setIsLoading(false)
  }, [])

  return isLoading ? (
    <div>"Is Loading"</div>
  ) : isLoggedIn ? (
    <div>"You are auth"</div>
  ) : (
    <div>"You are not auth"</div>
  )
}
