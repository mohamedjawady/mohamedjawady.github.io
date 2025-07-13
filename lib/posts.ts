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
  banner?: string
  bannerAlt?: string
  visibility: 'public' | 'private' | 'draft'
  series?: string
  seriesOrder?: number
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
        banner: data.banner,
        bannerAlt: data.bannerAlt,
        visibility: data.visibility || 'public',
        series: data.series,
        seriesOrder: data.seriesOrder,
      }
    })

  return allPostsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPublicPosts(): Promise<Post[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter((post) => post.visibility === 'public' || post.visibility === 'draft')
}

export async function getDraftPosts(): Promise<Post[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter((post) => post.visibility === 'draft')
}

export async function getPrivatePosts(): Promise<Post[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter((post) => post.visibility === 'private')
}

export async function getNonPublicPosts(): Promise<Post[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter((post) => post.visibility !== 'public')
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getAllPosts()
  return posts.find((post) => post.slug === slug) || null
}

export async function getPublicPostBySlug(slug: string): Promise<Post | null> {
  const post = await getPostBySlug(slug)
  return post && (post.visibility === 'public' || post.visibility === 'draft') ? post : null
}

export async function getPostsBySeries(series: string): Promise<Post[]> {
  const allPosts = await getAllPosts()
  return allPosts
    .filter((post) => post.series === series && (post.visibility === 'public' || post.visibility === 'draft'))
    .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0))
}

export async function getSeriesNavigation(currentPostSlug: string): Promise<{
  series: string | null
  posts: Post[]
  currentIndex: number
  previousPost: Post | null
  nextPost: Post | null
} | null> {
  const currentPost = await getPostBySlug(currentPostSlug)
  
  if (!currentPost || !currentPost.series) {
    return null
  }

  const seriesPosts = await getPostsBySeries(currentPost.series)
  const currentIndex = seriesPosts.findIndex(post => post.slug === currentPostSlug)
  
  if (currentIndex === -1) {
    return null
  }

  return {
    series: currentPost.series,
    posts: seriesPosts,
    currentIndex,
    previousPost: currentIndex > 0 ? seriesPosts[currentIndex - 1] : null,
    nextPost: currentIndex < seriesPosts.length - 1 ? seriesPosts[currentIndex + 1] : null,
  }
}

export async function getAllSeries(): Promise<Record<string, Post[]>> {
  const allPosts = await getPublicPosts()
  const seriesMap: Record<string, Post[]> = {}
  
  allPosts.forEach(post => {
    if (post.series) {
      if (!seriesMap[post.series]) {
        seriesMap[post.series] = []
      }
      seriesMap[post.series].push(post)
    }
  })
  
  // Sort posts within each series
  Object.keys(seriesMap).forEach(series => {
    seriesMap[series].sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0))
  })
  
  return seriesMap
}

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}
