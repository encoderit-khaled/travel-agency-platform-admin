import type {
  StatementBooking,
  StatementWalletTransaction,
  StatementCreditUsage,
  StatementCommission,
  StatementSummaryData,
} from './agent-statements-types'

export const initialStatementSummary: StatementSummaryData = {
  agentName: 'Skyline Demo Travels Ltd',
  statementType: 'Agent Statement',
  startDate: '2026-10-01',
  endDate: '2026-11-16',
  formattedPeriod: '01 Oct 2026 – 16 Nov 2026',
  bookingsCount: 12,
  walletTxCount: 10,
  commissionsCount: 5,
  bookingsSummary: '12 in period',
  walletSummary: '10 in period',
  creditSummary: 'Credit Limit, Used, Available, Outstanding',
  commissionsSummary: '5 in period',
  closingBalanceStatus: 'Statement value available',
  closingBalanceNote:
    'This is the closing balance recorded for the selected statement period. System-provided statement value; no formula is applied in this view.',
}

export const initialStatementBookings: StatementBooking[] = [
  {
    id: 'b-01',
    reference: 'AW-DEMO-PK-003',
    customer: 'Nadia Islam',
    service: 'Travel Package',
    createdBy: 'Mirpur Desk',
    creatorType: 'Sub-agent',
    date: '05 Oct 2026',
    status: 'Confirmed',
    amount: 'Sample amount',
  },
  {
    id: 'b-02',
    reference: 'AW-DEMO-CR-005',
    customer: 'Farhana Noor',
    service: 'Car Rental',
    createdBy: 'Mirpur Desk',
    creatorType: 'Sub-agent',
    date: '12 Oct 2026',
    status: 'Cancelled',
    amount: 'Sample amount',
  },
  {
    id: 'b-03',
    reference: 'AW-DEMO-BT-009',
    customer: 'Maliha Khan',
    service: 'Bus / Train',
    createdBy: 'Skyline Demo Travels Ltd',
    creatorType: 'Parent Agent',
    date: '14 Oct 2026',
    status: 'Confirmed',
    amount: 'Sample amount',
  },
  {
    id: 'b-04',
    reference: 'AW-DEMO-AC-011',
    customer: 'Nafisa Rahman',
    service: 'Activity',
    createdBy: 'Skyline Demo Travels Ltd',
    creatorType: 'Parent Agent',
    date: '18 Oct 2026',
    status: 'Refunded',
    amount: 'Sample amount',
  },
  {
    id: 'b-05',
    reference: 'AW-DEMO-HT-002',
    customer: 'Karim Hasan',
    service: 'Hotel',
    createdBy: 'Mirpur Desk',
    creatorType: 'Sub-agent',
    date: '22 Oct 2026',
    status: 'Confirmed',
    amount: 'Sample amount',
  },
  {
    id: 'b-06',
    reference: 'AW-DEMO-HT-007',
    customer: 'Tania Sultana',
    service: 'Hotel',
    createdBy: 'Banani Desk',
    creatorType: 'Sub-agent',
    date: '26 Oct 2026',
    status: 'Issued',
    amount: 'Sample amount',
  },
  {
    id: 'b-07',
    reference: 'AW-DEMO-TI-010',
    customer: 'Tasnim Karim',
    service: 'Travel Insurance',
    createdBy: 'Skyline Demo Travels Ltd',
    creatorType: 'Parent Agent',
    date: '30 Oct 2026',
    status: 'Issued',
    amount: 'Sample amount',
  },
  {
    id: 'b-08',
    reference: 'AW-DEMO-ES-008',
    customer: 'Rafi Ahmed',
    service: 'eSIM',
    createdBy: 'Uttara Desk',
    creatorType: 'Sub-agent',
    date: '02 Nov 2026',
    status: 'Issued',
    amount: 'Sample amount',
  },
  {
    id: 'b-09',
    reference: 'AW-DEMO-FL-006',
    customer: 'Mahin Chowdhury',
    service: 'Flight',
    createdBy: 'Banani Desk',
    creatorType: 'Sub-agent',
    date: '04 Nov 2026',
    status: 'Confirmed',
    amount: 'Sample amount',
  },
  {
    id: 'b-10',
    reference: 'AW-DEMO-FL-001',
    customer: 'Amina Rahman',
    service: 'Flight',
    createdBy: 'Mirpur Desk',
    creatorType: 'Sub-agent',
    date: '05 Nov 2026',
    status: 'Ticketed',
    amount: 'Sample amount',
  },
  {
    id: 'b-11',
    reference: 'AW-DEMO-AC-004',
    customer: 'Samiul Ahmed',
    service: 'Activity',
    createdBy: 'Mirpur Desk',
    creatorType: 'Sub-agent',
    date: '09 Nov 2026',
    status: 'Pending',
    amount: 'Sample amount',
  },
  {
    id: 'b-12',
    reference: 'AW-DEMO-FL-012',
    customer: 'Imran Hossain',
    service: 'Flight',
    createdBy: 'Skyline Demo Travels Ltd',
    creatorType: 'Parent Agent',
    date: '11 Nov 2026',
    status: 'Failed',
    amount: 'Not applicable',
  },
]

