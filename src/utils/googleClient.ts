import { OAuth2Client } from "google-auth-library";

const googleClientId =
  process.env.GOOGLE_CLIENT_ID ||
  "499708572275-dsql3ijmj6p5314mfl4pov0da835o08g.apps.googleusercontent.com";
  
const client = new OAuth2Client(googleClientId);

export const verifyGoogleToken = async (token: string) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: googleClientId,
  });
  return ticket.getPayload();
};
