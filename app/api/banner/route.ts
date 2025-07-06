import { NextRequest, NextResponse } from "next/server"
import { getCategoryPreset } from "@/lib/banners"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const title = searchParams.get("title") || "Blog Post"
  const tags = searchParams.get("tags") || "blog"
  const category = searchParams.get("category") || "Article"
  const type = searchParams.get("type") || "post"
  const slug = searchParams.get("slug") || "sample"
  const width = parseInt(searchParams.get("width") || "1200")
  const height = parseInt(searchParams.get("height") || "630")

  // Get category-specific styling
  const preset = getCategoryPreset(category)
  
  // Create SVG banner with improved design
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${preset.gradientFrom};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${preset.gradientTo};stop-opacity:1" />
        </linearGradient>
        <linearGradient id="overlay" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:rgba(0,0,0,0.3);stop-opacity:1" />
          <stop offset="50%" style="stop-color:rgba(0,0,0,0.1);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgba(0,0,0,0.3);stop-opacity:1" />
        </linearGradient>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
        </pattern>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <rect width="100%" height="100%" fill="url(#grid)"/>
      <rect width="100%" height="100%" fill="url(#overlay)"/>
      
      <!-- Content Container -->
      <g transform="translate(80, ${height/2 - 120})">
        <!-- Category Badge -->
        <rect x="0" y="-20" width="${Math.min(category.length * 12 + 40, 200)}" height="35" 
              fill="rgba(255,255,255,0.2)" rx="17" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
        <text x="20" y="0" fill="white" font-family="Arial, sans-serif" 
              font-size="16" font-weight="500">${category.toUpperCase()}</text>
        
        <!-- Title -->
        <text x="0" y="60" fill="white" font-family="Arial, sans-serif" font-size="52" font-weight="bold" filter="url(#glow)">
          ${title.length > 35 ? 
            `<tspan x="0" dy="0">${title.substring(0, 35)}</tspan><tspan x="0" dy="60">${title.substring(35, 70)}${title.length > 70 ? "..." : ""}</tspan>` :
            `<tspan x="0" dy="0">${title}</tspan>`
          }
        </text>
        
        <!-- Tags -->
        <g transform="translate(0, ${title.length > 35 ? 160 : 100})">
          ${tags.split(",").slice(0, 4).map((tag, index) => {
            const tagWidth = Math.min(tag.trim().length * 9 + 24, 140)
            return `
              <rect x="${index * 150}" y="0" width="${tagWidth}" height="32" 
                    fill="rgba(255,255,255,0.15)" rx="16" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
              <text x="${index * 150 + 12}" y="21" fill="white" font-family="Arial, sans-serif" 
                    font-size="14" font-weight="400">#${tag.trim()}</text>
            `
          }).join("")}
        </g>
        
        <!-- Type indicator -->
        <text x="0" y="${title.length > 35 ? 220 : 160}" fill="rgba(255,255,255,0.7)" font-family="Arial, sans-serif" 
              font-size="18" font-weight="300">${type === 'visualization' ? 'Interactive Visualization' : 'Blog Post'}</text>
      </g>
      
      <!-- Brand and decorative elements -->
      <g transform="translate(${width - 120}, ${height - 80})">
        <text x="0" y="0" fill="rgba(255,255,255,0.6)" font-family="Arial, sans-serif" 
              font-size="24" font-weight="600" text-anchor="end">0xHabib</text>
        <text x="0" y="25" fill="rgba(255,255,255,0.4)" font-family="Arial, sans-serif" 
              font-size="14" text-anchor="end">Security Research & Education</text>
      </g>
      
      <!-- Decorative geometric elements -->
      <g opacity="0.15">
        <circle cx="${width - 150}" cy="120" r="60" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
        <circle cx="${width - 120}" cy="90" r="25" fill="rgba(255,255,255,0.05)"/>
        <rect x="${width - 200}" y="200" width="80" height="80" fill="rgba(255,255,255,0.05)" rx="8" transform="rotate(15 ${width - 160} 240)"/>
      </g>
    </svg>
  `

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": `inline; filename="${slug}-banner.svg"`,
    },
  })
}
