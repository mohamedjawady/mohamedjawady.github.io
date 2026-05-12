"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Circle, ArrowDown, Box, FileText, Terminal, Globe } from "lucide-react"

interface ExerciseStep {
    id: number
    title: string
    description: string
    icon: React.ElementType
    color: string
    command?: string
    output?: string
}

const steps: ExerciseStep[] = [
    {
        id: 1,
        title: "Create Project Structure",
        description: "Set up the directory layout with a Vagrantfile and a salt/ directory containing your state files. This is the minimum structure Salt needs to operate in masterless mode.",
        icon: FileText,
        color: "blue",
        command: `mkdir my-salt-lab && cd my-salt-lab
mkdir salt
touch Vagrantfile salt/top.sls salt/web.sls`,
        output: `my-salt-lab/
├── Vagrantfile
└── salt/
    ├── top.sls
    └── web.sls`,
    },
    {
        id: 2,
        title: "Write the State File (web.sls)",
        description: "Define the desired state in YAML. This file tells Salt that Nginx must be installed and running. Salt will check the current state and only make changes if necessary (idempotency).",
        icon: FileText,
        color: "emerald",
        command: `# salt/web.sls
install_nginx:
  pkg.installed:
    - name: nginx

start_nginx:
  service.running:
    - name: nginx
    - enable: True
    - require:
      - pkg: install_nginx`,
    },
    {
        id: 3,
        title: "Write the Top File (top.sls)",
        description: "The top file maps states to Minions. The wildcard '*' means every Minion (in this case, the local VM) will receive the 'web' state.",
        icon: FileText,
        color: "amber",
        command: `# salt/top.sls
base:
  '*':
    - web`,
    },
    {
        id: 4,
        title: "Configure the Vagrantfile",
        description: "Tell Vagrant to provision an Ubuntu VM with Salt in masterless mode. Vagrant will install the Salt Minion, sync the salt/ directory into the VM, and run state.apply automatically.",
        icon: Box,
        color: "purple",
        command: `Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/jammy64"
  config.vm.network "forwarded_port",
    guest: 80, host: 8080

  config.vm.provision :salt do |salt|
    salt.masterless = true
    salt.run_highstate = true
  end
end`,
    },
    {
        id: 5,
        title: "Boot and Provision",
        description: "Run 'vagrant up'. Vagrant downloads the base box, starts the VM, installs the Salt Minion, and applies your states. Watch the output to see Salt working through each state declaration.",
        icon: Terminal,
        color: "red",
        command: "vagrant up",
        output: `==> default: Running provisioner: salt...
==> default: Minion ID: vagrant
==> default: Running: state.highstate
----------
  ID: install_nginx
  Function: pkg.installed
  Name: nginx
  Result: True
  Comment: Package nginx installed
----------
  ID: start_nginx
  Function: service.running
  Name: nginx
  Result: True
  Comment: Service nginx started`,
    },
    {
        id: 6,
        title: "Verify the Result",
        description: "Open http://localhost:8080 in your browser. You should see the default Nginx welcome page. Your first Salt state has been applied successfully.",
        icon: Globe,
        color: "emerald",
        command: "curl http://localhost:8080",
        output: "Welcome to nginx!",
    },
]

export function SaltExerciseDiagram() {
    const [currentStep, setCurrentStep] = useState(0)

    const getColorClasses = (color: string) => {
        const map: Record<string, { bg: string; border: string; badge: string; icon: string }> = {
            blue: { bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-300 dark:border-blue-700", badge: "bg-blue-500", icon: "text-blue-600 dark:text-blue-400" },
            emerald: { bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-300 dark:border-emerald-700", badge: "bg-emerald-500", icon: "text-emerald-600 dark:text-emerald-400" },
            amber: { bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-300 dark:border-amber-700", badge: "bg-amber-500", icon: "text-amber-600 dark:text-amber-400" },
            purple: { bg: "bg-purple-50 dark:bg-purple-950/30", border: "border-purple-300 dark:border-purple-700", badge: "bg-purple-500", icon: "text-purple-600 dark:text-purple-400" },
            red: { bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-300 dark:border-red-700", badge: "bg-red-500", icon: "text-red-600 dark:text-red-400" },
        }
        return map[color] || map.blue
    }

    const step = steps[currentStep]
    const colors = getColorClasses(step.color)

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6 my-8">
            <Card className="border-border/50 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-primary" />
                        Exercise: Masterless Salt with Vagrant
                    </CardTitle>
                    <CardDescription>
                        Follow the six steps to deploy an Nginx web server using Salt in masterless mode inside a Vagrant VM.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Step Progress Bar */}
                    <div className="flex items-center gap-2">
                        {steps.map((s, index) => (
                            <div key={s.id} className="flex items-center">
                                <button
                                    onClick={() => setCurrentStep(index)}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                                        index < currentStep
                                            ? "bg-emerald-500 text-white"
                                            : index === currentStep
                                            ? "bg-primary text-primary-foreground scale-110"
                                            : "bg-muted text-muted-foreground border border-border"
                                    }`}
                                >
                                    {index < currentStep ? (
                                        <CheckCircle className="w-4 h-4" />
                                    ) : (
                                        s.id
                                    )}
                                </button>
                                {index < steps.length - 1 && (
                                    <div className={`w-6 md:w-10 h-0.5 mx-1 transition-colors duration-300 ${
                                        index < currentStep ? "bg-emerald-500" : "bg-border"
                                    }`} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Active Step Detail */}
                    <div className={`p-6 rounded-xl border-2 ${colors.bg} ${colors.border} transition-all duration-300`}>
                        <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${colors.bg} border ${colors.border}`}>
                                <step.icon className={`w-5 h-5 ${colors.icon}`} />
                            </div>
                            <div className="flex-1 min-w-0 space-y-3">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="outline" className="text-xs border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200">Step {step.id}</Badge>
                                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">{step.title}</h4>
                                    </div>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">{step.description}</p>
                                </div>

                                {step.command && (
                                    <div className="bg-slate-100 dark:bg-slate-950 rounded-lg p-4 overflow-x-auto border border-slate-200 dark:border-slate-800">
                                        <pre className="text-sm font-mono text-slate-900 dark:text-slate-100 whitespace-pre">{step.command}</pre>
                                    </div>
                                )}

                                {step.output && (
                                    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 overflow-x-auto border-l-4 border-emerald-500 shadow-sm border border-slate-200 dark:border-slate-800">
                                        <p className="text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 font-semibold">Output</p>
                                        <pre className="text-sm font-mono text-slate-700 dark:text-slate-300 whitespace-pre">{step.output}</pre>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center pt-2 border-t border-border/50">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                            disabled={currentStep === 0}
                        >
                            Previous
                        </Button>
                        <div className="text-sm text-muted-foreground">
                            Step {currentStep + 1} of {steps.length}
                        </div>
                        <Button
                            onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
                            disabled={currentStep === steps.length - 1}
                        >
                            Next
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
