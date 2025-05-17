import { serve } from "https://deno.land/std@0.204.0/http/server.ts"
import { serveDir } from "https://deno.land/std@0.204.0/http/file_server.ts"

const kv = await Deno.openKv()
console.log(1)
async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const path = url.pathname

  if (path.startsWith("/api/")) {
    if (path === "/api/leaderboard" && req.method === "GET") {
      const mode = url.searchParams.get("mode") || "all"
      const size = url.searchParams.get("size") || "all"
      const limit = Number.parseInt(url.searchParams.get("limit") || "50")

      const leaderboard = await getLeaderboard(mode, size, limit)
      return new Response(JSON.stringify(leaderboard), {
        headers: { "Content-Type": "application/json" },
      })
    }

    if (path === "/api/leaderboard" && req.method === "POST") {
      try {
        const data = await req.json()
        const result = await addScore(data)
        return new Response(JSON.stringify({ success: true, id: result }), {
          headers: { "Content-Type": "application/json" },
        })
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        })
      }
    }

    if (path === "/api/score/global") {
      try {
        if (req.method === "GET") {
          const data = await getGlobalBestScore()
          return new Response(JSON.stringify(data), {
            headers: {"Content-Type": "application/json"},
          })
        } else if (req.method === "POST") {
          const data = await req.json()
          const result = await setGlobalBestScore(data.score)
          const id = crypto.randomUUID()
          return new Response(JSON.stringify({ success: true, id: id }), {
            headers: { "Content-Type": "application/json" },
          })
        }
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        })
      }
    }

    if (path == "/api/score/user") {
      try {
        if (req.method === "GET") {
          const name = url.searchParams.get("name")
          const data = await getPersonalBestScore(name)
          return new Response(JSON.stringify(data), {
            headers: {"Content-Type": "application/json"},
          })
        } else if (req.method === "POST") {
          const data = await req.json()
          const result = await setPersonalBestScore(data.name, data.score)
          const id = crypto.randomUUID()
          return new Response(JSON.stringify({ success: true, id: id }), {
            headers: { "Content-Type": "application/json" },
          })
        }
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        })
      }
    }

    if (path === "/api/validate") {
      await validate();
      return;
    }

    if (path === "/api/all") {
      const entries = await getAllEntries();
      return new Response(JSON.stringify(entries), {
        headers: { "Content-Type": "application/json" }
      })
    }

    // if (path === "/api/delete") {
    //   await dropTable()
    // }

    return new Response("Not Found", { status: 404 })
  }

  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  })
}

async function getAllEntries(): Promise<any> {
  return await kv.list({ prefix: [] })
}

async function setGlobalBestScore(score: number): Promise<number> {
  await kv.set(["globalBest"], score)
  return score
}

async function getGlobalBestScore(): Promise<number> {
  return await kv.get(["globalBest"])
}

async function setPersonalBestScore(name: string, score: number): Promise<any[]> {
  await kv.set(["score", name], score)
  return [name, score]
}

async function getPersonalBestScore(name: string): Promise<number> {
  return await kv.get(["score", name])
}

async function getLeaderboard(mode: string, size: string, limit: number): Promise<any[]> {
  const leaderboard: any[] = []

  const entries = kv.list({ prefix: ["leaderboard"] })

  for await (const entry of entries) {
    const record = entry.value as any

    if ((mode === "all" || record.mode === mode) && (size === "all" || record.size.toString() === size)) {
      leaderboard.push(record)
    }
  }
  leaderboard.sort((a, b) => b.score - a.score)
  return limit > 0 ? leaderboard.slice(0, limit) : leaderboard
}

async function addScore(data: any): Promise<string> {
  if (!data.name || !data.score || !data.mode || !data.size) {
    throw new Error("Missing required fields")
  }
  const id = crypto.randomUUID()
  const record = {
    id,
    name: data.name,
    score: data.score,
    mode: data.mode,
    size: data.size,
    date: data.date || new Date().toISOString(),
  }
  await kv.set(["leaderboard", id], record)

  return id
}

async function validate(): Promise<void> {
  for await (const entry of kv.list({ prefix: [] })) {
    try {
      let a = parseInt(entry.value)
      if (a % 2 != 0) {
        kv.delete(entry.key)
      }
    } catch (err) {
      kv.delete(entry.key)
    }
  }
}

serve(handler)
