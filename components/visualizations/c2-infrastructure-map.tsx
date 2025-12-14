"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowRight, Globe, Server, Shield, Laptop } from "lucide-react"

export function C2InfrastructureMap() {
    const [domainFronting, setDomainFronting] = useState(false)
    const [cloudRedirector, setCloudRedirector] = useState(true)

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 my-8">
            <Card className="border-border/50 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-500" />
                        C2 Infrastructure Visualizer
                    </CardTitle>
                    <CardDescription>
                        Experiment with redirection and Domain Fronting to see how C2 traffic is routed and disguised.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">

                    {/* Controls */}
                    <div className="flex flex-wrap gap-6 p-4 bg-muted/30 rounded-lg border border-border/50">
                        <div className="flex items-center space-x-2">
                            <Switch id="redirector" checked={cloudRedirector} onCheckedChange={setCloudRedirector} />
                            <Label htmlFor="redirector" className="font-semibold">Use Cloud Redirector</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="fronting"
                                checked={domainFronting}
                                onCheckedChange={setDomainFronting}
                                disabled={!cloudRedirector}
                            />
                            <Label htmlFor="fronting" className={!cloudRedirector ? "text-muted-foreground" : "font-semibold"}>
                                Enable Domain Fronting
                            </Label>
                        </div>
                    </div>

                    {/* Diagram */}
                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl min-h-[200px]">

                        {/* Victim */}
                        <div className="flex flex-col items-center gap-2 z-10 w-32">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center border border-red-200 dark:border-red-800">
                                <Laptop className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-bold">Victim</p>
                                <p className="text-xs text-muted-foreground">Gateway IP: 192.168.1.50</p>
                            </div>
                        </div>

                        {/* Arrows 1 */}
                        <div className="flex-1 flex flex-col items-center justify-center gap-1 min-w-[100px]">
                            <span className="text-[10px] font-mono bg-background border px-1 rounded text-muted-foreground">HTTPS POST</span>
                            <div className="h-0.5 w-full bg-slate-300 dark:bg-slate-700 relative">
                                <ArrowRight className="absolute -right-1.5 -top-2.5 w-5 h-5 text-slate-300 dark:text-slate-700" />
                            </div>
                            {domainFronting && (
                                <div className="text-[10px] text-green-600 font-mono mt-1 text-center">
                                    <p>SNI: cdn.legit.com</p>
                                    <p>Host: evil.c2.com</p>
                                </div>
                            )}
                        </div>

                        {/* Redirector / CDN */}
                        <div className="flex flex-col items-center gap-2 z-10 w-40">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center border transition-colors duration-500 ${domainFronting ? "bg-green-100 dark:bg-green-900 border-green-200" : "bg-blue-100 dark:bg-blue-900 border-blue-200"}`}>
                                <Server className={`w-6 h-6 ${domainFronting ? "text-green-600" : "text-blue-600"}`} />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-bold">{domainFronting ? "High-Rep CDN" : (cloudRedirector ? "Cloud Redirector" : "Direct Connect")}</p>
                                <p className="text-xs text-muted-foreground">{domainFronting ? "Google / Cloudfront" : (cloudRedirector ? "AWS EC2 / VPS" : "Direct C2 IP")}</p>
                            </div>
                        </div>

                        {/* Arrows 2 */}
                        {cloudRedirector && (
                            <>
                                <div className="flex-1 flex flex-col items-center justify-center gap-1 min-w-[100px]">
                                    <span className="text-[10px] font-mono bg-background border px-1 rounded text-muted-foreground">Forwarding</span>
                                    <div className="h-0.5 w-full bg-slate-300 dark:bg-slate-700 relative">
                                        <ArrowRight className="absolute -right-1.5 -top-2.5 w-5 h-5 text-slate-300 dark:text-slate-700" />
                                    </div>
                                </div>

                                {/* Team Server */}
                                <div className="flex flex-col items-center gap-2 z-10 w-32">
                                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center border border-purple-200 dark:border-purple-800">
                                        <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-bold">Team Server</p>
                                        <p className="text-xs text-muted-foreground">Hidden Backend</p>
                                    </div>
                                </div>
                            </>
                        )}

                    </div>

                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-sm">
                        <h4 className="font-semibold mb-2">Technique Analysis:</h4>
                        {domainFronting ? (
                            <p className="text-green-600 dark:text-green-400">
                                <b>Domain Fronting Active:</b> Security appliances see the connection going to a legitimate CDN edge (SNI: cdn.legit.com).
                                They decrypt the packet, but unless they inspect the HTTP <code>Host</code> header deeply, they won't see the true destination (`evil.c2.com`).
                                However, most modern CDNs now block this mismatch.
                            </p>
                        ) : cloudRedirector ? (
                            <p className="text-blue-600 dark:text-blue-400">
                                <b>Redirector Active:</b> The Implant talks to a disposable "Redirector" node. If Blue Team detects and blocks this IP,
                                the Team Server remains safe. Operators just spin up a new Redirector and update the DNS.
                            </p>
                        ) : (
                            <p className="text-red-500">
                                <b>Direct Connection (Unsafe):</b> The Implant talks directly to the Team Server.
                                If this IP is detected/blocked, the entire campaign infrastructure is burned.
                                Forensics can easily trace the operator's location.
                            </p>
                        )}
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
