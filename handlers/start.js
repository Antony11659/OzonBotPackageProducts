import { mapMessages } from "../lib/message.js";
import { createMainKeyboard } from "../keyboards/main.js";
import { getSession } from "../state/session.js";

export const registerStartHandler = (bot) => {
    bot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id;

        const session = getSession(chatId);

        await bot.sendMessage(
          chatId,
          mapMessages.mainPage.startMessage,
          createMainKeyboard()
        );
      });
};