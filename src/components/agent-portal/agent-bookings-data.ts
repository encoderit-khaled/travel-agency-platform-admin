export type AgentBookingServiceType =
  | 'Flight'
  | 'Hotel'
  | 'Travel Package'
  | 'Activity'
  | 'Car Rental'
  | 'eSIM'
  | 'Bus / Train'
  | 'Travel Insurance'

export type AgentBookingStatus =
  | 'Confirmed'
  | 'Ticketed'
  | 'Issued'
  | 'Pending'
  | 'Refunded'
  | 'Failed'
  | 'Cancelled'

export type AgentBookingSource = 'All' | 'Parent Agent' | 'Sub-agent'

export interface AgentBookingItem {
  id: string
  ref: string
  customer: string
  customerEmail: string
  customerPhone: string
  onBehalf: boolean
  service: AgentBookingServiceType
  travelDate: string
  travelDateRaw: string
  createdBy: string
  createdByType: 'Parent Agent' | 'Sub-agent'
  status: AgentBookingStatus
  documentStatus:
    | 'Voucher available'
    | 'E-ticket available'
    | 'Voucher / document available'
    | 'Not available yet'
    | 'Not available'
  documentAction?: 'View Voucher' | 'View E-ticket' | 'View Document'
  documentType?: 'eticket' | 'voucher' | 'insurance'
  pnr?: string
  routeOrItem: string
  supplier?: string
  fareAmount: string
  markupAmount: string
  totalAmount: string
  bookingDate: string
  passengerCount?: number
  cabinOrRoom?: string
}

