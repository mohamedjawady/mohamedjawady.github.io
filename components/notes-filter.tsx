"use client"

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Filter, X, BookOpen, Video, Headphones, FileText, Monitor, GraduationCap } from 'lucide-react'
import { Note } from '@/lib/notes'

interface NotesFilterProps {
  notes: Note[]
  onFilter: (filteredNotes: Note[]) => void
  categories: string[]
  types: string[]
  tags: string[]
  statuses: string[]
}

export function NotesFilter({ notes, onFilter, categories, types, tags, statuses }: NotesFilterProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const getTypeIcon = (type: string) => {
    const iconProps = { className: "w-4 h-4" }
    switch (type) {
      case 'book': return <BookOpen {...iconProps} />
      case 'course': return <GraduationCap {...iconProps} />
      case 'video': return <Video {...iconProps} />
      case 'podcast': return <Headphones {...iconProps} />
      case 'article': return <FileText {...iconProps} />
      case 'lecture': return <Monitor {...iconProps} />
      default: return <FileText {...iconProps} />
    }
  }

  const filterNotes = () => {
    let filtered = notes

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.description.toLowerCase().includes(query) ||
        note.source.toLowerCase().includes(query) ||
        note.author?.toLowerCase().includes(query) ||
        note.tags.some(tag => tag.toLowerCase().includes(query)) ||
        note.category.toLowerCase().includes(query)
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(note => note.category === selectedCategory)
    }

    if (selectedType) {
      filtered = filtered.filter(note => note.type === selectedType)
    }

    if (selectedDifficulty) {
      filtered = filtered.filter(note => note.difficulty === selectedDifficulty)
    }

    if (selectedStatus) {
      filtered = filtered.filter(note => note.status === selectedStatus)
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(note =>
        selectedTags.every(tag => note.tags.includes(tag))
      )
    }

    onFilter(filtered)
  }

  useEffect(() => {
    filterNotes()
  }, [searchQuery, selectedCategory, selectedType, selectedDifficulty, selectedStatus, selectedTags, notes])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedType('')
    setSelectedDifficulty('')
    setSelectedStatus('')
    setSelectedTags([])
  }

  const hasActiveFilters = searchQuery || selectedCategory || selectedType || selectedDifficulty || selectedStatus || selectedTags.length > 0

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag))
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder="Search notes by title, description, source, author, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1">
              Active
            </Badge>
          )}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Filters</TabsTrigger>
                <TabsTrigger value="tags">Tags</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Category Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All categories</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Type Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All types</SelectItem>
                        {types.map(type => (
                          <SelectItem key={type} value={type}>
                            <div className="flex items-center gap-2">
                              {getTypeIcon(type)}
                              <span className="capitalize">{type}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Difficulty Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Difficulty</label>
                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                      <SelectTrigger>
                        <SelectValue placeholder="All levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All levels</SelectItem>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All statuses</SelectItem>
                        {statuses.map(status => (
                          <SelectItem key={status} value={status}>
                            <span className="capitalize">{status}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tags" className="space-y-4 mt-4">
                {selectedTags.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Selected Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map(tag => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => removeTag(tag)}
                        >
                          {tag}
                          <X className="w-3 h-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Available Tags</label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {tags
                      .filter(tag => !selectedTags.includes(tag))
                      .map(tag => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer hover:bg-secondary"
                          onClick={() => addTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="secondary">
              Search: "{searchQuery}"
              <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSearchQuery('')} />
            </Badge>
          )}
          {selectedCategory && (
            <Badge variant="secondary">
              Category: {selectedCategory}
              <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSelectedCategory('')} />
            </Badge>
          )}
          {selectedType && (
            <Badge variant="secondary">
              Type: {selectedType}
              <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSelectedType('')} />
            </Badge>
          )}
          {selectedDifficulty && (
            <Badge variant="secondary">
              Level: {selectedDifficulty}
              <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSelectedDifficulty('')} />
            </Badge>
          )}
          {selectedStatus && (
            <Badge variant="secondary">
              Status: {selectedStatus}
              <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSelectedStatus('')} />
            </Badge>
          )}
          {selectedTags.map(tag => (
            <Badge key={tag} variant="secondary">
              Tag: {tag}
              <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => removeTag(tag)} />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
