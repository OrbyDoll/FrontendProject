import { serve } from "https://deno.land/std@0.204.0/http/server.ts"
import { serveDir } from "https://deno.land/std@0.204.0/http/file_server.ts"

// Инициализация KV хранилища
const kv = await Deno.openKv()

// Обработчик запросов
async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const path = url.pathname

  // API для работы с рекордами
  if (path.startsWith("/api/")) {
    // Получение рекордов
    if (path === "/api/leaderboard" && req.method === "GET") {
      const mode = url.searchParams.get("mode") || "all"
      const size = url.searchParams.get("size") || "all"
      const limit = Number.parseInt(url.searchParams.get("limit") || "50")

      const leaderboard = await getLeaderboard(mode, size, limit)
      return new Response(JSON.stringify(leaderboard), {
        headers: { "Content-Type": "application/json" },
      })
    }

    // Добавление нового рекорда
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

    return new Response("Not Found", { status: 404 })
  }

  // Обслуживание статических файлов
  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  })
}

// Получение рекордов из KV хранилища
async function getLeaderboard(mode: string, size: string, limit: number): Promise<any[]> {
  const leaderboard: any[] = []

  // Получаем все записи с префиксом "leaderboard:"
  const entries = kv.list({ prefix: ["leaderboard"] })

  for await (const entry of entries) {
    const record = entry.value as any

    // Фильтрация по режиму и размеру
    if ((mode === "all" || record.mode === mode) && (size === "all" || record.size.toString() === size)) {
      leaderboard.push(record)
    }
  }

  // Сортировка по счету (по убыванию)
  leaderboard.sort((a, b) => b.score - a.score)

  // Применение лимита
  return limit > 0 ? leaderboard.slice(0, limit) : leaderboard
}

// Добавление нового рекорда в KV хранилище
async function addScore(data: any): Promise<string> {
  // Валидация данных
  if (!data.name || !data.score || !data.mode || !data.size) {
    throw new Error("Missing required fields")
  }

  // Создание уникального ID для записи
  const id = crypto.randomUUID()

  // Подготовка записи
  const record = {
    id,
    name: data.name,
    score: data.score,
    mode: data.mode,
    size: data.size,
    date: data.date || new Date().toISOString(),
    duration: data.duration || null,
  }

  // Сохранение в KV хранилище
  await kv.set(["leaderboard", id], record)

  return id
}

// Запуск сервера
serve(handler)
