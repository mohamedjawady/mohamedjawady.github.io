import fs from "fs"
import path from "path"
import matter from "gray-matter"

const cheatsheetsDirectory = path.join(process.cwd(), "content/cheatsheets")

export interface Cheatsheet {
  id: string
  title: string
  description: string
  date: string
  author: string
  tags: string[]
  component: string
  visibility: "public" | "private" | "draft"
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  content: string
}

export async function getAllCheatsheets(): Promise<Cheatsheet[]> {
  // Check if cheatsheets directory exists
  if (!fs.existsSync(cheatsheetsDirectory)) {
    console.warn(`Cheatsheets directory does not exist: ${cheatsheetsDirectory}`)
    return []
  }

  const fileNames = fs.readdirSync(cheatsheetsDirectory)
  const allCheatsheetsData = fileNames
    .filter((name) => name.endsWith(".md") || name.endsWith(".mdx"))
    .map((fileName) => {
      const id = fileName.replace(/\.(md|mdx)$/, "")
      const fullPath = path.join(cheatsheetsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const { data, content } = matter(fileContents)

      return {
        id,
        title: data.title || "Untitled",
        description: data.description || "",
        date: data.date || new Date().toISOString(),
        author: data.author || "Anonymous",
        tags: data.tags || [],
        component: data.component || id,
        visibility: data.visibility || "public",
        category: data.category || "general",
        difficulty: data.difficulty || "beginner",
        content,
      }
    })

  return allCheatsheetsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getCheatsheetById(id: string): Promise<Cheatsheet | null> {
  const cheatsheets = await getAllCheatsheets()
  return cheatsheets.find((sheet) => sheet.id === id) || null
}

export async function getPublicCheatsheets(): Promise<Cheatsheet[]> {
  const allCheatsheets = await getAllCheatsheets()
  return allCheatsheets.filter((sheet) => sheet.visibility === "public")
}

export async function getDraftCheatsheets(): Promise<Cheatsheet[]> {
  const allCheatsheets = await getAllCheatsheets()
  return allCheatsheets.filter((sheet) => sheet.visibility === "draft")
}

export async function getPrivateCheatsheets(): Promise<Cheatsheet[]> {
  const allCheatsheets = await getAllCheatsheets()
  return allCheatsheets.filter((sheet) => sheet.visibility === "private")
}

export async function getVisibleCheatsheets(): Promise<Cheatsheet[]> {
  const allCheatsheets = await getAllCheatsheets()
  return allCheatsheets.filter(
    (sheet) => sheet.visibility === "public" || sheet.visibility === "draft"
  )
}

export function getAllTags(cheatsheets: Cheatsheet[]): string[] {
  return Array.from(new Set(cheatsheets.flatMap((sheet) => sheet.tags)))
}

export function getAllCategories(cheatsheets: Cheatsheet[]): string[] {
  return Array.from(new Set(cheatsheets.map((sheet) => sheet.category)))
}

export function getCheatsheetsByCategory(cheatsheets: Cheatsheet[], category: string): Cheatsheet[] {
  return cheatsheets.filter((sheet) => sheet.category === category)
}

export function getCheatsheetsByDifficulty(cheatsheets: Cheatsheet[], difficulty: string): Cheatsheet[] {
  return cheatsheets.filter((sheet) => sheet.difficulty === difficulty)
}
