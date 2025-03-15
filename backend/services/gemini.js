const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateVideoContent(topic, niche = "default") {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Customize the prompt based on the niche
    let nicheContext = "";
    if (niche !== "default") {
      nicheContext = `The content should be specifically tailored for the ${niche} niche audience. Use terminology, references, and examples that would resonate with ${niche} enthusiasts.`;
    }

    const prompt = `Generate a creative content plan for the topic: "${topic}"
    ${nicheContext}
    
    Please provide:
    1. An engaging title (maximum 60 characters) that would appeal to ${niche !== "default" ? `${niche} enthusiasts` : "a general audience"}
    2. A compelling description (150-200 words) that includes relevant keywords for ${niche !== "default" ? `the ${niche} niche` : "this topic"}
    3. 25 trending hashtags related to this topic that could help the video gain visibility ${niche !== "default" ? `in the ${niche} community` : ""}
    
    Format the response as a JSON object with keys: 
    - title (string)
    - description (string)
    - hashtags (array of strings, each without the # symbol)
    
    Make sure the hashtags are relevant, trending, and would help the video reach its target audience.`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    try {
      // Try to parse the response as JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : text;
      
      const parsedContent = JSON.parse(jsonString);
      
      // Ensure the response has the expected structure
      return {
        title: parsedContent.title || `Video about ${topic}`,
        description: parsedContent.description || `This is a video about ${topic}.`,
        hashtags: Array.isArray(parsedContent.hashtags) 
          ? parsedContent.hashtags.map(tag => tag.startsWith('#') ? tag.substring(1) : tag)
          : generateDefaultHashtags(topic)
      };
    } catch (error) {
      console.error('Failed to parse Gemini response as JSON:', error);
      console.log('Raw response:', text);
      
      // Extract information manually if JSON parsing fails
      const lines = text.split('\n');
      
      // Try to extract title
      let title = topic;
      const titleLine = lines.find(line => line.includes('Title:') || line.includes('"title"'));
      if (titleLine) {
        title = titleLine.replace(/.*Title:|\s*"title"\s*:\s*"|".*$/gi, '').trim();
      }
      
      // Try to extract description
      let description = '';
      const descIndex = lines.findIndex(line => 
        line.includes('Description:') || line.includes('"description"'));
      if (descIndex >= 0) {
        let endIndex = lines.findIndex((line, i) => 
          i > descIndex && (line.includes('Hashtags:') || line.includes('"hashtags"')));
        if (endIndex === -1) endIndex = lines.length;
        description = lines.slice(descIndex + 1, endIndex)
          .join(' ')
          .replace(/^\s*"|\s*"$/g, '')
          .trim();
      }
      
      // Try to extract hashtags
      let hashtags = [];
      const hashtagsStartIndex = lines.findIndex(line => 
        line.includes('Hashtags:') || line.includes('"hashtags"'));
      if (hashtagsStartIndex >= 0) {
        hashtags = lines.slice(hashtagsStartIndex + 1)
          .filter(line => line.trim().match(/^\d+\.|\-|\*|#/) || line.includes(':'))
          .map(line => {
            // Remove list markers, quotes, and # symbols
            const cleaned = line.replace(/^\s*\d+\.|\-|\*|\s*"|\s*"$|^\s*#/g, '').trim();
            // Remove any remaining # symbols
            return cleaned.startsWith('#') ? cleaned.substring(1) : cleaned;
          })
          .filter(line => line.length > 0);
      }
      
      // Fallback response
      return {
        title: title || `Video about ${topic}`,
        description: description || `This is a video about ${topic}.`,
        hashtags: hashtags.length > 0 ? hashtags : generateDefaultHashtags(topic)
      };
    }
  } catch (error) {
    console.error('Error generating content with Gemini:', error);
    throw new Error(`Failed to generate content: ${error.message}`);
  }
}

// Helper function to generate default hashtags if parsing fails
function generateDefaultHashtags(topic) {
  const words = topic.toLowerCase().split(/\s+/);
  const baseHashtags = [
    topic.replace(/\s+/g, ''),
    ...words,
    'video',
    'youtube',
    'content',
    'trending',
    'viral',
    'socialmedia',
    'creator',
    'influencer'
  ];
  
  // Filter out duplicates and empty strings
  return [...new Set(baseHashtags.filter(tag => tag.length > 0))];
}

module.exports = {
  generateVideoContent
}; 