const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lovcwhcqheakjeijypaq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvdmN3aGNxaGVha2plaWp5cGFxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDM0NjU4OCwiZXhwIjoyMDg1OTIyNTg4fQ.tPgnzad1IHs_L0Cbwg3omAJU2PBDng5GPxx3cuT_53M';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestEvent() {
  try {
    // First check if event exists
    const { data: existing } = await supabase
      .from('events')
      .select('*')
      .eq('slug', 'sample-event')
      .single();

    if (existing) {
      console.log('✅ Event already exists:', existing);
      return;
    }

    // Create event
    const { data, error } = await supabase
      .from('events')
      .insert([{
        name: 'Tech Networking Event',
        slug: 'sample-event',
        location: 'ASU Phoenix Campus',
        start_time: new Date('2026-02-05T09:00:00Z').toISOString(),
        end_time: new Date('2026-02-05T17:00:00Z').toISOString(),
        status: 'live',
        settings: { scoringRules: { uniquePartnerWeight: 2 } }
      }])
      .select();

    if (error) {
      console.error('❌ Error creating event:', error);
      process.exit(1);
    }

    console.log('✅ Event created successfully:', data[0]);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

createTestEvent();
