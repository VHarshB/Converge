import { createClient } from '@supabase/supabase-js'
import { GoogleGenerativeAI } from '@google/generative-ai'

const SUPABASE_URL = 'https://lovcwhcqheakjeijypaq.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvdmN3aGNxaGVha2plaWp5cGFxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDM0NjU4OCwiZXhwIjoyMDg1OTIyNTg4fQ.tPgnzad1IHs_L0Cbwg3omAJU2PBDng5GPxx3cuT_53M'
const GOOGLE_API_KEY = 'AIzaSyBNdw8vkfJYxF1h23enegVJ6Gf5sUatF4w'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY)

interface ConversationScores {
  overall: number
  relevance: number
  weird: number
  offtrack: number
  analysis: string
}

async function scoreConversation(
  topics: string[],
  note?: string
): Promise<ConversationScores> {
  try {
    const topicsStr = topics.join(', ')
    const noteStr = note || 'No additional notes'

    const prompt = `You are an AI judge scoring a networking conversation at a startup event. Score the following conversation on 4 dimensions (0-100):

**Conversation Details:**
- Topics: ${topicsStr}
- Notes: ${noteStr}

**Scoring Criteria:**
1. **Overall Quality** (0-100): How good was this conversation overall? Consider depth, engagement, value exchange.
2. **Relevance** (0-100): How relevant were the topics to startup/business networking? Higher scores for focused, valuable topics.
3. **Weirdness/Creativity** (0-100): How unusual, creative, or unexpected was this conversation? Higher scores for unique, memorable interactions.
4. **Off-Track** (0-100): How much did it wander from the stated topics? Higher scores mean MORE off-track.

Return ONLY a JSON object with these exact keys (no markdown, no explanation):
{
  "overall": <number>,
  "relevance": <number>,
  "weird": <number>,
  "offtrack": <number>,
  "analysis": "<one sentence summary>"
}`

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    let cleanText = text.trim()
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/```\n?/g, '')
    }

    const scores = JSON.parse(cleanText)

    return {
      overall: Math.max(0, Math.min(100, scores.overall || 50)),
      relevance: Math.max(0, Math.min(100, scores.relevance || 50)),
      weird: Math.max(0, Math.min(100, scores.weird || 50)),
      offtrack: Math.max(0, Math.min(100, scores.offtrack || 50)),
      analysis: scores.analysis || 'Conversation scored',
    }
  } catch (error) {
    console.error('Error scoring conversation:', error)
    return {
      overall: 50,
      relevance: 50,
      weird: 50,
      offtrack: 50,
      analysis: 'Error scoring conversation',
    }
  }
}

async function createMissingColumns() {
  try {
    console.log('🗄️  Checking if AI score columns exist...\n')

    // Try a simple select to check if column exists
    const { error: checkError } = await supabase
      .from('conversation_logs')
      .select('ai_score_overall')
      .limit(1)

    if (checkError && checkError.code === '42703') {
      // Column doesn't exist
      console.log('❌ Columns do not exist. Need manual SQL setup.')
      console.log('\n📋 Please run this SQL in Supabase SQL Editor (https://supabase.com/dashboard):')
      console.log(`
BEGIN;
ALTER TABLE conversation_logs
ADD COLUMN IF NOT EXISTS ai_score_overall INTEGER DEFAULT 0;
ALTER TABLE conversation_logs
ADD COLUMN IF NOT EXISTS ai_score_relevance INTEGER DEFAULT 0;
ALTER TABLE conversation_logs
ADD COLUMN IF NOT EXISTS ai_score_weird INTEGER DEFAULT 0;
ALTER TABLE conversation_logs
ADD COLUMN IF NOT EXISTS ai_score_offtrack INTEGER DEFAULT 0;
ALTER TABLE conversation_logs
ADD COLUMN IF NOT EXISTS ai_analysis TEXT;
COMMIT;
      `)
      return false
    }

    console.log('✅ Columns exist!')
    return true
  } catch (error) {
    console.error('Error during column check:', error)
    return false
  }
}

async function main() {
  try {
    console.log('🚀 Starting AI Scoring Migration & Backfill...\n')

    // Check if columns exist
    const columnsExist = await createMissingColumns()

    if (!columnsExist) {
      console.log('\n⚠️  Cannot proceed without database columns.')
      console.log('Please execute the SQL above in your Supabase dashboard, then run this script again.')
      process.exit(1)
    }

    console.log('\n📊 Fetching unscored conversations...')
    const { data: conversations, error: fetchError } = await supabase
      .from('conversation_logs')
      .select('*')
      .eq('is_deleted', false)
      .or('ai_score_overall.is.null,ai_score_overall.eq.0')
      .order('created_at', { ascending: true })

    if (fetchError) {
      console.error('❌ Error fetching conversations:', fetchError)
      process.exit(1)
    }

    console.log(`📌 Found ${conversations?.length || 0} conversations to score\n`)

    if (!conversations || conversations.length === 0) {
      console.log('✅ All conversations already scored!')
      process.exit(0)
    }

    // Score each conversation
    let scored = 0
    let failed = 0

    for (let i = 0; i < conversations.length; i++) {
      const conv = conversations[i]
      try {
        console.log(`⏳ [${i + 1}/${conversations.length}] Scoring conversation...`)

        const scores = await scoreConversation(conv.topics || [], conv.note)

        const { error: updateError } = await supabase
          .from('conversation_logs')
          .update({
            ai_score_overall: scores.overall,
            ai_score_relevance: scores.relevance,
            ai_score_weird: scores.weird,
            ai_score_offtrack: scores.offtrack,
            ai_analysis: scores.analysis,
          })
          .eq('id', conv.id)

        if (updateError) {
          console.error(`   ❌ Update failed: ${updateError.message}`)
          failed++
        } else {
          console.log(
            `   ✅ Scored - Overall:${scores.overall} Relevance:${scores.relevance} Weird:${scores.weird} OffTrack:${scores.offtrack}`
          )
          scored++
        }

        // Delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1500))
      } catch (error) {
        console.error(`   ❌ Error: ${error instanceof Error ? error.message : 'Unknown'}`)
        failed++
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    console.log(`\n✨ Scoring Migration Complete!`)
    console.log(`   ✅ Successfully Scored: ${scored}`)
    console.log(`   ❌ Failed: ${failed}`)
    console.log(`   📊 Total Processed: ${scored + failed}`)
  } catch (error) {
    console.error('Fatal error:', error)
  }

  process.exit(0)
}

main()
