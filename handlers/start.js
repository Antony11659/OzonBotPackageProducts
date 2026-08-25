import { mapMessages } from "../lib/message.js";
import { createMainKeyboard } from "../keyboards/main.js";
import { deleteSession, getSession } from "../state/session.js";
import { deleteActiveMessage } from "../lib/utils.js";

export const registerStartHandler = async (bot) => {
    bot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id;

        await deleteActiveMessage(bot, chatId); // delete if User has previous session
        deleteSession(chatId);

        const session = getSession(chatId);
        session.startedAt = new Date();
        
        const sentMessage = await bot.sendMessage(
          chatId,
          mapMessages.mainPage.startMessage(msg.from.username),
          createMainKeyboard()
        );

        session.activeMessageId = sentMessage.message_id;
      });
};