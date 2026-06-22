"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Network, Database, Server, MessageSquare, HardDrive, GitBranch, Layers, BarChart2 } from "lucide-react"

interface Service {
    id: string
    name: string
    lang: string
    color: string
    icon: React.ReactNode
    role: string
    details: string[]
    outputs: string[]
}

interface Layer {
    label: string
    services: Service[]
}

export function GolliathArchitecture() {
    const [selected, setSelected] = useState<string | null>(null)

    const services: Record<string, Service> = {
        telegram: {
            id: "telegram",
            name: "Telegram MTProto",
            lang: "External",
            color: "text-sky-400 border-sky-400/40 bg-sky-400/10",
            icon: <MessageSquare className="w-4 h-4" />,
            role: "Source — public channels, invite links, file attachments",
            details: [
                "MTProto protocol for encrypted transport",
                "Messages, file attachments, invite links",
                "Bot API + user account sessions via Telethon",
            ],
            outputs: ["session-manager"],
        },
        "session-manager": {
            id: "session-manager",
            name: "Session Manager",
            lang: "Python / Telethon",
            color: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10",
            icon: <Server className="w-4 h-4" />,
            role: "MTProto session pool — scraping, file download, invite resolution",
            details: [
                "Maintains pool of authenticated Telegram sessions",
                "iter_messages(min_id=checkpoint, reverse=True, limit=3000)",
                "CheckChatInviteRequest for invite link metadata",
                "Streams files in 512 KB chunks to download-worker",
            ],
            outputs: ["download-worker"],
        },
        "download-worker": {
            id: "download-worker",
            name: "Download Worker",
            lang: "Go",
            color: "text-green-400 border-green-400/40 bg-green-400/10",
            icon: <Layers className="w-4 h-4" />,
            role: "Scrape mode — fetch messages, publish Kafka events",
            details: [
                "Claims scrape jobs via SELECT … FOR UPDATE SKIP LOCKED",
                "Publishes messages.discovered to Kafka",
                "Routes file tasks to priority/archives/pending topics",
                "Coordinates with session-manager via HTTP",
            ],
            outputs: ["kafka", "file-worker"],
        },
        "file-worker": {
            id: "file-worker",
            name: "File Worker",
            lang: "Go",
            color: "text-green-400 border-green-400/40 bg-green-400/10",
            icon: <HardDrive className="w-4 h-4" />,
            role: "Files mode — consume download tasks, upload to MinIO",
            details: [
                "5 concurrent download slots",
                "Priority: text > archives > other",
                "SHA-256 integrity tracking per file",
                "Categorizes: archives, txt-dumps, quarantine buckets",
            ],
            outputs: ["minio"],
        },
        kafka: {
            id: "kafka",
            name: "Kafka KRaft",
            lang: "Infrastructure",
            color: "text-orange-400 border-orange-400/40 bg-orange-400/10",
            icon: <GitBranch className="w-4 h-4" />,
            role: "Event backbone — messages.discovered, files.priority/archives/pending",
            details: [
                "Three-tier file priority topics (priority > archives > pending)",
                "messages.discovered → message-indexer",
                "Decouples scraping from indexing and file processing",
                "Used by neo4j-sync for graph event consumption",
            ],
            outputs: ["message-indexer", "neo4j-sync"],
        },
        "message-indexer": {
            id: "message-indexer",
            name: "Message Indexer",
            lang: "Go",
            color: "text-green-400 border-green-400/40 bg-green-400/10",
            icon: <BarChart2 className="w-4 h-4" />,
            role: "Index messages to OpenSearch, extract invite links to PostgreSQL",
            details: [
                "Full-text indexing for 234,757+ messages",
                "Extracts t.me/+HASH invite link patterns",
                "Writes to PostgreSQL for invite graph",
                "1,958 msg/sec IOC extraction baseline",
            ],
            outputs: ["opensearch", "postgres"],
        },
        "neo4j-sync": {
            id: "neo4j-sync",
            name: "Neo4j Sync",
            lang: "Python",
            color: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10",
            icon: <Network className="w-4 h-4" />,
            role: "Build knowledge graph — sources, messages, users, relationships",
            details: [
                "(:Source), (:Message), (:TelegramUser) nodes",
                "FORWARDED_FROM_SOURCE, ACTIVE_IN edges",
                "Surfaces channel forwarding chains and actor pivots",
                "Consumes from Kafka consumer group",
            ],
            outputs: ["neo4j"],
        },
        opensearch: {
            id: "opensearch",
            name: "OpenSearch",
            lang: "Storage",
            color: "text-purple-400 border-purple-400/40 bg-purple-400/10",
            icon: <Database className="w-4 h-4" />,
            role: "Full-text message search + credential and session indices",
            details: [
                "messages-index: 234,757+ entries",
                "credentials-index, cookies-index, sessions-index",
                "Real-time IOC and watchlist matching",
                "Domain exposure reports via two-pass aggregations",
            ],
            outputs: [],
        },
        minio: {
            id: "minio",
            name: "MinIO",
            lang: "Storage",
            color: "text-purple-400 border-purple-400/40 bg-purple-400/10",
            icon: <HardDrive className="w-4 h-4" />,
            role: "Object storage — archives, txt-dumps, quarantine buckets",
            details: [
                "archives/ bucket: ZIP, RAR, 7z, TAR",
                "txt-dumps/ bucket: credential text files",
                "quarantine/ bucket: executables",
                "19.5 GB benchmark corpus stored here",
            ],
            outputs: [],
        },
        neo4j: {
            id: "neo4j",
            name: "Neo4j",
            lang: "Storage",
            color: "text-purple-400 border-purple-400/40 bg-purple-400/10",
            icon: <Network className="w-4 h-4" />,
            role: "Graph database — channel topology and actor relationships",
            details: [
                "Cypher queries for forwarding chains",
                "Actor cross-channel activity detection",
                "Infrastructure relationship mapping",
                "/graph page: force-directed canvas",
            ],
            outputs: [],
        },
        postgres: {
            id: "postgres",
            name: "PostgreSQL",
            lang: "Storage",
            color: "text-purple-400 border-purple-400/40 bg-purple-400/10",
            icon: <Database className="w-4 h-4" />,
            role: "Job state, source registry, invite link graph",
            details: [
                "Scrape job queue with SKIP LOCKED dispatch",
                "Source CRUD and per-source download flags",
                "Telegram user and invite link records",
                "Checkpoint tracking per source",
            ],
            outputs: [],
        },
    }

    const layers: Layer[] = [
        { label: "Source", services: [services["telegram"]] },
        { label: "Collection", services: [services["session-manager"], services["download-worker"], services["file-worker"]] },
        { label: "Transport", services: [services["kafka"]] },
        { label: "Processing", services: [services["message-indexer"], services["neo4j-sync"]] },
        { label: "Storage", services: [services["opensearch"], services["minio"], services["neo4j"], services["postgres"]] },
    ]

    const sel = selected ? services[selected] : null

    return (
        <div className="w-full max-w-4xl mx-auto space-y-4 my-8">
            <Card className="border-border/50 shadow-lg bg-background/50 backdrop-blur">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Network className="w-5 h-5 text-primary" />
                        Golliath Platform Architecture
                    </CardTitle>
                    <CardDescription>
                        Click any service to inspect its role, implementation, and data outputs.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        {layers.map((layer) => (
                            <div key={layer.label} className="flex items-start gap-3">
                                <div className="w-24 shrink-0 pt-2">
                                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{layer.label}</span>
                                </div>
                                <div className="flex flex-wrap gap-2 flex-1">
                                    {layer.services.map((svc) => (
                                        <button
                                            key={svc.id}
                                            onClick={() => setSelected(svc.id === selected ? null : svc.id)}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-mono transition-all duration-200 ${svc.color} ${selected === svc.id ? "ring-2 ring-primary scale-105 shadow-lg" : "opacity-80 hover:opacity-100 hover:scale-102"}`}
                                        >
                                            {svc.icon}
                                            <span>{svc.name}</span>
                                            <Badge variant="outline" className="text-[10px] font-normal border-current/30">
                                                {svc.lang}
                                            </Badge>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {sel && (
                            <motion.div
                                key={sel.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="mt-4 p-4 bg-muted/30 rounded-lg border border-border/50 space-y-3"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${sel.color}`}>{sel.icon}</div>
                                    <div>
                                        <div className="font-semibold">{sel.name}</div>
                                        <div className="text-sm text-muted-foreground">{sel.role}</div>
                                    </div>
                                </div>
                                <ul className="space-y-1">
                                    {sel.details.map((d) => (
                                        <li key={d} className="text-sm text-muted-foreground flex items-start gap-2">
                                            <span className="text-primary mt-0.5 shrink-0">›</span>
                                            {d}
                                        </li>
                                    ))}
                                </ul>
                                {sel.outputs.length > 0 && (
                                    <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                                        <span className="text-xs text-muted-foreground">Outputs to:</span>
                                        {sel.outputs.map((o) => (
                                            <Badge key={o} variant="secondary" className="text-xs font-mono">
                                                {services[o]?.name ?? o}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    )
}
