import { useState, useEffect } from 'react';
import { ServerlessWorkerNode } from '../types/scientific';
import {
  X,
  Cpu,
  Zap,
  Globe,
  Radio,
  RefreshCw,
  Server,
  Activity,
  CheckCircle2,
} from 'lucide-react';

interface DistributedClusterModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: ServerlessWorkerNode[];
  onTriggerBurst: () => void;
}

export function DistributedClusterModal({
  isOpen,
  onClose,
  nodes,
  onTriggerBurst,
}: DistributedClusterModalProps) {
  const [bursting, setBursting] = useState(false);

  if (!isOpen) return null;

  const totalReqs = nodes.reduce((acc, n) => acc + n.requestsPerSec, 0);
  const avgLatency = (nodes.reduce((acc, n) => acc + n.latencyMs, 0) / (nodes.length || 1)).toFixed(1);

  const handleSimulateBurst = () => {
    setBursting(true);
    onTriggerBurst();
    setTimeout(() => setBursting(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-950 border border-purple-800 rounded-xl text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Distributed Serverless Computing Fabric
              </h3>
              <p className="text-xs text-slate-400">
                Stateless Global Edge Nodes • Zero Session Affinity • Post-Quantum Cryptographic Handshakes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Cluster Summary Row */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
            <div className="text-slate-400 text-[10px] uppercase font-bold">Total Throughput</div>
            <div className="text-lg font-mono font-bold text-emerald-400 mt-0.5">
              {totalReqs.toLocaleString()} <span className="text-xs font-normal text-slate-400">req/s</span>
            </div>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
            <div className="text-slate-400 text-[10px] uppercase font-bold">Average Cluster Latency</div>
            <div className="text-lg font-mono font-bold text-sky-400 mt-0.5">
              {avgLatency} <span className="text-xs font-normal text-slate-400">ms</span>
            </div>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
            <div className="text-slate-400 text-[10px] uppercase font-bold">Load Balance Mode</div>
            <div className="text-sm font-semibold text-purple-300 mt-1">Adaptive Stateless RR</div>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex flex-col justify-center">
            <button
              onClick={handleSimulateBurst}
              disabled={bursting}
              className="w-full py-1.5 px-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>{bursting ? 'Simulating Burst...' : 'Simulate Load Burst'}</span>
            </button>
          </div>
        </div>

        {/* Nodes Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 text-xs">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">
            Active Edge & Serverless Micro-Workers
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {nodes.map((node) => (
              <div
                key={node.id}
                className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-sky-400" />
                    <span className="font-mono font-bold text-slate-200">{node.id}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {node.status}
                  </span>
                </div>

                <div className="text-slate-400 text-[11px] mb-2">{node.region} • {node.provider}</div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Node CPU Load:</span>
                    <span className="font-mono font-bold text-slate-200">{node.cpuLoadPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        node.cpuLoadPercent > 80 ? 'bg-red-500' : node.cpuLoadPercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${node.cpuLoadPercent}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-slate-300">
                    <div>
                      <span className="text-slate-400">Latency: </span>
                      <span className="font-mono text-sky-400">{node.latencyMs} ms</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Throughput: </span>
                      <span className="font-mono text-emerald-400">{node.requestsPerSec} req/s</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Q-Entropy: </span>
                      <span className="font-mono text-purple-400">{node.quantumEntropyRate} bps</span>
                    </div>
                    <div>
                      <span className="text-slate-400">PQC Handshakes: </span>
                      <span className="font-mono text-slate-200">{node.activeHandshakes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stateless Architecture Note */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-400">
            <span className="font-bold text-sky-400 block mb-1">
              ZeroLabz Stateless High-Throughput Specification:
            </span>
            Each scientific query carries self-contained, post-quantum cryptographic claims in stateless headers.
            No persistent session state or sticky session routing is required. Any serverless worker node across any cloud region can independently verify and process incoming research requests with sub-50ms latency.
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
          >
            Close Telemetry
          </button>
        </div>
      </div>
    </div>
  );
}
