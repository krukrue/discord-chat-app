"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface Group {
  id: string
  name: string
  private: boolean
}

export default function CreateGroupClient() {
  const [groups, setGroups] = useState<Group[]>([])
  const [name, setName] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [loading, setLoading] = useState(false)

  async function fetchGroups() {
    const res = await fetch("/api/group/list")
    const data = await res.json()
    setGroups(data)
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch("/api/group/create", {
      method: "POST",
      body: JSON.stringify({ name, private: isPrivate }),
    })

    if (res.ok) {
      setName("")
      setIsPrivate(false)
      fetchGroups() // обновляем список
    } else {
      alert("Chyba při vytváření skupiny")
    }

    setLoading(false)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12 px-4">
      {/* Список групп */}
      <div className="col-span-1 space-y-2">
        <h2 className="text-xl font-semibold mb-2">Skupiny</h2>
        {groups.length === 0 ? (
          <p className="text-muted-foreground">Žádné skupiny</p>
        ) : (
          <ul className="space-y-1">
            {groups.map((g) => (
              <li key={g.id}>
                <Link
                  href={`/group/${g.id}`}
                  className="block px-3 py-2 rounded-md hover:bg-muted transition text-sm"
                >
                  {g.name}
                  {g.private && (
                    <span className="text-xs text-muted-foreground ml-2">(soukromá)</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Форма создания */}
      <div className="col-span-2">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">Vytvořit skupinu</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Název skupiny"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="private"
                  checked={isPrivate}
                  onCheckedChange={(v) => setIsPrivate(Boolean(v))}
                />
                <label htmlFor="private" className="text-sm">
                  Soukromá skupina
                </label>
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Vytváříme..." : "Vytvořit"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
