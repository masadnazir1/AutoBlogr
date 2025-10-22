import express from "express";
import dotenv from "dotenv";
import cron from "node-cron";

import { generateBlogContent } from "./src/services/llmService.js";
import { getTrendingKeywords } from "./src/services/trendsService.js";
import { getImage } from "./src/services/unsplashService.js";
import { generateBestBlogSuggestion } from "./src/services/blogSuggestionService.js";
import { postBlog } from "./src/services/bloggerService.js";

dotenv.config();
const app = express();

async function runBlogTask() {
  try {
    const keywords = await getTrendingKeywords();
    const blogMeta = await generateBestBlogSuggestion(keywords);
    console.log("Selected blog metadata:", blogMeta);

    const blogImage = await getImage(blogMeta.imageKeyword);
    console.log("Blog image URL:", blogImage);

    const blogContent = await generateBlogContent(
      blogMeta.blogTopic,
      blogImage
    );
    console.log("Generated blog content:", blogContent.title);

    const response = await postBlog({
      title: blogContent.title,
      content: blogContent.content,
      labels: blogContent.labels,
    });

    console.log(`Blog posted successfully: ${blogContent.title}`);
  } catch (err) {
    console.error(" Error running blog task:", err.message);
  }
}

// Schedule to run at 8:00 AM and 3:00 PM daily
cron.schedule("0 8,15 * * *", async () => {
  console.log("Running scheduled blog task...");
  await runBlogTask();
});

app.get("/", async (req, res) => {
  await runBlogTask();
  res
    .status(200)
    .json({ success: true, message: "Blog task executed manually" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
