"use client"

export function SignIn() {


  return (
    <form action={() => undefined} className="flex flex-col gap-4 max-w-sm mx-auto p-6 border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold">Sign In</h2>
      
      {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}

      <label className="flex flex-col gap-1">
        Email
        <input 
          name="email" 
          type="email" 
          required 
          className="border p-2 rounded-md"
        />
      </label>

      <label className="flex flex-col gap-1">
        Password
        <input 
          name="password" 
          type="password" 
          required 
          className="border p-2 rounded-md"
        />
      </label>

      <button className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
        Sign In
      </button>
    </form>
  )
}
