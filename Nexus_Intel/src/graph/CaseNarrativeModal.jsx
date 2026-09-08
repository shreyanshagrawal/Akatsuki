// Nexus_Intel/src/graph/CaseNarrativeModal.jsx
import { BookOpen, CheckCircle2, Clock, FileText, Network, ShieldAlert, X } from 'lucide-react'

export function CaseNarrativeModal({ onClose, onOpenGraph }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-[#d8d3c8] bg-[#fcfbf9] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e5e0d8] bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-[#171511] text-white shadow-sm">
              <BookOpen className="size-4 text-[#f0a95c]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#8a8578]">Case File // CAS-2026-1140</span>
                <span className="rounded-full border border-[#f1c6c3] bg-[#fbeaea] px-2 py-0.5 font-mono text-[9px] font-semibold text-[#c0362c]">
                  HOMICIDE INVESTIGATION
                </span>
              </div>
              <h2 className="font-serif text-xl font-bold text-[#171511]">The 11:40 Murder — Crime Network Analysis</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onOpenGraph && (
              <button
                onClick={() => { onClose(); onOpenGraph() }}
                className="flex items-center gap-1.5 rounded-full bg-[#171511] px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-[#2b2722]"
              >
                <Network className="size-3.5" />
                View Network Graph
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-[#8a8578] transition hover:bg-[#ece8e1] hover:text-[#171511]"
              title="Close modal"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-6 text-[#2d2924]">
          {/* Cast Overview Card */}
          <div className="rounded-2xl border border-[#e5e0d8] bg-white p-5 shadow-sm">
            <h3 className="mb-3 font-mono text-[11px] uppercase tracking-wider text-[#8a8578]">Strict 6-Person Cast &amp; Role Index</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: 'Hriday', avatar: '/avatars/hriday.jpg', role: 'Victim', status: 'Deceased (21:18 IST)', color: 'border-[#2563eb] bg-[#eff6ff] text-[#1e3a5f]', note: 'Discovered missing company funds and arranged warehouse confrontation.' },
                { name: 'Akshay Kumar Singh', avatar: '/avatars/akshay.jpg', role: 'Murderer', status: 'Prime Suspect', color: 'border-[#dc2626] bg-[#fef2f2] text-[#991b1b]', note: 'Former business partner who stole funds, murdered Hriday at 21:18, and forged an alibi.' },
                { name: 'Shreyansh Agrawal', avatar: '/avatars/shreyansh.jpg', role: 'Accountant (Uninvolved)', status: 'Cleared', color: 'border-[#10b981] bg-[#ecfdf5] text-[#065f46]', note: 'Legitimate accountant; received 19:30 call and 22:10 post-mortem spoof text.' },
                { name: 'Thaniska', avatar: '/avatars/thaniska.jpg', role: 'Friend (Uninvolved)', status: 'Cleared', color: 'border-[#10b981] bg-[#ecfdf5] text-[#065f46]', note: 'Received 20:00 warning call; verified at home during the entire incident window.' },
                { name: 'Swastik', avatar: '/avatars/swastik.jpg', role: 'Driver (False Lead)', status: 'Exonerated', color: 'border-[#f59e0b] bg-[#fffbeb] text-[#92400e]', note: 'Gave Akshay a ride, dropped him at 20:45, and departed 33 mins prior to murder.' },
                { name: 'Devishi', avatar: null, role: 'Supporter / Accomplice', status: 'High Suspicion', color: 'border-[#f97316] bg-[#fff7ed] text-[#9a3412]', note: 'Received 21:27 panic call; crafted fabricated messages at 21:45 to stage a joint alibi.' },
              ].map((c) => (
                <div key={c.name} className={`rounded-xl border p-3.5 ${c.color} flex items-start gap-3`}>
                  {c.avatar ? (
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="size-11 rounded-xl object-cover border border-black/10 shadow-sm shrink-0"
                    />
                  ) : (
                    <div className="grid size-11 place-items-center rounded-xl border border-black/10 bg-white/60 font-serif text-sm font-bold opacity-80 shrink-0">
                      {c.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-1">
                      <strong className="text-sm font-bold truncate">{c.name}</strong>
                      <span className="rounded px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase shrink-0">{c.status}</span>
                    </div>
                    <p className="mt-0.5 text-xs font-medium opacity-90">{c.role}</p>
                    <p className="mt-1 text-[11px] leading-relaxed opacity-80">{c.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Narrative Case Story */}
          <div className="rounded-2xl border border-[#e5e0d8] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-[#f0ece4] pb-3">
              <FileText className="size-4 text-[#c0362c]" />
              <h3 className="font-serif text-lg font-bold text-[#171511]">The Narrative Record: The 11:40 Murder</h3>
            </div>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-[#3d3830]">
              <p>
                The humidity hung thick over the industrial corridor on the night of August 14th. Inside the corrugated metal walls of an abandoned warehouse on Dock Road, Hriday’s lifeless body would not be discovered until <strong>11:40 PM</strong>, but the chain of events that sealed his fate had started ticking hours earlier.
              </p>
              <p>
                At <strong>7:30 PM</strong>, Hriday made a call to Shreyansh Agrawal, the company accountant who held legitimate access to the firm’s financial books. Hriday’s voice was taut: <em>&ldquo;I’ve found where the missing money went. I know who did it.&rdquo;</em> When Shreyansh asked who was responsible for draining the operational balances, Hriday refused to disclose the name over an open line, choosing instead to verify the paper trail privately.
              </p>
              <p>
                Thirty minutes later, at <strong>8:00 PM</strong>, Hriday called Thaniska, his close friend. A sense of foreboding colored his words: <em>&ldquo;If something happens to me tonight, check what I told Shreyansh.&rdquo;</em> Thaniska urged him to step back, assuming he was merely exhausted and anxious about the audit. Thaniska remained at home for the rest of the evening, unaware of the impending danger.
              </p>
              <p>
                Meanwhile, at <strong>8:20 PM</strong> across town, Akshay Kumar Singh—Hriday’s former business partner who had covertly siphoned the funds—called Swastik. Akshay claimed he needed an urgent drop-off near the abandoned warehouse and asked Swastik for a ride. Unaware of Akshay’s lethal intentions, Swastik agreed.
              </p>
              <p>
                At <strong>8:45 PM</strong>, Swastik’s car pulled up to the dark perimeter of the warehouse. Akshay stepped out into the night and told him: <em>&ldquo;I’ll call you when I’m done.&rdquo;</em> Swastik drove away immediately. This precise departure at 8:45 PM would become the definitive temporal demarcation separating an innocent ride from a homicide conspiracy.
              </p>
              <p>
                At <strong>9:05 PM</strong>, Hriday arrived at the warehouse, expecting a resolution. Instead, he walked straight into an ambush. Confronting Akshay with the ledger discrepancies, Hriday demanded restitution and threatened immediate public exposure. Akshay denied everything, but the confrontation escalated into a vicious struggle. At <strong>9:18 PM</strong>, the argument turned fatal: Akshay murdered Hriday on the concrete floor.
              </p>
              <p>
                In frantic survival mode, Akshay reached for his phone at <strong>9:27 PM</strong> and dialed Devishi, his closest confidante. Akshay confessed to the crime. Instead of reporting the killing, Devishi agreed to construct a retroactive alibi. She instructed Akshay to abandon the scene immediately and promised to claim they had been together elsewhere.
              </p>
              <p>
                At <strong>9:45 PM</strong>, Akshay slipped out of the warehouse. Minutes later, Devishi began firing scripted messages to his device—crafted deliberately to make it appear as though the two were conversing in person and sharing an evening away from the docks.
              </p>
              <p>
                At <strong>10:10 PM</strong>, Shreyansh Agrawal’s phone buzzed with an incoming SMS originating from Hriday’s phone: <em>&ldquo;Everything is fine. I’ll explain tomorrow.&rdquo;</em> Shreyansh paused, noting the uncharacteristic tone. It was a digital ghost: sent 52 minutes after Hriday’s heart had stopped, transmitted by Akshay to delay discovery.
              </p>
              <p>
                At <strong>11:40 PM</strong>, Hriday was found inside the warehouse, initiating the investigation.
              </p>
            </div>
          </div>

          {/* AI Graph Extraction & Reasoning Matrix */}
          <div className="rounded-2xl border border-[#e5e0d8] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-[#f0ece4] pb-3">
              <Network className="size-4 text-[#2563eb]" />
              <h3 className="font-serif text-lg font-bold text-[#171511]">AI Network Graph Extraction &amp; Triangulation</h3>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-[#e5e0d8] bg-[#faf8f5] p-4">
                <h4 className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-[#171511]">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  1. Temporal Elimination (False Lead Cleared)
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-[#625d53]">
                  <strong>Swastik &rarr; Warehouse:</strong> Geolocation and call data place Swastik at the warehouse at <strong>8:45 PM</strong>, but confirmed transit logs prove he departed immediately. With the estimated murder window established at <strong>9:18 PM</strong>, the AI system clears Swastik as an unwitting false lead.
                </p>
              </div>

              <div className="rounded-xl border border-[#e5e0d8] bg-[#faf8f5] p-4">
                <h4 className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-[#171511]">
                  <ShieldAlert className="size-3.5 text-[#c0362c]" />
                  2. Critical Crime Vector
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-[#625d53]">
                  <strong>Hriday &harr; Akshay:</strong> Financial audit trail (missing company funds) establishes motive. On-scene overlap between 9:05 PM and 9:18 PM pinpoints Akshay at the warehouse during the exact moment of lethal trauma.
                </p>
              </div>

              <div className="rounded-xl border border-[#e5e0d8] bg-[#faf8f5] p-4">
                <h4 className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-[#171511]">
                  <Clock className="size-3.5 text-amber-600" />
                  3. Digital Telemetry Anomaly
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-[#625d53]">
                  <strong>Spoofed Transmission:</strong> SMS sent from Hriday&apos;s phone to Shreyansh at <strong>10:10 PM</strong> occurred 52 minutes post-mortem. This proves physical possession of the victim&apos;s device by the perpetrator.
                </p>
              </div>

              <div className="rounded-xl border border-[#e5e0d8] bg-[#faf8f5] p-4">
                <h4 className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-[#171511]">
                  <ShieldAlert className="size-3.5 text-[#ea580c]" />
                  4. Accomplice Alibi Fabrication
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-[#625d53]">
                  <strong>Devishi &rarr; Akshay:</strong> Outbound 9:27 PM call immediately following the murder, followed by retroactive alibi message exchanges starting at 9:45 PM, identifies Devishi as an active co-conspirator in evidence tampering.
                </p>
              </div>
            </div>

            {/* Physical Evidence Photo Exhibit */}
            <div className="mt-4 rounded-xl border border-[#f1c6c3] bg-[#fdf6f6] p-4">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#c0362c]">Forensic Exhibit // EVD-W87 (Recovered Murder Weapon)</span>
              <div className="mt-2.5 flex flex-col sm:flex-row items-start gap-4">
                <img
                  src="/evidence/knife_w87.jpg"
                  alt="Forensic Weapon Exhibit W87"
                  className="w-full sm:w-36 h-36 rounded-xl object-cover border border-[#e8bdb9] shadow-sm shrink-0"
                />
                <div className="min-w-0 text-xs text-[#554f43]">
                  <h5 className="font-serif text-base font-bold text-[#171511]">Tactical Folding Blade with "W87" Inscription</h5>
                  <p className="mt-1 leading-relaxed">
                    Recovered from drainage grate 120 meters south of the Dock Road warehouse. Forensic serology identified high-titer blood micro-spatter matching the DNA profile of <strong>Hriday V. Mehta</strong>. Latent ridge impressions on the bolster matched the right index and thumb print of <strong>Akshay Kumar Singh</strong>.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 font-mono text-[10px] text-[#777166]">
                    <span className="rounded bg-white px-2 py-0.5 border border-[#e5c2be]">Status: CFSL Evidence Vault</span>
                    <span className="rounded bg-white px-2 py-0.5 border border-[#e5c2be]">Chain of Custody: Logged</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
