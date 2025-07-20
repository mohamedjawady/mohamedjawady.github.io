'use client'

import React from 'react'
import Image from 'next/image'

export function DataCollectionArchitectureDiagram() {
  return (
    <div className="w-full max-w-7xl mx-auto p-8 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4">
        {/* <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-200 mb-6">
          Data Collection Architecture
        </h2> */}
        
        {/* SVG version for better web display */}
        <div className="w-full flex justify-center">
          <Image
            src="/diagrams/data-collection-architecture.svg"
            alt="Data Collection Architecture Diagram"
            width={1000}
            height={800}
            className="w-full h-auto max-w-none"
            priority
          />
        </div>
        
        {/* Legend
        <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border-2 border-slate-500 rounded"></div>
              <span className="text-slate-600 dark:text-slate-400">Components</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-slate-600 dark:text-slate-400">Central Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-sky-500 rounded"></div>
              <span className="text-slate-600 dark:text-slate-400">Data Types</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-slate-600 dark:text-slate-400">Processing</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-slate-500"></div>
              <span className="text-slate-600 dark:text-slate-400">Solid: Data Flow</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-slate-400 border-dashed border-t-2 bg-transparent border-slate-400"></div>
              <span className="text-slate-600 dark:text-slate-400">Dashed: Data Output</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-purple-500"></div>
              <span className="text-slate-600 dark:text-slate-400">Purple: Bidirectional</span>
            </div>
          </div>
        </div> */}
        
        {/* Architecture Notes */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">Key Data Flows</h3>
          <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
            <li>• <strong>Network Devices → Flow Receivers → SIEM:</strong> Unidirectional network flow data collection</li>
            <li>• <strong>Endpoints → Log Agents → SIEM:</strong> Unidirectional log data processing pipeline</li>
            <li>• <strong>SIEM ↔ Correlation:</strong> Correlation and analysis</li>
            <li>• <strong>Correlation → Analytics/Alerting:</strong> Processing outputs for monitoring and response</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
