"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X } from "lucide-react"
import type { Cheatsheet } from "@/lib/cheatsheets"

interface CheatsheetsFilterProps {
  cheatsheets: Cheatsheet[]
  onFilter: (filtered: Cheatsheet[]) => void
}

export function CheatsheetsFilter({ cheatsheets, onFilter }: CheatsheetsFilterProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Get unique values for filters
  const categories = Array.from(new Set(cheatsheets.map(sheet => sheet.category)))
  const difficulties = ["beginner", "intermediate", "advanced"]
  const allTags = Array.from(new Set(cheatsheets.flatMap(sheet => sheet.tags)))

  // Apply filters
  const applyFilters = () => {
    let filtered = cheatsheets

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(sheet =>
        sheet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sheet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sheet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(sheet => sheet.category === selectedCategory)
    }

    // Difficulty filter
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(sheet => sheet.difficulty === selectedDifficulty)
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(sheet =>
        selectedTags.some(tag => sheet.tags.includes(tag))
      )
    }

    onFilter(filtered)
  }

  // Handle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedDifficulty("all")
    setSelectedTags([])
    onFilter(cheatsheets)
  }

  // Apply filters whenever any filter changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
  }

  const handleDifficultyChange = (value: string) => {
    setSelectedDifficulty(value)
  }

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters()
  }, [searchTerm, selectedCategory, selectedDifficulty, selectedTags])

  const hasActiveFilters = searchTerm || selectedCategory !== "all" || selectedDifficulty !== "all" || selectedTags.length > 0

  return (
    <div className="space-y-4 mb-8">
      {/* Search and quick filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search cheatsheets..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDifficulty} onValueChange={handleDifficultyChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {difficulties.map(difficulty => (
                <SelectItem key={difficulty} value={difficulty}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Tags filter */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter by tags:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "secondary"}
              className="cursor-pointer hover:scale-105 transition-transform"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="text-sm text-muted-foreground">
          Showing filtered results
          {selectedTags.length > 0 && (
            <span> • Tags: {selectedTags.join(", ")}</span>
          )}
        </div>
      )}
    </div>
  )
}
