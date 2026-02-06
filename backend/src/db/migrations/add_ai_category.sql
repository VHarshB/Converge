-- Add ai_category column to conversation_logs table for exclusive categorization
ALTER TABLE conversation_logs 
ADD COLUMN IF NOT EXISTS ai_category TEXT CHECK (ai_category IN ('relevance', 'weird', 'offtrack'));

-- Create index for faster category filtering
CREATE INDEX IF NOT EXISTS idx_conversation_logs_ai_category ON conversation_logs(ai_category);
