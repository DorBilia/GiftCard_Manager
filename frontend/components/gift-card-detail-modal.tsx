'use client'

import { useState, useEffect } from 'react'
import { CreditCard, Calendar, Hash, FileText, History, ArrowLeft } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { GiftCard } from '@/lib/gift-card-data'
import { fetchCardDetail, fetchPurchaseHistory } from '@/lib/api-client'
import { convertBackendCompleteToGiftCard } from '@/lib/gift-card-data'

interface GiftCardDetailModalProps {
  card: GiftCard | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GiftCardDetailModalV2({ card, open, onOpenChange }: GiftCardDetailModalProps) {
  const [showHistory, setShowHistory] = useState(false)
  const [detailedCard, setDetailedCard] = useState<GiftCard | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [detailsError, setDetailsError] = useState<string | null>(null)
  useEffect(() => {
    let mounted = true
    if (!open || !card) {
      setDetailedCard(null)
      return
    }

    ;(async () => {
      setLoadingDetails(true)
      setDetailsError(null)
      try {
        const [detail, history] = await Promise.all([
          fetchCardDetail(card.id),
          fetchPurchaseHistory(card.id),
        ])
        if (!mounted) return
        const mapped = convertBackendCompleteToGiftCard(detail, history.purchases)
        setDetailedCard(mapped)
      } catch (e) {
        console.error(e)
        setDetailsError('Failed to load card details')
      } finally {
        if (mounted) setLoadingDetails(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [open, card])

  if (!card) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const handleClose = (newOpen: boolean) => {
    if (!newOpen) {
      setShowHistory(false)
    }
    onOpenChange(newOpen)
  }

  const displayCard = detailedCard ?? card

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md border-border bg-card sm:max-w-lg">
        {loadingDetails ? (
          <div className="py-8 text-center">Loading card details...</div>
        ) : detailsError ? (
          <div className="py-8 text-center text-destructive">{detailsError}</div>
        ) : showHistory ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowHistory(false)}
                  className="h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <DialogTitle className="text-xl">Purchase History</DialogTitle>
              </div>
            </DialogHeader>

            <div className="mt-4 space-y-3">
              {displayCard.purchaseHistory.length > 0 ? (
                displayCard.purchaseHistory.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="rounded-lg border border-border bg-secondary/30 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-card-foreground">{purchase.merchant}</p>
                        <p className="text-sm text-muted-foreground">{purchase.description}</p>
                      </div>
                      <p className="font-semibold text-card-foreground">
                        -{formatCurrency(purchase.amount)}
                      </p>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatDate(purchase.date)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center">
                  <History className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-3 text-muted-foreground">No purchases yet</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <DialogTitle className="text-2xl">{displayCard.name}</DialogTitle>
              </div>
            </DialogHeader>

            <div className="mt-6 space-y-6">
              {/* Balance Section */}
              <div className="rounded-xl bg-primary/10 p-6 text-center">
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-4xl font-bold text-primary">
                  {formatCurrency(displayCard.balance)}
                </p>
                {displayCard.balance < displayCard.originalBalance && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Original: {formatCurrency(displayCard.originalBalance)}
                  </p>
                )}
              </div>

              <Separator className="bg-border" />

              {/* Card Details */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Expiration Date</p>
                    <p className="font-medium text-card-foreground">
                      {formatDate(displayCard.expirationDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Hash className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Card Number</p>
                    <p className="font-mono font-medium text-card-foreground">
                      {displayCard.cardNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FileText className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Card Details</p>
                    <p className="text-card-foreground">{displayCard.cardDetails}</p>
                  </div>
                </div>
              </div>

              <Separator className="bg-border" />

              {/* Actions */}
              <Button
                onClick={() => setShowHistory(true)}
                className="w-full"
                variant="outline"
              >
                <History className="mr-2 h-4 w-4" />
                View Purchase History
                {displayCard.purchaseHistory.length > 0 && (
                  <span className="ml-2 rounded-full bg-primary/20 px-2 py-0.5 text-xs">
                    {displayCard.purchaseHistory.length}
                  </span>
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

// backward-compatible named export for HMR safety
export { GiftCardDetailModalV2 as GiftCardDetailModal }
