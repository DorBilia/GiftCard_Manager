export interface PurchaseHistory {
  id: string
  date: string
  merchant: string
  amount: number
  description: string
}

export interface GiftCard {
  id: string
  name: string
  balance: number
  originalBalance: number
  expirationDate: string
  cardNumber: string
  cardDetails: string
  isActive: boolean
  historyReason?: 'expired' | 'empty'
  purchaseHistory: PurchaseHistory[]
}

// Backend response types and mapping helpers
export interface BackendGiftCardOverview {
  id: string
  name: string
  balance: number
  expr_date: string
}

export interface BackendRemovedGiftCardOverview {
  id: string
  name: string
  removed_reason: string
  balance?: number
  expr_date?: string
}

export interface BackendCompleteGiftCard {
  id: string
  name: string
  balance: number
  expr_date: string
  card_number: string
  details?: string | null
}

export interface BackendPurchase {
  id: string
  amount: number
  date: string
  details?: string | null
  store?: string | null
}

export interface BackendGiftCardPurchasesResponse {
  card_id: string
  purchases: BackendPurchase[]
}

export function convertBackendPurchase(p: BackendPurchase): PurchaseHistory {
  return {
    id: p.id,
    date: p.date,
    merchant: p.store ?? '',
    amount: p.amount,
    description: p.details ?? '',
  }
}

export function convertBackendOverviewToGiftCard(b: BackendGiftCardOverview): GiftCard {
  return {
    id: b.id,
    name: b.name,
    balance: b.balance,
    originalBalance: b.balance, // keep originalBalance same as current balance for now
    expirationDate: b.expr_date,
    cardNumber: '',
    cardDetails: '',
    isActive: true,
    purchaseHistory: [],
  }
}

export function convertBackendRemovedToGiftCard(b: BackendRemovedGiftCardOverview): GiftCard {
  const reason = b.removed_reason
  let historyReason: 'expired' | 'empty' | undefined = undefined
  if (reason) {
    const r = reason.toLowerCase()
    if (r.includes('expired')) historyReason = 'expired'
    else if (r.includes('empty')) historyReason = 'empty'
  }
  return {
    id: b.id,
    name: b.name,
    balance: b.balance ?? 0,
    originalBalance: b.balance ?? 0,
    expirationDate: b.expr_date ?? '',
    cardNumber: '',
    cardDetails: '',
    isActive: false,
    historyReason,
    purchaseHistory: [],
  }
}

export function convertBackendCompleteToGiftCard(b: BackendCompleteGiftCard, purchases: BackendPurchase[] = []): GiftCard {
  return {
    id: b.id,
    name: b.name,
    balance: b.balance,
    originalBalance: b.balance,
    expirationDate: b.expr_date,
    cardNumber: b.card_number,
    cardDetails: b.details ?? '',
    isActive: true,
    purchaseHistory: purchases.map(convertBackendPurchase),
  }
}

export const giftCards: GiftCard[] = [
  {
    id: '1',
    name: 'Amazon',
    balance: 150.00,
    originalBalance: 200.00,
    expirationDate: '2026-12-31',
    cardNumber: '4532-8901-2345-6789',
    cardDetails: 'Use for any Amazon purchase. Can be combined with other payment methods.',
    isActive: true,
    purchaseHistory: [
      { id: 'p1', date: '2026-03-15', merchant: 'Amazon Books', amount: 25.99, description: 'The Art of Programming' },
      { id: 'p2', date: '2026-03-20', merchant: 'Amazon Electronics', amount: 24.01, description: 'USB-C Cable 3-Pack' },
    ]
  },
  {
    id: '2',
    name: 'Starbucks',
    balance: 45.50,
    originalBalance: 50.00,
    expirationDate: '2027-06-15',
    cardNumber: '6011-2345-6789-0123',
    cardDetails: 'Earn stars with every purchase. Valid at all participating Starbucks locations.',
    isActive: true,
    purchaseHistory: [
      { id: 'p3', date: '2026-04-10', merchant: 'Starbucks Downtown', amount: 4.50, description: 'Grande Latte' },
    ]
  },
  {
    id: '3',
    name: 'Target',
    balance: 75.25,
    originalBalance: 100.00,
    expirationDate: '2026-09-30',
    cardNumber: '5500-1234-5678-9012',
    cardDetails: 'Redeemable at Target stores and Target.com. Cannot be used for gift card purchases.',
    isActive: true,
    purchaseHistory: [
      { id: 'p4', date: '2026-02-28', merchant: 'Target Online', amount: 15.75, description: 'Home Decor Items' },
      { id: 'p5', date: '2026-03-05', merchant: 'Target Store #1234', amount: 9.00, description: 'Cleaning Supplies' },
    ]
  },
  {
    id: '4',
    name: 'Best Buy',
    balance: 200.00,
    originalBalance: 200.00,
    expirationDate: '2027-03-01',
    cardNumber: '4916-7823-4567-8901',
    cardDetails: 'Valid for all Best Buy products including electronics, appliances, and services.',
    isActive: true,
    purchaseHistory: []
  },
  {
    id: '5',
    name: 'Apple Store',
    balance: 89.00,
    originalBalance: 150.00,
    expirationDate: '2026-11-20',
    cardNumber: '3782-8224-6310-0045',
    cardDetails: 'Redeemable for Apple products, accessories, apps, games, music, movies, and more.',
    isActive: true,
    purchaseHistory: [
      { id: 'p6', date: '2026-01-15', merchant: 'Apple Online Store', amount: 61.00, description: 'AirPods Case' },
    ]
  },
  {
    id: '6',
    name: 'Netflix',
    balance: 0,
    originalBalance: 50.00,
    expirationDate: '2026-01-01',
    cardNumber: '4024-0071-2345-6780',
    cardDetails: 'Apply to your Netflix account for streaming access.',
    isActive: false,
    historyReason: 'empty',
    purchaseHistory: [
      { id: 'p7', date: '2025-10-01', merchant: 'Netflix', amount: 15.99, description: 'Monthly Subscription' },
      { id: 'p8', date: '2025-11-01', merchant: 'Netflix', amount: 15.99, description: 'Monthly Subscription' },
      { id: 'p9', date: '2025-12-01', merchant: 'Netflix', amount: 18.02, description: 'Monthly Subscription (Final)' },
    ]
  },
  {
    id: '7',
    name: 'Spotify',
    balance: 12.50,
    originalBalance: 30.00,
    expirationDate: '2025-06-30',
    cardNumber: '5425-2334-5678-9012',
    cardDetails: 'Redeem for Spotify Premium subscription.',
    isActive: false,
    historyReason: 'expired',
    purchaseHistory: [
      { id: 'p10', date: '2025-04-15', merchant: 'Spotify', amount: 9.99, description: 'Premium Subscription' },
      { id: 'p11', date: '2025-05-15', merchant: 'Spotify', amount: 7.51, description: 'Premium Subscription (Partial)' },
    ]
  },
  {
    id: '8',
    name: 'Old Navy',
    balance: 0,
    originalBalance: 75.00,
    expirationDate: '2025-12-31',
    cardNumber: '4532-1111-2222-3333',
    cardDetails: 'Valid at Old Navy, Gap, and Banana Republic stores.',
    isActive: false,
    historyReason: 'empty',
    purchaseHistory: [
      { id: 'p12', date: '2025-08-20', merchant: 'Old Navy Store', amount: 45.00, description: 'Summer Clothing' },
      { id: 'p13', date: '2025-10-15', merchant: 'Gap Online', amount: 30.00, description: 'Fall Jacket' },
    ]
  }
]
