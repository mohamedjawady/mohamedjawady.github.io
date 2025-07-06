"use client"

import { useState, useMemo } from "react"
import { Visualization } from "@/lib/visualizations"
import { VisualizationCard } from "@/components/visualization-card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Code } from "lucide-react"

interface VisualizationsFilterProps {
  visualizations: Visualization[]
  allTags: string[]
}

export function VisualizationsFilter({ visualizations, allTags }: VisualizationsFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const filteredVisualizations = useMemo(() => {
    let filtered = visualizations

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (viz) =>
          viz.title.toLowerCase().includes(query) ||
          viz.description.toLowerCase().includes(query) ||
          viz.category.toLowerCase().includes(query) ||
          viz.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    // Filter by selected tag
    if (selectedTag) {
      filtered = filtered.filter((viz) => viz.tags.includes(selectedTag))
    }

    return filtered
  }, [visualizations, searchQuery, selectedTag])

  // Group filtered visualizations by category
  const categorizedVisualizations = useMemo(() => {
    const grouped: Record<string, Visualization[]> = {}
    filteredVisualizations.forEach((viz) => {
      if (!grouped[viz.category]) {
        grouped[viz.category] = []
      }
      grouped[viz.category].push(viz)
    })
    return grouped
  }, [filteredVisualizations])

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
            placeholder="Search visualizations..."
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
          {filteredVisualizations.length === visualizations.length
            ? `Showing all ${visualizations.length} visualizations`
            : `Showing ${filteredVisualizations.length} of ${visualizations.length} visualizations`}
          {searchQuery && ` for "${searchQuery}"`}
          {selectedTag && ` tagged with "${selectedTag}"`}
        </p>
      </div>

      {/* Visualizations by Category */}
      {Object.entries(categorizedVisualizations).map(([category, vizs]) => (
        <div key={category} className="mb-12">
          <h2 className="text-2xl font-bold font-mono mb-6 text-green-400">
            {category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vizs.map((viz) => (
              <VisualizationCard key={viz.id} visualization={viz} />
            ))}
          </div>
        </div>
      ))}

      {/* No results */}
      {filteredVisualizations.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No visualizations found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search query or selected tags.
          </p>
        </div>
      )}

      {/* Empty state for no visualizations at all */}
      {visualizations.length === 0 && (
        <div className="text-center py-12">
          <Code className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No visualizations yet</h3>
          <p className="text-muted-foreground">
            Interactive visualizations will appear here as they are created.
          </p>
        </div>
      )}
    </>
  )
}
