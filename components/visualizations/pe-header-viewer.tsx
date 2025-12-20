"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function PEHeaderViewer() {
    const [activeSection, setActiveSection] = useState<'dos' | 'nt' | 'file' | 'optional'>('dos')
    const [hoveredField, setHoveredField] = useState<string | null>(null)

    const structures = {
        dos: {
            name: "IMAGE_DOS_HEADER",
            offset: "0x0000",
            size: "64 bytes",
            description: "Legacy MS-DOS header. The first 64 bytes of every PE file.",
            fields: [
                { name: "e_magic", type: "WORD", value: "0x5A4D ('MZ')", description: "Magic number identifying the file." },
                { name: "e_lfanew", type: "LONG", value: "0x00E0", description: "Offset to the NT headers.", highlight: true },
            ]
        },
        nt: {
            name: "IMAGE_NT_HEADERS64",
            offset: "0x00E0 (e_lfanew)",
            size: "264 bytes",
            description: "Main header containing the PE signature and other headers.",
            fields: [
                { name: "Signature", type: "DWORD", value: "0x00004550 ('PE\\0\\0')", description: "PE signature." },
            ]
        },
        file: {
            name: "IMAGE_FILE_HEADER",
            offset: "+4 bytes from NT",
            size: "20 bytes",
            description: "Basic info about the file layout.",
            fields: [
                { name: "Machine", type: "WORD", value: "0x8664 (AMD64)", description: "Target architecture." },
                { name: "NumberOfSections", type: "WORD", value: "0x0006", description: "Number of sections (.text, .data, etc)." },
                { name: "TimeDateStamp", type: "DWORD", value: "0x63A0F... ", description: "Compilation timestamp." },
                { name: "SizeOfOptionalHeader", type: "WORD", value: "0x00F0", description: "Size of the following optional header." },
                { name: "Characteristics", type: "WORD", value: "0x0022", description: "Flags (Executable, DLL, etc)." },
            ]
        },
        optional: {
            name: "IMAGE_OPTIONAL_HEADER64",
            offset: "+24 bytes from NT",
            size: "240 bytes",
            description: "Critical execution data (Entry Point, Image Base, etc).",
            fields: [
                { name: "Magic", type: "WORD", value: "0x020B (PE32+)", description: "0x10B for 32-bit, 0x20B for 64-bit." },
                { name: "AddressOfEntryPoint", type: "DWORD", value: "0x00001000", description: "RVA of the entry point function.", highlight: true },
                { name: "ImageBase", type: "QWORD", value: "0x0000000180000000", description: "Preferred load address." },
                { name: "SectionAlignment", type: "DWORD", value: "0x00001000", description: "Alignment in memory." },
                { name: "FileAlignment", type: "DWORD", value: "0x00000200", description: "Alignment on disk." },
                { name: "DataDirectory[16]", type: "IMAGE_DATA_DIRECTORY", value: "[Array]", description: "Pointers to Export, Import, Resource tables, etc.", highlight: true },
            ]
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-4 my-8">
            <Card className="border-border/50 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <span className="text-blue-500 font-mono">0x</span>
                        PE Header Structure
                    </CardTitle>
                    <CardDescription>
                        Interactive visualization of the Portable Executable (PE) header format parsed by <code>RtlLoadPeHeaders</code>.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="dos" className="w-full" onValueChange={(v) => setActiveSection(v as any)}>
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="dos">DOS Header</TabsTrigger>
                            <TabsTrigger value="nt">NT Signature</TabsTrigger>
                            <TabsTrigger value="file">File Header</TabsTrigger>
                            <TabsTrigger value="optional">Optional Header</TabsTrigger>
                        </TabsList>

                        {Object.entries(structures).map(([key, struct]) => (
                            <TabsContent key={key} value={key} className="mt-6 space-y-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Visual Representation */}
                                    <div className="md:w-1/3 space-y-4">
                                        <div className="relative border-2 border-border/50 rounded-lg overflow-hidden bg-muted/20">
                                            {/* Header Mockup */}
                                            <div className="h-64 flex flex-col">
                                                <div
                                                    className={`p-4 border-b border-border/50 transition-colors duration-300 ${activeSection === 'dos' ? 'bg-blue-500/10' : 'opacity-40'}`}
                                                >
                                                    <div className="font-mono text-xs text-muted-foreground">0x0000</div>
                                                    <div className="font-bold">IMAGE_DOS_HEADER</div>
                                                </div>

                                                <div
                                                    className={`p-2 border-b border-border/50 bg-muted/40 text-center text-xs text-muted-foreground flex items-center justify-center h-8`}
                                                >
                                                    ... DOS Stub ...
                                                </div>

                                                <div
                                                    className={`p-4 border-b border-border/50 transition-colors duration-300 ${activeSection === 'nt' ? 'bg-blue-500/10' : 'opacity-40'}`}
                                                >
                                                    <div className="font-mono text-xs text-muted-foreground">0x00E0</div>
                                                    <div className="font-bold">NT Signature</div>
                                                </div>

                                                <div
                                                    className={`p-4 border-b border-border/50 transition-colors duration-300 ${activeSection === 'file' ? 'bg-blue-500/10' : 'opacity-40'}`}
                                                >
                                                    <div className="font-mono text-xs text-muted-foreground">+0x04</div>
                                                    <div className="font-bold">IMAGE_FILE_HEADER</div>
                                                </div>

                                                <div
                                                    className={`p-4 flex-1 transition-colors duration-300 ${activeSection === 'optional' ? 'bg-blue-500/10' : 'opacity-40'}`}
                                                >
                                                    <div className="font-mono text-xs text-muted-foreground">+0x18</div>
                                                    <div className="font-bold">IMAGE_OPTIONAL_HEADER</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="md:w-2/3 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold font-mono text-primary">{struct.name}</h3>
                                                <p className="text-muted-foreground text-sm">{struct.description}</p>
                                            </div>
                                            <div className="text-right text-xs font-mono text-muted-foreground">
                                                <div>Offset: {struct.offset}</div>
                                                <div>Size: {struct.size}</div>
                                            </div>
                                        </div>

                                        <div className="border border-border rounded-lg overflow-hidden">
                                            <table className="w-full text-sm">
                                                <thead className="bg-muted/50">
                                                    <tr>
                                                        <th className="p-2 text-left font-medium">Field</th>
                                                        <th className="p-2 text-left font-medium">Type</th>
                                                        <th className="p-2 text-left font-medium">Value (Example)</th>
                                                        <th className="p-2 text-left font-medium">Description</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border/50">
                                                    {struct.fields.map((field: any) => (
                                                        <tr
                                                            key={field.name}
                                                            className={`transition-colors hover:bg-muted/30 ${field.highlight ? 'bg-yellow-500/5 dark:bg-yellow-500/10' : ''}`}
                                                            onMouseEnter={() => setHoveredField(field.name)}
                                                            onMouseLeave={() => setHoveredField(null)}
                                                        >
                                                            <td className="p-2 font-mono text-primary">{field.name}</td>
                                                            <td className="p-2 font-mono text-xs text-muted-foreground">{field.type}</td>
                                                            <td className="p-2 font-mono text-xs">{field.value}</td>
                                                            <td className="p-2 text-muted-foreground text-xs">{field.description}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