export const initialStatementWalletTransactions: StatementWalletTransaction[] =
  [
    {
      id: 'tx-01',
      dateTime: '02 Oct 2026 · 09:30',
      type: 'Top-up',
      description: 'Stripe wallet top-up',
      reference: '—',
      direction: 'Credit',
      amount: '+ Sample amount',
      runningBalance: 'Sample balance',
    },
    {
      id: 'tx-02',
      dateTime: '08 Oct 2026 · 15:45',
      type: 'Top-up',
      description: 'Manual deposit recorded by Admin',
      reference: '—',
      direction: 'Credit',
      amount: '+ Sample amount',
      runningBalance: 'Sample balance',
    },
    {
      id: 'tx-03',
      dateTime: '14 Oct 2026 · 10:05',
      type: 'Booking Debit',
      description: 'Booking payment',
      reference: 'AW-DEMO-BT-009',
      direction: 'Debit',
      amount: '− Sample amount',
      runningBalance: 'Sample balance',
    },
    {
      id: 'tx-04',
      dateTime: '20 Oct 2026 · 13:20',
      type: 'Refund',
      description: 'Booking refund',
      reference: '—',
      direction: 'Credit',
      amount: '+ Sample amount',
      runningBalance: 'Sample balance',
    },
    {
      id: 'tx-05',
      dateTime: '27 Oct 2026 · 16:00',
      type: 'Manual Adjustment',
      description: 'Admin correction',
      reference: '—',
      direction: 'Credit',
      amount: '+ Sample amount',
      runningBalance: 'Sample balance',
    },
    {
      id: 'tx-06',
      dateTime: '03 Nov 2026 · 10:15',
      type: 'Top-up',
      description: 'Stripe wallet top-up',
      reference: '—',
      direction: 'Credit',
      amount: '+ Sample amount',
      runningBalance: 'Sample balance',
    },
    {
      id: 'tx-07',
      dateTime: '05 Nov 2026 · 14:40',
      type: 'Booking Debit',
      description: 'Booking payment',
      reference: 'AW-DEMO-FL-001',
      direction: 'Debit',
      amount: '− Sample amount',
      runningBalance: 'Sample balance',
    },
    {
      id: 'tx-08',
      dateTime: '08 Nov 2026 · 09:05',
      type: 'Refund',
      description: 'Booking refund',
      reference: 'AW-DEMO-AC-011',
      direction: 'Credit',
      amount: '+ Sample amount',
      runningBalance: 'Sample balance',
    },
    {
      id: 'tx-09',
      dateTime: '10 Nov 2026 · 16:30',
      type: 'Commission Credit',
      description: 'Commission credit',
      reference: '—',
      direction: 'Credit',
      amount: '+ Sample amount',
      runningBalance: 'Sample balance',
    },
    {
      id: 'tx-10',
      dateTime: '12 Nov 2026 · 11:20',
      type: 'Manual Adjustment',
      description: 'Admin adjustment',
      reference: '—',
      direction: 'Debit',
      amount: '− Sample amount',
      runningBalance: 'Sample balance',
    },
  ]

