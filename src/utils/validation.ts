export function validateJobDescription(text: string): { isValid: boolean; error?: string } {
  // 1. Length Check
  if (!text || text.trim().length < 50) {
    return { 
      isValid: false, 
      error: "The job description is too short. Please paste a complete job description." 
    };
  }

  // 2. Gibberish / Keysmash Check
  // Split by whitespace and check if there are extremely long strings without spaces
  const words = text.split(/\s+/);
  const hasExtremelyLongWords = words.some(word => word.length > 40 && !word.includes('http'));
  
  if (hasExtremelyLongWords) {
    return { 
      isValid: false, 
      error: "The job description appears to contain invalid text or keysmashes. Please provide a valid job posting." 
    };
  }

  // 3. Keyword Density Check
  // Standard industry keywords found in almost every legitimate job description
  const targetKeywords = [
    'requirement', 'requirements', 'experience', 'role', 'qualification', 'qualifications', 
    'skill', 'skills', 'responsibilities', 'responsibility', 'opportunity', 'team', 
    'knowledge', 'degree', 'years', 'working', 'development', 'management', 'strong',
    'ability', 'required', 'preferred', 'looking', 'join', 'company', 'work'
  ];
  
  const textLower = text.toLowerCase();
  let matchCount = 0;
  
  for (const keyword of targetKeywords) {
    if (textLower.includes(keyword)) {
      matchCount++;
    }
  }

  // A real JD will easily hit at least 3 of these common keywords
  if (matchCount < 3) {
    return { 
      isValid: false, 
      error: "This text does not look like a valid job description. It is missing standard industry keywords (e.g., requirements, experience, skills)." 
    };
  }

  return { isValid: true };
}
