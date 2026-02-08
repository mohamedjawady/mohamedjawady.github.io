'use client'

import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export function EncryptedDnsFlow() {
  const [protocol, setProtocol] = useState<'traditional' | 'doh' | 'dot'>('traditional')

  const protocols = {
    traditional: {
      name: 'Traditional DNS',
      port: '53 (UDP/TCP)',
      encryption: 'None',
      visibility: 'Full visibility',
      color: 'red'
    },
    doh: {
      name: 'DNS over HTTPS (DoH)',
      port: '443 (TCP)',
      encryption: 'TLS 1.3',
      visibility: 'Hidden in HTTPS',
      color: 'green'
    },
    dot: {
      name: 'DNS over TLS (DoT)',
      port: '853 (TCP)',
      encryption: 'TLS 1.3',
      visibility: 'Encrypted, distinct port',
      color: 'blue'
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm my-8">
      <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-200">
        Encrypted DNS Protocols: Security Monitoring Impact
      </h3>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {Object.entries(protocols).map(([key, proto]) => (
          <button
            key={key}
            onClick={() => setProtocol(key as any)}
            className={`p-4 rounded-lg border-2 transition-all ${
              protocol === key
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="text-center">
              <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                {proto.name}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Port {proto.port}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Encryption:</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                {protocols[protocol].encryption}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Network Visibility:</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                {protocols[protocol].visibility}
              </div>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg border-2 ${
          protocol === 'traditional' 
            ? 'bg-red-50 dark:bg-red-950 border-red-500'
            : 'bg-green-50 dark:bg-green-950 border-green-500'
        }`}>
          <div className="flex items-center gap-3">
            {protocol === 'traditional' ? (
              <Eye className="w-6 h-6 text-red-600" />
            ) : (
              <EyeOff className="w-6 h-6 text-green-600" />
            )}
            <div>
              <div className={`font-semibold ${
                protocol === 'traditional' ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'
              }`}>
                {protocol === 'traditional' ? 'Query Content Visible' : 'Query Content Encrypted'}
              </div>
              <div className={`text-sm ${
                protocol === 'traditional' ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'
              }`}>
                {protocol === 'traditional' 
                  ? 'DNS queries can be monitored and logged by network devices'
                  : 'DNS queries are encrypted and hidden from network monitoring'
                }
              </div>
            </div>
          </div>
        </div>

        {protocol !== 'traditional' && (
          <div className="bg-yellow-50 dark:bg-yellow-950 rounded-lg p-4 border-2 border-yellow-500">
            <div className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              Detection Strategy
            </div>
            <div className="text-sm text-yellow-700 dark:text-yellow-300">
              {protocol === 'doh' && 'Monitor SNI fields in TLS handshakes for known DoH providers (dns.google, cloudflare-dns.com). Block /dns-query endpoints.'}
              {protocol === 'dot' && 'Monitor connections to port 853. Easier to detect and control than DoH due to dedicated port.'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EncryptedDnsFlow
