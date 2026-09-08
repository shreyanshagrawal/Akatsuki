// Nexus_Intel/src/components/KeyIndividuals.jsx
import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  ChevronDown,
  Clock,
  FileText,
  MapPin,
  Network,
  PhoneCall,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

const allIndividuals = [
  // --- Case 11:40: The Warehouse Murder Cast ---
  {
    name: 'Akshay Kumar Singh',
    alias: 'Former Partner',
    avatar: '/avatars/akshay.jpg',
    weaponImage: '/evidence/knife_w87.jpg',
    caseId: 'CAS-2026-1140',
    caseTitle: 'The 11:40 Murder',
    score: '98.4',
    role: 'Prime Suspect / Murderer',
    reason: 'Primary perpetrator in 11:40 warehouse murder; embezzled company capital (₹32.5L), inflicted lethal cranial trauma, and orchestrated false Bistro 9 alibi.',
    tags: ['Case 11:40', 'Primary Suspect', 'Gateways', 'High PageRank'],
    degree: '0.96',
    betweenness: '0.94',
    pageRank: '0.98',
    status: 'Prime Suspect',
    statusTone: 'bad',
    telemetry: 'Present at Dock Road Warehouse 20:45–21:45 IST; cell silence during murder; departed on foot at 21:45.',
    callRecord: '20:20 IST to Swastik (transit request) • 21:27 IST to Devishi (3m 42s confession/panic call).',
    alibiAudit: 'Claimed dinner at Bistro 9 with Devishi; debunked by Dock Road cell tower latch at 21:48 IST.',
    physicalEvidence: 'Tactical folding knife engraved "W87" recovered in trench; DNA-matched blood micro-spatter on right leather shoe; victim\'s handset seized nearby.',
  },
  {
    name: 'Devishi',
    alias: 'Alibi Confidante',
    avatar: null,
    caseId: 'CAS-2026-1140',
    caseTitle: 'The 11:40 Murder',
    score: '89.2',
    role: 'Accomplice / Alibi Fabricator',
    reason: 'Received post-crime confession call at 21:27 IST; staged retroactive text message thread at 21:45 IST to manufacture co-presence.',
    tags: ['Case 11:40', 'Accomplice', 'Gateways'],
    degree: '0.88',
    betweenness: '0.85',
    pageRank: '0.89',
    status: 'Accomplice',
    statusTone: 'warn',
    telemetry: 'Located at Bistro 9 (Bandra West); active messaging between 21:45 and 21:52 IST.',
    callRecord: '21:27 IST incoming call from Akshay Kumar Singh (duration: 3m 42s).',
    alibiAudit: 'Fabricated SMS: "Table is ready at Bistro 9" at 21:45 while knowing Akshay had just committed murder.',
    physicalEvidence: 'Chat export retrieved from device verifying coordinated timeline falsification.',
  },
  {
    name: 'Hriday',
    alias: 'Victim',
    avatar: '/avatars/hriday.jpg',
    caseId: 'CAS-2026-1140',
    caseTitle: 'The 11:40 Murder',
    score: '92.0',
    role: 'Deceased / Complainant',
    reason: 'Business owner who discovered financial diversion; scheduled warehouse meeting to confront former partner.',
    tags: ['Case 11:40', 'Victim', 'High PageRank'],
    degree: '0.91',
    betweenness: '0.88',
    pageRank: '0.92',
    status: 'Deceased',
    statusTone: 'neutral',
    telemetry: 'Dock Road Warehouse arrival at 21:05 IST; cell connection static until body discovery at 23:40 IST.',
    callRecord: '19:30 IST to Shreyansh Agrawal (4m 12s) • 20:00 IST to Thaniska (3m 50s premonition call).',
    alibiAudit: 'Autopsy establishes time of death at 21:18 IST (+/- 6 minutes); no defensive wounds.',
    physicalEvidence: 'Blunt-force cranial fracture; financial audit reports detailing ₹32,50,000 deficit found in briefcase.',
  },
  {
    name: 'Shreyansh Agrawal',
    alias: 'Accountant',
    avatar: '/avatars/shreyansh.jpg',
    caseId: 'CAS-2026-1140',
    caseTitle: 'The 11:40 Murder',
    score: '74.5',
    role: 'Company Accountant (Uninvolved)',
    reason: 'Legitimate financial auditor; received 19:30 fraud disclosure call and 22:10 post-mortem spoofed text.',
    tags: ['Case 11:40', 'Financial Hubs', 'Uninvolved'],
    degree: '0.74',
    betweenness: '0.71',
    pageRank: '0.76',
    status: 'Exonerated',
    statusTone: 'good',
    telemetry: 'At accounting firm office until 20:15 IST, arrived residence at 20:45 IST; continuous home Wi-Fi latch.',
    callRecord: '19:30 IST incoming call from Hriday (4m 12s) • 22:10 IST incoming spoof text from victim phone.',
    alibiAudit: 'Full CCTV and router logs confirm presence at residence during 21:18 IST murder window.',
    physicalEvidence: 'Audited balance sheets handed over to investigators showing unauthorized withdrawals by Akshay.',
  },
  {
    name: 'Swastik',
    alias: 'Driver',
    avatar: '/avatars/swastik.jpg',
    caseId: 'CAS-2026-1140',
    caseTitle: 'The 11:40 Murder',
    score: '68.2',
    role: 'Transit Driver (False Lead)',
    reason: 'Gave Akshay a ride, dropped him at warehouse at 20:45 IST, and departed 33 minutes before the lethal encounter.',
    tags: ['Case 11:40', 'False Lead', 'Uninvolved'],
    degree: '0.68',
    betweenness: '0.62',
    pageRank: '0.69',
    status: 'Cleared',
    statusTone: 'good',
    telemetry: 'Silver Honda City (MH-02-CD-4190); GPS confirms arrival at 20:45 and departure at 20:46 IST.',
    callRecord: '20:20 IST incoming call from Akshay Kumar Singh requesting transit lift.',
    alibiAudit: 'FastTag toll plaza record timestamped 21:02 IST (18km away from scene); departed 33m before crime.',
    physicalEvidence: 'Vehicle dashcam records corroborate immediate departure after curbside drop-off.',
  },
  {
    name: 'Thaniska',
    alias: 'Confidante',
    avatar: '/avatars/thaniska.jpg',
    caseId: 'CAS-2026-1140',
    caseTitle: 'The 11:40 Murder',
    score: '62.1',
    role: 'Friend (Uninvolved)',
    reason: 'Received 20:00 premonition call from Hriday; location telemetry confirms presence at home throughout the incident.',
    tags: ['Case 11:40', 'Uninvolved'],
    degree: '0.61',
    betweenness: '0.55',
    pageRank: '0.63',
    status: 'Exonerated',
    statusTone: 'good',
    telemetry: 'Domestic Wi-Fi continuous router connection (14km away from Dock Road warehouse).',
    callRecord: '20:00 IST incoming call from Hriday: "If something happens to me tonight, check what I told Shreyansh."',
    alibiAudit: 'Food delivery receipt and digital footprint place Thaniska at home continuously between 19:10 and 02:00 IST.',
    physicalEvidence: 'Call duration logs matching carrier metadata confirming warning call details.',
  },

  // --- Operation Dark Ledger Cast ---
  {
    name: 'Ramesh Kumar',
    alias: 'Wire',
    caseId: 'CAS-2026-0392',
    caseTitle: 'Operation Dark Ledger',
    score: '94.8',
    role: 'Primary Suspect',
    reason: 'Bridges logistics and Hawala clearing clusters across 14 state cyber cells.',
    tags: ['Operation Dark Ledger', 'Gateways', 'High PageRank'],
    degree: '0.94',
    betweenness: '0.89',
    pageRank: '0.91',
    status: 'Active Target',
    statusTone: 'bad',
    telemetry: 'Multi-jurisdictional roaming; 18 encrypted VoIP bursts preceding ₹28.5L RTGS transfer.',
    callRecord: 'VoIP encrypted channels latched to Bandra cell tower.',
    alibiAudit: 'Under investigation for corporate identity spoofing and offshore laundering.',
    physicalEvidence: 'Seized 4TB encrypted drive containing 41 ledger spreadsheets.',
  },
  {
    name: 'Marcus Vance',
    alias: 'The Chancellor',
    caseId: 'CAS-2026-0392',
    caseTitle: 'Operation Dark Ledger',
    score: '88.2',
    role: 'Offshore Controller',
    reason: 'Controls outbound Hawala liquidity routing through foreign clearing accounts.',
    tags: ['Operation Dark Ledger', 'Financial Hubs', 'High PageRank'],
    degree: '0.88',
    betweenness: '0.85',
    pageRank: '0.88',
    status: 'Under Audit',
    statusTone: 'warn',
    telemetry: 'Apex Escrow AG, Suite 1204, BKC Financial District.',
    callRecord: 'Cross-border wire authentication pings to Zurich.',
    alibiAudit: 'Dormant shell account reactivated after 14 months of zero transactions.',
    physicalEvidence: 'SWIFT wire verification tokens matching seized mule accounts.',
  },
]

