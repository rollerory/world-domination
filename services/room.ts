export async function createRoom(supabase: any, roomId: string) {
    try {
        const { data: room, error: roomError } = await supabase
            .from('rooms')
            .insert({ id: roomId, name: roomId })
            .select()
            .single()

        if (roomError) throw roomError

        // Додаємо гравців
        const playersToInsert = [
            { name: 'Player 1', color: '#ff6b6b', room_id: room.id },
            { name: 'Player 2', color: '#4d96ff', room_id: room.id }
        ]
        await supabase.from('players').insert(playersToInsert)

        // Додаємо території
        const territoriesToInsert = Array.from({ length: 16 }).map((_, i) => ({
            room_id: room.id,
            position: i,
            level: 1
        }))
        await supabase.from('territories').insert(territoriesToInsert)

        return room
    } catch (err) {
        console.error('createRoom error', err)
        return null
    }
}
