<template>
    <div>
        <h1>Room {{ store.roomId }}</h1>

        <div class="players">
            <span v-for="player in store.players" :key="player.id" :style="{
                color: player.color,
                fontWeight: store.currentPlayerId === player.id ? 'bold' : 'normal',
                cursor: 'pointer'
            }" @click="store.currentPlayerId = player.id">
                {{ player.name }}
            </span>
        </div>

        <GameField v-if="store.territories.length" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useNuxtApp } from '#app'
import { useGameStore } from '~/stores/game'
import GameField from '~/components/GameField.vue'
import { subscribeToTerritories } from '~/services/realtime'

const route = useRoute()
const store = useGameStore()
const { $supabase } = useNuxtApp()

let subscription: any = null

onMounted(async () => {
    const roomId = route.params.id as string
    store.roomId = roomId

    // 1️⃣ гравці
    const { data: players } = await $supabase
        .from('players')
        .select('*')
        .eq('room_id', roomId)

    store.players = players ?? []
    store.currentPlayerId = store.players[0]?.id ?? null

    // 2️⃣ території
    const { data: territories } = await $supabase
        .from('territories')
        .select('*')
        .eq('room_id', roomId)
        .order('position')

    store.territories = territories.map(t => ({
        id: t.id,
        ownerId: t.owner_id,
        level: t.level
    }))

    // 3️⃣ realtime
    subscription = subscribeToTerritories($supabase, roomId, updated => {
        const t = store.territories.find(x => x.id === updated.id)
        if (t) t.ownerId = updated.owner_id
    })
})

onBeforeUnmount(() => {
    if (subscription) subscription.unsubscribe()
})
</script>

<style scoped>
.players {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-bottom: 20px;
}
</style>
