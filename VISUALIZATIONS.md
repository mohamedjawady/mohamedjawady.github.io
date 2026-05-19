# Visualization Guide

How interactive components are built, registered, and embedded in this codebase.

---

## Architecture overview

Posts are `.mdx` files rendered by `next-mdx-remote/rsc`. Custom JSX tags inside MDX
(e.g. `<PyramidOfPain />`) are resolved by looking up the tag name in a **components map**
passed to `<MDXRemote components={...} />`.

There are **two separate registries** that both need to be updated when adding a new visualization
to a post. Missing either one produces the runtime error:

```
Expected component `YourComponent` to be defined: you likely forgot to import, pass, or provide it.
```

| File | Role |
|---|---|
| `components/mdx-components.tsx` | Shared base map, used across all MDX contexts |
| `app/posts/[slug]/page.tsx` | Post-specific map (`postComponents`), merges the base and re-declares everything explicitly |
| `app/visualizations/[id]/page.tsx` | Standalone visualization pages. Separate registry, key-value map by component name string |

---

## Adding a visualization to a post

### 1. Create the component

Create `components/visualizations/your-component-name.tsx`.

All interactive components must be Client Components:

```tsx
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SomeIcon } from "lucide-react"

export function YourComponentName() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 my-8">
      <Card className="border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SomeIcon className="w-5 h-5 text-primary" />
            Title
          </CardTitle>
          <CardDescription>
            One sentence explaining what the reader can do here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* content */}
        </CardContent>
      </Card>
    </div>
  )
}
```

### 2. Register in `components/mdx-components.tsx`

Add the import and the map entry:

```tsx
// imports (at the top with the others)
import { YourComponentName } from "@/components/visualizations/your-component-name"

// inside the mdxComponents object (alphabetical order, near similar components)
YourComponentName: () => <YourComponentName />,
```

### 3. Register in `app/posts/[slug]/page.tsx`

This is the step that is easy to miss. The page maintains its own explicit registry.
Add both the import and the entry:

```tsx
// imports (keep alphabetical, near the other visualization imports ~line 46)
import { YourComponentName } from "@/components/visualizations/your-component-name"

// inside postComponents (~line 93, near similar components)
YourComponentName: () => <YourComponentName />,
```

### 4. Use it in the MDX post

```mdx
<YourComponentName />
```

Self-closing tag, no props needed for standard visualizations.

---

## Adding a standalone visualization page

Standalone visualizations live at `/visualizations/[id]` and are backed by a content file
in `content/visualizations/`.

### 1. Create the content file

`content/visualizations/your-viz-id.md`:

```md
---
title: "Your Visualization Title"
description: "One sentence description for the page and OG card."
date: "2026-01-01"
author: "Mohamed Habib Jaouadi"
tags: ["tag-one", "tag-two"]
component: "YourComponentName"
visibility: "public"
relatedPost: "optional-post-slug"
---

Optional markdown prose displayed above the interactive component.
```

The `component` field must match the key used in the next step.

### 2. Register in `app/visualizations/[id]/page.tsx`

```tsx
// import
import { YourComponentName } from "@/components/visualizations/your-component-name"

// inside visualizationComponents
'YourComponentName': YourComponentName,
```

Note: standalone visualization pages do **not** use `mdxComponents` or `postComponents`.
They have their own separate `visualizationComponents` map.

---

## Component conventions

### File location

```
components/visualizations/kebab-case-name.tsx
```

Export name must be PascalCase and match what you register in all maps.

### Required: `"use client"` directive

Every visualization uses `useState`, `framer-motion`, or browser APIs.
Always add `"use client"` as the first line.

### Standard wrapper

Wrap all content in a `Card` with consistent outer spacing:

```tsx
<div className="w-full max-w-4xl mx-auto space-y-6 my-8">
  <Card className="border-border/50 shadow-lg">
    <CardHeader>...</CardHeader>
    <CardContent className="space-y-6">...</CardContent>
  </Card>
</div>
```

### Animation

Use `framer-motion` for all enter/exit animations. Keep delays short (≤ 100ms per item).
The standard pattern for reveal-on-mount:

```tsx
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.07 }}
>
```

For conditional content (show/hide panels):

```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.22 }}
      className="overflow-hidden"
    >
      ...
    </motion.div>
  )}
</AnimatePresence>
```

### Color and theming

Use Tailwind semantic classes rather than hardcoded colors so dark mode works automatically:

| Purpose | Class |
|---|---|
| Card background | `bg-background` |
| Subtle fill | `bg-muted/30` to `bg-muted/50` |
| Border | `border-border/50` |
| Muted text | `text-muted-foreground` |
| Primary accent | `text-primary` |

Avoid `bg-white` or `text-black`. They break in dark mode.

### Available UI primitives

Import from `@/components/ui/`:

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
```

Import icons from `lucide-react`.

---

## Built-in MDX components

These are already registered and available in any post without any setup.

### `<Term>`

Renders inline text with a hover tooltip pulled from the glossary in `components/ui/term.tsx`.

```mdx
The attacker used <Term concept="living-off-the-land">living-off-the-land</Term> techniques.
```

To add a new term, add an entry to the `glossary` object in `components/ui/term.tsx`:

```tsx
"your-concept": "Definition text shown in the tooltip.",
```

The `concept` prop is case-insensitive. If no definition is found, the text renders with
primary color styling and a warning is logged to the console.

### `<CollapsibleCode>`

A collapsible code block with a label, language badge, and copy button.

```mdx
<CollapsibleCode title="Example Sigma Rule" language="yaml">

```yaml
title: My Detection Rule
...
```

</CollapsibleCode>
```

Props:

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | string | language name | Header label |
| `language` | string | (none) | Language badge (e.g. `yaml`, `bash`, `yara`) |
| `defaultOpen` | boolean | `false` | Whether expanded on load |
| `showCopy` | boolean | `true` | Show copy button |

---

## Quick-reference checklist

Adding a visualization to a **post**:

- [ ] Create `components/visualizations/your-name.tsx` with `"use client"` at the top
- [ ] Export a PascalCase function component
- [ ] Wrap in `<div className="w-full max-w-4xl mx-auto space-y-6 my-8"><Card ...>`
- [ ] Add import + map entry in `components/mdx-components.tsx`
- [ ] Add import + map entry in `app/posts/[slug]/page.tsx` **(do not skip this)**
- [ ] Use `<YourComponentName />` in the `.mdx` file

Adding a **standalone visualization**:

- [ ] Create `components/visualizations/your-name.tsx` (same component rules)
- [ ] Create `content/visualizations/your-id.md` with `component: "YourComponentName"` in frontmatter
- [ ] Add import + map entry in `app/visualizations/[id]/page.tsx`
- [ ] `visibility: "public"` to make it appear in the visualizations index
