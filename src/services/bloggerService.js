import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, BLOGGER_BLOG_ID } =
  process.env;

// OAuth2 client
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);

oauth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN,
});

// Blogger API client
const blogger = google.blogger({ version: "v3", auth: oauth2Client });

/**
 * Post a blog to Blogger
 * @param {Object} blogData
 * @param {string} blogData.title - Blog title
 * @param {string} blogData.content - HTML content of the blog
 * @param {string[]} [blogData.labels] - Optional array of labels/tags
 * @returns {Promise<Object>} - Blogger API response
 */
export async function postBlog({ title, content, labels = [] }) {
  if (!title || !content) {
    throw new Error("Title and content are required to post a blog.");
  }

  try {
    const response = await blogger.posts.insert({
      blogId: BLOGGER_BLOG_ID,
      requestBody: {
        title,
        content,
        labels,
      },
    });

    return {
      success: true,
      postId: response.data.id,
      url: response.data.url,
      published: response.data.published,
    };
  } catch (err) {
    console.error("Error posting blog:", err.response?.data || err.message);
    return {
      success: false,
      error: err.response?.data || err.message,
    };
  }
}
