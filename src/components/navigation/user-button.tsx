'use client'

import { Session } from "next-auth"
import { signOut } from "next-auth/react"

export const UserButton = ({ user } : Session ) => {
  console.log(user)
  return (
    <div>
      <h1>{user?.email}</h1>
      <button onClick={() => signOut()}>Signout</button>
    </div>
  )
}