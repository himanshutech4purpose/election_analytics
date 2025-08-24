import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client with service role key (bypasses RLS)
const supabaseAdmin = createClient(
  'https://vavlkdltwxgwhrytrfnp.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhdmxrZGx0d3hnd2hyeXRyZm5wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTI4MTg4NywiZXhwIjoyMDcwODU3ODg3fQ.OHHleyDp4_vbwKEIqPirj6rYoFkEiaVdqtZjAY8igx8'
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('fetch-users: API handler called with method:', req.method);
  
  if (req.method !== 'GET') {
    console.log('fetch-users: Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('fetch-users: Starting to fetch all users...');

    // Get all users from allowed_user table
    console.log('fetch-users: Making database query to allowed_user table...');
    const { data: users, error } = await supabaseAdmin
      .from('allowed_user')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('fetch-users: Database query result:', { 
      usersCount: users?.length, 
      error: error?.message,
      hasError: !!error 
    });

    if (error) {
      console.error('fetch-users: Database error occurred:', error);
      return res.status(400).json({ error: `Database error: ${error.message}` });
    }

    console.log('fetch-users: Successfully found users:', users?.length || 0);
    console.log('fetch-users: Returning response with users');
    return res.status(200).json({ 
      success: true, 
      users: users || [],
      count: users?.length || 0
    });

  } catch (error) {
    console.error('fetch-users: Unexpected error occurred:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
