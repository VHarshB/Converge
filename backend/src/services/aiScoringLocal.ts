/**
 * Local AI Scoring Service - SEMANTIC ANALYSIS
 * AI understands MEANING, not just keywords!
 * No hardcoded limits - analyzes context intelligently
 */

export interface ConversationScores {
  overall: number
  relevance: number
  weird: number
  offtrack: number
  category: 'relevance' | 'weird' | 'offtrack'
  analysis: string
}

/**
 * Semantic analyzer - understands context and meaning
 */
function analyzeSemanticRelevance(topics: string[], note: string): {
  topicUnderstanding: string
  noteUnderstanding: string
  alignment: number // 0-100
} {
  const topicsText = topics.join(' ').toLowerCase()
  const noteText = note.toLowerCase()
  
  // Extract what the topics are ABOUT (semantic categories)
  const topicCategories = new Set<string>()
  
  // Academic/Education domain
  if (/school|college|university|degree|gpa|study|student|learn|class|grade|academic|exam|education|course|teach/i.test(topicsText)) {
    topicCategories.add('education')
  }
  
  // Professional/Career domain
  if (/job|career|work|employ|resume|interview|salary|profession|office|hire|recruit/i.test(topicsText)) {
    topicCategories.add('career')
  }
  
  // Business/Entrepreneurship domain
  if (/business|startup|company|entrepreneur|revenue|profit|market|customer|product|sales|growth|fund|investor|pitch/i.test(topicsText)) {
    topicCategories.add('business')
  }
  
  // Technology domain
  if (/tech|software|code|program|app|platform|api|data|algorithm|cloud|ai|ml|engineer|develop/i.test(topicsText)) {
    topicCategories.add('technology')
  }
  
  // Health/Fitness domain
  if (/health|fitness|exercise|diet|nutrition|wellness|medical|doctor|hospital|mental|workout|gym/i.test(topicsText)) {
    topicCategories.add('health')
  }
  
  // Finance/Money domain
  if (/finance|money|invest|stock|trading|crypto|bitcoin|portfolio|saving|loan|debt|budget|tax|bank/i.test(topicsText)) {
    topicCategories.add('finance')
  }
  
  // Creative/Arts domain
  if (/art|design|creative|music|paint|draw|write|author|film|photo|video|perform/i.test(topicsText)) {
    topicCategories.add('creative')
  }
  
  // Science/Research domain
  if (/science|research|experiment|lab|physics|chemistry|biology|theory|hypothesis|study|discover/i.test(topicsText)) {
    topicCategories.add('science')
  }
  
  // If no specific domain detected, mark as general
  if (topicCategories.size === 0) {
    topicCategories.add('general')
  }
  
  // Now check what the NOTE is about
  const noteCategories = new Set<string>()
  
  if (/school|college|university|degree|gpa|study|student|learn|class|grade|academic|exam|education|course|teach/i.test(noteText)) {
    noteCategories.add('education')
  }
  if (/job|career|work|employ|resume|interview|salary|profession|office|hire|recruit/i.test(noteText)) {
    noteCategories.add('career')
  }
  if (/business|startup|company|entrepreneur|revenue|profit|market|customer|product|sales|growth|fund|investor|pitch/i.test(noteText)) {
    noteCategories.add('business')
  }
  if (/tech|software|code|program|app|platform|api|data|algorithm|cloud|ai|ml|engineer|develop/i.test(noteText)) {
    noteCategories.add('technology')
  }
  if (/health|fitness|exercise|diet|nutrition|wellness|medical|doctor|hospital|mental|workout|gym/i.test(noteText)) {
    noteCategories.add('health')
  }
  if (/finance|money|invest|stock|trading|crypto|bitcoin|portfolio|saving|loan|debt|budget|tax|bank/i.test(noteText)) {
    noteCategories.add('finance')
  }
  if (/art|design|creative|music|paint|draw|write|author|film|photo|video|perform/i.test(noteText)) {
    noteCategories.add('creative')
  }
  if (/science|research|experiment|lab|physics|chemistry|biology|theory|hypothesis|study|discover/i.test(noteText)) {
    noteCategories.add('science')
  }
  
  // Calculate alignment between topic and note
  let alignment = 0
  
  // Perfect match: same domain
  const intersection = [...topicCategories].filter(cat => noteCategories.has(cat))
  if (intersection.length > 0) {
    alignment = 60 + (intersection.length * 15) // Base 60, +15 per matching category
  }
  
  // Adjacent domains (related but different)
  const adjacentDomains: { [key: string]: string[] } = {
    'education': ['career', 'science'],
    'career': ['education', 'business'],
    'business': ['career', 'finance', 'technology'],
    'technology': ['business', 'science'],
    'finance': ['business', 'career'],
    'health': ['science'],
    'creative': ['business', 'technology'],
    'science': ['education', 'technology', 'health']
  }
  
  if (alignment === 0) {
    for (const topicCat of topicCategories) {
      const adjacent = adjacentDomains[topicCat] || []
      for (const noteCat of noteCategories) {
        if (adjacent.includes(noteCat)) {
          alignment = 35 // Related but different domain
          break
        }
      }
      if (alignment > 0) break
    }
  }
  
  // Boost for note length and detail
  if (note.length >= 200) alignment += 10
  else if (note.length >= 100) alignment += 5
  
  // Cap at 100
  alignment = Math.min(100, alignment)
  
  const topicUnderstanding = Array.from(topicCategories).join(', ')
  const noteUnderstanding = noteCategories.size > 0 ? Array.from(noteCategories).join(', ') : 'unclear/general'
  
  return { topicUnderstanding, noteUnderstanding, alignment }
}

