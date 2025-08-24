import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client with service role key (bypasses RLS)
const supabaseAdmin = createClient(
  'https://vavlkdltwxgwhrytrfnp.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhdmxrZGx0d3hnd2hyeXRyZm5wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTI4MTg4NywiZXhwIjoyMDcwODU3ODg3fQ.OHHleyDp4_vbwKEIqPirj6rYoFkEiaVdqtZjAY8igx8'
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('register-user: API handler called with method:', req.method);
  
  if (req.method !== 'POST') {
    console.log('register-user: Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, phone, name, role } = req.body;

    console.log('register-user: Request body received:', { email, phone, name, role });

    // Validate required fields
    console.log('register-user: Validating required fields...');
    if (!email || !phone || !name || !role) {
      console.error('register-user: Missing required fields:', { email: !!email, phone: !!phone, name: !!name, role: !!role });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('register-user: All required fields present, proceeding...');

    // Generate a default password
    const defaultPassword = Math.random().toString(36).slice(-8);
    console.log('register-user: Generated default password');

    // First, create user in Supabase Auth
    console.log('register-user: Creating user in Supabase Auth...');
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: defaultPassword,
      email_confirm: true, // Auto-confirm email
    });

    console.log('register-user: Auth create user result:', { 
      success: !!authData.user, 
      error: authError?.message,
      hasError: !!authError 
    });

    if (authError) {
      console.error('register-user: Auth error occurred:', authError);
      return res.status(400).json({ error: `Auth error: ${authError.message}` });
    }

    console.log('register-user: Auth user created successfully, adding to allowed_user table...');

    // Then add to allowed_user table using service role (bypasses RLS)
    const { data: userData, error: userError } = await supabaseAdmin
      .from('allowed_user')
      .insert([
        {
          name: name,
          email: email,
          phone_number: phone,
          role: role,
          hashed_password: defaultPassword // In production, this should be hashed
        }
      ])
      .select()
      .single();

    console.log('register-user: User insert result:', { 
      success: !!userData, 
      error: userError?.message,
      hasError: !!userError 
    });

    if (userError) {
      console.error('register-user: User insert error occurred:', userError);
      return res.status(400).json({ error: `Database error: ${userError.message}` });
    }

    console.log('register-user: User registration successful');
    console.log('register-user: Returning success response');
    return res.status(200).json({ 
      success: true, 
      message: 'User registered successfully',
      user: userData,
      credentials: {
        email: email,
        password: defaultPassword
      }
    });

  } catch (error) {
    console.error('register-user: Unexpected error occurred:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
