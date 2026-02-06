#!/bin/bash
# Setup test event in Supabase

echo "Creating test event in Supabase..."

# Create event
curl -X POST http://localhost:5000/api/checkin \
  -H "Content-Type: application/json" \
  -d '{
    "eventSlug": "sample-event",
    "name": "John Test",
    "email": "john@test.com",
    "role": "student"
  }' 

echo "✓ Test event setup complete!"