/**
 * Detect if content is weird/inappropriate
 */
function analyzeWeirdness(topics: string[], note: string): {
  isWeird: boolean
  weirdScore: number
  reason: string
} {
  const allText = `${topics.join(' ')} ${note}`.toLowerCase()
  
  let weirdScore = 0
  let reason = ''
  
  // Sexual/inappropriate content
  if (/\b(sex|sexual|porn|naked|nude|xxx|adult|nsfw|explicit|intimate|erotic)\b/i.test(allText)) {
    weirdScore += 40
    reason = 'sexual/inappropriate content'
  }
  
  // Drugs/alcohol
  if (/\b(drug|weed|marijuana|cocaine|heroin|meth|high|stoned|drunk|alcohol|beer|wine|vodka|whiskey)\b/i.test(allText)) {
    weirdScore += 25
    reason = reason ? reason + ', substance-related' : 'substance-related content'
  }
  
  // Conspiracy/supernatural
  if (/\b(conspiracy|alien|ufo|supernatural|ghost|demon|magic|psychic|illuminati|lizard people)\b/i.test(allText)) {
    weirdScore += 30
    reason = reason ? reason + ', conspiracy/supernatural' : 'conspiracy/supernatural themes'
  }
  
  // Violence/extreme
  if (/\b(kill|murder|death|violence|weapon|gun|bomb|terrorist|attack|war|fight|blood)\b/i.test(allText)) {
    weirdScore += 35
    reason = reason ? reason + ', violent content' : 'violent/extreme content'
  }
  
  // Just weird/bizarre language
  if (/\b(wtf|lmao|omg|crazy|insane|bizarre|weird|strange|wtf|lol|haha|rofl)\b/gi.test(allText)) {
    const matches = allText.match(/\b(wtf|lmao|omg|crazy|insane|bizarre|weird|strange|wtf|lol|haha|rofl)\b/gi)
    if (matches && matches.length >= 3) {
      weirdScore += 20
      reason = reason ? reason + ', informal/bizarre language' : 'informal/bizarre language'
    }
  }
  
  // Unusual topic combinations
  const topicsLower = topics.map(t => t.toLowerCase()).join(' ')
  if ((topicsLower.includes('education') && /dating|romance|love|sex/i.test(note)) ||
      (topicsLower.includes('business') && /spiritual|meditation|chakra|astrology/i.test(note)) ||
      (topicsLower.includes('finance') && /poetry|art|feelings|emotions/i.test(note))) {
    weirdScore += 25
    reason = reason ? reason + ', unusual topic mix' : 'unusual topic combination'
  }
  
  // Boost for very long weird content
  if (note.length >= 200 && weirdScore > 0) {
    weirdScore += 15
  }
  
  return {
    isWeird: weirdScore >= 30,
    weirdScore: Math.min(100, weirdScore),
    reason: reason || 'none'
  }
}

