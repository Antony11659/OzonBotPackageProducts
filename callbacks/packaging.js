import { generateMessage, paginatePages } from "../lib/utils.js";
import { deleteActiveMessage } from "../lib/utils.js";
import { makeNextKeyboard } from "../keyboards/next.js";

export const handlePackaging = async(bot, query, session) => {
    const chatId = query.message.chat.id;

    await deleteActiveMessage(bot, chatId);

    const { orders } = session.packaging;
    session.packaging.currentPage = 0;

    const amountPages = Math.ceil(session.packaging.orders.length / session.packaging.itemsPerPage);
    
    const { orderPage } = paginatePages(orders,  session.packaging.currentPage, session.packaging.itemsPerPage);
    const message = generateMessage.getPackageMessage(orderPage,  session.packaging.currentPage, amountPages);
    
    const sentMessage = await bot.sendMessage(chatId, message, makeNextKeyboard(null, 'packaging'))
    
    session.activeMessageId = sentMessage.message_id;
};

