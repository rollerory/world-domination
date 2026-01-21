<template>
    <div class="grid">
        <div v-for="t in store.territories" :key="t.id" class="territory" :style="getTileStyle(t)"
            @click="select(t.id)">
            <!-- <span class="level">{{ t.level }}</span> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { useGameStore } from '~/stores/game'
import { useNuxtApp } from '#app'

// ✅ правильний імпорт
import kyivTile from '@/assets/images/Kyiv-tile.png'
import lvivTile from '@/assets/images/Lviv-tile.png'

const store = useGameStore()
const { $supabase } = useNuxtApp()

const select = (id: string) => {
    store.toggleTerritorySelection(id, $supabase)
}

const getTileStyle = (t: any) => {
    if (!t.ownerId) {
        return { backgroundColor: '#ddd' }
    }

    const playerIndex = store.players.findIndex(
        p => p.id === t.ownerId
    )

    if (playerIndex === 0) {
        return {
            backgroundImage: `url(${kyivTile})`
        }
    }

    if (playerIndex === 1) {
        return {
            backgroundImage: `url(${lvivTile})`
        }
    }

    return { backgroundColor: '#ddd' }
}
</script>


<style scoped>
.grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    width: 400px;
    margin: 0 auto;
}

.territory {
    height: 80px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.level {
    font-weight: bold;
    background: rgba(255, 255, 255, 0.8);
    padding: 4px 8px;
    border-radius: 4px;
}
</style>
