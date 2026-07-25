import { mapMessages } from "../lib/message.js";
import { createMainKeyboard } from "../keyboards/main.js";

export const registerStartHandler = (bot) => {
    bot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id;
        await bot.sendMessage(
          chatId,
          mapMessages.mainPage.startMessage,
          createMainKeyboard()
        );
      });
};