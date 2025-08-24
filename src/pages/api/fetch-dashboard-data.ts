import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client with service role key (bypasses RLS)
const supabaseAdmin = createClient(
  'https://vavlkdltwxgwhrytrfnp.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhdmxrZGx0d3hnd2hyeXRyZm5wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTI4MTg4NywiZXhwIjoyMDcwODU3ODg3fQ.OHHleyDp4_vbwKEIqPirj6rYoFkEiaVdqtZjAY8igx8'
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('fetch-dashboard-data: API handler called with method:', req.method);
  
  if (req.method !== 'GET') {
    console.log('fetch-dashboard-data: Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('fetch-dashboard-data: Starting to fetch dashboard data...');

    // Fetch booth analytics
    console.log('fetch-dashboard-data: Fetching booth analytics...');
    const { data: boothAnalytics, error: boothError } = await supabaseAdmin
      .from('booth_level_analytics')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('fetch-dashboard-data: Booth analytics result:', { 
      dataCount: boothAnalytics?.length, 
      error: boothError?.message,
      hasError: !!boothError 
    });

    if (boothError) {
      console.error('fetch-dashboard-data: Booth analytics error:', boothError);
      return res.status(400).json({ error: `Booth analytics error: ${boothError.message}` });
    }

    // Fetch key people
    console.log('fetch-dashboard-data: Fetching key people...');
    const { data: keyPeople, error: peopleError } = await supabaseAdmin
      .from('key_people')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('fetch-dashboard-data: Key people result:', { 
      dataCount: keyPeople?.length, 
      error: peopleError?.message,
      hasError: !!peopleError 
    });

    if (peopleError) {
      console.error('fetch-dashboard-data: Key people error:', peopleError);
      return res.status(400).json({ error: `Key people error: ${peopleError.message}` });
    }

    console.log('fetch-dashboard-data: Successfully fetched dashboard data');
    console.log('fetch-dashboard-data: Returning response with data');
    return res.status(200).json({ 
      success: true, 
      boothAnalytics: boothAnalytics || [],
      keyPeople: keyPeople || [],
      boothCount: boothAnalytics?.length || 0,
      keyPeopleCount: keyPeople?.length || 0
    });

  } catch (error) {
    console.error('fetch-dashboard-data: Unexpected error occurred:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
