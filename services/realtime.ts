import type { SupabaseClient } from '@supabase/supabase-js'

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
