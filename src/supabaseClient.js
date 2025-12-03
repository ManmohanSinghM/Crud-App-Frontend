import { createClient } from '@supabase/supabase-js'

// Replace these with the keys you copied in Step 2
const supabaseUrl = 'https://tsbicuqiiwggnfwzdypy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzYmljdXFpaXdnZ25md3pkeXB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NzIzNDcsImV4cCI6MjA4MDM0ODM0N30.YXLMD6LW88HGM2s844yA0HG3rYVCvTHB_lNb0nivnME'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
