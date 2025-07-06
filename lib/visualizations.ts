import fs from "fs"
import path from "path"
import matter from "gray-matter"

const visualizationsDirectory = path.join(process.cwd(), "content/visualizations")

export interface Visualization {
  id: string
  title: string
  description: string
  date: string
  author: string
  tags: string[]
  component: string
  difficulty: string
  category: string
  relatedPost?: string
  content: string
}

export async function getAllVisualizations(): Promise<Visualization[]> {
  // Check if visualizations directory exists
  if (!fs.existsSync(visualizationsDirectory)) {
    console.warn(`Visualizations directory does not exist: ${visualizationsDirectory}`)
    return []
  }

  const fileNames = fs.readdirSync(visualizationsDirectory)
  const allVisualizationsData = fileNames
    .filter((name) => name.endsWith(".md") || name.endsWith(".mdx"))
    .map((fileName) => {
      const id = fileName.replace(/\.(md|mdx)$/, "")
      const fullPath = path.join(visualizationsDirectory, fileName)
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
        difficulty: data.difficulty || "beginner",
        category: data.category || "general",
        relatedPost: data.relatedPost || null,
        content,
      }
    })

  return allVisualizationsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getVisualizationById(id: string): Promise<Visualization | null> {
  const visualizations = await getAllVisualizations()
  return visualizations.find((viz) => viz.id === id) || null
}

export function getVisualizationsByCategory(visualizations: Visualization[]): Record<string, Visualization[]> {
  return visualizations.reduce((acc, viz) => {
    if (!acc[viz.category]) {
      acc[viz.category] = []
    }
    acc[viz.category].push(viz)
    return acc
  }, {} as Record<string, Visualization[]>)
}

export function getAllTags(visualizations: Visualization[]): string[] {
  return Array.from(new Set(visualizations.flatMap((viz) => viz.tags)))
}