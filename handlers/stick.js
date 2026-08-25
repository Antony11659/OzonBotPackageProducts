import { getSession } from "../state/session.js";
import { deleteActiveMessage } from "../lib/utils.js";
import { handleSticking } from "../callbacks/sticking.js";

export const registerStickHandler = async (bot) => {
    bot.onText(/\/stick/, async (msg) => {
        const chatId = msg.chat.id;

        await deleteActiveMessage(bot, chatId); // delete if User has previous session

        const session = getSession(chatId);
        session.startedAt = new Date();
      
        if (!session.shopName) {
            const sentMessage = await bot.sendMessage(chatId, 'Ты не выбрала Магазин!!!');
            session.activeMessageId = sentMessage.message_id;
            return;
        }
        
        await handleSticking(bot, {message: {chat: {id: chatId}}}, session);
      });
};