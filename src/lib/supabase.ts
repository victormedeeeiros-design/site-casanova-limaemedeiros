import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Verificar se as credenciais estão configuradas
const isSupabaseConfigured = supabaseUrl !== 'https://placeholder.supabase.co' && 
                            supabaseAnonKey !== 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Configurar autenticação com Google
export const signInWithGoogle = async () => {
  if (!isSupabaseConfigured) {
    console.warn('Supabase não está configurado. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY')
    return { data: null, error: { message: 'Supabase não configurado' } }
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`
    }
  })
  return { data, error }
}

export const signOut = async () => {
  if (!isSupabaseConfigured) {
    return { error: { message: 'Supabase não configurado' } }
  }

  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  if (!isSupabaseConfigured) {
    return { user: null, error: { message: 'Supabase não configurado' } }
  }

  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}