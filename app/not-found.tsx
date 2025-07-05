import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, ArrowLeft, Search, FileX } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Error Message */}
        <Card className="bg-card/50 backdrop-blur-sm border-green-500/20">
          <CardContent className="p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Page Not Found
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              Oops! The page you're looking for seems to have vanished into the digital void. 
              It might have been moved, deleted, or you may have typed the URL incorrectly.
            </p>
            
            {/* Navigation Options */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Go Home
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/posts">
                    <Search className="mr-2 h-4 w-4" />
                    Browse Posts
                  </Link>
                </Button>
              </div>
              
              <Button variant="ghost" asChild className="text-muted-foreground">
                <Link href="javascript:history.back()">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Helpful Links */}
        <div className="mt-8 text-sm text-muted-foreground">
          <p className="mb-4">Looking for something specific? Try these popular sections:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/about" 
              className="hover:text-green-500 transition-colors underline decoration-dotted"
            >
              About
            </Link>
            <Link 
              href="/posts" 
              className="hover:text-green-500 transition-colors underline decoration-dotted"
            >
              All Posts
            </Link>
            <Link 
              href="/tags" 
              className="hover:text-green-500 transition-colors underline decoration-dotted"
            >
              Tags
            </Link>
            <Link 
              href="/now" 
              className="hover:text-green-500 transition-colors underline decoration-dotted"
            >
              Now
            </Link>
          </div>
        </div>

        {/* Fun Security-themed message */}
        <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-sm text-green-400">
            <span className="font-mono">Error Code:</span> RESOURCE_NOT_FOUND 
            
          </p>
        </div>
      </div>
    </div>
  )
}
