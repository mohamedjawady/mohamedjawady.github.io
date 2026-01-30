"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ArrowRight, Box, Code, Layers } from "lucide-react"

export function GoDataStructures() {
    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 my-8">
            <Card className="border-border/50 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Box className="w-5 h-5 text-blue-500" />
                        Go Internal Data Structures
                    </CardTitle>
                    <CardDescription>
                        Interactive visualization of memory layouts for Strings, Slices, and Interfaces.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="string" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="string">String (ex1)</TabsTrigger>
                            <TabsTrigger value="slice">Slice (ex2)</TabsTrigger>
                            <TabsTrigger value="interface">Interface (Boxing)</TabsTrigger>
                        </TabsList>

                        {/* STRING VISUALIZATION */}
                        <TabsContent value="string" className="space-y-4 mt-6">
                            <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                                {/* Stack View */}
                                <div className="space-y-2">
                                    <div className="text-sm font-semibold text-center text-muted-foreground">Stack Frame (Local Variable)</div>
                                    <div className="border border-border rounded-lg bg-background p-4 w-48 shadow-sm">
                                        <div className="text-xs text-muted-foreground mb-1 font-mono">string struct</div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center text-sm p-1 bg-muted rounded">
                                                <span className="font-mono text-blue-600">ptr</span>
                                                <span className="font-mono text-[10px]">0x1040a020</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm p-1 bg-muted rounded">
                                                <span className="font-mono text-purple-600">len</span>
                                                <span className="font-mono">6</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <ArrowRight className="hidden md:block text-muted-foreground" />
                                <div className="block md:hidden text-center text-muted-foreground">Points To</div>

                                {/* Heap View */}
                                <div className="space-y-2">
                                    <div className="text-sm font-semibold text-center text-muted-foreground">Heap / Runtime Data</div>
                                    <div className="border border-border rounded-lg bg-background p-4 w-64 shadow-sm">
                                        <div className="text-xs text-muted-foreground mb-1 font-mono">0x1040a020 (Immutable)</div>
                                        <div className="grid grid-cols-6 gap-1">
                                            {['s', 'a', 'm', 'p', 'l', 'e'].map((char, i) => (
                                                <div key={i} className="aspect-square bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center rounded text-sm font-mono border border-blue-200 dark:border-blue-800">
                                                    {char}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-2 text-[10px] text-muted-foreground text-center">
                                            No null terminator!
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-muted/50 p-4 rounded-md text-sm text-muted-foreground mt-4">
                                <p><strong>Key concept:</strong> Strings are essentially read-only slices. They have a pointer and a length, but no capacity. Passing a string by value copies the struct, not the backing data.</p>
                            </div>
                        </TabsContent>

                        {/* SLICE VISUALIZATION */}
                        <TabsContent value="slice" className="space-y-4 mt-6">
                            <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                                {/* Stack View */}
                                <div className="space-y-2">
                                    <div className="text-sm font-semibold text-center text-muted-foreground">Stack Frame</div>
                                    <div className="border border-border rounded-lg bg-background p-4 w-48 shadow-sm">
                                        <div className="text-xs text-muted-foreground mb-1 font-mono">slice struct</div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center text-sm p-1 bg-muted rounded">
                                                <span className="font-mono text-blue-600">ptr</span>
                                                <span className="font-mono text-[10px]">0x2080c040</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm p-1 bg-muted rounded">
                                                <span className="font-mono text-purple-600">len</span>
                                                <span className="font-mono">3</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm p-1 bg-muted rounded">
                                                <span className="font-mono text-orange-600">cap</span>
                                                <span className="font-mono">4</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <ArrowRight className="hidden md:block text-muted-foreground" />

                                {/* Heap View */}
                                <div className="space-y-2">
                                    <div className="text-sm font-semibold text-center text-muted-foreground">Backing Array</div>
                                    <div className="border border-border rounded-lg bg-background p-4 w-64 shadow-sm">
                                        <div className="text-xs text-muted-foreground mb-1 font-mono">0x2080c040</div>
                                        <div className="grid grid-cols-4 gap-1">
                                            <div className="aspect-square bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center rounded text-sm font-mono border border-purple-200 dark:border-purple-800">1</div>
                                            <div className="aspect-square bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center rounded text-sm font-mono border border-purple-200 dark:border-purple-800">2</div>
                                            <div className="aspect-square bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center rounded text-sm font-mono border border-purple-200 dark:border-purple-800">3</div>
                                            <div className="aspect-square bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center rounded text-sm font-mono border border-dashed border-orange-300 dark:border-orange-700 text-muted-foreground">?</div>
                                        </div>
                                        <div className="flex justify-between mt-1 text-[10px] ">
                                            <span className="text-purple-600">len = 3</span>
                                            <span className="text-orange-600">cap = 4</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-muted/50 p-4 rounded-md text-sm text-muted-foreground mt-4">
                                <p><strong>Key concept:</strong> A slice describes a window into an array. If <code>append()</code> exceeds <code>cap</code>, Go allocates a newer, bigger array and updates the <code>ptr</code> in the return struct.</p>
                            </div>
                        </TabsContent>

                        {/* INTERFACE VISUALIZATION */}
                        <TabsContent value="interface" className="space-y-4 mt-6">
                            <div className="flex flex-col gap-4 items-center justify-center">
                                {/* Stack View */}
                                <div className="text-sm font-semibold text-center text-muted-foreground">Boxed Interface (eface)</div>
                                <div className="border border-border rounded-lg bg-background p-4 w-80 shadow-sm flex flex-col gap-2">
                                    <div className="text-xs text-muted-foreground font-mono self-start">interface{ })</div>

                                    {/* Type Pointer */}
                                    <div className="flex items-center gap-2 bg-muted/50 p-2 rounded border border-border/50">
                                        <div className="w-12 text-xs font-mono text-muted-foreground">TYPE</div>
                                        <ArrowRight className="w-4 h-4 text-emerald-500" />
                                        <Badge variant="outline" className="font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200">RTYPE_string</Badge>
                                        <span className="text-[10px] text-muted-foreground ml-auto">Describes "string"</span>
                                    </div>

                                    {/* Data Pointer */}
                                    <div className="flex items-center gap-2 bg-muted/50 p-2 rounded border border-border/50">
                                        <div className="w-12 text-xs font-mono text-muted-foreground">DATA</div>
                                        <ArrowRight className="w-4 h-4 text-blue-500" />
                                        <div className="flex flex-col">
                                            <Badge variant="outline" className="font-mono text-blue-600 bg-blue-50 dark:bg-blue-950/30 border-blue-200">ptr</Badge>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground ml-auto">Points to actual string struct</span>
                                    </div>
                                </div>


                                {/* Flow Diagram */}
                                <div className="mt-4 flex gap-4 text-sm text-center max-w-lg">
                                    <div className="flex-1 p-2 bg-background border border-border rounded">
                                        <div className="font-semibold mb-1">Source Value</div>
                                        <div className="font-mono text-xs">hello := "sample"</div>
                                    </div>
                                    <div className="flex items-center text-muted-foreground">→ Boxed Into →</div>
                                    <div className="flex-1 p-2 bg-background border border-border rounded">
                                        <div className="font-semibold mb-1">Destination Interface</div>
                                        <div className="font-mono text-xs">fmt.Println(hello)</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-muted/50 p-4 rounded-md text-sm text-muted-foreground mt-4">
                                <p><strong>Key concept:</strong> When passing a value to an <code>interface{ }</code> argument (like in <code>fmt.Println</code>), Go creates this pair: a pointer to the type "RTYPE", and a pointer to the data. This is what you see in IDA as two pointer assignments.</p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
