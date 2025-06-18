// ../lib/supabase.js

import { AppState } from 'react-native'
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js' // <--- IMPORTANT: ensure processLock is GONE from this line
import { supabaseUrl, supabaseAnonKey } from '../constants' // Your constants file confirmed correct

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    // lock: processLock, // <--- IMPORTANT: ENSURE THIS LINE IS REMOVED
  },
})

// This AppState listener is usually fine, but not strictly needed for basic auto-refresh/persist
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})