"use client"

import { useState, useEffect } from 'react'
import { CreditCard, History, Wallet } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GiftCardGrid } from '@/components/gift-card-grid'
import { GiftCardDetailModalV2 as GiftCardDetailModal } from '@/components/gift-card-detail-modal'
import type { GiftCard } from '@/lib/gift-card-data'
import { fetchActiveCards, fetchHistoricalCards } from '@/lib/api-client'
import { convertBackendOverviewToGiftCard, convertBackendRemovedToGiftCard } from '@/lib/gift-card-data'

export default function GiftCardManagement() {
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [activeCards, setActiveCards] = useState<GiftCard[]>([])
  const [historyCards, setHistoryCards] = useState<GiftCard[]>([])
  const [loadingActive, setLoadingActive] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoadingActive(true)
      setError(null)
      try {
        const data = await fetchActiveCards()
        if (!mounted) return
        setActiveCards(data.map(convertBackendOverviewToGiftCard))
      } catch (e) {
        console.error(e)
        setError('Failed to load active cards')
      } finally {
        if (mounted) setLoadingActive(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoadingHistory(true)
      try {
        const data = await fetchHistoricalCards()
        if (!mounted) return
        setHistoryCards(data.map(convertBackendRemovedToGiftCard))
      } catch (e) {
        console.error(e)
      } finally {
        if (mounted) setLoadingHistory(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const handleCardClick = (card: GiftCard) => {
    setSelectedCard(card)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Wallet className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Gift Cards</h1>
                <p className="text-sm text-muted-foreground">Manage your gift card collection</p>
              </div>
            </div>
            

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-8 grid w-full max-w-md grid-cols-2 bg-secondary">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Active Cards
              <span className="ml-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                {activeCards.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
              <span className="ml-1 rounded-full bg-muted-foreground/20 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {historyCards.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground">Your Active Gift Cards</h2>
              <p className="text-sm text-muted-foreground">
                Click on a card to view details and purchase history
              </p>
            </div>
            <GiftCardGrid 
              cards={activeCards} 
              onCardClick={handleCardClick}
              variant="active"
              emptyMessage="No active gift cards"
            />
          </TabsContent>

          <TabsContent value="history">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground">History</h2>
              <p className="text-sm text-muted-foreground">
                Expired or fully used gift cards
              </p>
            </div>
            <GiftCardGrid 
              cards={historyCards} 
              onCardClick={handleCardClick}
              variant="history"
              emptyMessage="No cards in history"
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Card Detail Modal */}
      <GiftCardDetailModal
        card={selectedCard}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  )
}
