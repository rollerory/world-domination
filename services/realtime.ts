import type { SupabaseClient } from '@supabase/supabase-js'

export function subscribeToPlayers(
    supabase: SupabaseClient,
    roomId: string,
    callback: (players: any[]) => void
) {
    const sub = supabase
        .channel('players-' + roomId)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'players',
                filter: `room_id=eq.${roomId}`
            },
            (payload) => {
                console.log('Realtime player event:', payload)

                callback([payload.new]) // повертаємо масив з одним новим гравцем
            }
        )
        .subscribe()

    console.log('Subscribed to players for room:', roomId)
    return sub
}

export function subscribeToTerritories(
    supabase: SupabaseClient,
    roomId: string,
    callback: (data: any) => void
) {
    const sub = supabase
        .channel('room-' + roomId)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'territories',
                filter: `room_id=eq.${roomId}`
            },
            (payload) => {
                console.log('Realtime event:', payload)
                callback(payload.new)
            }
        )
        .subscribe()

    console.log('Subscribed to room:', roomId)
    return sub
}
