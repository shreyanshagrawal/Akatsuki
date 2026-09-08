import { useState } from 'react'
import { ChevronDown, GitBranch, Network } from 'lucide-react'
import { clusters, rankedSuspects } from './intelData'

export function RankingsPanel() {
  const [open, setOpen] = useState(null)
  const sorted = [...rankedSuspects].sort((a, b) => b.score - a.score)

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-[#a47621]">Network Topology // Centrality Analysis</p>
      <h1 className="font-serif text-3xl">Rankings & Groups</h1>
      <p className="mt-2 max-w-2xl text-sm text-[#777166]">Suspects ranked by composite centrality, grouped into auto-detected clusters. Bridge individuals connect two or more clusters.</p>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        {clusters.map((cluster) => (
          <div key={cluster.id} className="rounded-xl border border-[#e5e0d8] bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2"><i className="size-2.5 rounded-full" style={{ background: cluster.color }} /><b className="text-sm">{cluster.name}</b></div>
            <p className="mt-2 text-xs leading-5 text-[#777166]">{cluster.summary}</p>
            <p className="mt-3 font-mono text-[10px] text-[#8a8578]">{rankedSuspects.filter((s) => s.clusterIds.includes(cluster.id)).length} members</p>
          </div>
        ))}
      </section>

      <section className="mt-6 space-y-3">
        {sorted.map((person, i) => (
          <article key={person.id} className="animate-rise-in rounded-xl border border-[#e5e0d8] bg-white p-5 shadow-sm">
            <div className="flex gap-4">
              <span className="font-serif text-2xl text-[#a47621]">0{i + 1}</span>
              <div className="flex-1">
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <h2 className="font-serif text-2xl">{person.name} <span className="text-base italic text-[#777166]">'{person.alias}'</span></h2>
                    <p className="mt-1 text-sm text-[#666052]">{person.reason}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {person.clusterIds.map((cid) => {
                        const cluster = clusters.find((c) => c.id === cid)
                        return <span key={cid} className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] text-white" style={{ background: cluster.color }}>{cluster.name}</span>
                      })}
                      {person.isBridge && <span className="inline-flex items-center gap-1 rounded-full bg-[#171511] px-2 py-0.5 text-[10px] font-medium text-white"><GitBranch className="size-3" />Bridge</span>}
                    </div>
                  </div>
                  <b className="font-mono text-lg">{person.score}<small className="text-xs"> /100</small></b>
                </div>
                <button onClick={() => setOpen(open === person.id ? null : person.id)} className="mt-3 text-xs font-medium">Algorithmic score <ChevronDown className={`inline size-4 transition ${open === person.id ? 'rotate-180' : ''}`} /></button>
                {open === person.id && <div className="mt-3 grid gap-2 rounded-lg bg-[#faf7f2] p-3 text-xs sm:grid-cols-3"><span>Degree centrality: {person.degree}</span><span>Betweenness: {person.betweenness}</span><span>PageRank: {person.pagerank}</span></div>}
              </div>
            </div>
          </article>
        ))}
      </section>
      <p className="mx-auto mt-6 text-xs leading-5 text-[#777166]"><Network className="mr-1 inline size-4" /> Composite ranking combines betweenness (45%), degree density (30%), and PageRank (25%).</p>
    </div>
  )
}
