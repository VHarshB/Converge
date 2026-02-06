import { supabase } from '../index'
import { scoreConversation } from '../services/aiScoringLocal'

async function main() {
  try {
    console.log('🚀 Starting Local AI Rescoring...\n')

    console.log('📊 Fetching all conversations...')
    const { data: conversations, error: fetchError } = await supabase
      .from('conversation_logs')
      .select('*')
      .eq('is_deleted', false)
      .order('created_at', { ascending: true })

    if (fetchError) {
      console.error('❌ Error fetching conversations:', fetchError)
      process.exit(1)
    }

    console.log(`📌 Found ${conversations?.length || 0} conversations to re-score\n`)

    if (!conversations || conversations.length === 0) {
      console.log('✅ No conversations to score!')
      process.exit(0)
    }

    let scored = 0
    let failed = 0

    for (let i = 0; i < conversations.length; i++) {
      const conv = conversations[i]
      try {
        console.log(`⏳ [${i + 1}/${conversations.length}] Scoring: ${conv.topics?.join(', ') || 'no topics'}`)

        const scores = await scoreConversation(conv.topics || [], conv.note)

        const { error: updateError } = await supabase
          .from('conversation_logs')
          .update({
            ai_score_overall: scores.overall,
            ai_score_relevance: scores.relevance,
            ai_score_weird: scores.weird,
            ai_score_offtrack: scores.offtrack,
            ai_category: scores.category,
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
      } catch (error) {
        console.error(`   ❌ Error: ${error instanceof Error ? error.message : 'Unknown'}`)
        failed++
      }
    }

    console.log(`\n✨ Rescoring Complete!`)
    console.log(`   ✅ Successfully Scored: ${scored}`)
    console.log(`   ❌ Failed: ${failed}`)
    console.log(`   📊 Total Processed: ${scored + failed}`)
    console.log(`\n🎉 All conversations now have intelligent local AI scores!`)
  } catch (error) {
    console.error('Fatal error:', error)
  }

  process.exit(0)
}

main()
