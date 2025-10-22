import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

async function getTokens(code) {
  const { tokens } = await oauth2Client.getToken({
    code,
    redirect_uri: process.env.REDIRECT_URI,
  });
  console.log(tokens); // { access_token, refresh_token, scope, expiry_date, token_type }
  return tokens;
}

// use the code from the URL
getTokens("4/12345678890");

// http://localhost:3000/oauth2callback?code=4/12345678890&scope=https://www.googleapis.com/auth/blogger
