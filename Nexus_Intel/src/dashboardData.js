export const initialCases = [
  { id: 'CAS-2026-0392', title: 'Operation Dark Ledger', subject: 'Ramesh Kumar', alias: "'Wire'", status: 'Active', risk: 'High', lead: 'Insp. D. Miller', updated: 'Today, 09:42 AM', type: 'dossier', ai: true },
]

// Shared so every "Alerts" badge in the app (dashboard sidebar, graph workspace, alerts center) agrees on the same count.
export const alertSeed = [
  ['High-Frequency VoIP Divergence', 'Critical', 'Ramesh Kumar triggered 18 encrypted calls within 12 minutes of an outbound ₹28.5L RTGS transfer.'],
  ['Micro-Structuring Smurfing Cascade', 'Critical', '24 debit transactions under threshold across six mule accounts in 45 minutes.'],
  ['Dormant Shell Re-Activation', 'Warning', 'Apex Escrow AG received its first wire inflow after 14 months of zero ledger activity.'],
  ['Geographic Anomaly / Device Hop', 'Warning', 'IMSI pinged Bandra and Deira cell towers with a sub-second interval.'],
  ['Rapid Liquidity Drain', 'Critical', 'Escrow vault account drained 94% of reserves to crypto bridge addresses.'],
]
