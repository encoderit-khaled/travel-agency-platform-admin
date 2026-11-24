export type BookingServiceType =
  | 'Bus / Train'
  | 'Flight'
  | 'Travel Insurance'
  | 'Hotel'
  | 'eSIM'
  | 'Travel Package'
  | 'Activity'
  | 'Car Rental'

export type BookingStatus =
  | 'Confirmed'
  | 'Ticketed'
  | 'Issued'
  | 'Pending'
  | 'Cancelled'
  | 'Refunded'
  | 'Failed'

export type DocumentStatus =
  | 'Voucher available'
  | 'E-ticket available'
  | 'Voucher / document available'
  | 'Not available yet'
  | 'Not available'

export type CreatedBySource = 'Parent Agent' | 'Sub-agent'

export interface AgentBookingItem {
  id: string
  ref: string
  customer: string
  customerEmail: string
  customerPhone: string
  service: BookingServiceType
  travelDate: string
  createdByName: string
  createdBySource: CreatedBySource
  status: BookingStatus
  documentStatus: DocumentStatus
  documentType: 'voucher' | 'eticket' | 'document' | 'none'
  amount: string
  pnr: string
  routeOrItem: string
  cabinOrRoom?: string
  notes?: string
}

export const AGENT_BOOKING_HISTORY_DATA: AgentBookingItem[] = [
  {
    id: '1',
    ref: 'AW-DEMO-BT-009',
    customer: 'Maliha Khan',
    customerEmail: 'maliha.khan@example.com',
    customerPhone: '+880 1711 909100',
    service: 'Bus / Train',
    travelDate: '16 Dec 2026',
    createdByName: 'Skyline Demo Travels Ltd',
    createdBySource: 'Parent Agent',
    status: 'Confirmed',
    documentStatus: 'Voucher available',
    documentType: 'voucher',
    amount: 'BDT 3,200',
    pnr: 'BT9021',
    routeOrItem: 'Dhaka ➔ Chittagong (Green Line Express AC)',
    cabinOrRoom: 'Class 1 Business Seat 14A, 14B',
  },
  {
    id: '2',
    ref: 'AW-DEMO-FL-001',
    customer: 'Amina Rahman',
    customerEmail: 'amina.rahman@example.com',
    customerPhone: '+880 1711 234567',
    service: 'Flight',
    travelDate: '18 Dec 2026',
    createdByName: 'Mirpur Desk',
    createdBySource: 'Sub-agent',
    status: 'Ticketed',
    documentStatus: 'E-ticket available',
    documentType: 'eticket',
    amount: 'BDT 42,500',
    pnr: 'PK782D',
    routeOrItem: 'DAC ➔ DXB (Emirates EK-585)',
    cabinOrRoom: 'Economy Classic (Seat 24K)',
  },
  {
    id: '3',
    ref: 'AW-DEMO-TI-010',
    customer: 'Tasnim Karim',
    customerEmail: 'tasnim.karim@example.com',
    customerPhone: '+880 1912 345671',
    service: 'Travel Insurance',
    travelDate: '19 Dec 2026',
    createdByName: 'Skyline Demo Travels Ltd',
    createdBySource: 'Parent Agent',
    status: 'Issued',
    documentStatus: 'Voucher / document available',
    documentType: 'document',
    amount: 'BDT 4,500',
    pnr: 'TI1044',
    routeOrItem: 'Worldwide Comprehensive Travel Shield (30 Days)',
    cabinOrRoom: 'Coverage: Medical & Flight Interruption',
  },
  {
    id: '4',
    ref: 'AW-DEMO-FL-006',
    customer: 'Mahin Chowdhury',
    customerEmail: 'mahin.chowdhury@example.com',
    customerPhone: '+880 1812 789012',
    service: 'Flight',
    travelDate: '20 Dec 2026',
    createdByName: 'Banani Desk',
    createdBySource: 'Sub-agent',
    status: 'Confirmed',
    documentStatus: 'Not available yet',
    documentType: 'none',
    amount: 'BDT 78,900',
    pnr: 'BG201B',
    routeOrItem: 'DAC ➔ LHR (Biman Bangladesh BG-201)',
    cabinOrRoom: 'Economy Saver',
  },
  {
    id: '5',
    ref: 'AW-DEMO-HT-002',
    customer: 'Karim Hasan',
    customerEmail: 'karim.hasan@example.com',
    customerPhone: '+880 1812 345678',
    service: 'Hotel',
    travelDate: '22 Dec 2026',
    createdByName: 'Mirpur Desk',
    createdBySource: 'Sub-agent',
    status: 'Confirmed',
    documentStatus: 'Voucher available',
    documentType: 'voucher',
    amount: 'BDT 28,000',
    pnr: 'HT9931',
    routeOrItem: 'Grand Hyatt Dubai (Deluxe King Room, 3 Nights)',
    cabinOrRoom: 'Deluxe King Room · City View · Breakfast Included',
  },
  {
    id: '6',
    ref: 'AW-DEMO-HT-007',
    customer: 'Tania Sultana',
    customerEmail: 'tania.sultana@example.com',
    customerPhone: '+880 1512 890123',
    service: 'Hotel',
    travelDate: '28 Dec 2026',
    createdByName: 'Banani Desk',
    createdBySource: 'Sub-agent',
    status: 'Issued',
    documentStatus: 'Voucher available',
    documentType: 'voucher',
    amount: 'BDT 35,400',
    pnr: 'HT7720',
    routeOrItem: 'Marina Bay Sands Singapore (Deluxe Harbor View, 2 Nights)',
    cabinOrRoom: 'Deluxe Harbor View · King Bed · Infinity Pool Access',
  },
  {
    id: '7',
    ref: 'AW-DEMO-ES-008',
    customer: 'Rafi Ahmed',
    customerEmail: 'rafi.ahmed@example.com',
    customerPhone: '+880 1612 456780',
    service: 'eSIM',
    travelDate: '02 Jan 2027',
    createdByName: 'Uttara Desk',
    createdBySource: 'Sub-agent',
    status: 'Issued',
    documentStatus: 'Voucher available',
    documentType: 'voucher',
    amount: 'BDT 2,800',
    pnr: 'ES0811',
    routeOrItem: 'Global Roam eSIM 10GB 15-Day Data Pack',
    cabinOrRoom: 'Coverage: UAE, Singapore, Malaysia, Thailand',
  },
  {
    id: '8',
    ref: 'AW-DEMO-PK-003',
    customer: 'Nadia Islam',
    customerEmail: 'nadia.islam@example.com',
    customerPhone: '+880 1913 456789',
    service: 'Travel Package',
    travelDate: '05 Jan 2027',
    createdByName: 'Mirpur Desk',
    createdBySource: 'Sub-agent',
    status: 'Confirmed',
    documentStatus: 'Voucher available',
    documentType: 'voucher',
    amount: 'BDT 85,000',
    pnr: 'PK4420',
    routeOrItem: 'Maldives Paradise Island Resort 4D/3N All-Inclusive',
    cabinOrRoom: 'Water Villa · Return Speedboat Transfer Included',
  },
  {
    id: '9',
    ref: 'AW-DEMO-AC-011',
    customer: 'Nafisa Rahman',
    customerEmail: 'nafisa.rahman@example.com',
    customerPhone: '+880 1713 567891',
    service: 'Activity',
    travelDate: '08 Jan 2027',
    createdByName: 'Skyline Demo Travels Ltd',
    createdBySource: 'Parent Agent',
    status: 'Refunded',
    documentStatus: 'Not available',
    documentType: 'none',
    amount: 'BDT 15,600',
    pnr: 'AC9100',
    routeOrItem: 'Bangkok Chao Phraya Princess Dinner Cruise (Family of 4)',
    cabinOrRoom: 'Upper Deck Seating with International Buffet',
  },
  {
    id: '10',
    ref: 'AW-DEMO-AC-004',
    customer: 'Samiul Ahmed',
    customerEmail: 'samiul.ahmed@example.com',
    customerPhone: '+880 1614 567890',
    service: 'Activity',
    travelDate: '10 Jan 2027',
    createdByName: 'Mirpur Desk',
    createdBySource: 'Sub-agent',
    status: 'Pending',
    documentStatus: 'Not available yet',
    documentType: 'none',
    amount: 'BDT 12,400',
    pnr: 'AC1105',
    routeOrItem: 'Dubai Desert Safari with BBQ Dinner & Dune Bashing',
    cabinOrRoom: '4x4 Desert Camp with Live Entertainment & Falconry',
  },
  {
    id: '11',
    ref: 'AW-DEMO-FL-012',
    customer: 'Imran Hossain',
    customerEmail: 'imran.hossain@example.com',
    customerPhone: '+880 1714 678902',
    service: 'Flight',
    travelDate: '12 Jan 2027',
    createdByName: 'Skyline Demo Travels Ltd',
    createdBySource: 'Parent Agent',
    status: 'Failed',
    documentStatus: 'Not available',
    documentType: 'none',
    amount: 'BDT 54,200',
    pnr: 'TG322F',
    routeOrItem: 'DAC ➔ BKK (Thai Airways TG-322)',
    cabinOrRoom: 'Economy Special · Airline API timeout',
  },
  {
    id: '12',
    ref: 'AW-DEMO-CR-005',
    customer: 'Farhana Noor',
    customerEmail: 'farhana.noor@example.com',
    customerPhone: '+880 1515 678901',
    service: 'Car Rental',
    travelDate: '14 Jan 2027',
    createdByName: 'Mirpur Desk',
    createdBySource: 'Sub-agent',
    status: 'Cancelled',
    documentStatus: 'Not available',
    documentType: 'none',
    amount: 'BDT 8,500',
    pnr: 'CR9021',
    routeOrItem: 'Toyota Prado SUV Airport Transfer & Full Day Chauffeur',
    cabinOrRoom: 'SUV 7-Seater with English-speaking Chauffeur',
  },
]
