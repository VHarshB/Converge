import { supabase } from '../index'
import fs from 'fs'
import path from 'path'

async function main() {
  try {
    console.log('🚀 Adding ai_category column...\n')

    const migrationSQL = fs.readFileSync(
      path.join(__dirname, '../db/migrations/add_ai_category.sql'),
      'utf-8'
    )

    // Execute the migration
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL })

    if (error) {
      console.error('❌ Migration failed:', error)
      
      // Try alternative method - direct queries
      console.log('🔄 Trying alternative method...')
      
      const { error: alterError } = await supabase
        .from('conversation_logs')
        .select('ai_category')
        .limit(1)
      
      if (alterError && alterError.message.includes('column')) {
        console.log('⚠️  Column does not exist. Please run this SQL manually in your Supabase SQL Editor:')
        console.log('\n' + migrationSQL + '\n')
        process.exit(1)
      } else {
        console.log('✅ Column already exists!')
      }
    } else {
      console.log('✅ Migration successful!')
    }

  } catch (error) {
    console.error('Fatal error:', error)
    console.log('\n⚠️  Please run this SQL manually in your Supabase SQL Editor:')
    console.log('\nALTER TABLE conversation_logs ADD COLUMN IF NOT EXISTS ai_category TEXT CHECK (ai_category IN (\'relevance\', \'weird\', \'offtrack\'));')
    console.log('CREATE INDEX IF NOT EXISTS idx_conversation_logs_ai_category ON conversation_logs(ai_category);\n')
  }

  process.exit(0)
}

main()
