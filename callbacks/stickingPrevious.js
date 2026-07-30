import { generateMessage, paginatePages } from "../lib/utils.js";
import { makeNextKeyboard } from "../keyboards/next.js";


export const handleStickingPrevious = async (bot, query, session) => {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id

    const amountPages = Math.ceil(session.sticking.orders.length / session.sticking.itemsPerPage);

    if (amountPages === 0) {
      return;
    }

    
    session.sticking.currentPage = Math.max(0, session.sticking.currentPage -= 1);

    const { orderPage } = paginatePages(
      session.sticking.orders,
      session.sticking.currentPage,
      session.sticking.itemsPerPage
    );

    const message = generateMessage.getStickingMessage(orderPage, session.sticking.currentPage, amountPages);

    const keyboards = session.sticking.currentPage < 1 ? { chat_id: chatId, message_id: messageId , ...makeNextKeyboard(null, 'sticking') } : makeNextKeyboard(query, 'sticking');

    await bot.editMessageText(message, keyboards );
}