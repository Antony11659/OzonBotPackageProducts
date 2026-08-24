//Configure and create the connection to Telegram.
import { env } from "./config/env.js"

import TelegramBot from "node-telegram-bot-api";

const token = env.telegramToken;

export const bot = new TelegramBot(token, { polling: true });

bot.setMyCommands([
    { command: 'start', description: 'Перезапустить Бота' },
  ]);