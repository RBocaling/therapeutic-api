"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQuoteOfTheDay = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const qoutes_1 = require("../utils/qoutes");
const notification_services_1 = require("./notification.services");
const generateQuoteOfTheDay = async (userId) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const existingQuote = await prisma_1.default.notification.findFirst({
        where: {
            recipientId: userId,
            type: "QUOTE",
            createdAt: {
                gte: today,
            },
        },
    });
    if (existingQuote) {
        return {
            alreadyGenerated: true,
            message: "Quote already generated today.",
            data: existingQuote,
        };
    }
    const randomQuote = qoutes_1.QUOTES[Math.floor(Math.random() * qoutes_1.QUOTES.length)];
    const notification = await (0, notification_services_1.createNotification)({
        recipientId: userId,
        type: "QUOTE",
        title: "Quote of the Day",
        message: randomQuote,
    });
    return {
        alreadyGenerated: false,
        message: "Quote generated successfully.",
        data: notification,
    };
};
exports.generateQuoteOfTheDay = generateQuoteOfTheDay;
