import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client with service role key (bypasses RLS)
const supabaseAdmin = createClient(
  'https://vavlkdltwxgwhrytrfnp.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhdmxrZGx0d3hnd2hyeXRyZm5wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTI4MTg4NywiZXhwIjoyMDcwODU3ODg3fQ.OHHleyDp4_vbwKEIqPirj6rYoFkEiaVdqtZjAY8igx8'
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('delete-account: API handler called with method:', req.method);
  
  if (req.method !== 'DELETE') {
    console.log('delete-account: Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.body;

    console.log('delete-account: Request body received:', { userId });

    // Validate required fields
    console.log('delete-account: Validating required fields...');
    if (!userId) {
      console.error('delete-account: Missing required field: userId');
      return res.status(400).json({ error: 'User ID is required' });
    }

    console.log('delete-account: All required fields present, proceeding...');

    // Delete user from allowed_user table using service role (bypasses RLS)
    console.log('delete-account: Deleting user from database...');
    const { error: deleteError } = await supabaseAdmin
      .from('allowed_user')
      .delete()
      .eq('id', userId);

    console.log('delete-account: Database delete result:', { 
      success: !deleteError, 
      error: deleteError?.message,
      hasError: !!deleteError 
    });

    if (deleteError) {
      console.error('delete-account: Database delete error occurred:', deleteError);
      return res.status(400).json({ error: `Database error: ${deleteError.message}` });
    }

    console.log('delete-account: Account deleted successfully');
    console.log('delete-account: Returning success response');
    return res.status(200).json({ 
      success: true, 
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('delete-account: Unexpected error occurred:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