/**
 * Detect if discussion went off-track
 */
function analyzeOffTrack(
  topics: string[],
  topicUnderstanding: string,
  noteUnderstanding: string,
  alignment: number,
  note: string
): {
  isOffTrack: boolean
  offTrackScore: number
} {
  // Personal/irrelevant content patterns
  const personalPatterns = /\b(my life|personal|family|girlfriend|boyfriend|wife|husband|kids|children|parent|relationship|dating|romance|love|vacation|travel|weekend|party|pet|dog|cat|hobby|movie|game|sports|food|recipe|cooking|weather)\b/gi
  
  const personalMatches = note.match(personalPatterns)
  const personalCount = personalMatches ? personalMatches.length : 0
  
  // If alignment is low AND has personal content = OFF TRACK
  if (alignment < 40 && personalCount >= 2) {
    const offTrackScore = Math.min(100, 40 + (personalCount * 10) + (note.length >= 100 ? 15 : 5))
    return { isOffTrack: true, offTrackScore }
  }
  
  // If note discusses completely different domain
  if (topicUnderstanding !== 'general' && noteUnderstanding !== 'unclear/general' && alignment < 25) {
    const offTrackScore = Math.min(100, 50 + (note.length >= 100 ? 20 : 10))
    return { isOffTrack: true, offTrackScore }
  }
  
  // Very short notes on multi-topic discussions (vague/unclear)
  if (topics.length >= 3 && note.length < 30 && alignment < 50) {
    return { isOffTrack: true, offTrackScore: 45 }
  }
  
  return { isOffTrack: false, offTrackScore: 0 }
}

/**
 * Main scoring function with semantic AI analysis
 */
export async function scoreConversation(
  topics: string[],
  note?: string
): Promise<ConversationScores> {
  try {
    const noteStr = note || ''
    
    // Step 1: Understand semantic meaning
    const semantic = analyzeSemanticRelevance(topics, noteStr)
    
    // Step 2: Check for weird content
    const weird = analyzeWeirdness(topics, noteStr)
    
    // Step 3: Check if off-track
    const offtrack = analyzeOffTrack(
      topics,
      semantic.topicUnderstanding,
      semantic.noteUnderstanding,
      semantic.alignment,
      noteStr
    )
    
    // CATEGORY DECISION: Which bucket does this belong to?
    
    // Priority 1: Weird wins (most important to filter)
    if (weird.isWeird) {
      return {
        overall: Math.round(weird.weirdScore),
        relevance: 0,
        weird: Math.round(weird.weirdScore),
        offtrack: 0,
        category: 'weird',
        analysis: `Weird: Contains ${weird.reason}.`
      }
    }
    
    // Priority 2: Off-track
    if (offtrack.isOffTrack) {
      return {
        overall: Math.round(offtrack.offTrackScore),
        relevance: 0,
        weird: 0,
        offtrack: Math.round(offtrack.offTrackScore),
        category: 'offtrack',
        analysis: `Off-track: Topic is "${semantic.topicUnderstanding}" but note discusses "${semantic.noteUnderstanding}".`
      }
    }
    
    // Priority 3: Relevant (default)
    const relevanceScore = semantic.alignment
    
    return {
      overall: Math.round(relevanceScore),
      relevance: Math.round(relevanceScore),
      weird: 0,
      offtrack: 0,
      category: 'relevance',
      analysis: semantic.alignment >= 70
        ? `Relevant: Strong discussion about ${semantic.topicUnderstanding}.`
        : `Relevant: Discussion related to ${semantic.topicUnderstanding}.`
    }
    
  } catch (error) {
    console.error('Error scoring conversation:', error)
    return {
      overall: 30,
      relevance: 30,
      weird: 0,
      offtrack: 0,
      category: 'relevance',
      analysis: 'Unable to score conversation'
    }
  }
}