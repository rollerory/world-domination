import { supabase } from './supabase'

export async function loginAnonymously() {
    const { data, error } = await supabase.auth.signInAnonymously()
    if (error) throw error
    return data.user
}
