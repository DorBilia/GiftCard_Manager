'use client'

import { CreditCard } from 'lucide-react'
import { GiftCardItem } from '@/components/gift-card-item'
import type { GiftCard } from '@/lib/gift-card-data'

interface GiftCardGridProps {
  cards: GiftCard[]
  onCardClick: (card: GiftCard) => void
  onCardEdit?: (card: GiftCard) => void
  onCardDelete?: (card: GiftCard) => void
  variant?: 'active' | 'history'
  emptyMessage?: string
}

export function GiftCardGrid({ 
  cards, 
  onCardClick, 
  onCardEdit,
  onCardDelete,
  variant = 'active',
  emptyMessage = 'No cards found'
}: GiftCardGridProps) {
  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <CreditCard className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="mt-4 text-lg text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <GiftCardItem
          key={card.id}
          card={card}
          onClick={() => onCardClick(card)}
          onEdit={(e) => {
            e.stopPropagation()
            onCardEdit?.(card)
          }}
          onDelete={(e) => {
            e.stopPropagation()
            onCardDelete?.(card)
          }}
          variant={variant}
        />
      ))}
    </div>
  )
}