export const AGENT_BOOKINGS_DATA: AgentBookingItem[] = [
  {
    id: 'bkg-1',
    ref: 'AW-DEMO-BT-009',
    customer: 'Maliha Khan',
    customerEmail: 'maliha.khan@example.com',
    customerPhone: '+880 1712 345678',
    onBehalf: true,
    service: 'Bus / Train',
    travelDate: '16 Dec 2026',
    travelDateRaw: '2026-12-16',
    createdBy: 'Skyline Demo Travels Ltd',
    createdByType: 'Parent Agent',
    status: 'Confirmed',
    documentStatus: 'Voucher available',
    documentAction: 'View Voucher',
    documentType: 'voucher',
    pnr: 'BT-9021',
    routeOrItem: 'Dhaka ➔ Chittagong (Green Line Scania Business Class)',
    supplier: 'Green Line Paribahan',
    fareAmount: 'BDT 2,200',
    markupAmount: 'BDT 200',
    totalAmount: 'BDT 2,400',
    bookingDate: '01 Dec 2026',
    passengerCount: 1,
  },
  {
    id: 'bkg-2',
    ref: 'AW-DEMO-FL-001',
    customer: 'Amina Rahman',
    customerEmail: 'amina.rahman@example.com',
    customerPhone: '+880 1711 234567',
    onBehalf: true,
    service: 'Flight',
    travelDate: '18 Dec 2026',
    travelDateRaw: '2026-12-18',
    createdBy: 'Mirpur Desk',
    createdByType: 'Sub-agent',
    status: 'Ticketed',
    documentStatus: 'E-ticket available',
    documentAction: 'View E-ticket',
    documentType: 'eticket',
    pnr: 'PK782D',
    routeOrItem: 'DAC ➔ DXB (Emirates EK-585 Economy Classic)',
    supplier: 'Emirates Airlines',
    fareAmount: 'BDT 38,500',
    markupAmount: 'BDT 4,000',
    totalAmount: 'BDT 42,500',
    bookingDate: '02 Dec 2026',
    passengerCount: 1,
    cabinOrRoom: 'Economy Class (T)',
  },
  {
    id: 'bkg-3',
    ref: 'AW-DEMO-TI-010',
    customer: 'Tasnim Karim',
    customerEmail: 'tasnim.karim@example.com',
    customerPhone: '+880 1819 876543',
    onBehalf: true,
    service: 'Travel Insurance',
    travelDate: '19 Dec 2026',
    travelDateRaw: '2026-12-19',
    createdBy: 'Skyline Demo Travels Ltd',
    createdByType: 'Parent Agent',
    status: 'Issued',
    documentStatus: 'Voucher / document available',
    documentAction: 'View Document',
    documentType: 'insurance',
    pnr: 'TI-44810',
    routeOrItem: 'Worldwide Comprehensive Travel Protection (30 Days)',
    supplier: 'Allianz Global Assistance',
    fareAmount: 'BDT 5,800',
    markupAmount: 'BDT 700',
    totalAmount: 'BDT 6,500',
    bookingDate: '03 Dec 2026',
    passengerCount: 1,
  },
  {
    id: 'bkg-4',
    ref: 'AW-DEMO-FL-006',
    customer: 'Mahin Chowdhury',
    customerEmail: 'mahin.c@example.com',
    customerPhone: '+880 1914 112233',
    onBehalf: true,
    service: 'Flight',
    travelDate: '20 Dec 2026',
    travelDateRaw: '2026-12-20',
    createdBy: 'Banani Desk',
    createdByType: 'Sub-agent',
    status: 'Confirmed',
    documentStatus: 'Not available yet',
    pnr: 'BG-8402',
    routeOrItem: 'DAC ➔ BKK (Biman Bangladesh Airlines BG-388)',
    supplier: 'Biman Bangladesh Airlines',
    fareAmount: 'BDT 31,000',
    markupAmount: 'BDT 2,500',
    totalAmount: 'BDT 33,500',
    bookingDate: '04 Dec 2026',
    passengerCount: 1,
    cabinOrRoom: 'Economy Saver',
  },
  {
    id: 'bkg-5',
    ref: 'AW-DEMO-HT-002',
    customer: 'Karim Hasan',
    customerEmail: 'karim.hasan@example.com',
    customerPhone: '+880 1812 345678',
    onBehalf: true,
    service: 'Hotel',
    travelDate: '22 Dec 2026',
    travelDateRaw: '2026-12-22',
    createdBy: 'Mirpur Desk',
    createdByType: 'Sub-agent',
    status: 'Confirmed',
    documentStatus: 'Voucher available',
    documentAction: 'View Voucher',
    documentType: 'voucher',
    pnr: 'HT-9931',
    routeOrItem: 'Grand Hyatt Dubai (Deluxe King Room, 3 Nights)',
    supplier: 'Hyatt Hotels',
    fareAmount: 'BDT 25,500',
    markupAmount: 'BDT 2,500',
    totalAmount: 'BDT 28,000',
    bookingDate: '05 Dec 2026',
    passengerCount: 2,
    cabinOrRoom: 'Deluxe King City View',
  },
  {
    id: 'bkg-6',
    ref: 'AW-DEMO-HT-007',
    customer: 'Tania Sultana',
    customerEmail: 'tania.sultana@example.com',
    customerPhone: '+880 1715 998877',
    onBehalf: true,
    service: 'Hotel',
    travelDate: '28 Dec 2026',
    travelDateRaw: '2026-12-28',
    createdBy: 'Banani Desk',
    createdByType: 'Sub-agent',
    status: 'Issued',
    documentStatus: 'Voucher available',
    documentAction: 'View Voucher',
    documentType: 'voucher',
    pnr: 'HT-10822',
    routeOrItem: 'The Berkeley Hotel Pratunam (Premier Room, 4 Nights)',
    supplier: 'Berkeley Bangkok',
    fareAmount: 'BDT 34,000',
    markupAmount: 'BDT 3,200',
    totalAmount: 'BDT 37,200',
    bookingDate: '06 Dec 2026',
    passengerCount: 2,
    cabinOrRoom: 'Premier Double Bed',
  },
  {
    id: 'bkg-7',
    ref: 'AW-DEMO-ES-008',
    customer: 'Rafi Ahmed',
    customerEmail: 'rafi.ahmed@example.com',
    customerPhone: '+880 1618 334455',
    onBehalf: true,
    service: 'eSIM',
    travelDate: '02 Jan 2027',
    travelDateRaw: '2027-01-02',
    createdBy: 'Uttara Desk',
    createdByType: 'Sub-agent',
    status: 'Issued',
    documentStatus: 'Voucher available',
    documentAction: 'View Voucher',
    documentType: 'voucher',
    pnr: 'ES-7719',
    routeOrItem: 'Middle East & Asia Regional eSIM (15 Days / 10 GB)',
    supplier: 'Airalo Global Net',
    fareAmount: 'BDT 3,200',
    markupAmount: 'BDT 400',
    totalAmount: 'BDT 3,600',
    bookingDate: '08 Dec 2026',
    passengerCount: 1,
  },
  {
    id: 'bkg-8',
    ref: 'AW-DEMO-PK-003',
    customer: 'Nadia Islam',
    customerEmail: 'nadia.islam@example.com',
    customerPhone: '+880 1913 456789',
    onBehalf: true,
    service: 'Travel Package',
    travelDate: '05 Jan 2027',
    travelDateRaw: '2027-01-05',
    createdBy: 'Mirpur Desk',
    createdByType: 'Sub-agent',
    status: 'Confirmed',
    documentStatus: 'Voucher available',
    documentAction: 'View Voucher',
    documentType: 'voucher',
    pnr: 'PK-4420',
    routeOrItem: 'Maldives Paradise Island Resort 4D/3N All-Inclusive',
    supplier: 'Villa Nautica Maldives',
    fareAmount: 'BDT 76,000',
    markupAmount: 'BDT 9,000',
    totalAmount: 'BDT 85,000',
    bookingDate: '10 Dec 2026',
    passengerCount: 2,
    cabinOrRoom: 'Water Villa All-Inclusive',
  },
  {
    id: 'bkg-9',
    ref: 'AW-DEMO-AC-011',
    customer: 'Nafisa Rahman',
    customerEmail: 'nafisa.rahman@example.com',
    customerPhone: '+880 1719 556677',
    onBehalf: true,
    service: 'Activity',
    travelDate: '08 Jan 2027',
    travelDateRaw: '2027-01-08',
    createdBy: 'Skyline Demo Travels Ltd',
    createdByType: 'Parent Agent',
    status: 'Refunded',
    documentStatus: 'Not available',
    pnr: 'AC-1029',
    routeOrItem: 'Burj Khalifa At The Top 124th Floor Sky Entry Pass',
    supplier: 'Emaar Entertainment',
    fareAmount: 'BDT 8,500',
    markupAmount: 'BDT 800',
    totalAmount: 'BDT 9,300',
    bookingDate: '12 Dec 2026',
    passengerCount: 2,
  },
  {
    id: 'bkg-10',
    ref: 'AW-DEMO-AC-004',
    customer: 'Samiul Ahmed',
    customerEmail: 'samiul.ahmed@example.com',
    customerPhone: '+880 1614 567890',
    onBehalf: true,
    service: 'Activity',
    travelDate: '10 Jan 2027',
    travelDateRaw: '2027-01-10',
    createdBy: 'Mirpur Desk',
    createdByType: 'Sub-agent',
    status: 'Pending',
    documentStatus: 'Not available yet',
    pnr: 'AC-3091',
    routeOrItem: 'Dubai Desert Safari with BBQ Dinner & Dune Bashing',
    supplier: 'Arabian Adventures',
    fareAmount: 'BDT 12,000',
    markupAmount: 'BDT 1,200',
    totalAmount: 'BDT 13,200',
    bookingDate: '14 Dec 2026',
    passengerCount: 2,
  },
  {
    id: 'bkg-11',
    ref: 'AW-DEMO-FL-012',
    customer: 'Imran Hossain',
    customerEmail: 'imran.hossain@example.com',
    customerPhone: '+880 1817 667788',
    onBehalf: true,
    service: 'Flight',
    travelDate: '12 Jan 2027',
    travelDateRaw: '2027-01-12',
    createdBy: 'Skyline Demo Travels Ltd',
    createdByType: 'Parent Agent',
    status: 'Failed',
    documentStatus: 'Not available',
    pnr: 'SQ-9940',
    routeOrItem: 'DAC ➔ SIN (Singapore Airlines SQ-447 Economy)',
    supplier: 'Singapore Airlines',
    fareAmount: 'BDT 46,000',
    markupAmount: 'BDT 3,500',
    totalAmount: 'BDT 49,500',
    bookingDate: '15 Dec 2026',
    passengerCount: 1,
    cabinOrRoom: 'Economy Value',
  },
  {
    id: 'bkg-12',
    ref: 'AW-DEMO-CR-005',
    customer: 'Farhana Noor',
    customerEmail: 'farhana.noor@example.com',
    customerPhone: '+880 1718 223344',
    onBehalf: true,
    service: 'Car Rental',
    travelDate: '14 Jan 2027',
    travelDateRaw: '2027-01-14',
    createdBy: 'Mirpur Desk',
    createdByType: 'Sub-agent',
    status: 'Cancelled',
    documentStatus: 'Not available',
    pnr: 'CR-5541',
    routeOrItem: 'Dubai Airport Chauffeur Sedan Pick-up & Drop',
    supplier: 'Sixt Car Rental',
    fareAmount: 'BDT 7,200',
    markupAmount: 'BDT 800',
    totalAmount: 'BDT 8,000',
    bookingDate: '16 Dec 2026',
    passengerCount: 2,
  },
]

