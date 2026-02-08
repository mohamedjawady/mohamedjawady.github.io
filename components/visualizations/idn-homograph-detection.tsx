'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'

export function IdnHomographDetection() {
  const [selectedDomain, setSelectedDomain] = useState(0)

  const examples = [
    {
      displayed: 'apple.com',
      actual: 'аррӏе.com',
      punycode: 'xn--80ak6aa92e.com',
      status: 'Malicious',
      risk: 'HIGH'
    },
    {
      displayed: 'microsoft.com',
      actual: 'mіcrosoft.com',
      punycode: 'xn--mcrosoft-4ug.com',
      status: 'Malicious',
      risk: 'HIGH'
    },
    {
      displayed: 'paypal.com',
      actual: 'pаypal.com',
      punycode: 'xn--pypal-4ve.com',
      status: 'Malicious',
      risk: 'HIGH'
    }
  ]

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm my-8">
      <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-200">
        IDN Homograph Attack Detection
      </h3>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => setSelectedDomain(index)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedDomain === index
                ? 'border-red-500 bg-red-50 dark:bg-red-950'
                : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="font-mono text-sm text-slate-700 dark:text-slate-300">
              {example.displayed}
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
          <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">What you see:</div>
          <div className="font-mono text-lg font-bold text-slate-800 dark:text-slate-200">
            {examples[selectedDomain].displayed}
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-950 rounded-lg p-4 border-2 border-yellow-500">
          <div className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">Actual domain (with Cyrillic):</div>
          <div className="font-mono text-lg font-bold text-yellow-800 dark:text-yellow-200">
            {examples[selectedDomain].actual}
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-950 rounded-lg p-4 border-2 border-red-500">
          <div className="text-sm text-red-700 dark:text-red-300 mb-2">Punycode encoding:</div>
          <div className="font-mono text-lg font-bold text-red-800 dark:text-red-200">
            {examples[selectedDomain].punycode}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <div className="flex items-center gap-3">
            <X className="w-6 h-6 text-red-600" />
            <div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                Status: {examples[selectedDomain].status}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Risk Level: {examples[selectedDomain].risk}
              </div>
            </div>
          </div>
          <div className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold text-sm">
            PHISHING DETECTED
          </div>
        </div>
      </div>
    </div>
  )
}

export default IdnHomographDetection
