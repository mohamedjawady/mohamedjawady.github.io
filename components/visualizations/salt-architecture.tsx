"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Server, Monitor, Database, Lock, Radio, Shield, Cpu, HardDrive, Info, X } from "lucide-react"

interface NodeInfo {
    title: string
    description: string
    details: string[]
    color: string
}

const nodeData: Record<string, NodeInfo> = {
    master: {
        title: "Salt Master",
        description: "The central orchestrator. It manages the event bus, authenticates Minions via AES key exchange, distributes Pillar data, and serves state files from /srv/salt.",
        details: [
            "Publishes jobs over ZeroMQ PUB socket (port 4505)",
            "Receives results over ZeroMQ REP socket (port 4506)",
            "Maintains the persistent Event Bus for all system events",
            "Stores Pillar data and serves it securely per-Minion",
            "Runs Runners (master-side execution modules)",
        ],
        color: "emerald",
    },
    minion1: {
        title: "Minion (Web Server)",
        description: "An agent running on a target node. It initiates the connection to the Master, meaning no inbound ports need to be opened on the Minion host.",
        details: [
            "Subscribes to the Master PUB socket for job broadcasts",
            "Sends results back via the REQ socket",
            "Collects local Grains data (OS, hardware, IP, etc.)",
            "Executes states and modules locally on the host",
            "Can fire custom events onto the Master Event Bus",
        ],
        color: "blue",
    },
    minion2: {
        title: "Minion (Database Server)",
        description: "Each Minion operates independently. It receives only the jobs targeted at it (via glob, grain, or pillar matching) and executes them locally.",
        details: [
            "Runs the salt-minion daemon as a background service",
            "Authenticates with the Master using public key cryptography",
            "Stores its own accepted key in /etc/salt/pki/minion",
            "Supports Beacons for monitoring local system events",
            "Can operate in masterless mode using local state files",
        ],
        color: "blue",
    },
    minion3: {
        title: "Minion (App Server)",
        description: "Minions are lightweight and designed for scale. A single Master can manage thousands of Minions concurrently over the ZeroMQ message bus.",
        details: [
            "Minion ID defaults to the hostname but is configurable",
            "Grains are refreshed on each Minion startup",
            "Supports scheduled states via Salt Scheduler",
            "Can return results to external systems via Returners",
            "Pillar data is fetched securely from the Master on demand",
        ],
        color: "blue",
    },
    eventbus: {
        title: "ZeroMQ Event Bus",
        description: "The transport backbone of Salt. All communication between Master and Minions flows through two ZeroMQ sockets operating over encrypted TCP.",
        details: [
            "Port 4505 (PUB): One-to-many broadcast from Master to all Minions",
            "Port 4506 (REP): Two-way channel for results, file requests, and Pillar queries",
            "All payloads encrypted with AES after initial key exchange",
            "Minions filter incoming jobs by matching their ID against the target expression",
            "Event tags follow the pattern: salt/job/<jid>/new, salt/job/<jid>/ret/<minion_id>",
        ],
        color: "purple",
    },
    pillar: {
        title: "Pillar (Secure Data)",
        description: "Top-down, Master-controlled data store for sensitive configuration. Each Minion only receives the Pillar data explicitly assigned to it in the Pillar top file.",
        details: [
            "Stored on the Master under /srv/pillar",
            "Distributed encrypted over the ZeroMQ REP channel",
            "Supports Jinja templating for dynamic values",
            "Ideal for passwords, API keys, and per-environment config",
            "Targeted via top.sls matching (glob, grain, compound)",
        ],
        color: "amber",
    },
    grains: {
        title: "Grains (Static Data)",
        description: "Bottom-up, Minion-collected static data about the host. Grains include OS type, kernel version, IP addresses, CPU architecture, and custom tags.",
        details: [
            "Collected automatically when the Minion starts",
            "Used for targeting: salt -G 'os:Ubuntu' state.apply",
            "Custom grains can be defined in /etc/salt/grains",
            "Grains are static and do not change during runtime (unless refreshed)",
            "Common grains: os, os_family, fqdn, ip4_interfaces, cpuarch",
        ],
        color: "cyan",
    },
}

