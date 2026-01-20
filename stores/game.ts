import { defineStore } from 'pinia'

export interface Territory {
    id: string
    ownerId: string | null
    level: number
}

export interface Player {
    id: string
    name: string
    color: string
}

export const useGameStore = defineStore('game', {
    state: () => ({
        roomId: '' as string,
        players: [] as Player[],
        territories: [] as Territory[],
        currentPlayerId: null as string | null
    }),

    actions: {
        async toggleTerritorySelection(
            territoryId: string,
            supabase: any
        ) {
            if (!this.currentPlayerId) return

            const territory = this.territories.find(t => t.id === territoryId)
            if (!territory) return

            // якщо територія вже належить гравцю — нічого не робимо
            if (territory.ownerId === this.currentPlayerId) return

            // локально (опціонально, але приємно)
            territory.ownerId = this.currentPlayerId

            // запис у БД
            const { error } = await supabase
                .from('territories')
                .update({
                    owner_id: this.currentPlayerId
                })
                .eq('id', territoryId)

            if (error) {
                console.error('Supabase update error:', error)
            }
        }
    }
})
