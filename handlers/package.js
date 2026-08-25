import { getSession } from "../state/session.js";
import { deleteActiveMessage } from "../lib/utils.js";
import { handlePackaging } from "../callbacks/packaging.js";

export const registerPackageHandler = async (bot) => {
    bot.onText(/\/package/, async (msg) => {
        const chatId = msg.chat.id;

        await deleteActiveMessage(bot, chatId); // delete if User has previous session

        const session = getSession(chatId);
      
        if (!session.shopName) {
            const sentMessage = await bot.sendMessage(chatId, 'Ты не выбрала Магазин!!!\n Перезагрузи Бота и выбери магазин!!!');
            session.activeMessageId = sentMessage.message_id;
            return;
        }
    
        await handlePackaging(bot, { message: msg }, session);
      });
};