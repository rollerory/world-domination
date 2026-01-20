<template>
    <div class="grid">
        <div v-for="t in store.territories" :key="t.id" class="territory" :style="{ backgroundColor: getColor(t) }"
            @click="select(t.id)">
            <span class="level">{{ t.level }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useGameStore } from '~/stores/game'
import { useNuxtApp } from '#app'

const store = useGameStore()
const { $supabase } = useNuxtApp()

const select = (id: string) => {
    store.toggleTerritorySelection(id, $supabase)
}

const getColor = (t: any) => {
    const p = store.players.find(p => p.id === t.ownerId)
    return p ? p.color : '#ddd'
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
}
</style>
