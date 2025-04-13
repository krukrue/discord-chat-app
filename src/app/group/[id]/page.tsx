 
"use client"
import {  Group, Feed, UserSubscribe } from "@/server/schema"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import Image from "next/image"
import React from "react"
import { useAuth } from "@/components/auth/auth-context"

interface GroupPageProps {
  params: { id: string }
}

export default function GroupPage({ params }: GroupPageProps) {
  const groupId = params.id
  const { user } = useAuth()
  const userId = user?.id

  const [postTitle, setPostTitle] = useState("")
  const [postContent, setPostContent] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [groupData, setGroupData] = useState<Group>();
  const [members, setMembers] = useState<UserSubscribe[]>();
  const [posts, setPosts] = useState<Feed[]>();


  React.useEffect(() => {
    async function fetchGroupData() {
      console.log("CALLED")
      try {
        // Получаем данные группы
        const groupResponse = await fetch(`/api/group/${groupId}`);
        const groupData = await groupResponse.json();
        if (groupData.error) {
          alert("Group not found");
          return;
        }
        setGroupData(groupData);

        // Получаем участников
        const membersResponse = await fetch(`/api/group/${groupId}/members`);
        const members = await membersResponse.json();
        setMembers(members);

        // Получаем посты
        const postsResponse = await fetch(`/api/group/${groupId}/feeds`);
        const posts = await postsResponse.json();
        setPosts(posts);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    }

    fetchGroupData();
  }, [groupId]);




  if (!groupData || !posts || !members) return <div className="p-4 text-red-600">Skupina neni nalezena</div>

  const isCreator = userId === groupData.creatorId

  async function handlePostSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    // Создаем объект FormData
    const formData = new FormData()
    formData.append("title", postTitle)
    formData.append("content", postContent)
    formData.append("groupId", groupId)
    console.log(userId)
    formData.append("userId", userId!)
    if (file) formData.append("file", file)

    // Отправляем данные
    const res = await fetch("/api/feed/create", {
      method: "POST",
      body: formData,
    })

    if (res.ok) {
      setPostTitle("")
      setPostContent("")
      setFile(null)
      alert("Příspěvek byl vytvořen")
    } else {
      alert("Chyba při vytváření příspěvku")
    }

    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 px-4">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h1 className="text-3xl font-bold">{groupData.name}</h1>
          <p className="text-muted-foreground">
            Počet členů: {members.length}
          </p>

          {isCreator && (
            <form onSubmit={handlePostSubmit} className="mt-4 space-y-4">
              <Input
                placeholder="Název příspěvku"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                required
              />
              <textarea
                placeholder="Obsah příspěvku"
                className="w-full h-32 p-2 border rounded"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                required
              />
              <input
                type="file"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Vytváříme..." : "Vytvořit příspěvek"}
              </Button>
            </form>
          )}

          <div className="mt-6">
            <h2 className="text-2xl font-semibold">Příspěvky</h2>
            {posts.length === 0 ? (
              <p className="text-muted-foreground">Žádné příspěvky</p>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="mt-4">
                  <h3 className="text-xl font-semibold">{post.title}</h3>
                  {post.file && (
                    <Image
                      src={post.file}
                      alt="File"
                      width={200}
                      height={200}
                      className="max-w-xs mt-2"
                    />
                  )}
                  <p>{post.content}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