export const initialStatementCreditUsage: StatementCreditUsage = {
  creditLimit: 'Limit configured',
  usedCredit: 'Usage available',
  availableCredit: 'Available credit tracked',
  outstandingBalance: 'Outstanding balance tracked',
  note: 'Credit Limit is assigned by Aero Wing Admin. Exact amounts are not included in this design-preview dataset.',
}

export const initialStatementCommissions: StatementCommission[] = [
  {
    id: 'com-01',
    bookingReference: 'AW-DEMO-PK-003',
    service: 'Travel Package',
    status: 'Settled',
    commissionAmount: 'Sample amount',
    settlementImpact: 'Recorded by Aero Wing Admin',
  },
  {
    id: 'com-02',
    bookingReference: 'AW-DEMO-CR-005',
    service: 'Car Rental',
    status: 'Commission reversed',
    commissionAmount: 'Sample amount',
    settlementImpact: 'Not in active totals',
    impactNote: 'Reversed due to cancellation',
  },
  {
    id: 'com-03',
    bookingReference: 'AW-DEMO-AC-011',
    service: 'Activity',
    status: 'Commission reversed',
    commissionAmount: 'Sample amount',
    settlementImpact: 'Not in active totals',
    impactNote: 'Reversed due to refund',
  },
  {
    id: 'com-04',
    bookingReference: 'AW-DEMO-HT-002',
    service: 'Hotel',
    status: 'Earned',
    commissionAmount: 'Sample amount',
    settlementImpact: '—',
  },
  {
    id: 'com-05',
    bookingReference: 'AW-DEMO-FL-006',
    service: 'Flight',
    status: 'Pending',
    commissionAmount: 'Sample amount',
    settlementImpact: '—',
  },
]

export function generateStatementCSV(
  summary: StatementSummaryData,
  bookings: StatementBooking[] = initialStatementBookings,
  walletTx: StatementWalletTransaction[] = initialStatementWalletTransactions,
  commissions: StatementCommission[] = initialStatementCommissions,
): string {
  const lines: string[] = []

  // Document metadata
  lines.push(`Agent Statement,${summary.agentName}`)
  const periodParts = summary.formattedPeriod.split('–').map((s) => s.trim())
  if (periodParts.length === 2) {
    lines.push(`Statement Period,${periodParts[0]},${periodParts[1]}`)
  } else {
    lines.push(`Statement Period,${summary.formattedPeriod}`)
  }
  lines.push('Data,Sample data - fictional design-preview content')
  lines.push('Currency,Not included (sample data)')
  lines.push('')

  // Section 1: Bookings
  lines.push(
    'Section,Booking Reference,Customer,Service,Created By,Booking Date,Booking Status,Booking Amount',
  )
  for (const b of bookings) {
    lines.push(
      `Bookings,${b.reference},${b.customer},${b.service},${b.createdBy},${b.date},${b.status},${b.amount}`,
    )
  }
  lines.push('')

  // Section 2: Wallet Transactions
  lines.push(
    'Section,Date / Time,Type,Description,Reference,Direction,Amount,Running Balance',
  )
  for (const w of walletTx) {
    lines.push(
      `Wallet,${w.dateTime},${w.type},${w.description},${w.reference},${w.direction},${w.amount},${w.runningBalance}`,
    )
  }
  lines.push('')

  // Section 3: Credit Usage
  lines.push('Section,Metric,Status')
  lines.push('Credit Usage,Credit Limit,Limit configured')
  lines.push('Credit Usage,Used Credit,Usage available')
  lines.push('Credit Usage,Available Credit,Available credit tracked')
  lines.push('Credit Usage,Outstanding Balance,Outstanding balance tracked')
  lines.push('')

  // Section 4: Commissions
  lines.push(
    'Section,Booking,Service,Commission Status,Commission,Settlement / Impact',
  )
  for (const c of commissions) {
    const impact = c.impactNote
      ? `${c.settlementImpact} · ${c.impactNote}`
      : c.settlementImpact
    lines.push(
      `Commissions,${c.bookingReference},${c.service},${c.status},${c.commissionAmount},${impact}`,
    )
  }
  lines.push('')

  // Section 5: Closing Balance
  lines.push('Section,Status,Period,Note')
  lines.push(
    `Closing Balance,${summary.closingBalanceStatus},${summary.formattedPeriod},${summary.closingBalanceNote}`,
  )

  return lines.join('\n')
}

