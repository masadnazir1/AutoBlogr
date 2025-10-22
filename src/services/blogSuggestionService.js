// services/blogSuggestionService.js
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generate a single SEO-friendly blog topic and image keyword using free Studio model
 * @param {string[]} keywords - Array of trending keywords
 * @returns {Promise<{ keyword: string, blogTopic: string, imageKeyword: string }>}
 */
export async function generateBestBlogSuggestion(keywords) {
  if (!keywords || keywords.length === 0) {
    throw new Error("Keywords array is empty.");
  }

  const bestKeyword = keywords[0];

  const prompt = `
You are an expert SEO content writer and trending topic analyst.

You are given the following trending keywords array:
${JSON.stringify(keywords)}

1. Analyze the keywords and **select the single most suitable keyword** that has the highest potential for SEO-friendly blog content.
2. For the chosen keyword, suggest **one SEO-optimized, creative blog topic** suitable for an 800–1200 word article.
3. Also provide **one related word** that can be used to fetch an image from Unsplash.
4. Use clear, engaging, and descriptive language for the blog topic.
5. Follow these style examples:
   - "earthquake pakistan" -> Blog Topic: "Understanding the Recent Earthquake in Pakistan: Causes, Effects, and Safety Measures", Image Keyword: "earthquake"
   - "south africa women vs pakistan women" -> Blog Topic: "South Africa Women vs Pakistan Women Cricket Match: Key Highlights and Analysis", Image Keyword: "cricket"
   - "chatgpt atlas" -> Blog Topic: "Exploring ChatGPT Atlas: How AI is Transforming Knowledge Mapping", Image Keyword: "AI"

Respond strictly in **JSON format** like this:
{
  "keyword": "...",
  "blogTopic": "...",
  "imageKeyword": "..."
}
Only include the JSON, do not echo the full array or extra text.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // free Studio model
      contents: prompt,
      temperature: 0.8,
      maxOutputTokens: 250,
    });

    const rawText = response.text?.trim();

    let result;
    try {
      const jsonStart = rawText.indexOf("{");
      const jsonEnd = rawText.lastIndexOf("}") + 1;
      result = JSON.parse(rawText.slice(jsonStart, jsonEnd));
    } catch {
      result = {
        blogTopic: `${bestKeyword} - SEO Blog`,
        imageKeyword: bestKeyword.split(" ")[0],
      };
    }

    return {
      keyword: bestKeyword,
      blogTopic: result.blogTopic,
      imageKeyword: result.imageKeyword,
    };
  } catch (err) {
    console.error("Error generating blog suggestion:", err);
    return {
      keyword: bestKeyword,
      blogTopic: `${bestKeyword} - SEO Blog`,
      imageKeyword: bestKeyword.split(" ")[0],
    };
  }
}
