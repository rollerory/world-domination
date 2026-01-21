import { resolve } from 'path'

export default defineNuxtConfig({
    modules: ['@pinia/nuxt'],

    alias: {
        '@assets': resolve(__dirname, 'assets'),
        '@images': resolve(__dirname, 'assets/images'),
        '@icons': resolve(__dirname, 'assets/icons'),
    },

    runtimeConfig: {
        public: {
            supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
            supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY
        }
    }
})
