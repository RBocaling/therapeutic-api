import { Request } from "express";

declare module "express" {
  interface Request {
    user?: {
      id: number;
      firstName: string;
      lastName: string;
      middleName?: string;
      suffix?: string;
      email: string;
      profilePic?: string;
      isTakeSurvey: boolean;
      role: "ADMIN" | "MODERATOR" | "COUNSELOR" | "USER";
      profile: {
        id: number;
      };
    };
  }
}
