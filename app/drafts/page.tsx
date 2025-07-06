import { getDraftPosts, getPrivatePosts } from "@/lib/posts"
import { PostCard } from "@/components/post-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Edit } from "lucide-react"
import { canAccessDrafts } from "@/lib/development"
import { notFound } from "next/navigation"

export default async function DraftsPage() {
  // Only allow access in development or if explicitly enabled
  if (!canAccessDrafts()) {
    notFound()
  }

  const drafts = await getDraftPosts()
  const privatePosts = await getPrivatePosts()

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold font-mono mb-4 flex items-center gap-3">
          <Edit className="w-8 h-8 text-orange-500" />
          Development Preview
        </h1>
        <p className="text-muted-foreground text-lg">
          Private posts and development preview for non-public content
        </p>
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-blue-800 dark:text-blue-300 text-sm">
            <strong>Note:</strong> Draft posts are now publicly visible with "Coming Soon" previews. 
            This page shows only private posts and development-specific content.
          </p>
        </div>
      </div>

      {/* Draft Posts - Now Public Info */}
      {drafts.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Edit className="w-5 h-5 text-blue-500" />
            <h2 className="text-2xl font-bold">Draft Posts ({drafts.length}) - Now Public</h2>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Publicly Visible as "Coming Soon"
            </Badge>
          </div>
          <p className="text-muted-foreground mb-6">
            These draft posts are now publicly visible with "Coming Soon" previews in the main blog.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drafts.map((post) => (
              <div key={post.slug} className="relative">
                <PostCard post={post} />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-blue-500 hover:bg-blue-600">
                    PUBLIC PREVIEW
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Private Posts */}
      {privatePosts.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <EyeOff className="w-5 h-5 text-red-500" />
            <h2 className="text-2xl font-bold">Private Posts ({privatePosts.length})</h2>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              Hidden from Public
            </Badge>
          </div>
          <p className="text-muted-foreground mb-6">
            These posts are complete but kept private from public viewing.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {privatePosts.map((post) => (
              <div key={post.slug} className="relative">
                <PostCard post={post} />
                <div className="absolute top-2 right-2">
                  <Badge variant="destructive">
                    PRIVATE
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {drafts.length === 0 && privatePosts.length === 0 && (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-3 text-muted-foreground">
              <Eye className="w-8 h-8" />
              No Hidden Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              All posts are currently public. Create some drafts to see them here!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Development Info */}
      <Card className="mt-12 border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="text-blue-800">Development Preview</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 space-y-2">
          <p><strong>Draft Posts:</strong> Work-in-progress content that can be previewed during development</p>
          <p><strong>Private Posts:</strong> Complete content kept hidden from public view</p>
          <p><strong>Access:</strong> This page is only accessible during development - not linked in production</p>
        </CardContent>
      </Card>
    </div>
  )
}
