"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Copy, RefreshCw } from "lucide-react"
import { generateBannerUrl, getBannerPath, getBannerFileName, BANNER_PRESETS } from "@/lib/banners"

interface BannerGeneratorProps {
  title?: string
  tags?: string[]
  category?: string
  type?: 'post' | 'visualization'
  slug?: string
}

export function BannerGenerator({ 
  title = "Sample Post", 
  tags = ["sample"], 
  category = "blog",
  type = "post",
  slug = "sample-post"
}: BannerGeneratorProps) {
  const [customTitle, setCustomTitle] = useState(title)
  const [customTags, setCustomTags] = useState(tags.join(", "))
  const [customCategory, setCustomCategory] = useState(category)
  const [customType, setCustomType] = useState<'post' | 'visualization'>(type)
  const [customSlug, setCustomSlug] = useState(slug)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const bannerConfig = {
    title: customTitle,
    tags: customTags.split(",").map(tag => tag.trim()),
    category: customCategory,
    type: customType,
    slug: customSlug,
  }

  const bannerUrl = generateBannerUrl(bannerConfig)
  const staticPath = getBannerPath(customSlug, customType)
  const fileName = getBannerFileName(customSlug, customType)

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          Banner Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Enter post title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              placeholder="post-slug"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={customTags}
              onChange={(e) => setCustomTags(e.target.value)}
              placeholder="tag1, tag2, tag3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={customType} onValueChange={(value: 'post' | 'visualization') => setCustomType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="post">Blog Post</SelectItem>
                <SelectItem value="visualization">Visualization</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="category">Category</Label>
            <Select value={customCategory} onValueChange={setCustomCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(BANNER_PRESETS).filter(key => key !== 'default').map((preset) => (
                  <SelectItem key={preset} value={preset}>
                    {preset.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </SelectItem>
                ))}
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {customCategory === 'other' && (
              <Input
                placeholder="Enter custom category"
                onChange={(e) => setCustomCategory(e.target.value)}
                className="mt-2"
              />
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Live Preview</Label>
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border">
            <iframe
              src={bannerUrl}
              className="w-full h-full"
              style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%', height: '200%' }}
              title="Banner Preview"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Dynamic Banner URL</Label>
            <div className="flex gap-2">
              <Input
                value={bannerUrl}
                readOnly
                className="flex-1 text-xs"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(bannerUrl)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Static Path</Label>
            <div className="flex gap-2">
              <Input
                value={staticPath}
                readOnly
                className="flex-1 text-xs"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(staticPath)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <a href={bannerUrl} download={fileName}>
              <Download className="w-4 h-4 mr-2" />
              Download Banner
            </a>
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => window.open(bannerUrl, '_blank')}
          >
            Open Full Size
          </Button>
        </div>

        <div className="space-y-3">
          <Label>Frontmatter Examples</Label>
          
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Dynamic Banner (Generated)</Label>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`banner: "${bannerUrl}"
bannerAlt: "${customTitle} - ${customCategory}"`}
              </pre>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Static Banner (Upload to /public/banners/)</Label>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`banner: "${staticPath}"
bannerAlt: "${customTitle} - ${customCategory}"`}
              </pre>
            </div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground space-y-2">
          <p><strong>📁 Banner Organization:</strong></p>
          <ul className="space-y-1 ml-4">
            <li>• <code>/public/banners/posts/</code> - Blog post banners</li>
            <li>• <code>/public/banners/visualizations/</code> - Visualization banners</li>
            <li>• Use descriptive filenames: <code>{fileName}</code></li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
