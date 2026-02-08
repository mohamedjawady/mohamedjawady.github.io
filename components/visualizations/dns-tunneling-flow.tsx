'use client'

import React, { useState } from 'react'
import { ArrowRight, Shield, AlertTriangle } from 'lucide-react'

export function DnsTunnelingFlow() {
  const [selectedStep, setSelectedStep] = useState<number>(0)

  const steps = [
    {
      id: 0,
      label: 'Normal Domain',
      example: 'google.com',
      entropy: '2.8',
      detection: 'Legitimate pattern'
    },
    {
      id: 1,
      label: 'Encoded Subdomain',
      example: 'SGVsbG9Xb3JsZA.tunnel.com',
      entropy: '4.2',
      detection: 'High entropy detected'
    },
    {
      id: 2,
      label: 'TXT Record Response',
      example: 'TXT: "Y29tbWFuZDpleGVj"',
      entropy: '4.5',
      detection: 'Unusual record type'
    }
  ]

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm my-8">
      <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-200">
        DNS Tunneling Detection: Entropy Analysis
      </h3>

      {/* Steps */}
      <div className="flex justify-between items-center mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <button
              onClick={() => setSelectedStep(index)}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                selectedStep === index
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="text-center">
                <div className={`text-2xl font-bold mb-2 ${
                  Number.parseFloat(step.entropy) > 4.0 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  {step.entropy}
                </div>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {step.label}
                </div>
              </div>
            </button>
            {index < steps.length - 1 && (
              <ArrowRight className="w-6 h-6 mx-2 text-slate-400" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Details */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
        <div className="mb-4">
          <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Example Query:</div>
          <div className="font-mono text-sm bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-700 break-all">
            {steps[selectedStep].example}
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-lg border-2" style={{
          borderColor: Number.parseFloat(steps[selectedStep].entropy) > 4.0 ? 'rgb(220 38 38)' : 'rgb(22 163 74)',
          backgroundColor: Number.parseFloat(steps[selectedStep].entropy) > 4.0 ? 'rgb(254 242 242)' : 'rgb(240 253 244)'
        }}>
          {Number.parseFloat(steps[selectedStep].entropy) > 4.0 ? (
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          ) : (
            <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          )}
          <div>
            <div className="font-semibold text-sm mb-1" style={{
              color: Number.parseFloat(steps[selectedStep].entropy) > 4.0 ? 'rgb(153 27 27)' : 'rgb(21 128 61)'
            }}>
              {steps[selectedStep].detection}
            </div>
            <div className="text-sm" style={{
              color: Number.parseFloat(steps[selectedStep].entropy) > 4.0 ? 'rgb(185 28 28)' : 'rgb(22 101 52)'
            }}>
              Shannon Entropy: {steps[selectedStep].entropy} bits/char
              {Number.parseFloat(steps[selectedStep].entropy) > 4.0 && ' (Threshold: 4.0+)'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DnsTunnelingFlow