export const AGENT_BOOKING_KPI_DATA = {
  totalBookings: 12,
  totalBookingsSubtext: 'All parent & sub-agent bookings',
  confirmedTicketed: 9,
  confirmedTicketedSubtext: 'Ready for travel or completed',
  grossBookingValue: '$42,650',
  grossBookingValueSubtext: 'Inclusive of markup & taxes',
  documentsAvailable: 7,
  documentsAvailableSubtext: 'E-tickets and vouchers ready',
  needsAttention: 2,
  needsAttentionSubtext: 'Pending or failed bookings',
}

export const BOOKING_STATUS_CHIPS: {
  status: 'all' | AgentBookingStatus
  label: string
  count: number
}[] = [
  { status: 'all', label: 'All bookings', count: 12 },
  { status: 'Pending', label: 'Pending', count: 1 },
  { status: 'Confirmed', label: 'Confirmed', count: 4 },
  { status: 'Ticketed', label: 'Ticketed / Issued', count: 4 }, // Covers Ticketed (1) + Issued (3)
  { status: 'Cancelled', label: 'Cancelled', count: 1 },
  { status: 'Refunded', label: 'Refunded', count: 1 },
  { status: 'Failed', label: 'Failed', count: 1 },
]

export const INITIAL_AGENT_BOOKINGS = AGENT_BOOKINGS_DATA
