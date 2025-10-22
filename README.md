Here’s a full, professional `README.md` for your **AutoBlogr** project:

````markdown
# AutoBlogr

AutoBlogr is a Node.js application that automatically generates SEO-friendly blog posts based on trending keywords and publishes them to Blogger. It leverages AI for content creation, fetches relevant images from Unsplash, and posts fully formatted blogs with labels and hashtags. The automation runs daily at scheduled times, ensuring fresh content without manual effort.

---

## Features

- Generates SEO-optimized blog posts using AI.
- Automatically selects trending keywords.
- Fetches relevant images from Unsplash.
- Posts fully formatted blogs to Blogger with labels and hashtags.
- Scheduled automation (daily at 8 AM and 3 PM).
- Fully configurable via environment variables.

---

## Tech Stack

- Node.js
- Express.js
- Google Blogger API
- Unsplash API
- OpenAI / Gemini AI
- Cron for scheduling tasks
- PostgreSQL or MongoDB (optional for storing logs or metadata)

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/AutoBlogr.git
cd AutoBlogr
```
````

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and configure the following variables:

```env
PORT=3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/oauth2callback
BLOGGER_BLOG_ID=your_blogger_blog_id
GEMINI_API_KEY=your_gemini_api_key
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

4. Enable Blogger API in your Google Cloud project:
   [Enable Blogger API](https://console.developers.google.com/apis/api/blogger.googleapis.com/overview)

---

## Usage

1. Start the server:

```bash
npm start
```

2. Visit `http://localhost:3000` to trigger blog generation manually.

3. Automation runs daily at 8 AM and 3 PM automatically via Cron jobs.

---

## Project Structure

```
AutoBlogr/
├── src/
│   ├── services/
│   │   ├── llmService.js       # AI content generation
│   │   ├── trendsService.js    # Fetch trending keywords
│   │   ├── unsplashService.js  # Fetch relevant images
│   │   ├── blogSuggestionService.js # Pick best blog suggestion
│   │   └── bloggerService.js   # Post blog to Blogger
│   ├── utils/
│   └── models/
├── .env.example
├── .gitignore
├── package.json
└── index.js                     # Main server entry
```

---

## How It Works

1. Fetch trending keywords using `trendsService`.
2. Pick the most suitable keyword for the blog using `blogSuggestionService`.
3. Generate blog content using `llmService`.
4. Fetch a related image from Unsplash using `unsplashService`.
5. Post the blog to Blogger using `bloggerService`.
6. Cron jobs run this workflow automatically at scheduled times.

---

## Cron Schedule

The application posts blogs automatically at:

- 8:00 AM daily
- 3:00 PM daily

Cron syntax used:

```js
cron.schedule("0 8,15 * * *", async () => {
  await runDailyBlogTask();
});
```

---

## Environment Variables

| Variable               | Description                            |
| ---------------------- | -------------------------------------- |
| `PORT`                 | Server port (default: 3000)            |
| `GOOGLE_CLIENT_ID`     | Google OAuth Client ID                 |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret             |
| `GOOGLE_REDIRECT_URI`  | OAuth redirect URI                     |
| `BLOGGER_BLOG_ID`      | Blogger Blog ID to post articles       |
| `GEMINI_API_KEY`       | AI API key for blog content generation |
| `UNSPLASH_ACCESS_KEY`  | Unsplash API key for image fetching    |

---

## License

MIT License

---

## Notes

- Make sure the Blogger API is enabled in your Google Cloud project.
- Ensure OAuth credentials are valid and refresh tokens are correctly set.
- You can customize the number of blogs per day or schedule by modifying the cron expression in `index.js`.

---
