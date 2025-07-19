"use client"

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Copy, Terminal, Bug, Eye, Play, Settings, Target } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

export default function GdbDebuggingCheatsheet() {
  const [activeTab, setActiveTab] = useState('basic')

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const CommandBlock = ({ command, description, example }: { command: string; description: string; example?: string }) => (
    <div className="flex items-start justify-between p-3 border border-muted rounded-lg">
      <div className="space-y-1 flex-1">
        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{command}</code>
        <p className="text-sm text-muted-foreground">{description}</p>
        {example && (
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Example: </span>
            <code className="bg-muted px-1 rounded">{example}</code>
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => copyToClipboard(command)}
        className="ml-2 h-8 w-8 p-0"
      >
        <Copy className="h-3 w-3" />
      </Button>
    </div>
  )

  const basicCommands = [
    { command: "gdb program", description: "Start GDB with a program", example: "gdb ./myapp" },
    { command: "gdb program core", description: "Debug with core dump", example: "gdb ./myapp core" },
    { command: "gdb -p PID", description: "Attach to running process", example: "gdb -p 12345" },
    { command: "run [args]", description: "Start program execution", example: "run arg1 arg2" },
    { command: "continue (c)", description: "Continue execution after breakpoint" },
    { command: "quit (q)", description: "Exit GDB" },
    { command: "help [command]", description: "Get help for commands", example: "help breakpoint" },
    { command: "set args [args]", description: "Set program arguments", example: "set args -v file.txt" },
    { command: "show args", description: "Display current arguments" },
    { command: "file program", description: "Load executable file", example: "file ./debug_version" }
  ]

  const breakpointCommands = [
    { command: "break function", description: "Set breakpoint at function", example: "break main" },
    { command: "break file:line", description: "Set breakpoint at line", example: "break main.c:25" },
    { command: "break *address", description: "Set breakpoint at address", example: "break *0x400500" },
    { command: "break +offset", description: "Set breakpoint at offset from current line", example: "break +5" },
    { command: "rbreak regex", description: "Set breakpoints matching regex", example: "rbreak ^str" },
    { command: "watch variable", description: "Set watchpoint on variable", example: "watch myvar" },
    { command: "rwatch variable", description: "Set read watchpoint", example: "rwatch buffer" },
    { command: "awatch variable", description: "Set read/write watchpoint", example: "awatch counter" },
    { command: "info breakpoints", description: "List all breakpoints" },
    { command: "delete [num]", description: "Delete breakpoint(s)", example: "delete 2" },
    { command: "disable [num]", description: "Disable breakpoint(s)", example: "disable 1" },
    { command: "enable [num]", description: "Enable breakpoint(s)", example: "enable 1" },
    { command: "condition num expr", description: "Set conditional breakpoint", example: "condition 1 x > 10" },
    { command: "ignore num count", description: "Ignore breakpoint N times", example: "ignore 1 5" }
  ]

  const executionCommands = [
    { command: "step (s)", description: "Step into functions (source level)" },
    { command: "stepi (si)", description: "Step one instruction" },
    { command: "next (n)", description: "Step over functions (source level)" },
    { command: "nexti (ni)", description: "Step over one instruction" },
    { command: "finish", description: "Run until current function returns" },
    { command: "until [location]", description: "Run until location", example: "until 50" },
    { command: "advance location", description: "Run until location (temporary breakpoint)", example: "advance func" },
    { command: "jump location", description: "Jump to location without executing intermediate code", example: "jump 30" },
    { command: "return [value]", description: "Force function to return", example: "return 42" },
    { command: "call function", description: "Call function in debugged program", example: "call strlen(str)" },
    { command: "signal signum", description: "Send signal to program", example: "signal SIGTERM" }
  ]

  const inspectionCommands = [
    { command: "print variable", description: "Print variable value", example: "print x" },
    { command: "print/format expr", description: "Print with format (x=hex, d=decimal, etc)", example: "print/x ptr" },
    { command: "print *pointer", description: "Dereference pointer", example: "print *ptr" },
    { command: "print array[0]@len", description: "Print array elements", example: "print arr[0]@10" },
    { command: "display expr", description: "Auto-display expression", example: "display counter" },
    { command: "undisplay [num]", description: "Remove auto-display", example: "undisplay 1" },
    { command: "info locals", description: "Show local variables" },
    { command: "info args", description: "Show function arguments" },
    { command: "info variables", description: "Show global/static variables" },
    { command: "info registers", description: "Show CPU registers" },
    { command: "x/format address", description: "Examine memory", example: "x/10x $rsp" },
    { command: "set variable = value", description: "Modify variable", example: "set x = 100" },
    { command: "whatis variable", description: "Show variable type", example: "whatis ptr" },
    { command: "ptype type", description: "Show detailed type info", example: "ptype struct node" }
  ]

  const stackCommands = [
    { command: "backtrace (bt)", description: "Show call stack" },
    { command: "backtrace full", description: "Show call stack with local variables" },
    { command: "frame [num]", description: "Select stack frame", example: "frame 2" },
    { command: "up [count]", description: "Move up stack frames", example: "up 2" },
    { command: "down [count]", description: "Move down stack frames", example: "down 1" },
    { command: "info frame", description: "Show current frame info" },
    { command: "info stack", description: "Show stack summary" },
    { command: "select-frame num", description: "Select frame without printing", example: "select-frame 3" },
    { command: "frame apply all command", description: "Apply command to all frames", example: "frame apply all info locals" }
  ]

  const advancedCommands = [
    { command: "thread [num]", description: "Switch to thread", example: "thread 2" },
    { command: "info threads", description: "List all threads" },
    { command: "thread apply all command", description: "Apply command to all threads", example: "thread apply all bt" },
    { command: "attach PID", description: "Attach to running process", example: "attach 1234" },
    { command: "detach", description: "Detach from process" },
    { command: "generate-core-file", description: "Create core dump" },
    { command: "source script.gdb", description: "Execute GDB script", example: "source debug.gdb" },
    { command: "define command_name", description: "Define custom command" },
    { command: "python code", description: "Execute Python code", example: "python print('hello')" },
    { command: "info inferior", description: "Show inferior processes" },
    { command: "inferior num", description: "Switch to inferior", example: "inferior 2" },
    { command: "add-inferior", description: "Add new inferior process" },
    { command: "set follow-fork-mode child", description: "Follow child process on fork" },
    { command: "catch syscall", description: "Catch system calls", example: "catch syscall open" }
  ]

  const formatOptions = [
    { format: "/x", description: "Hexadecimal" },
    { format: "/d", description: "Decimal" },
    { format: "/u", description: "Unsigned decimal" },
    { format: "/o", description: "Octal" },
    { format: "/t", description: "Binary" },
    { format: "/c", description: "Character" },
    { format: "/s", description: "String" },
    { format: "/f", description: "Floating point" },
    { format: "/a", description: "Address" },
    { format: "/i", description: "Instruction" }
  ]

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Bug className="h-8 w-8" />
          GDB Debugging Cheatsheet
        </h1>
        <p className="text-muted-foreground">
          Essential GDB commands and techniques for effective C/C++ debugging
        </p>
      </div>

      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertDescription>
          <strong>Quick Start:</strong> Compile with debug symbols using <code>gcc -g program.c</code>, 
          then run <code>gdb ./a.out</code> to start debugging.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic" className="flex items-center gap-1">
            <Play className="h-3 w-3" />
            Basic
          </TabsTrigger>
          <TabsTrigger value="breakpoints" className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            Breakpoints
          </TabsTrigger>
          <TabsTrigger value="execution" className="flex items-center gap-1">
            <Play className="h-3 w-3" />
            Execution
          </TabsTrigger>
          <TabsTrigger value="inspection" className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            Inspection
          </TabsTrigger>
          <TabsTrigger value="stack" className="flex items-center gap-1">
            <Settings className="h-3 w-3" />
            Stack
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-1">
            <Terminal className="h-3 w-3" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Play className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Basic Commands</h2>
            <Badge variant="secondary">Essential</Badge>
          </div>
          <div className="grid gap-3">
            {basicCommands.map((cmd, index) => (
              <CommandBlock key={index} {...cmd} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="breakpoints" className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Breakpoints & Watchpoints</h2>
            <Badge variant="secondary">Control Flow</Badge>
          </div>
          <div className="grid gap-3">
            {breakpointCommands.map((cmd, index) => (
              <CommandBlock key={index} {...cmd} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="execution" className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Play className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Execution Control</h2>
            <Badge variant="secondary">Navigation</Badge>
          </div>
          <div className="grid gap-3">
            {executionCommands.map((cmd, index) => (
              <CommandBlock key={index} {...cmd} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inspection" className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Data Inspection</h2>
            <Badge variant="secondary">Analysis</Badge>
          </div>
          <div className="grid gap-3">
            {inspectionCommands.map((cmd, index) => (
              <CommandBlock key={index} {...cmd} />
            ))}
          </div>
          
          <div className="mt-6 p-4 border border-muted rounded-lg">
            <h3 className="font-semibold mb-3">Print Format Options</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {formatOptions.map((fmt, index) => (
                <div key={index} className="text-sm">
                  <code className="bg-muted px-1 rounded">{fmt.format}</code>
                  <span className="text-muted-foreground ml-1">{fmt.description}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stack" className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Stack & Frame Navigation</h2>
            <Badge variant="secondary">Call Stack</Badge>
          </div>
          <div className="grid gap-3">
            {stackCommands.map((cmd, index) => (
              <CommandBlock key={index} {...cmd} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Advanced Features</h2>
            <Badge variant="secondary">Expert</Badge>
          </div>
          <div className="grid gap-3">
            {advancedCommands.map((cmd, index) => (
              <CommandBlock key={index} {...cmd} />
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <Alert>
              <Bug className="h-4 w-4" />
              <AlertDescription>
                <strong>Memory Examination:</strong> Use <code>x/[count][format][size] address</code><br/>
                Example: <code>x/10x $rsp</code> (10 hex words from stack pointer)
              </AlertDescription>
            </Alert>

            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertDescription>
                <strong>GDB Scripts:</strong> Create <code>.gdbinit</code> file for custom commands and settings.<br/>
                Example: <code>set print pretty on</code> for formatted struct output.
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-center text-sm text-muted-foreground space-y-1">
        <p>💡 <strong>Pro Tip:</strong> Use <kbd>Tab</kbd> for auto-completion and <kbd>↑/↓</kbd> for command history</p>
        <p>📖 For more details: <code>man gdb</code> or <code>info gdb</code></p>
      </div>
    </div>
  )
}
