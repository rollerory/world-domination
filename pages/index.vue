<template>
    <div class="room-start">
        <h1>Territory Control</h1>

        <input v-model="roomNumber" type="text" placeholder="Введіть код кімнати" />
        <input v-model="playerName" type="text" placeholder="Ім'я гравця" />

        <div class="buttons">
            <button @click="createRoom">Створити нову кімнату</button>
            <button @click="joinRoom">Приєднатись до існуючої</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNuxtApp } from '#app'
import { useGameStore } from '~/stores/game'

const roomNumber = ref('')
const playerName = ref('')
const router = useRouter()
const { $supabase } = useNuxtApp()
const store = useGameStore() // ✅ ВАЖЛИВО


async function createRoom() {
    if (!roomNumber.value) {
        alert('Введіть код кімнати')
        return
    }

    if (!playerName.value) {
        alert('Введіть ім\'я гравця')
        return
    }

    try {
        // Створюємо кімнату з текстовим id
        const { data: room, error: roomError } = await $supabase
            .from('rooms')
            .insert({ id: roomNumber.value, name: roomNumber.value })
            .select()
            .single()

        if (roomError) throw roomError

        // після insert у players
        const { data: newPlayer, error: playerError } = await $supabase
            .from('players')
            .insert([{ name: playerName.value, color: '#ff6b6b', room_id: room.id }])
            .select()
            .single()

        if (playerError) throw playerError

        // зберігаємо у store
        store.currentPlayerId = newPlayer.id


        // Створюємо території
        const territories = Array.from({ length: 16 }).map((_, i) => ({
            room_id: room.id,
            position: i,
            level: 1
        }))

        const { error: territoriesError } = await $supabase
            .from('territories')
            .insert(territories)

        if (territoriesError) throw territoriesError

        router.push(`/room/${room.id}`)
    } catch (err: any) {
        console.error('Помилка створення кімнати', err)
        alert(err.message || 'Помилка створення кімнати')
    }
}

async function joinRoom() {
    if (!roomNumber.value) {
        alert('Введіть код кімнати')
        return
    }

    if (!playerName.value) {
        alert('Введіть ім\'я гравця')
        return
    }

    try {
        // Шукаємо кімнату по id
        const { data: room, error: roomError } = await $supabase
            .from('rooms')
            .select('*')
            .eq('id', roomNumber.value)
            .single()

        if (roomError || !room) {
            alert('Кімната не знайдена')
            return
        }

        // після insert у players
        const { data: newPlayer, error: playerError } = await $supabase
            .from('players')
            .insert([{ name: playerName.value, color: '#ff6b6b', room_id: room.id }])
            .select()
            .single()

        if (playerError) throw playerError

        // зберігаємо у store
        store.currentPlayerId = newPlayer.id



        router.push(`/room/${room.id}`)
    } catch (err: any) {
        console.error('Помилка приєднання до кімнати', err)
        alert(err.message || 'Помилка приєднання до кімнати')
    }
}
</script>

<style scoped>
.room-start {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin-top: 60px;
}

input {
    padding: 8px 12px;
    font-size: 16px;
}

.buttons {
    display: flex;
    gap: 10px;
}

button {
    padding: 8px 20px;
    font-size: 16px;
    cursor: pointer;
}
</style>