const filters = [
  'All',
  'Case 11:40',
  'Primary Suspect',
  'Accomplice',
  'Uninvolved',
  'Gateways',
  'Financial Hubs',
  'High PageRank',
]

const toneBadges = {
  bad: 'border-[#f1c6c3] bg-[#fbeaea] text-[#c0362c]',
  warn: 'border-[#fde4ba] bg-[#fff4df] text-[#a47621]',
  good: 'border-[#c3e6cd] bg-[#ecfdf5] text-[#1e6b37]',
  neutral: 'border-[#e5e0d8] bg-[#ece8e1] text-[#5b564b]',
}

export function KeyIndividuals({ onExit, caseId = 'CAS-2026-1140' }) {
  const [filter, setFilter] = useState(caseId === 'CAS-2026-1140' ? 'Case 11:40' : 'All')
  const [open, setOpen] = useState(null)

  const visible = useMemo(() => {
    if (filter === 'All') return allIndividuals
    return allIndividuals.filter((item) => item.tags.includes(filter))
  }, [filter])

  return (
    <main className="min-h-screen bg-[#f5f1ea] p-5 text-[#171511] sm:p-10">
      <header className="mx-auto flex max-w-5xl flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#a47621]">
              Network Topology // Centrality Analysis
            </span>
            <span className="rounded-full border border-[#171511] bg-white px-2 py-0.5 font-mono text-[9px] uppercase">
              {allIndividuals.length} Profiled Entities
            </span>
          </div>
          <h1 className="mt-1 font-serif text-4xl font-bold">Key Individuals</h1>
          <p className="mt-2 text-sm text-[#777166]">
            Entities ranked by structural network connectivity, intermediary bridging, and algorithmic prominence.
          </p>
        </div>
        <button
          onClick={onExit}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#e5e0d8] bg-white px-4 py-2 text-xs font-medium shadow-sm transition hover:border-[#171511] hover:bg-[#faf7f2]"
        >
          <ArrowLeft className="size-3.5" />
          Back to Graph
        </button>
      </header>

      {/* Filter Bar */}
      <div className="mx-auto mt-7 flex max-w-5xl gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              filter === f ? 'bg-[#171511] text-white shadow-sm' : 'border border-[#e5e0d8] bg-white text-[#666052] hover:bg-[#ece8e1]'
            }`}
          >
            {f === 'Case 11:40' && <Sparkles className="mr-1.5 inline size-3 text-[#f0a95c]" />}
            {f}
          </button>
        ))}
      </div>

      {/* Entities List */}
      <section className="mx-auto mt-4 max-w-5xl space-y-4">
        {visible.length === 0 && (
          <p className="rounded-2xl border border-dashed border-[#d4cebf] bg-white p-8 text-center text-sm text-[#777166]">
            No individuals match this filter.
          </p>
        )}

        {visible.map((person, i) => {
          const isOpen = open === person.name
          return (
            <article
              key={person.name}
              className="animate-rise-in rounded-2xl border border-[#e5e0d8] bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <span className="font-serif text-2xl font-bold text-[#a47621]">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Person Portrait / Avatar Record */}
                <div className="relative shrink-0">
                  {person.avatar ? (
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="size-14 sm:size-16 rounded-2xl object-cover border-2 border-[#e5e0d8] shadow-sm ring-1 ring-[#171511]/5"
                    />
                  ) : (
                    <div className="grid size-14 sm:size-16 place-items-center rounded-2xl border-2 border-[#e5e0d8] bg-[#f2eee9] font-serif text-lg font-bold text-[#777166] shadow-inner">
                      {person.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-serif text-2xl font-bold text-[#171511]">{person.name}</h2>
                        {person.alias && (
                          <span className="font-serif text-base italic text-[#777166]">
                            &lsquo;{person.alias}&rsquo;
                          </span>
                        )}
                        <span
                          className={`rounded-full border px-2 py-0.5 font-mono text-[9px] font-semibold uppercase ${
                            toneBadges[person.statusTone]
                          }`}
                        >
                          {person.status}
                        </span>
                      </div>

                      <p className="mt-1 text-xs font-medium text-[#8a8578]">{person.role} • <span className="font-mono text-[11px]">{person.caseTitle}</span></p>
                      <p className="mt-2 text-sm leading-relaxed text-[#554f43]">{person.reason}</p>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {person.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                              tag === 'Case 11:40'
                                ? 'border border-[#f5c6cb] bg-[#fdf6f6] text-[#c0362c]'
                                : 'bg-[#ece8e1] text-[#5b564b]'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-2xl font-bold text-[#171511]">{person.score}</span>
                      <span className="font-mono text-xs text-[#8a8578]"> /100</span>
                      <p className="font-mono text-[9px] uppercase tracking-wider text-[#8a8578]">Composite Rank</p>
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <div className="mt-4 flex items-center justify-between border-t border-[#f0ece4] pt-3">
                    <button
                      onClick={() => setOpen(isOpen ? null : person.name)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#777166] transition hover:text-[#171511]"
                    >
                      <FileText className="size-3.5" />
                      <span>{isOpen ? 'Hide Forensic & Centrality Dossier' : 'View Full Forensic & Centrality Dossier'}</span>
                      <ChevronDown className={`size-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {/* Expanded Forensic Dossier */}
                  {isOpen && (
                    <div className="animate-rise-in mt-4 space-y-3.5 rounded-2xl border border-[#e5e0d8] bg-[#faf8f5] p-4 text-xs">
                      {/* Centrality Metric Cards */}
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#8a8578]">Graph Theory Metrics</span>
                        <div className="mt-1.5 grid gap-2 sm:grid-cols-3">
                          <div className="rounded-xl border border-[#e5e0d8] bg-white p-2.5">
                            <span className="font-mono text-[9px] text-[#8a8578]">Degree Centrality</span>
                            <p className="mt-0.5 font-mono text-base font-bold text-[#171511]">{person.degree}</p>
                          </div>
                          <div className="rounded-xl border border-[#e5e0d8] bg-white p-2.5">
                            <span className="font-mono text-[9px] text-[#8a8578]">Betweenness Centrality</span>
                            <p className="mt-0.5 font-mono text-base font-bold text-[#171511]">{person.betweenness}</p>
                          </div>
                          <div className="rounded-xl border border-[#e5e0d8] bg-white p-2.5">
                            <span className="font-mono text-[9px] text-[#8a8578]">PageRank Score</span>
                            <p className="mt-0.5 font-mono text-base font-bold text-[#171511]">{person.pageRank}</p>
                          </div>
                        </div>
                      </div>

                      {/* Forensic Intelligence Fields */}
                      <div className="grid gap-2.5 sm:grid-cols-2">
                        {person.telemetry && (
                          <div className="rounded-xl border border-[#e5e0d8] bg-white p-3">
                            <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase text-[#171511]">
                              <MapPin className="size-3.5 text-[#2563eb]" />
                              Geolocation &amp; Telemetry
                            </div>
                            <p className="mt-1.5 leading-relaxed text-[#554f43]">{person.telemetry}</p>
                          </div>
                        )}

                        {person.callRecord && (
                          <div className="rounded-xl border border-[#e5e0d8] bg-white p-3">
                            <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase text-[#171511]">
                              <PhoneCall className="size-3.5 text-[#059669]" />
                              Communication Logs
                            </div>
                            <p className="mt-1.5 leading-relaxed text-[#554f43]">{person.callRecord}</p>
                          </div>
                        )}

                        {person.alibiAudit && (
                          <div className="rounded-xl border border-[#e5e0d8] bg-white p-3">
                            <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase text-[#171511]">
                              <Clock className="size-3.5 text-[#d97706]" />
                              Alibi &amp; Chronology Audit
                            </div>
                            <p className="mt-1.5 leading-relaxed text-[#554f43]">{person.alibiAudit}</p>
                          </div>
                        )}

                        {person.physicalEvidence && (
                          <div className="rounded-xl border border-[#e5e0d8] bg-white p-3">
                            <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase text-[#171511]">
                              {person.statusTone === 'bad' ? (
                                <ShieldAlert className="size-3.5 text-[#dc2626]" />
                              ) : (
                                <ShieldCheck className="size-3.5 text-[#10b981]" />
                              )}
                              Physical &amp; Forensic Evidence
                            </div>
                            <p className="mt-1.5 leading-relaxed text-[#554f43]">{person.physicalEvidence}</p>
                          </div>
                        )}

                        {person.weaponImage && (
                          <div className="sm:col-span-2 rounded-xl border border-[#f1c6c3] bg-[#fdf6f6] p-3.5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                            <div className="relative group shrink-0 overflow-hidden rounded-xl border border-[#e5c2be] bg-white p-1 shadow-sm">
                              <img
                                src={person.weaponImage}
                                alt="Physical Murder Weapon W87"
                                className="h-36 w-20 sm:w-24 object-contain transition-transform duration-200 group-hover:scale-105"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#c0362c]">Forensic Weapon Exhibit // EX-W87</span>
                                <span className="rounded bg-[#fbeaea] px-1.5 py-0.5 font-mono text-[9px] font-semibold text-[#c0362c] border border-[#f1c6c3]">CFSL Vault Logged</span>
                              </div>
                              <h4 className="mt-1 font-serif text-base font-bold text-[#171511]">Tactical Folding Knife (Laser Mark: &ldquo;W87&rdquo;)</h4>
                              <p className="mt-1 text-xs leading-relaxed text-[#554f43]">
                                Confirmed murder weapon recovered from drainage trench 120m south of Dock Road warehouse. Features a black-coated blade with <strong>&ldquo;W87&rdquo;</strong> laser engraving and carved spider relief on stainless handle. Forensic serology confirmed <strong>Hriday V. Mehta DNA</strong> in micro-spatter on blade edge; latent thumbprint on bolster matched <strong>Akshay Kumar Singh</strong>.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </section>

      <p className="mx-auto mt-8 max-w-5xl text-xs leading-5 text-[#8a8578]">
        <Network className="mr-1.5 inline size-4 text-[#a47621]" />
        Composite network ranking formula: Betweenness (45%) + Degree Density (30%) + PageRank Structural Prominence (25%).
      </p>
    </main>
  )
}