export function SaltArchitecture() {
    const [selectedNode, setSelectedNode] = useState<string | null>(null)

    const info = selectedNode ? nodeData[selectedNode] : null

    const getColorClasses = (color: string, isSelected: boolean) => {
        const colors: Record<string, { bg: string; border: string; icon: string; selectedBg: string }> = {
            emerald: { bg: "bg-emerald-100 dark:bg-emerald-900/40", border: "border-emerald-300 dark:border-emerald-700", icon: "text-emerald-600 dark:text-emerald-400", selectedBg: "ring-2 ring-emerald-500" },
            blue: { bg: "bg-blue-100 dark:bg-blue-900/40", border: "border-blue-300 dark:border-blue-700", icon: "text-blue-600 dark:text-blue-400", selectedBg: "ring-2 ring-blue-500" },
            purple: { bg: "bg-purple-100 dark:bg-purple-900/40", border: "border-purple-300 dark:border-purple-700", icon: "text-purple-600 dark:text-purple-400", selectedBg: "ring-2 ring-purple-500" },
            amber: { bg: "bg-amber-100 dark:bg-amber-900/40", border: "border-amber-300 dark:border-amber-700", icon: "text-amber-600 dark:text-amber-400", selectedBg: "ring-2 ring-amber-500" },
            cyan: { bg: "bg-cyan-100 dark:bg-cyan-900/40", border: "border-cyan-300 dark:border-cyan-700", icon: "text-cyan-600 dark:text-cyan-400", selectedBg: "ring-2 ring-cyan-500" },
        }
        const c = colors[color] || colors.blue
        return `${c.bg} ${c.border} ${isSelected ? c.selectedBg : ""}`
    }

    const getIconColor = (color: string) => {
        const map: Record<string, string> = {
            emerald: "text-emerald-600 dark:text-emerald-400",
            blue: "text-blue-600 dark:text-blue-400",
            purple: "text-purple-600 dark:text-purple-400",
            amber: "text-amber-600 dark:text-amber-400",
            cyan: "text-cyan-600 dark:text-cyan-400",
        }
        return map[color] || map.blue
    }

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6 my-8">
            <Card className="border-border/50 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Server className="w-5 h-5 text-emerald-500" />
                        Salt Master-Minion Architecture
                    </CardTitle>
                    <CardDescription>
                        Click on any component to see how it fits into the Salt ecosystem. The Master broadcasts jobs over port 4505 and receives results over port 4506.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Architecture Diagram */}
                    <div className="relative p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-border/50">

                        {/* Master Node */}
                        <div className="flex flex-col items-center mb-8">
                            <button
                                onClick={() => setSelectedNode(selectedNode === "master" ? null : "master")}
                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:scale-105 ${getColorClasses("emerald", selectedNode === "master")}`}
                            >
                                <div className="w-14 h-14 rounded-lg bg-emerald-200 dark:bg-emerald-800 flex items-center justify-center">
                                    <Server className="w-7 h-7 text-emerald-700 dark:text-emerald-300" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold">Salt Master</p>
                                    <p className="text-xs text-muted-foreground">Orchestrator</p>
                                </div>
                            </button>
                        </div>

                        {/* Data Layer (Pillar + Grains) */}
                        <div className="flex justify-center gap-6 mb-4">
                            <button
                                onClick={() => setSelectedNode(selectedNode === "pillar" ? null : "pillar")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 cursor-pointer hover:scale-105 ${getColorClasses("amber", selectedNode === "pillar")}`}
                            >
                                <Lock className={`w-4 h-4 ${getIconColor("amber")}`} />
                                <span className="text-sm font-medium">Pillar</span>
                                <Badge variant="outline" className="text-[10px]">Top-Down</Badge>
                            </button>
                            <button
                                onClick={() => setSelectedNode(selectedNode === "grains" ? null : "grains")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 cursor-pointer hover:scale-105 ${getColorClasses("cyan", selectedNode === "grains")}`}
                            >
                                <Cpu className={`w-4 h-4 ${getIconColor("cyan")}`} />
                                <span className="text-sm font-medium">Grains</span>
                                <Badge variant="outline" className="text-[10px]">Bottom-Up</Badge>
                            </button>
                        </div>

                        {/* Event Bus */}
                        <div className="flex justify-center mb-4">
                            <button
                                onClick={() => setSelectedNode(selectedNode === "eventbus" ? null : "eventbus")}
                                className={`w-full max-w-lg flex items-center justify-center gap-3 px-6 py-3 rounded-lg border-2 border-dashed transition-all duration-300 cursor-pointer hover:scale-[1.02] ${getColorClasses("purple", selectedNode === "eventbus")}`}
                            >
                                <Radio className={`w-5 h-5 ${getIconColor("purple")}`} />
                                <div className="text-center">
                                    <p className="text-sm font-bold">ZeroMQ Event Bus</p>
                                    <div className="flex gap-4 justify-center mt-1">
                                        <span className="text-[10px] font-mono bg-background/50 px-2 py-0.5 rounded border">PUB :4505</span>
                                        <span className="text-[10px] font-mono bg-background/50 px-2 py-0.5 rounded border">REP :4506</span>
                                    </div>
                                </div>
                                <Radio className={`w-5 h-5 ${getIconColor("purple")}`} />
                            </button>
                        </div>

                        {/* Connection Arrows */}
                        <div className="flex justify-center mb-4">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <ArrowRight className="w-4 h-4 rotate-90" />
                                <span className="text-[10px] font-mono">Encrypted AES Payloads</span>
                                <ArrowRight className="w-4 h-4 rotate-90" />
                            </div>
                        </div>

                        {/* Minion Nodes */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {(["minion1", "minion2", "minion3"] as const).map((id, index) => {
                                const icons = [Monitor, Database, HardDrive]
                                const labels = ["web-server-01", "db-server-01", "app-server-01"]
                                const roles = ["Web Server", "Database", "App Server"]
                                const Icon = icons[index]
                                return (
                                    <button
                                        key={id}
                                        onClick={() => setSelectedNode(selectedNode === id ? null : id)}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:scale-105 ${getColorClasses("blue", selectedNode === id)}`}
                                    >
                                        <div className="w-12 h-12 rounded-lg bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
                                            <Icon className="w-6 h-6 text-blue-700 dark:text-blue-300" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-bold">Minion</p>
                                            <p className="text-xs text-muted-foreground font-mono">{labels[index]}</p>
                                            <Badge variant="outline" className="text-[10px] mt-1">{roles[index]}</Badge>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Detail Panel */}
                    {info && (
                        <div className="p-5 bg-muted/30 rounded-lg border border-border/50 space-y-3 transition-all duration-300">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    <Info className="w-4 h-4 text-primary" />
                                    <h4 className="font-semibold">{info.title}</h4>
                                </div>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setSelectedNode(null)}>
                                    <X className="w-3 h-3" />
                                </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">{info.description}</p>
                            <ul className="space-y-1.5">
                                {info.details.map((detail, i) => (
                                    <li key={i} className="text-sm flex items-start gap-2">
                                        <Shield className="w-3 h-3 mt-1 text-primary shrink-0" />
                                        <span>{detail}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Legend */}
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t border-border/50">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                            <span>Master (Orchestrator)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-blue-500" />
                            <span>Minion (Agent)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-purple-500" />
                            <span>ZeroMQ Transport</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-amber-500" />
                            <span>Pillar (Secrets)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-cyan-500" />
                            <span>Grains (Host Facts)</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
