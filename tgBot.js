//Configure and create the connection to Telegram.
import { env } from "./config/env.js"

import TelegramBot from "node-telegram-bot-api";

const token = env.telegramToken;
console.log(token)

export const bot = new TelegramBot(token, { polling: true });