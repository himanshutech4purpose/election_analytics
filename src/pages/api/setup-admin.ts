import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client with service role key (bypasses RLS)
const supabaseAdmin = createClient(
  'https://vavlkdltwxgwhrytrfnp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhdmxrZGx0d3hnd2hyeXRyZm5wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTI4MTg4NywiZXhwIjoyMDcwODU3ODg3fQ.OHHleyDp4_vbwKEIqPirj6rYoFkEiaVdqtZjAY8igx8'
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('setup-admin: API handler called with method:', req.method);
  
  if (req.method !== 'POST') {
    console.log('setup-admin: Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone_number, role } = req.body;

    console.log('setup-admin: Request body received:', { name, email, phone_number, role });

    // Validate required fields
    console.log('setup-admin: Validating required fields...');
    if (!name || !email || !phone_number || !role) {
      console.error('setup-admin: Missing required fields:', { name: !!name, email: !!email, phone_number: !!phone_number, role: !!role });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('setup-admin: All required fields present, proceeding...');

    // Generate default password
    const defaultPassword = 'admin123';
    console.log('setup-admin: Using default password:', defaultPassword);

    // First, create user in Supabase Auth
    console.log('setup-admin: Creating user in Supabase Auth...');
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: defaultPassword,
      email_confirm: true, // Auto-confirm email
    });

    console.log('setup-admin: Auth create user result:', { 
      success: !!authData.user, 
      error: authError?.message,
      hasError: !!authError 
    });

    if (authError) {
      console.error('setup-admin: Auth error occurred:', authError);
      return res.status(400).json({ error: `Auth error: ${authError.message}` });
    }

    console.log('setup-admin: Auth user created successfully, adding to allowed_user table...');

    // Then add to allowed_user table using service role (bypasses RLS)
    const { data: userData, error: userError } = await supabaseAdmin
      .from('allowed_user')
      .insert([
        {
          name: name,
          email: email,
          phone_number: phone_number,
          role: role,
          hashed_password: defaultPassword // In production, this should be hashed
        }
      ])
      .select()
      .single();

    console.log('setup-admin: User insert result:', { 
      success: !!userData, 
      error: userError?.message,
      hasError: !!userError 
    });

    if (userError) {
      console.error('setup-admin: User insert error occurred:', userError);
      return res.status(400).json({ error: `Database error: ${userError.message}` });
    }

    console.log('setup-admin: Admin user created successfully in both Auth and database');
    console.log('setup-admin: Returning success response');
    return res.status(200).json({ 
      success: true, 
      message: 'Admin user created successfully',
      user: userData,
      credentials: {
        email: email,
        password: defaultPassword
      }
    });

  } catch (error) {
    console.error('setup-admin: Unexpected error occurred:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
