import { useState } from 'react';
import { TargetMetadata } from '../types/scientific';
import { PRESET_TARGETS } from '../services/scientificApi';
import { Search, Sparkles, Dna, ArrowRight } from 'lucide-react';

interface QuickTryBarProps {
  currentTargetId: string;
  onSelectTarget: (idOrAccession: string) => void;
}

export function QuickTryBar({ currentTargetId, onSelectTarget }: QuickTryBarProps) {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSelectTarget(searchInput.trim());
      setSearchInput('');
    }
  };

  return (
    <div className="w-full bg-white border-b border-slate-200 px-4 py-2.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-2xs">
      {/* Quick-Try Example Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap flex items-center gap-1 mr-1">
          <Dna className="w-3.5 h-3.5 text-sky-600" />
          Quick-Try Targets:
        </span>

        {PRESET_TARGETS.map((target) => {
          const isSelected = target.id === currentTargetId;
          return (
            <button
              key={target.id}
              onClick={() => onSelectTarget(target.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-sky-600 text-white border-sky-600 shadow-2xs font-semibold'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <span>{target.id}</span>
              <span className={`ml-1 text-[10px] ${isSelected ? 'text-sky-200' : 'text-slate-400 font-mono'}`}>
                {target.category === 'small-molecule' ? 'CID5291' : target.uniprotAccession}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input for UniProt, Gene or PDB */}
      <form onSubmit={handleSearchSubmit} className="relative min-w-[220px] max-w-sm">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search UniProt ID (e.g. P53355, 1TUP)..."
          className="w-full pl-8 pr-8 py-1 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 transition-colors"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-sky-600 transition-colors"
          title="Search Target"
        >
          <ArrowRight className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
}
