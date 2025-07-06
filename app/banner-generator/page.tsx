import { BannerGenerator } from "@/components/banner-generator"

export default function BannerGeneratorPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Banner Generator</h1>
        <p className="text-xl text-muted-foreground">
          Create beautiful, branded banners for your blog posts and visualizations
        </p>
      </header>

      <div className="flex justify-center mb-12">
        <BannerGenerator 
          title="The Hill Cipher: Linear Algebra Meets Cryptography"
          tags={["cryptography", "linear-algebra", "matrix", "encryption"]}
          category="cryptography"
          type="post"
          slug="hill-cipher-cryptography"
        />
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h2>🎨 Banner System Overview</h2>
        <p>
          Our banner system provides a structured way to create and manage visual headers for your content.
          All banners are organized in dedicated directories and follow consistent naming conventions.
        </p>

        <h3>📁 Directory Structure</h3>
        <pre className="bg-muted p-4 rounded-lg">
{`public/
├── banners/
│   ├── posts/           # Blog post banners
│   │   ├── hill-cipher-cryptography-banner.jpg
│   │   ├── malware-analysis-intro-banner.png
│   │   └── ...
│   └── visualizations/  # Visualization banners
│       ├── hill-cipher-banner.svg
│       ├── rsa-demo-banner.jpg
│       └── ...`}
        </pre>

        <h3>🎯 Static Banner Features</h3>
        <ul>
          <li>✅ Complete creative control</li>
          <li>✅ Can include screenshots, diagrams, photos</li>
          <li>✅ Optimized file sizes</li>
          <li>✅ Custom branded designs</li>
          <li>✅ Perfect for specific visual themes</li>
        </ul>

        <h3>🎨 Category Presets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
          <div className="p-4 rounded-lg border">
            <div className="h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded mb-2"></div>
            <strong>Cryptography</strong> - Security-focused blues and purples
          </div>
          <div className="p-4 rounded-lg border">
            <div className="h-4 bg-gradient-to-r from-green-600 to-cyan-600 rounded mb-2"></div>
            <strong>Reverse Engineering</strong> - Tech greens and cyans
          </div>
          <div className="p-4 rounded-lg border">
            <div className="h-4 bg-gradient-to-r from-red-600 to-orange-600 rounded mb-2"></div>
            <strong>Malware Analysis</strong> - Alert reds and oranges
          </div>
          <div className="p-4 rounded-lg border">
            <div className="h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded mb-2"></div>
            <strong>Tutorial</strong> - Educational blues
          </div>
        </div>

        <h3>📝 Usage Example</h3>
        
        <h4>Static Banner Implementation</h4>
        <pre className="bg-muted p-4 rounded-lg">
{`---
title: "The Hill Cipher: Linear Algebra Meets Cryptography"
description: "Exploring the Hill cipher and its mathematical foundations"
banner: "/banners/posts/hill-cipher.jpg"
bannerAlt: "The Hill Cipher mathematical visualization"
---`}
        </pre>

        <h3>🔧 Best Practices</h3>
        <ul>
          <li><strong>Naming Convention:</strong> Use kebab-case matching your post slug</li>
          <li><strong>Dimensions:</strong> 1200×630px for optimal social sharing</li>
          <li><strong>File Formats:</strong> JPG for photos, PNG for graphics with transparency, SVG for vector graphics</li>
          <li><strong>File Size:</strong> Keep under 1MB for fast loading</li>
          <li><strong>Alt Text:</strong> Always include descriptive alt text for accessibility</li>
          <li><strong>Consistency:</strong> Maintain consistent branding across all banners</li>
          <li><strong>Quality:</strong> Use high-resolution images that look crisp on all devices</li>
        </ul>

        <h3>⚡ Quick Start</h3>
        <ol>
          <li>Create or design your banner image (1200×630px recommended)</li>
          <li>Save it in the appropriate directory (/public/banners/posts/ or /public/banners/visualizations/)</li>
          <li>Add the banner frontmatter to your post</li>
          <li>Include descriptive alt text for accessibility</li>
          <li>Preview your post to see the banner in action</li>
        </ol>

        <p className="text-muted-foreground text-sm">
          💡 <strong>Tip:</strong> Create banners that complement your content theme and maintain 
          visual consistency across your blog for better brand recognition.
        </p>
      </div>
    </div>
  )
}
