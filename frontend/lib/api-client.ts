const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000'

export type BackendGiftCardOverview = {
  id: string
  name: string
  balance: number
  expr_date: string
}

export type BackendRemovedGiftCardOverview = {
  id: string
  name: string
  removed_reason: string
  balance?: number
  expr_date?: string
}

export type BackendCompleteGiftCard = {
  id: string
  name: string
  balance: number
  expr_date: string
  card_number: string
  details?: string | null
}

export type BackendPurchase = {
  id: string
  card_id?: string
  amount: number
  date: string
  details?: string | null
  store?: string | null
}

export type BackendGiftCardPurchasesResponse = {
  card_id: string
  purchases: BackendPurchase[]
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(API_BASE + path, init)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API error ${res.status}: ${text}`)
  }
  return res.json() as Promise<T>
}

export async function fetchActiveCards(): Promise<BackendGiftCardOverview[]> {
  return request<BackendGiftCardOverview[]>('/api/gift_card/active_gift_cards')
}

export async function fetchHistoricalCards(): Promise<BackendRemovedGiftCardOverview[]> {
  return request<BackendRemovedGiftCardOverview[]>('/api/gift_card/historical_gift_cards')
}

export async function fetchCardDetail(cardId: string): Promise<BackendCompleteGiftCard> {
  return request<BackendCompleteGiftCard>(`/api/gift_card/gift_cards/${encodeURIComponent(cardId)}`)
}

export async function fetchPurchaseHistory(cardId: string): Promise<BackendGiftCardPurchasesResponse> {
  return request<BackendGiftCardPurchasesResponse>(`/api/purchase/${encodeURIComponent(cardId)}/history`)
}

export async function createPurchase(cardId: string, payload: {
  card_id: string
  amount: number
  date: string
  details?: string
  store?: string
}): Promise<BackendPurchase> {
  return request<BackendPurchase>(`/api/purchase/${encodeURIComponent(cardId)}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function createGiftCard(payload: {
  name: string
  card_number: string
  balance: number
  expr_date: string
  details?: string
}): Promise<any> {
  return request('/api/gift_card/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}
