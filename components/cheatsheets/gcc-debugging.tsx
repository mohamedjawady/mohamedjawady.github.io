"use client"

import { useState } from "react"
import { Copy, Check, Bug, AlertTriangle, Settings, Zap, Search, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      className="h-7 w-7 p-0"
      onClick={copyToClipboard}
      title={copied ? "Copied!" : "Copy command"}
    >
      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
    </Button>
  )
}

interface GccCommandProps {
  flag: string
  description: string
  example?: string
  usage?: string
  notes?: string
  category?: string
}

function GccCommand({ flag, description, example, usage, notes, category }: GccCommandProps) {
  return (
    <div className="space-y-3 border-l-2 border-blue-500/30 pl-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{flag}</code>
            {category && <Badge variant="outline" className="text-xs">{category}</Badge>}
            <CopyButton text={flag} />
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      
      {usage && (
        <div>
          <h5 className="text-xs font-semibold mb-1">Usage:</h5>
          <div className="flex items-center gap-2">
            <code className="text-xs bg-muted/50 px-2 py-1 rounded">{usage}</code>
            <CopyButton text={usage} />
          </div>
        </div>
      )}
      
      {example && (
        <div>
          <h5 className="text-xs font-semibold mb-1">Example:</h5>
          <div className="flex items-center gap-2">
            <code className="text-xs bg-muted/50 px-2 py-1 rounded">{example}</code>
            <CopyButton text={example} />
          </div>
        </div>
      )}
      
      {notes && (
        <Alert>
          <AlertTriangle className="h-3 w-3" />
          <AlertDescription className="text-xs">
            {notes}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export function GccDebuggingCheatsheet() {
  const basicDebugging = [
    {
      flag: "-g",
      description: "Generate debug information for use with debuggers like GDB",
      usage: "gcc -g program.c -o program",
      example: "gcc -g main.c -o main",
      notes: "Essential for debugging with GDB. Increases binary size."
    },
    {
      flag: "-g3",
      description: "Generate maximum debug information including macro definitions",
      usage: "gcc -g3 program.c -o program",
      example: "gcc -g3 -DDEBUG main.c -o main",
      notes: "Includes macro information. Larger binaries than -g."
    },
    {
      flag: "-ggdb",
      description: "Generate debug information specifically for GDB",
      usage: "gcc -ggdb program.c -o program",
      example: "gcc -ggdb main.c -o main",
      notes: "GDB-specific extensions. Best compatibility with GDB."
    },
    {
      flag: "-gdwarf-4",
      description: "Generate DWARF version 4 debug information",
      usage: "gcc -gdwarf-4 program.c -o program",
      example: "gcc -gdwarf-4 -g main.c -o main",
      notes: "Specify DWARF version for compatibility."
    },
    {
      flag: "-fno-omit-frame-pointer",
      description: "Keep frame pointer for better stack traces",
      usage: "gcc -fno-omit-frame-pointer program.c -o program",
      example: "gcc -g -fno-omit-frame-pointer main.c -o main",
      notes: "Helpful for profiling tools and stack traces."
    }
  ]

  const warningControl = [
    {
      flag: "-Wall",
      description: "Enable most common warning messages",
      usage: "gcc -Wall program.c -o program",
      example: "gcc -Wall main.c -o main",
      notes: "Good starting point for catching common issues."
    },
    {
      flag: "-Wextra",
      description: "Enable additional warning messages beyond -Wall",
      usage: "gcc -Wall -Wextra program.c -o program",
      example: "gcc -Wall -Wextra main.c -o main",
      notes: "More strict checking. Recommended for development."
    },
    {
      flag: "-Werror",
      description: "Treat all warnings as errors",
      usage: "gcc -Werror program.c -o program",
      example: "gcc -Wall -Werror main.c -o main",
      notes: "Forces you to fix all warnings. Good for CI/CD."
    },
    {
      flag: "-Wformat=2",
      description: "Extra format string checking",
      usage: "gcc -Wformat=2 program.c -o program",
      example: "gcc -Wall -Wformat=2 main.c -o main",
      notes: "Catches printf/scanf format string vulnerabilities."
    },
    {
      flag: "-Wuninitialized",
      description: "Warn about uninitialized variables",
      usage: "gcc -Wuninitialized program.c -o program",
      example: "gcc -O -Wuninitialized main.c -o main",
      notes: "Requires optimization to work effectively."
    },
    {
      flag: "-Wshadow",
      description: "Warn about variable shadowing",
      usage: "gcc -Wshadow program.c -o program",
      example: "gcc -Wall -Wshadow main.c -o main",
      notes: "Catches variables that hide outer scope variables."
    }
  ]

  const optimization = [
    {
      flag: "-O0",
      description: "No optimization (default for debugging)",
      usage: "gcc -O0 -g program.c -o program",
      example: "gcc -O0 -g main.c -o main",
      notes: "Best for debugging. Code matches source line-by-line."
    },
    {
      flag: "-Og",
      description: "Optimize for debugging experience",
      usage: "gcc -Og -g program.c -o program",
      example: "gcc -Og -g main.c -o main",
      notes: "Balanced optimization that doesn't break debugging."
    },
    {
      flag: "-O1",
      description: "Basic optimization",
      usage: "gcc -O1 program.c -o program",
      example: "gcc -O1 -g main.c -o main",
      notes: "Light optimization. Some debugging may be affected."
    },
    {
      flag: "-O2",
      description: "Standard optimization level",
      usage: "gcc -O2 program.c -o program",
      example: "gcc -O2 main.c -o main",
      notes: "Common for production. Debugging can be challenging."
    },
    {
      flag: "-O3",
      description: "Aggressive optimization",
      usage: "gcc -O3 program.c -o program",
      example: "gcc -O3 main.c -o main",
      notes: "Maximum optimization. Debugging very difficult."
    },
    {
      flag: "-fno-inline",
      description: "Disable function inlining",
      usage: "gcc -fno-inline program.c -o program",
      example: "gcc -O2 -fno-inline -g main.c -o main",
      notes: "Keeps function calls for better debugging."
    }
  ]

  const sanitizers = [
    {
      flag: "-fsanitize=address",
      description: "Address Sanitizer (ASan) - detects memory errors",
      usage: "gcc -fsanitize=address program.c -o program",
      example: "gcc -g -fsanitize=address main.c -o main",
      notes: "Detects buffer overflows, use-after-free, memory leaks."
    },
    {
      flag: "-fsanitize=undefined",
      description: "Undefined Behavior Sanitizer (UBSan)",
      usage: "gcc -fsanitize=undefined program.c -o program",
      example: "gcc -g -fsanitize=undefined main.c -o main",
      notes: "Catches undefined behavior like integer overflow."
    },
    {
      flag: "-fsanitize=thread",
      description: "Thread Sanitizer (TSan) - detects race conditions",
      usage: "gcc -fsanitize=thread program.c -o program",
      example: "gcc -g -fsanitize=thread -pthread main.c -o main",
      notes: "For multithreaded programs. Detects data races."
    },
    {
      flag: "-fsanitize=memory",
      description: "Memory Sanitizer (MSan) - detects uninitialized reads",
      usage: "gcc -fsanitize=memory program.c -o program",
      example: "gcc -g -fsanitize=memory main.c -o main",
      notes: "Clang-specific. Detects reads of uninitialized memory."
    },
    {
      flag: "-fstack-protector-strong",
      description: "Enable strong stack protection",
      usage: "gcc -fstack-protector-strong program.c -o program",
      example: "gcc -g -fstack-protector-strong main.c -o main",
      notes: "Protects against stack buffer overflows."
    }
  ]

  const staticAnalysis = [
    {
      flag: "-fanalyzer",
      description: "Enable static analysis (GCC 10+)",
      usage: "gcc -fanalyzer program.c -o program",
      example: "gcc -fanalyzer main.c -o main",
      notes: "Deep static analysis. Can be slow on large codebases."
    },
    {
      flag: "-Wconversion",
      description: "Warn about type conversions that may alter values",
      usage: "gcc -Wconversion program.c -o program",
      example: "gcc -Wall -Wconversion main.c -o main",
      notes: "Strict checking. May produce many warnings."
    },
    {
      flag: "-Wdouble-promotion",
      description: "Warn about float to double promotions",
      usage: "gcc -Wdouble-promotion program.c -o program",
      example: "gcc -Wall -Wdouble-promotion main.c -o main",
      notes: "Important for embedded systems with limited precision."
    },
    {
      flag: "-Wcast-align",
      description: "Warn about casts that increase alignment requirements",
      usage: "gcc -Wcast-align program.c -o program",
      example: "gcc -Wall -Wcast-align main.c -o main",
      notes: "Prevents alignment-related crashes on some architectures."
    },
    {
      flag: "-Wnull-dereference",
      description: "Warn about potential null pointer dereferences",
      usage: "gcc -Wnull-dereference program.c -o program",
      example: "gcc -O2 -Wnull-dereference main.c -o main",
      notes: "Requires optimization for effective analysis."
    }
  ]

  const advancedDebugging = [
    {
      flag: "-pg",
      description: "Generate profiling information for gprof",
      usage: "gcc -pg program.c -o program",
      example: "gcc -g -pg main.c -o main",
      notes: "Run program, then use gprof to analyze performance."
    },
    {
      flag: "-rdynamic",
      description: "Export all symbols for better stack traces",
      usage: "gcc -rdynamic program.c -o program",
      example: "gcc -g -rdynamic main.c -o main",
      notes: "Helpful for debugging segfaults and crashes."
    },
    {
      flag: "-save-temps",
      description: "Save intermediate compilation files",
      usage: "gcc -save-temps program.c -o program",
      example: "gcc -save-temps main.c -o main",
      notes: "Generates .i, .s, .o files for debugging compilation."
    },
    {
      flag: "-dumpbase",
      description: "Set base name for dump files",
      usage: "gcc -dumpbase name program.c -o program",
      example: "gcc -save-temps -dumpbase debug main.c -o main",
      notes: "Useful when saving intermediate files."
    },
    {
      flag: "-v",
      description: "Verbose output showing compilation steps",
      usage: "gcc -v program.c -o program",
      example: "gcc -v main.c -o main",
      notes: "Shows all commands executed during compilation."
    },
    {
      flag: "-Q",
      description: "Show compilation statistics",
      usage: "gcc -Q --help=optimizers program.c",
      example: "gcc -Q -O2 main.c -o main",
      notes: "Combined with other flags to show what's enabled."
    }
  ]

  return (
    <div className="space-y-6">
      <Alert>
        <Bug className="h-4 w-4" />
        <AlertDescription>
          Comprehensive GCC debugging reference. Use these flags to catch bugs early, 
          generate debug symbols, and analyze your C/C++ code effectively.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic Debug</TabsTrigger>
          <TabsTrigger value="warnings">Warnings</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="sanitizers">Sanitizers</TabsTrigger>
          <TabsTrigger value="analysis">Static Analysis</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5" />
                Basic Debugging Flags
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {basicDebugging.map((cmd, index) => (
                <GccCommand key={index} {...cmd} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warnings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Warning Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {warningControl.map((cmd, index) => (
                <GccCommand key={index} {...cmd} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Optimization Levels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {optimization.map((cmd, index) => (
                <GccCommand key={index} {...cmd} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sanitizers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Runtime Sanitizers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sanitizers.map((cmd, index) => (
                <GccCommand key={index} {...cmd} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Static Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {staticAnalysis.map((cmd, index) => (
                <GccCommand key={index} {...cmd} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Advanced Debugging
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {advancedDebugging.map((cmd, index) => (
                <GccCommand key={index} {...cmd} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Pro tip:</strong> For development, start with: 
          <code className="mx-1 text-xs bg-muted px-1 rounded">gcc -Wall -Wextra -g -Og</code>
          For debugging issues, add sanitizers: 
          <code className="mx-1 text-xs bg-muted px-1 rounded">gcc -Wall -Wextra -g -O0 -fsanitize=address,undefined</code>
        </AlertDescription>
      </Alert>
    </div>
  )
}
