import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

// Initialize the Google GenAI client with API key from environment
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Generates a long-form, SEO-friendly blog post suitable for Blogger API.
 * Falls back to a default keyword if none is provided.
 *
 * @param {string} [keyword="latest technology trends"] - The main topic for the blog post.
 * @returns {Promise<{ title: string, content: string, labels: string[], metaDescription: string }>}
 *          An object containing the blog title, HTML content, labels, and SEO meta description.
 *
 * @throws {Error} Throws an error if the API request fails or returns invalid data.
 *
 * @example
 * const blog = await generateBlogContent("Artificial Intelligence");
 * console.log(blog.title, blog.content, blog.labels, blog.metaDescription);
 */
export async function generateBlogContent(
  blogTopic = "latest technology trends",
  imageUrl = ""
) {
  const prompt = `
You are an expert SEO content writer.

Generate a detailed, SEO-friendly blog post for the topic: "${blogTopic}" ready to post on Blogger.

Requirements:
1. Include a clear, engaging title (H1) using the topic.
2. Add a featured image using this URL: "${imageUrl}" with proper <img> HTML tag and alt text.
3. Write 800–1200 words of content, divided into sections using <h2> and <h3> for headings.
4. Include at least 3 subheadings with meaningful content under each.
5. Incorporate keywords naturally throughout the content.
6. Use paragraphs (<p>), lists (<ul>/<li>), and other HTML elements to make it Blogger-ready.
7. Suggest 5–10 SEO-friendly labels/tags for the post.
8. Include 5–10 relevant hashtags at the end inside <p> tags.
9. Ensure content is engaging, well-structured, and optimized for search engines.

Respond strictly in **JSON format** like this:
{
  "title": "...",
  "content": "<h1>...</h1><p>...</p>...",
  "labels": ["label1", "label2", "..."],
  "hashtags": ["#hashtag1", "#hashtag2", "..."]
}
Do not include Markdown. Use only HTML formatting suitable for Blogger.
`;

  try {
    // Call Google GenAI API
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Free model available in AI Studio
      contents: prompt,
      temperature: 0.8, // encourages creative output
      maxOutputTokens: 200,
    });

    const rawText = response.text;

    if (!rawText) {
      throw new Error("No content returned from AI.");
    }

    // Attempt to extract JSON from AI response
    const jsonStart = rawText.indexOf("{");
    const jsonEnd = rawText.lastIndexOf("}") + 1;
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Failed to parse JSON from AI response.");
    }

    const blogData = JSON.parse(rawText.slice(jsonStart, jsonEnd));
    return blogData;
  } catch (err) {
    console.error("Error generating blog content:", err);
    return {
      title: `Failed to generate blog for "${keyword}"`,
      content: `<p>Unable to generate content. Please try again later.</p>`,
      labels: [],
      metaDescription: `Failed to generate meta description for "${keyword}".`,
    };
  }
}
