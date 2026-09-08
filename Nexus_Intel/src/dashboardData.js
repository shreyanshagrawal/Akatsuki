export const initialCases = [
  {
    id: 'CAS-2026-1140', title: 'The 11:40 Murder', subject: 'Akshay Kumar Singh', alias: "'Former Partner'",
    status: 'Active', risk: 'Critical', lead: 'Homicide Division', updated: 'Today, Just Now',
    type: 'dossier', ai: true, priority: 'High',
    firId: 'FIR-1140/2026-AUG14', incidentAt: '14 Aug 2026 • 21:18 IST (Found 23:40 IST)',
    identityRef: 'KYC-UID-1140-6629-4401', location: 'Abandoned Warehouse, Industrial Dock Road',
    victim: 'Hriday',
  },
  {
    id: 'CAS-2026-0392', title: 'Operation Dark Ledger', subject: 'Ramesh Kumar', alias: "'Wire'",
    status: 'Active', risk: 'High', lead: 'Insp. D. Miller', updated: 'Today, 09:42 AM',
    type: 'dossier', ai: true, priority: 'High',
    firId: 'FIR-CR-9402/2026-NZ', incidentAt: '2026-03-18 • 02:40 IST',
    identityRef: 'KYC-UID-8941-2094-1182', location: 'Warehouse Bay 4, Pier 44 Maritime Freight Terminal',
  },
  {
    id: 'CAS-2026-0114', title: 'Operation Tidewater', subject: 'Marcus Vance', alias: "'The Chancellor'",
    status: 'Active', risk: 'High', lead: 'Insp. D. Miller', updated: 'Yesterday, 6:20 PM',
    type: 'finance', ai: true, priority: 'High',
    firId: 'FIR-CR-1147/2026-SB', incidentAt: '2026-01-22 • 14:05 IST',
    identityRef: 'KYC-UID-2231-8850-4471', location: 'Apex Escrow AG, Suite 1204, BKC Financial District, Mumbai',
  },
  {
    id: 'CAS-2025-0771', title: 'Operation Bullion Drift', subject: 'Devendra Roy', alias: "'Alchemist'",
    status: 'Cold', risk: 'Medium', lead: 'Insp. R. Nair', updated: '11 days ago',
    type: 'corporate', ai: true, priority: 'Medium',
    firId: 'FIR-CR-6603/2025-KN', incidentAt: '2025-11-02 • 09:10 IST',
    identityRef: 'KYC-UID-7742-1190-3305', location: 'Bonded Warehouse 7, Sunauli Border Freight Yard',
  },
  {
    id: 'CAS-2026-0203', title: 'Operation Ghost Freight', subject: 'Vikram Malhotra', alias: "'Skipper'",
    status: 'Active', risk: 'Medium', lead: 'Insp. D. Miller', updated: '3 days ago',
    type: 'maritime', ai: true, priority: 'Medium',
    firId: 'FIR-CR-9955/2026-NZ', incidentAt: '2026-02-11 • 23:45 IST',
    identityRef: 'KYC-UID-5518-2264-9903', location: 'Pier 44 Maritime Freight Terminal, Berth 6',
  },
  {
    id: 'CAS-2025-0588', title: 'Operation Split Ledger', subject: 'Thomas Sterling', alias: "'Ledger-3'",
    status: 'Closed', risk: 'Medium', lead: 'Insp. A. Fernandes', updated: '2 months ago',
    type: 'finance', ai: true, priority: 'Medium',
    firId: 'FIR-CR-3341/2025-SB', incidentAt: '2025-08-14 • 11:30 IST',
    identityRef: 'KYC-UID-9012-4470-1188', location: 'Six mule accounts, HDFC/ICICI network, Mumbai',
  },
  {
    id: 'CAS-2024-1183', title: 'Operation Cold Harbour', subject: 'Elena Rostova', alias: "'Specter-7'",
    status: 'Cold', risk: 'High', lead: 'Insp. R. Nair', updated: '7 months ago',
    type: 'telecom', ai: true, priority: 'High',
    firId: 'FIR-CR-0087/2024-DL', incidentAt: '2024-06-30 • 04:15 IST',
    identityRef: 'KYC-UID-1150-3382-7764', location: 'Encrypted relay node, Deira Comms Exchange',
  },
]

// Shared so every "Alerts" badge in the app (dashboard sidebar, graph workspace, alerts center) agrees on the same count.
export const alertSeed = [
  ['Post-Mortem Spoofed Transmission', 'Critical', "Hriday's device transmitted SMS to Shreyansh Agrawal 52 minutes after estimated time of death."],
  ['High-Frequency VoIP Divergence', 'Critical', 'Ramesh Kumar triggered 18 encrypted calls within 12 minutes of an outbound ₹28.5L RTGS transfer.'],
  ['Micro-Structuring Smurfing Cascade', 'Critical', '24 debit transactions under threshold across six mule accounts in 45 minutes.'],
  ['Dormant Shell Re-Activation', 'Warning', 'Apex Escrow AG received its first wire inflow after 14 months of zero ledger activity.'],
  ['Geographic Anomaly / Device Hop', 'Warning', 'IMSI pinged Bandra and Deira cell towers with a sub-second interval.'],
  ['Rapid Liquidity Drain', 'Critical', 'Escrow vault account drained 94% of reserves to crypto bridge addresses.'],
]
