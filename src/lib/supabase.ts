import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://vavlkdltwxgwhrytrfnp.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhdmxrZGx0d3hnd2hyeXRyZm5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODE4ODcsImV4cCI6MjA3MDg1Nzg4N30.UES-9otFBN8cxK3tcb0Tsp8KZy_bCY8tQDM0eyf9iSo';

export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
