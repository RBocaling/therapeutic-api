import { OAuth2Client } from "google-auth-library";

const googleClientId =
  process.env.GOOGLE_CLIENT_ID ||
    "1044098837547-9fggm8fboc2o00v5uog49a64uuhag2bd.apps.googleusercontent.com";
  
const client = new OAuth2Client(googleClientId);

export const verifyGoogleToken = async (token: string) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: googleClientId,
  });
  return ticket.getPayload();
};