export function generateStatementHTMLDocument(
  summary: StatementSummaryData,
  bookings: StatementBooking[],
  walletTx: StatementWalletTransaction[],
  commissions: StatementCommission[],
  options?: {
    includeBookings?: boolean
    includeWallet?: boolean
    includeCredit?: boolean
    includeCommissions?: boolean
    includeClosing?: boolean
  },
): string {
  const incBookings = options?.includeBookings ?? true
  const incWallet = options?.includeWallet ?? true
  const incCredit = options?.includeCredit ?? true
  const incCommissions = options?.includeCommissions ?? true
  const incClosing = options?.includeClosing ?? true

  const bookingRows = bookings
    .map(
      (b) => `
    <tr>
      <td style="font-weight:600;color:#0267B8;">${b.reference}</td>
      <td><strong>${b.customer}</strong></td>
      <td>${b.service}</td>
      <td>${b.createdBy} <span style="font-size:10px;color:#64748B;">(${b.creatorType})</span></td>
      <td style="white-space:nowrap;">${b.date}</td>
      <td><span class="badge ${b.status.toLowerCase()}">${b.status}</span></td>
      <td style="text-align:right;font-weight:600;">${b.amount}</td>
    </tr>
  `,
    )
    .join('')

  const walletRows = walletTx
    .map(
      (w) => `
    <tr>
      <td style="white-space:nowrap;">${w.dateTime}</td>
      <td><strong>${w.type}</strong></td>
      <td>${w.description}</td>
      <td>${w.reference}</td>
      <td><span class="badge ${w.direction.toLowerCase()}">${w.direction}</span></td>
      <td style="font-weight:600;${w.direction === 'Credit' ? 'color:#0E6A3D;' : 'color:#B42318;'}">${w.amount}</td>
      <td style="text-align:right;font-weight:600;">${w.runningBalance}</td>
    </tr>
  `,
    )
    .join('')

  const commissionRows = commissions
    .map(
      (c) => `
    <tr>
      <td style="font-weight:600;color:#0267B8;">${c.bookingReference}</td>
      <td>${c.service}</td>
      <td><span class="badge ${c.status === 'Settled' ? 'confirmed' : c.status === 'Earned' ? 'issued' : 'pending'}">${c.status}</span></td>
      <td style="font-weight:600;">${c.commissionAmount}</td>
      <td>${c.settlementImpact} ${c.impactNote ? `<span style="color:#D92D20;font-size:10px;">(${c.impactNote})</span>` : ''}</td>
    </tr>
  `,
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Agent Statement - ${summary.agentName} - ${summary.formattedPeriod}</title>
  <style>
    @page { size: A4 portrait; margin: 12mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      margin: 0;
      padding: 24px;
      color: #141B28;
      background: #FFFFFF;
      font-size: 11px;
      line-height: 1.4;
    }
    .header-banner {
      background: linear-gradient(174deg, #001A3D 0%, #012A5E 100%);
      color: #FFFFFF;
      border-radius: 12px;
      padding: 20px 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
    }
    .brand-title {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin: 0 0 4px 0;
    }
    .brand-sub {
      font-size: 11px;
      color: #C9D7EA;
      margin: 0;
    }
    .meta-box {
      text-align: right;
      font-size: 11px;
    }
    .meta-item { margin-bottom: 3px; }
    .meta-label { color: #A0B9D6; }
    .meta-value { font-weight: 700; color: #FFFFFF; }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 10px;
      margin-bottom: 20px;
    }
    .kpi-card {
      background: #F4F6FA;
      border: 1px solid #E6EAF0;
      border-radius: 8px;
      padding: 10px 12px;
    }
    .kpi-card.highlight {
      background: #FEF9E7;
      border-color: #F1C134;
    }
    .kpi-title { font-size: 10px; color: #4F5B70; font-weight: 600; margin-bottom: 2px; }
    .kpi-card.highlight .kpi-title { color: #8F6B00; }
    .kpi-value { font-size: 12px; font-weight: 800; color: #141B28; }
    .kpi-sub { font-size: 10px; color: #64748B; margin-top: 2px; }
    .kpi-card.highlight .kpi-sub { color: #8F6B00; }
    .section-card {
      border: 1px solid #E6EAF0;
      border-radius: 10px;
      margin-bottom: 16px;
      overflow: hidden;
      page-break-inside: avoid;
    }
    .section-header {
      background: #F8FAFC;
      border-bottom: 1px solid #E6EAF0;
      padding: 10px 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 700;
      color: #012A5E;
      font-size: 12px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 10px;
    }
    th {
      background: #FAFBFD;
      color: #4F5B70;
      font-weight: 700;
      padding: 6px 10px;
      border-bottom: 1px solid #E6EAF0;
    }
    td {
      padding: 6px 10px;
      border-bottom: 1px solid #F0F2F6;
      color: #141B28;
    }
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .badge.confirmed, .badge.ticketed, .badge.credit { background: #E6F4EC; color: #0E6A3D; border: 1px solid #C5E9D5; }
    .badge.issued { background: #EAF4FD; color: #0267B8; border: 1px solid #CFE4FA; }
    .badge.pending { background: #FEF6E6; color: #B54708; border: 1px solid #FADBB3; }
    .badge.cancelled, .badge.debit { background: #FEE4E2; color: #D92D20; border: 1px solid #FECDCA; }
    .badge.refunded { background: #F4F3FF; color: #5925DC; border: 1px solid #DDD6FE; }
    .badge.failed { background: #FEF3F2; color: #B42318; border: 1px solid #FECDCA; }
    .closing-box {
      background: linear-gradient(175deg, #FFFBEB 0%, #FFF3CC 100%);
      border: 1px solid #F1C134;
      border-radius: 10px;
      padding: 14px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .footer-doc {
      border-top: 1px solid #E6EAF0;
      padding-top: 12px;
      display: flex;
      justify-content: space-between;
      color: #64748B;
      font-size: 10px;
    }
    .footnote {
      padding: 8px 12px;
      background: #FAFBFD;
      border-top: 1px solid #E6EAF0;
      color: #64748B;
      font-size: 9px;
    }
  </style>
</head>
<body>
  <div class="header-banner">
    <div>
      <h1 class="brand-title">AeroWing Agent Statement</h1>
      <p class="brand-sub">Official Travel Partner Account Activity · M2.10</p>
    </div>
    <div class="meta-box">
      <div class="meta-item"><span class="meta-label">Agent:</span> <span class="meta-value">${summary.agentName}</span></div>
      <div class="meta-item"><span class="meta-label">Period:</span> <span class="meta-value">${summary.formattedPeriod}</span></div>
      <div class="meta-item"><span class="meta-label">Type:</span> <span class="meta-value">${summary.statementType}</span></div>
      <div class="meta-item"><span class="meta-label">Generated:</span> <span class="meta-value">${new Date().toISOString().slice(0, 10)}</span></div>
    </div>
  </div>

  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-title">Bookings</div>
      <div class="kpi-value">${summary.bookingsSummary}</div>
      <div class="kpi-sub">${summary.bookingsCount} in period</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Wallet Transactions</div>
      <div class="kpi-value">${summary.walletSummary}</div>
      <div class="kpi-sub">${summary.walletTxCount} in period</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Credit Usage</div>
      <div class="kpi-value">${summary.creditSummary}</div>
      <div class="kpi-sub">Limit &amp; Outstanding</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Commissions</div>
      <div class="kpi-value">${summary.commissionsSummary}</div>
      <div class="kpi-sub">${summary.commissionsCount} in period</div>
    </div>
    <div class="kpi-card highlight">
      <div class="kpi-title">Closing Balance</div>
      <div class="kpi-value">${summary.closingBalanceStatus}</div>
      <div class="kpi-sub">System-provided</div>
    </div>
  </div>

  ${
    incBookings
      ? `
  <div class="section-card">
    <div class="section-header">
      <span>Bookings (${bookings.length})</span>
      <span style="font-size:10px;color:#0267B8;">Settles against Parent Account</span>
    </div>
    <table>
      <thead>
        <tr>
          <th>Reference</th>
          <th>Customer</th>
          <th>Service</th>
          <th>Created By</th>
          <th>Date</th>
          <th>Status</th>
          <th style="text-align:right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${bookingRows}
      </tbody>
    </table>
    <div class="footnote">
      Created By shows booking origin. Sub-agent bookings settle against the Parent Agent account; no separate Sub-agent statement exists.
    </div>
  </div>
  `
      : ''
  }

  ${
    incWallet
      ? `
  <div class="section-card">
    <div class="section-header">
      <span>Wallet Transactions (${walletTx.length})</span>
      <span style="font-size:10px;color:#0267B8;">Read-only Ledger Records</span>
    </div>
    <table>
      <thead>
        <tr>
          <th>Date / Time</th>
          <th>Type</th>
          <th>Description</th>
          <th>Reference</th>
          <th>Direction</th>
          <th>Amount</th>
          <th style="text-align:right;">Running Balance</th>
        </tr>
      </thead>
      <tbody>
        ${walletRows}
      </tbody>
    </table>
    <div class="footnote">
      Wallet entries are read-only ledger records. A manual deposit recorded by Admin is a Top-up; corrections are Manual Adjustment entries.
    </div>
  </div>
  `
      : ''
  }

  ${
    incCredit
      ? `
  <div class="section-card">
    <div class="section-header">
      <span>Credit Usage</span>
      <span style="font-size:10px;color:#0267B8;">Assigned by Aero Wing Admin</span>
    </div>
    <div style="padding:12px;display:grid;grid-template-columns:repeat(4,1fr);gap:10px;">
      <div style="background:#F8FAFC;border:1px solid #E6EAF0;border-radius:6px;padding:8px 10px;">
        <div style="font-size:10px;color:#64748B;">Credit Limit</div>
        <div style="font-weight:700;color:#141B28;">Limit configured</div>
      </div>
      <div style="background:#F8FAFC;border:1px solid #E6EAF0;border-radius:6px;padding:8px 10px;">
        <div style="font-size:10px;color:#64748B;">Used Credit</div>
        <div style="font-weight:700;color:#141B28;">Usage available</div>
      </div>
      <div style="background:#F8FAFC;border:1px solid #E6EAF0;border-radius:6px;padding:8px 10px;">
        <div style="font-size:10px;color:#64748B;">Available Credit</div>
        <div style="font-weight:700;color:#141B28;">Available credit tracked</div>
      </div>
      <div style="background:#F8FAFC;border:1px solid #E6EAF0;border-radius:6px;padding:8px 10px;">
        <div style="font-size:10px;color:#64748B;">Outstanding Balance</div>
        <div style="font-weight:700;color:#141B28;">Outstanding balance tracked</div>
      </div>
    </div>
    <div class="footnote">
      Credit Limit is assigned by Aero Wing Admin. Exact amounts are not included in this design-preview dataset.
    </div>
  </div>
  `
      : ''
  }

  ${
    incCommissions
      ? `
  <div class="section-card">
    <div class="section-header">
      <span>Commissions (${commissions.length})</span>
      <span style="font-size:10px;color:#0267B8;">Pending · Earned · Settled</span>
    </div>
    <table>
      <thead>
        <tr>
          <th>Booking</th>
          <th>Service</th>
          <th>Status</th>
          <th>Commission</th>
          <th>Settlement / Impact</th>
        </tr>
      </thead>
      <tbody>
        ${commissionRows}
      </tbody>
    </table>
    <div class="footnote">
      Commission statuses: Pending, Earned, Settled. A cancellation or refund reverses commission — shown as an impact, not a status.
    </div>
  </div>
  `
      : ''
  }

  ${
    incClosing
      ? `
  <div class="closing-box">
    <div>
      <div style="font-size:13px;font-weight:800;color:#012A5E;margin-bottom:2px;">Closing Balance</div>
      <div style="color:#64748B;font-size:10px;">${summary.closingBalanceNote}</div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:13px;font-weight:800;color:#141B28;">${summary.closingBalanceStatus}</div>
      <div style="font-size:10px;font-weight:700;color:#8F6B00;">${summary.formattedPeriod}</div>
    </div>
  </div>
  `
      : ''
  }

  <div class="footer-doc">
    <div>AeroWing Agent Portal · M2.10 Agent Statements · Partner Verification</div>
    <div>Design prototype — no accounting, PDF or export service is called.</div>
  </div>
</body>
</html>`
}
