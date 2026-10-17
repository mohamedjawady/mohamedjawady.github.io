import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Prominent, standalone CTAs: sharp corners, bold uppercase tracked
        // labels, flat solid colors. The site's one consistent "primary
        // button" look, replacing what used to be hand-rolled per page.
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 font-semibold uppercase tracking-wide",
        brand:
          "bg-emerald-500 text-black hover:bg-emerald-600 font-semibold uppercase tracking-wide",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold uppercase tracking-wide",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground font-semibold uppercase tracking-wide",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold uppercase tracking-wide",
        // Icon buttons, toolbar controls, and inline text actions stay in
        // sentence case; shouting at every click target in a dense tool
        // canvas or filter bar would hurt usability, not brand.
        ghost: "hover:bg-accent hover:text-accent-foreground font-medium",
        link: "text-primary underline-offset-4 hover:underline font-medium",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded px-3 text-xs",
        lg: "h-12 rounded px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
