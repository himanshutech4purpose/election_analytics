import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vavlkdltwxgwhrytrfnp.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhdmxrZGx0d3hnd2hyeXRyZm5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODE4ODcsImV4cCI6MjA3MDg1Nzg4N30.UES-9otFBN8cxK3tcb0Tsp8KZy_bCY8tQDM0eyf9iSo';

console.log('Supabase configuration:', {
  url: supabaseUrl,
  hasKey: !!supabaseKey,
  keyLength: supabaseKey?.length,
  keyType: 'ANON_KEY' // Only use anonymous key on client side
});

console.log('Supabase: Creating client with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Supabase: Client created successfully');

// Test the connection
console.log('Supabase: Testing connection...');
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase: Connection error:', error);
  } else {
    console.log('Supabase: Connection successful, session data:', { 
      hasSession: !!data.session,
      user: data.session?.user?.email 
    });
  }
}).catch((error) => {
  console.error('Supabase: Unexpected error during connection test:', error);
});

export default supabase;
