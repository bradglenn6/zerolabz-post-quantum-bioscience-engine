import { useEffect, useRef, useState, useCallback } from 'react';
import * as $3Dmol from '3dmol';
import { TargetMetadata } from '../types/scientific';
import { Play, Pause, RotateCcw, Eye, Sparkles, Layers, ShieldCheck, Info } from 'lucide-react';

interface MolecularViewer3DProps {
  target: TargetMetadata;
  highlightedResidues?: number[];
  onResidueSelect?: (residueIndex: number, atomInfo?: any) => void;
}

export function MolecularViewer3D({ target, highlightedResidues = [], onResidueSelect }: MolecularViewer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [styleMode, setStyleMode] = useState<'cartoon' | 'stick' | 'sphere' | 'surface'>('cartoon');
  const [colorScheme, setColorScheme] = useState<'plddt' | 'spectrum' | 'secondary'>('plddt');
  const [isSpinning, setIsSpinning] = useState(false);
  const [bgDark, setBgDark] = useState(true);
  const [activeAtom, setActiveAtom] = useState<{
    resn: string;
    resi: number;
    chain: string;
    b: number;
    elem: string;
  } | null>(null);

  const applyColorsAndStyles = useCallback(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    // Reset styles
    viewer.removeAllSurfaces();
    viewer.setStyle({}, {});

    const plddtColorFunc = (atom: any) => {
      const b = atom.b;
      if (b > 90) return '#0053D6'; // Very High (>90) - Dark Blue
      if (b > 70) return '#65CBF3'; // Confident (70-90) - Light Blue
      if (b > 50) return '#FFDB13'; // Low (50-70) - Yellow
      return '#FF7D45';             // Very Low (<50) - Orange
    };

    const chosenColor =
      colorScheme === 'plddt'
        ? { colorfunc: plddtColorFunc }
        : colorScheme === 'spectrum'
        ? { color: 'spectrum' }
        : { color: 'secondary' };

    if (styleMode === 'cartoon') {
      viewer.setStyle({ hetflag: false }, { cartoon: chosenColor });
      // Non-water heteroatoms as sticks
      viewer.setStyle({ hetflag: true, resn: ['HOH', 'WAT'], invert: true }, {
        stick: { radius: 0.25, colorscheme: 'Jmol' },
        sphere: { scale: 0.25, colorscheme: 'Jmol' },
      });
    } else if (styleMode === 'stick') {
      viewer.setStyle({}, { stick: { radius: 0.2, ...chosenColor } });
    } else if (styleMode === 'sphere') {
      viewer.setStyle({}, { sphere: { scale: 0.35, ...chosenColor } });
    } else if (styleMode === 'surface') {
      viewer.setStyle({ hetflag: false }, { cartoon: chosenColor });
      try {
        viewer.addSurface(($3Dmol as any).SurfaceType?.VDW || 1, {
          opacity: 0.65,
          colorfunc: colorScheme === 'plddt' ? plddtColorFunc : undefined,
          color: colorScheme === 'spectrum' ? 'spectrum' : undefined,
        });
      } catch (e) {
        console.warn('Surface generation fallback:', e);
      }
    }

    // Highlight key active/mutated residues
    if (highlightedResidues && highlightedResidues.length > 0) {
      viewer.setStyle(
        { resi: highlightedResidues },
        {
          stick: { radius: 0.45, color: '#DC2626' },
          sphere: { scale: 0.4, color: '#F87171' },
        }
      );
    }

    viewer.render();
  }, [styleMode, colorScheme, highlightedResidues]);

  // Initialize and load structure
  useEffect(() => {
    let isMounted = true;
    const container = containerRef.current;
    if (!container) return;

    setLoading(true);
    setLoadError(null);
    setActiveAtom(null);

    // Destroy previous viewer if any
    container.innerHTML = '';

    const viewer = $3Dmol.createViewer(container, {
      defaultcolors: $3Dmol.rasmolElementColors,
      backgroundColor: bgDark ? '#0f172a' : '#f8fafc',
    });
    viewerRef.current = viewer;

    async function fetchAndRender() {
      try {
        let structureData = '';
        let format = 'cif';

        // Try AlphaFold DB CIF URL first
        const cifUrl = target.cifUrl || `https://alphafold.ebi.ac.uk/files/AF-${target.uniprotAccession}-F1-model_v6.cif`;
        
        let response = await fetch(cifUrl).catch(() => null);

        // If AlphaFold fails or not found, try RCSB PDB if pdbId is available
        if (!response || !response.ok) {
          if (target.pdbId) {
            response = await fetch(`https://files.rcsb.org/download/${target.pdbId.toUpperCase()}.cif`).catch(() => null);
          }
        }

        // Secondary fallback to AlphaFold DB v4 URL
        if (!response || !response.ok) {
          response = await fetch(`https://alphafold.ebi.ac.uk/files/AF-${target.uniprotAccession}-F1-model_v4.cif`).catch(() => null);
        }

        if (response && response.ok) {
          structureData = await response.text();
        } else {
          throw new Error('Unable to fetch CIF coordinates from AlphaFold DB or RCSB PDB.');
        }

        if (!isMounted) return;

        viewer.clear();
        viewer.addModel(structureData, format);

        // Residue click picking
        viewer.setClickable({}, true, (atom: any) => {
          if (!atom) return;
          setActiveAtom({
            resn: atom.resn,
            resi: atom.resi,
            chain: atom.chain || 'A',
            b: atom.b ? +atom.b.toFixed(1) : 0,
            elem: atom.elem,
          });
          if (onResidueSelect) {
            onResidueSelect(atom.resi, atom);
          }
        });

        applyColorsAndStyles();
        viewer.zoomTo();
        viewer.render();
        setLoading(false);
      } catch (err: any) {
        if (!isMounted) return;
        console.error('Failed to load molecular structure:', err);
        setLoadError(err.message || 'Structure coordinate fetch failed.');
        setLoading(false);
      }
    }

    fetchAndRender();

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      if (viewerRef.current) {
        viewerRef.current.resize();
        viewerRef.current.render();
      }
    });
    resizeObserver.observe(container);

    return () => {
      isMounted = false;
      resizeObserver.disconnect();
      if (viewerRef.current) {
        viewerRef.current.spin(false);
      }
    };
  }, [target.id, target.cifUrl, target.uniprotAccession, target.pdbId, bgDark]);

  // Effect for updating styles without full reload
  useEffect(() => {
    if (!loading && !loadError && viewerRef.current) {
      applyColorsAndStyles();
    }
  }, [applyColorsAndStyles, loading, loadError]);

  // Handle spin toggle
  const toggleSpin = () => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    if (isSpinning) {
      viewer.spin(false);
      setIsSpinning(false);
    } else {
      viewer.spin('y', 1.2);
      setIsSpinning(true);
    }
  };

  const handleResetCamera = () => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    viewer.zoomTo();
    viewer.render();
  };

  return (
    <div className="relative w-full h-full flex flex-col rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm">
      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Source Provenance Badge */}
        <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs text-slate-200 pointer-events-auto">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-semibold text-sky-300">
            {target.pdbId ? `PDB: ${target.pdbId}` : 'AlphaFold DB'}
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300">Mean pLDDT: <b>{target.meanPlddt}</b></span>
        </div>

        {/* Right: Camera & Style Controls */}
        <div className="flex items-center gap-1 bg-slate-900/85 backdrop-blur-md p-1 rounded-lg border border-slate-700/60 pointer-events-auto shadow-lg">
          <button
            onClick={toggleSpin}
            title={isSpinning ? 'Pause Rotation' : 'Auto Rotate'}
            className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1 ${
              isSpinning ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            {isSpinning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline text-[11px]">Spin</span>
          </button>

          <button
            onClick={handleResetCamera}
            title="Reset Camera View"
            className="p-1.5 rounded text-xs text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Reset</span>
          </button>

          <div className="h-4 w-px bg-slate-700 mx-0.5" />

          {/* Style selector */}
          <select
            value={styleMode}
            onChange={(e) => setStyleMode(e.target.value as any)}
            className="bg-slate-800 text-slate-200 text-xs rounded px-2 py-1 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="cartoon">Cartoon</option>
            <option value="stick">Sticks</option>
            <option value="sphere">Spheres</option>
            <option value="surface">Surface</option>
          </select>

          {/* Color selector */}
          <select
            value={colorScheme}
            onChange={(e) => setColorScheme(e.target.value as any)}
            className="bg-slate-800 text-slate-200 text-xs rounded px-2 py-1 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="plddt">pLDDT Scale</option>
            <option value="spectrum">Spectrum</option>
            <option value="secondary">2° Structure</option>
          </select>

          <button
            onClick={() => setBgDark(!bgDark)}
            title="Toggle Viewport Contrast"
            className="p-1.5 rounded text-xs text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Viewport */}
      <div
        ref={containerRef}
        className={`w-full flex-1 relative cursor-grab active:cursor-grabbing transition-colors ${
          bgDark ? 'bg-slate-950' : 'bg-slate-100'
        }`}
        style={{ minHeight: '380px' }}
      />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/75 backdrop-blur-sm text-white">
          <div className="w-10 h-10 border-3 border-sky-400 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm font-medium text-slate-200">Resolving 3D Coordinates...</p>
          <p className="text-xs text-slate-400 font-mono mt-1">AlphaFold DB: {target.uniprotAccession}</p>
        </div>
      )}

      {/* Error Fallback */}
      {loadError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/90 text-white p-6 text-center">
          <div className="p-3 bg-red-950/50 border border-red-800 rounded-full mb-3 text-red-400">
            <Info className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-red-300">Coordinate Stream Interrupted</p>
          <p className="text-xs text-slate-400 max-w-sm mt-1">{loadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-md border border-slate-700"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Selected Residue Tooltip Card */}
      {activeAtom && (
        <div className="absolute top-14 left-3 z-10 bg-slate-900/90 backdrop-blur-md border border-sky-500/40 rounded-lg p-2.5 text-xs text-white shadow-xl animate-fade-in pointer-events-auto">
          <div className="flex items-center justify-between gap-3 border-b border-slate-700 pb-1 mb-1.5">
            <span className="font-bold text-sky-400">
              Residue: {activeAtom.resn} {activeAtom.resi}
            </span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">
              Chain {activeAtom.chain}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-300">
            <span>pLDDT Confidence:</span>
            <span
              className="font-bold font-mono"
              style={{
                color:
                  activeAtom.b > 90
                    ? '#60a5fa'
                    : activeAtom.b > 70
                    ? '#38bdf8'
                    : activeAtom.b > 50
                    ? '#facc15'
                    : '#fb923c',
              }}
            >
              {activeAtom.b}
            </span>
            <span>Atom Element:</span>
            <span className="font-mono text-slate-200">{activeAtom.elem}</span>
          </div>
        </div>
      )}

      {/* Bottom Floating Canonical AlphaFold pLDDT Legend */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-700/60 text-xs text-slate-300 pointer-events-auto shadow-lg">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-sky-400" />
            Canonical AlphaFold pLDDT Confidence
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0053D6]" />
              <span>Very high (&gt;90)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#65CBF3]" />
              <span>Confident (70–90)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFDB13]" />
              <span>Low (50–70)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF7D45]" />
              <span>Very low (&lt;50)</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-700/60 text-[11px] text-slate-400 pointer-events-auto hidden sm:block">
          Left Drag: Rotate • Scroll: Zoom • Right Drag: Pan
        </div>
      </div>
    </div>
  );
}
