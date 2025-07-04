import fs from "fs"
import path from "path"
import matter from "gray-matter"

const postsDirectory = path.join(process.cwd(), "content/posts")

export interface Post {
  slug: string
  title: string
  description: string
  date: string
  author: string
  tags: string[]
  readingTime: string
  content: string
}

export async function getAllPosts(): Promise<Post[]> {
  // Check if posts directory exists
  if (!fs.existsSync(postsDirectory)) {
    console.warn(`Posts directory does not exist: ${postsDirectory}`)
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter((name) => name.endsWith(".md") || name.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.(md|mdx)$/, "")
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title || "Untitled",
        description: data.description || "",
        date: data.date || new Date().toISOString(),
        author: data.author || "Anonymous",
        tags: data.tags || [],
        readingTime: calculateReadingTime(content),
        content,
      }
    })

  return allPostsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getAllPosts()
  return posts.find((post) => post.slug === slug) || null
}

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}
