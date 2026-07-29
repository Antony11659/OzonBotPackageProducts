import { mapMessages } from "../lib/message.js";
import { createMainKeyboard } from "../keyboards/main.js";
import { getSession } from "../state/session.js";

export const registerStartHandler = async (bot) => {
    bot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id;

        const session = getSession(chatId);
        
        const sentMessage = await bot.sendMessage(
          chatId,
          mapMessages.mainPage.startMessage,
          createMainKeyboard()
        );

        session.activeMessageId = sentMessage.message_id;
      });
};