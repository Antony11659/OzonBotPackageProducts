import { generateMessage, paginatePages } from "../lib/utils.js";
import { makeNextKeyboard } from "../keyboards/next.js";


export const handlePackagingPrevious = async (bot, query, session) => {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id

    const amountPages = Math.ceil(session.packaging.orders.length / session.packaging.itemsPerPage);

    if (amountPages === 0) {
      return;
    }

    session.packaging.currentPage = Math.max(0, session.packaging.currentPage -= 1);

    const { orderPage } = paginatePages(
      session.packaging.orders,
      session.packaging.currentPage,
      session.packaging.itemsPerPage
    );

    const message = generateMessage.getPackageMessage(orderPage, session.packaging.currentPage, amountPages);

    const keyboards = session.packaging.currentPage < 1 ? { chat_id: chatId, message_id: messageId , ...makeNextKeyboard(null, 'packaging') } : makeNextKeyboard(query, 'packaging');

    await bot.editMessageText(message, keyboards );
}