import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client with service role key (bypasses RLS)
const supabaseAdmin = createClient(
  'https://vavlkdltwxgwhrytrfnp.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhdmxrZGx0d3hnd2hyeXRyZm5wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTI4MTg4NywiZXhwIjoyMDcwODU3ODg3fQ.OHHleyDp4_vbwKEIqPirj6rYoFkEiaVdqtZjAY8igx8'
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('add-key-person: API handler called with method:', req.method);
  
  if (req.method !== 'POST') {
    console.log('add-key-person: Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, phone_number, notes, geolocation_url, instagram_id, facebook_id, twitter_id, other_social_media_id, longitude, latitude, persona, created_by } = req.body;

    console.log('add-key-person: Request body received:', { 
      name, 
      phone_number, 
      notes, 
      geolocation_url, 
      instagram_id, 
      facebook_id, 
      twitter_id, 
      other_social_media_id, 
      longitude, 
      latitude, 
      persona, 
      created_by 
    });

    // Validate required fields
    console.log('add-key-person: Validating required fields...');
    if (!name) {
      console.error('add-key-person: Missing required field: name');
      return res.status(400).json({ error: 'Name is required' });
    }

    console.log('add-key-person: All required fields present, proceeding...');

    // Insert key person into database using service role (bypasses RLS)
    console.log('add-key-person: Inserting key person into database...');
    const { data: keyPersonData, error: insertError } = await supabaseAdmin
      .from('key_people')
      .insert([
        {
          name,
          phone_number,
          notes,
          geolocation_url,
          instagram_id,
          facebook_id,
          twitter_id,
          other_social_media_id,
          longitude,
          latitude,
          persona,
          created_by,
        }
      ])
      .select()
      .single();

    console.log('add-key-person: Database insert result:', { 
      success: !!keyPersonData, 
      error: insertError?.message,
      hasError: !!insertError 
    });

    if (insertError) {
      console.error('add-key-person: Database insert error occurred:', insertError);
      return res.status(400).json({ error: `Database error: ${insertError.message}` });
    }

    console.log('add-key-person: Key person added successfully');
    console.log('add-key-person: Returning success response');
    return res.status(200).json({ 
      success: true, 
      message: 'Key person added successfully',
      keyPerson: keyPersonData
    });

  } catch (error) {
    console.error('add-key-person: Unexpected error occurred:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
