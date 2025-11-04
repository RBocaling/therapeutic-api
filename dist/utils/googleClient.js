"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyGoogleToken = void 0;
const google_auth_library_1 = require("google-auth-library");
const googleClientId = "499708572275-dsql3ijmj6p5314mfl4pov0da835o08g.apps.googleusercontent.com";
//
const client = new google_auth_library_1.OAuth2Client(googleClientId);
const verifyGoogleToken = async (token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: googleClientId,
    });
    return ticket.getPayload();
};
exports.verifyGoogleToken = verifyGoogleToken;
