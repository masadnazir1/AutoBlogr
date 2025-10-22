import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;

export async function getImage(keyword) {
  if (!keyword) throw new Error("Keyword is required");

  try {
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: {
        query: keyword,
        per_page: 1,
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_KEY}`,
      },
    });

    const results = response.data.results;
    if (results.length === 0) return null;

    // Return URL of regular sized image
    return results[0].urls.regular;
  } catch (err) {
    console.error("Unsplash API error:", err.message);
    return null;
  }
}
