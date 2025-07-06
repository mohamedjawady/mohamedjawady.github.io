"use client"

import { useState, useMemo } from "react"
import { Post } from "@/lib/posts"
import { PostCard } from "@/components/post-card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface PostsFilterProps {
  posts: Post[]
  allTags: string[]
}

export function PostsFilter({ posts, allTags }: PostsFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const filteredPosts = useMemo(() => {
    let filtered = posts

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    // Filter by selected tag
    if (selectedTag) {
      filtered = filtered.filter((post) => post.tags.includes(selectedTag))
    }

    return filtered
  }, [posts, searchQuery, selectedTag])

  const handleTagClick = (tag: string | null) => {
    setSelectedTag(selectedTag === tag ? null : tag)
  }

  return (
    <>
      {/* Search and Filter */}
      <div className="mb-8">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search posts..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedTag === null ? "default" : "outline"}
            className={`cursor-pointer transition-colors ${
              selectedTag === null
                ? "bg-green-500 hover:bg-green-600"
                : "hover:bg-green-500/20"
            }`}
            onClick={() => handleTagClick(null)}
          >
            All
          </Badge>
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                selectedTag === tag
                  ? "bg-green-500 hover:bg-green-600"
                  : "hover:bg-green-500/20"
              }`}
              onClick={() => handleTagClick(tag)}
            >
              #{tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          {filteredPosts.length === posts.length
            ? `Showing all ${posts.length} posts`
            : `Showing ${filteredPosts.length} of ${posts.length} posts`}
          {searchQuery && ` for "${searchQuery}"`}
          {selectedTag && ` tagged with "${selectedTag}"`}
        </p>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {/* No results */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No posts found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search query or selected tags.
          </p>
        </div>
      )}
    </>
  )
}
