// Nexus_Intel/src/components/GraphWorkspace.jsx
import { useState } from 'react'
import { ArrowLeft, BookOpen, ChevronDown, Cpu, Network, Radar, Siren, Users } from 'lucide-react'
import { CaseGraph } from '../graph/CaseGraph'
import { CytoscapeGraph } from '../graph/CytoscapeGraph'
import { CaseNarrativeModal } from '../graph/CaseNarrativeModal'
import { AVAILABLE_CASES, getCaseGraphData } from '../graph/caseRegistry'
import { alertSeed } from '../dashboardData'

export function GraphWorkspace({ onExit, onIndividuals, onAlerts, onIntel, initialCaseId = 'CAS-2026-1140' }) {
  const [engine, setEngine] = useState('cytoscape') // 'cytoscape' | 'reactflow'
  const [activeCaseId, setActiveCaseId] = useState(initialCaseId)
  const [showNarrativeModal, setShowNarrativeModal] = useState(false)
  const [showCaseDropdown, setShowCaseDropdown] = useState(false)

  const activeCaseMeta = AVAILABLE_CASES.find((c) => c.id === activeCaseId) || AVAILABLE_CASES[0]
  const caseGraphData = getCaseGraphData(activeCaseId)

  return (
    <div className="flex h-screen flex-col bg-[#f5f1ea] text-[#171511]">
      {/* Editorial Header */}
      <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-[#e5e0d8] bg-white px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] sm:px-7">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowCaseDropdown((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl border border-[#e5e0d8] bg-[#faf8f5] px-3 py-1.5 text-left transition hover:border-[#171511] hover:bg-white"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#8a8578]">Active Case File</span>
                  <span className="rounded bg-[#fbeaea] px-1.5 py-0.2 font-mono text-[9px] font-semibold text-[#c0362c]">
                    {activeCaseId}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-serif text-lg font-bold text-[#171511]">
                  <span>{activeCaseMeta.title}</span>
                  <ChevronDown className="size-3.5 text-[#8a8578]" />
                </div>
              </div>
            </button>

            {showCaseDropdown && (
              <div className="animate-rise-in absolute left-0 top-full z-40 mt-1.5 w-80 rounded-2xl border border-[#d8d3c8] bg-white p-2 shadow-xl">
                <p className="px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-[#8a8578]">Select Investigation</p>
                {AVAILABLE_CASES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveCaseId(c.id)
                      setShowCaseDropdown(false)
                    }}
                    className={`flex w-full flex-col rounded-xl px-3 py-2 text-left transition ${
                      activeCaseId === c.id ? 'bg-[#171511] text-white' : 'hover:bg-[#faf7f2] text-[#171511]'
                    }`}
                  >
                    <span className="font-serif text-sm font-bold">{c.title}</span>
                    <span className={`text-[11px] ${activeCaseId === c.id ? 'text-white/70' : 'text-[#777166]'}`}>
                      {c.subtitle}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowNarrativeModal(true)}
            className="hidden items-center gap-1.5 rounded-full border border-[#f5c6cb] bg-[#fdf6f6] px-3.5 py-1.5 text-xs font-semibold text-[#c0362c] shadow-sm transition hover:bg-[#fae8e8] sm:inline-flex"
            title="Read the official case story, timeline, and AI relationship extraction"
          >
            <BookOpen className="size-3.5" />
            Case Story &amp; AI Extraction
          </button>
        </div>

        {/* Engine Switcher & Navigation */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Dual Engine Switcher */}
          <div className="flex items-center rounded-full border border-[#e5e0d8] bg-[#faf8f5] p-1 shadow-inner">
            <button
              onClick={() => setEngine('cytoscape')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition ${
                engine === 'cytoscape'
                  ? 'bg-[#171511] text-white shadow-sm'
                  : 'text-[#625d53] hover:text-[#171511]'
              }`}
              title="Cytoscape.js Network Engine: Force physics & Graph Theory Math"
            >
              <Cpu className="size-3.5" />
              Cytoscape.js
            </button>
            <button
              onClick={() => setEngine('reactflow')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition ${
                engine === 'reactflow'
                  ? 'bg-[#171511] text-white shadow-sm'
                  : 'text-[#625d53] hover:text-[#171511]'
              }`}
              title="React Flow Engine: Radial case hierarchy & orbital layout"
            >
              <Network className="size-3.5" />
              React Flow
            </button>
          </div>

          <button
            onClick={() => setShowNarrativeModal(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#f5c6cb] bg-[#fdf6f6] px-3.5 py-1.5 text-xs font-semibold text-[#c0362c] sm:hidden"
          >
            <BookOpen className="size-3.5" />
            Story
          </button>

          <button
            className="inline-flex items-center gap-1.5 rounded-full border border-[#e5e0d8] bg-white px-3.5 py-1.5 text-xs font-medium text-[#171511] transition hover:border-[#171511] hover:bg-[#faf7f2]"
            onClick={onIndividuals}
          >
            <Users className="size-3.5 text-[#8a8578]" />
            Key Individuals
          </button>
          <button
            className="inline-flex items-center gap-1.5 rounded-full border border-[#e5e0d8] bg-white px-3.5 py-1.5 text-xs font-medium text-[#171511] transition hover:border-[#171511] hover:bg-[#faf7f2]"
            onClick={onAlerts}
          >
            <Siren className="size-3.5 text-[#c0362c]" />
            Alerts
            <span className="ml-0.5 rounded-full bg-[#c0362c] px-1.5 py-0.2 font-mono text-[10px] text-white">
              {alertSeed.length}
            </span>
          </button>
          {onIntel && (
            <button
              className="inline-flex items-center gap-1.5 rounded-full border border-[#e5e0d8] bg-white px-3.5 py-1.5 text-xs font-medium text-[#171511] transition hover:border-[#171511] hover:bg-[#faf7f2]"
              onClick={onIntel}
            >
              <Radar className="size-3.5 text-[#8a8578]" />
              Intel Hub
            </button>
          )}
          <button
            className="inline-flex items-center gap-1.5 rounded-full bg-[#171511] px-4 py-1.5 text-xs font-medium text-white transition hover:bg-[#333] active:scale-[0.99]"
            onClick={onExit}
          >
            <ArrowLeft className="size-3.5" />
            Dashboard
          </button>
        </div>
      </header>

      {/* Intelligence Context Sub-banner & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-[#e5e0d8] bg-[#faf8f5] px-4 py-2 text-xs text-[#777166] sm:px-7">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#1e3a5f]" />
            <strong className="font-medium text-[#171511]">{caseGraphData.complainantLabel}</strong>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#c0362c]" />
            <strong className="font-medium text-[#171511]">{caseGraphData.suspectLabel}</strong>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-4 border-b border-dashed border-[#c0362c]" />
            <strong className="font-medium text-[#7f1d1d]">Critical Crime Edges</strong> (Homicide, Alibi, Transit, Spoofed SMS)
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#8a8578]">
          Interactive Engine: {engine === 'cytoscape' ? 'Cytoscape.js Physics' : 'React Flow Orbital'} • Click any node to open dossier
        </span>
      </div>

      {/* Main Canvas */}
      <main className="min-h-0 flex-1">
        {engine === 'cytoscape' ? (
          <CytoscapeGraph caseId={activeCaseId} />
        ) : (
          <CaseGraph caseId={activeCaseId} />
        )}
      </main>

      {/* Case Story Narrative & AI Extraction Modal */}
      {showNarrativeModal && (
        <CaseNarrativeModal onClose={() => setShowNarrativeModal(false)} />
      )}
    </div>
  )
}
