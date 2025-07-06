# Banner Assets

This directory contains banner images for blog posts and visualizations.

## Directory Structure

```
banners/
├── posts/           # Blog post banners
│   ├── *.jpg        # Photo-based banners
│   ├── *.png        # Graphics with transparency
│   └── *.svg        # Vector graphics
└── visualizations/  # Interactive visualization banners
    ├── *.jpg        # Photo-based banners
    ├── *.png        # Graphics with transparency
    └── *.svg        # Vector graphics
```

## Naming Convention

Banner files should follow this naming pattern:
```
{post-slug}-banner.{ext}
```

Examples:
- `hill-cipher-cryptography-banner.jpg`
- `malware-analysis-intro-banner.png`
- `rsa-visualization-banner.svg`

## File Specifications

### Dimensions
- **Recommended:** 1200×630px (1.91:1 ratio)
- **Minimum:** 800×418px
- **Maximum:** 1920×1080px

### File Formats
- **JPG:** For photographic content, complex graphics
- **PNG:** For graphics with transparency, simple graphics
- **SVG:** For vector graphics, scalable designs

### File Size
- **Target:** Under 500KB
- **Maximum:** 1MB
- **Optimization:** Use tools like [TinyPNG](https://tinypng.com/) or [SVGO](https://jakearchibald.github.io/svgomg/)

## Usage

### In Post Frontmatter
```yaml
---
title: "Your Post Title"
banner: "/banners/posts/your-post-slug-banner.jpg"
bannerAlt: "Descriptive alt text for accessibility"
---
```

### Dynamic Banners
For auto-generated banners, use the banner API:
```yaml
banner: "/api/banner?title=Your%20Title&tags=tag1%2Ctag2&category=cryptography&type=post&slug=your-slug"
```

## Tools

- **Banner Generator:** Visit `/banner-generator` to create dynamic banners
- **Design Tools:** Figma, Canva, Adobe Creative Suite
- **Optimization:** TinyPNG, Squoosh, SVGO

## Best Practices

1. **Consistent Branding:** Use the site's color scheme and typography
2. **Readable Text:** Ensure text is legible at small sizes
3. **High Contrast:** Good contrast between text and background
4. **Mobile-Friendly:** Test how banners look on mobile devices
5. **Accessibility:** Always include descriptive alt text
6. **SEO:** Banners improve social media sharing and engagement

## Category Color Schemes

- **Cryptography:** Blues and purples (#4F46E5 → #7C3AED)
- **Reverse Engineering:** Greens and cyans (#059669 → #0891B2)
- **Malware Analysis:** Reds and oranges (#DC2626 → #EA580C)
- **Tutorial:** Blues and purples (#2563EB → #7C3AED)
- **Visualization:** Purples and pinks (#7C3AED → #EC4899)

## Quick Start

1. Create your banner image (1200×630px)
2. Optimize the file size
3. Save to appropriate directory (`posts/` or `visualizations/`)
4. Use kebab-case naming: `post-slug-banner.ext`
5. Add to your post's frontmatter
6. Test the banner display

## Need Help?

- Use the Banner Generator at `/banner-generator`
- Check existing banners for examples
- Follow the naming conventions
- Optimize file sizes before uploading
