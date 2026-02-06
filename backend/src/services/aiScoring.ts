import { GoogleGenerativeAI } from '@google/generative-ai'

// AI Scoring Categories
export interface ConversationScores {
  overall: number          // 0-100: Overall conversation quality
  relevance: number        // 0-100: How relevant to stated topics
  weird: number            // 0-100: How unusual/creative/weird
  offtrack: number         // 0-100: How much it wandered off-topic
  analysis: string         // Brief AI analysis
}

// Initialize Google Gemini client (will be null if no API key)
let genAI: GoogleGenerativeAI | null = null

if (process.env.GOOGLE_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
}

/**
 * Score a conversation using AI (Google Gemini - FREE!)
 * @param topics - Array of conversation topics
 * @param note - Optional note about the conversation (max 180 chars)
 * @returns ConversationScores object
 */
export async function scoreConversation(
  topics: string[],
  note?: string
): Promise<ConversationScores> {
  // If no Google API key, return default scores
  if (!genAI) {
    console.warn('Google API key not found - using default scores')
    return {
      overall: 50,
      relevance: 50,
      weird: 50,
      offtrack: 50,
      analysis: 'AI scoring not configured',
    }
  }

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

    // Clean up response (remove markdown code blocks if present)
    let cleanText = text.trim()
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/```\n?/g, '')
    }

    // Parse JSON response
    const scores = JSON.parse(cleanText)

    // Validate and clamp scores to 0-100
    return {
      overall: Math.max(0, Math.min(100, scores.overall || 50)),
      relevance: Math.max(0, Math.min(100, scores.relevance || 50)),
      weird: Math.max(0, Math.min(100, scores.weird || 50)),
      offtrack: Math.max(0, Math.min(100, scores.offtrack || 50)),
      analysis: scores.analysis || 'Conversation scored',
    }
  } catch (error) {
    console.error('Error scoring conversation with AI:', error)
    // Return default scores on error
    return {
      overall: 50,
      relevance: 50,
      weird: 50,
      offtrack: 50,
      analysis: 'Error scoring conversation',
    }
  }
}
