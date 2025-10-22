import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline", // important to get refresh token
  scope: ["https://www.googleapis.com/auth/blogger"],
});

console.log("Authorize this app by visiting this URL:", authUrl);
